/*
 *
 * LoadAppProjectData.js -- part of Extended QGIS Web Client
 *
 * Copyright (2010-2015), The QGIS Project and Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 *
 */


//This file is used instead of GlobalOptions.js from QWC

function makeLayer(layDef, visible) {

    if (layDef==null) {
        return null;
    }

    var options = Ext.util.JSON.decode(layDef.definition);
    var type = layDef.type;
    var title = layDef.title;
    var layer = {};

    switch (type) {

        case 'Google' :
            layer = new OpenLayers.Layer.Google(title, options);
            break;

        case 'OSM' :
            layer = new OpenLayers.Layer.OSM(title, null, options);
            break;

        case 'XYZ' :
            var url = options.url.replace(/\{/g, '${');

            if(typeof options.tmsUrl == "undefined") {
                layer = new OpenLayers.Layer.XYZ(title, url, options.options);
            } else {
                options.options.layername = options.tmsLayer;
                options.options.type = options.tmsType;
                layer = new OpenLayers.Layer.TMS(title, options.tmsUrl, options.options);
            }
            break;

        case 'Bing' :
            layer = new OpenLayers.Layer.Bing({
                name: title,
                type: options.imagerySet,
                key: options.key
            });
            break;

        case 'WMTS' :
            var matrixIds;
            var visibility = visible;
            //if extra layer take visibility from options if exists
            if (!visible && options.visibility != undefined) {
                visibility = options.visibility;
            }

            if (options.origins) {
                matrixIds = {};
                if (typeof eval(options.matrixIds) == 'object') {
                    eval(options.matrixIds).forEach(function (value, index, arr) {
                        matrixIds[index] = {
                            identifier: value,
                            topLeftCorner: new OpenLayers.LonLat.fromArray(eval(options.origins)[index])
                        };
                    });
                }
            } else {
                matrixIds = eval(options.matrixIds);
            }

            layer = new OpenLayers.Layer.WMTS({
                name: title,
                visibility: visibility,
                opacity: options.opacity,
                buffer: options.buffer,
                url: options.url,
                layer: options.layer,
                requestEncoding: options.requestEncoding,
                matrixSet: options.matrixSet,
                matrixIds: matrixIds,
                format: options.format,
                style: options.style,
                displayOutsideMaxExtent: false,
                tileFullExtent: eval(options.tileFullExtent),
                tileOrigin: eval(options.tileOrigin),
                maxExtent: eval(options.maxExtent),
                zoomOffset: eval(options.zoomOffset),
                numZoomLevels: eval(options.numZoomLevels),
                maxResolution: eval(options.maxResolution),
                resolutions: eval(options.resolutions),
                serverResolutions: typeof options.serverResolutions == 'string' ? JSON.parse(options.serverResolutions) : options.serverResolutions,
                print: eval(options.print)
            });

            break;

        case 'WMS' :

            options.options.visibility = visible;
            //if extra layer take visibility from options if exists
            if (!visible && options.visibility != undefined) {
                options.options.visibility = options.visibility;
            }

            //extralayer on same host (like different qgis project) add for identify (another GetFeatureInfo control)
            //we use layer metadata property for this
            var server = window.location.hostname;
            var urlHost = Eqwc.common.getRootUrl(options.url).split('//')[1];
            if (!visible && server==urlHost) {
                options.options.metadata = 'identify';
            }

            var layer = new OpenLayers.Layer.WMS(
                title,
                options.url,
                options.params,
                options.options);
            break;

    }
    return layer;
}

projectData.makeExtentFromArray = function(arr, checkAxis) {
    var proj = OpenLayers.Projection.defaults[authid];
    var reverseAxisOrder = proj == undefined ? false : proj.yx;

    if(!checkAxis) {
        reverseAxisOrder = false;
    }

    return OpenLayers.Bounds.fromArray(arr, reverseAxisOrder);
};

/**
 * Create OpenLayers2 layer objects from definition data readed from database
 * @returns {Array}
 * @constructor
 */
projectData.setBaseLayers = function (isBase) {

    var baseLayers = [];    //array of ol2 layer objects
    var bl = isBase ? projectData.baseLayers() : projectData.extraLayers();

    if (bl != null) {
        for (var k = 0; k < bl.length; k++) {
            baseLayers.push(makeLayer(bl[k], isBase));
        }
    }

    return baseLayers;
};

projectData.setLayerLegend = function (layer,node) {

    if(layer.geom_type == 'No geometry') {
        return;
    }

    var layername = wmsLoader.layerTitleNameMapping[layer.layername];
    var style = layerStyles([layer.id]);
    var layerId = layer.id;

    // Check cache first
    var cachedLegend = projectData.getLegendFromCache(layerId, style);
    if (cachedLegend) {
        // Create new object URL from cached blob to avoid memory issues
        var url = window.URL.createObjectURL(cachedLegend.blob);
        var legendData = {
            url: url,
            css: cachedLegend.css,
            size: cachedLegend.size
        };
        projectData.displayCachedLegend(legendData, layerId, node);
        return;
    }

    var legend = '';

    //IE 11 does not support xhr.responseURL, so old way is used for IE
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

    //for raster layers show default raster legend image
    if (layer.provider == 'gdal' || layer.provider == 'wms') {
        legend = iconDirectory+"raster.png?" + Ext.urlEncode({
            DUMMY: "hi",
            LAYERS: layername,
            NODE: node.id});
    } else {
        legend = wmsURI + Ext.urlEncode({
            SERVICE: "WMS",
            VERSION: "1.3.0",
            REQUEST: "GetLegendGraphics",
            FORMAT: "image/png",
            EXCEPTIONS: "application/vnd.ogc.se_inimage",
            BOXSPACE: 1,
            LAYERSPACE: 0,
            SYMBOLSPACE: 1,
            SYMBOLHEIGHT: 2,
            LAYERFONTSIZE: 0,
            ITEMFONTSIZE: 8,
            ICONLABELSPACE: 2,
            LAYERTITLE: "FALSE",
            LAYERFONTCOLOR: '#FFFFFF',
            LAYERTITLESPACE: 0,
            TRANSPARENT: true,
            LAYERS: layername,
            RULELABEL: "AUTO",
            STYLES: style,
            DPI: 200,
            NODE: node.id
        });
    }

    if(isIE11) {
        var height = Eqwc.settings.layerLegendMaxHeightPx ? Eqwc.settings.layerLegendMaxHeightPx : 200;
        Ext.DomHelper.insertAfter(node.getUI().getAnchor(),
            "<div style='overflow-y:auto; max-height:"+height+"px;' id='legend_" + layerId + "'><img style='vertical-align: middle; margin-left: 50px;margin-bottom: 10px;' src=\"" + legend + "\"/></div>"
        );
        var el = Ext.get('legend_'+layerId);
        if(el) {
            el.setVisibilityMode(Ext.Element.DISPLAY);
        }
        // For IE11, we can't easily cache the blob, so we just display directly
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", legend, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', function () {
            if (xhr.status === 200) {
                var blob = new Blob([xhr.response], {type: 'image/png'}),
                    url = window.URL.createObjectURL(blob);

                var nodeId = Ext.urlDecode(xhr.responseURL).NODE;
                var layerId = Ext.urlDecode(xhr.responseURL).LAYERS;
                var node = layerTree.getNodeById(nodeId);

                // Use smart CSS determination instead of blob size
                projectData.determineLegendCssClass(layername, style, function(css) {
                    // Cache the legend data
                    projectData.cacheLegend(layerId, style, {
                        url: url,
                        blob: blob,
                        size: blob.size,
                        css: css
                    });

                    // Display the legend
                    projectData.displayCachedLegend({
                        url: url,
                        css: css,
                        size: blob.size
                    }, layerId, node);
                });
            }
        });
        xhr.send();
    }
};

/**
 * Array of Projections arrays (0 Code, 1 Title, 2 Openlayers.Projection object) that exist in Proj4js definitions based on crs_list from QGIS project
 * Map projection is always first element!
 * If parameter code exists, get results only for passed projection, otherwise for all available
 */
projectData.getProjectionsList = function(code) {
    var ret = [];

    if(code === undefined) {

        //first element is map projection
        if (Proj4js.defs[projectData.crs]) {
            ret.push([projectData.crs, projectData.crs_description, new OpenLayers.Projection(projectData.crs)]);
        }

        for (var i = 0; i < projectData.crs_list.length; ++i) {
            var crs = projectData.crs_list[i];
            var olProj = new OpenLayers.Projection(crs);
            if (crs != projectData.crs && Proj4js.defs[crs]) {
                ret.push([crs, olProj.proj.title, olProj]);
            }
        }

    } else {

        var crs = projectData.crs_list.filter(function (val) {
            return val === code;
        })[0];
        if(crs) {
            var olProj = new OpenLayers.Projection(crs);
            ret.push([crs, olProj.proj.title, olProj]);
        }
    }

    return ret;
};

projectData.crsComboStore = function() {
    var ret = [];

    projectData.getProjectionsList().map(function(currentValue, index, arr) {
        var code = currentValue[0];
        var title = currentValue[1];
        title = title ? title : code;
        ret.push([code,title]);
    }, ret);

    return ret;
};

// Legend cache functionality
projectData.initLegendCache = function() {
    if (!projectData.legendCache) {
        projectData.legendCache = {};
    }
};

projectData.getLegendFromCache = function(layerId, style) {
    if (!projectData.legendCache) {
        projectData.initLegendCache();
    }
    var cacheKey = layerId + '_' + (style || 'default');
    return projectData.legendCache[cacheKey] || null;
};

projectData.cacheLegend = function(layerId, style, legendData) {
    if (!projectData.legendCache) {
        projectData.initLegendCache();
    }
    var cacheKey = layerId + '_' + (style || 'default');
    projectData.legendCache[cacheKey] = {
        url: legendData.url,
        blob: legendData.blob,
        size: legendData.size,
        css: legendData.css,
        timestamp: new Date().getTime()
    };
};

projectData.clearLegendCache = function(layerId) {
    if (!projectData.legendCache) {
        return;
    }
    
    if (layerId) {
        // Clear specific layer cache
        Object.keys(projectData.legendCache).forEach(function(key) {
            if (key.indexOf(layerId + '_') === 0) {
                // Revoke object URL to prevent memory leaks
                if (projectData.legendCache[key].url) {
                    window.URL.revokeObjectURL(projectData.legendCache[key].url);
                }
                delete projectData.legendCache[key];
            }
        });
    } else {
        // Clear all cache
        Object.keys(projectData.legendCache).forEach(function(key) {
            if (projectData.legendCache[key].url) {
                window.URL.revokeObjectURL(projectData.legendCache[key].url);
            }
        });
        projectData.legendCache = {};
    }
};

projectData.displayCachedLegend = function(legendData, layerId, node) {
    var css = legendData.css;
    var url = legendData.url;
    
    // Remove existing legend if any
    var existingLegend = Ext.get('legend_' + layerId);
    if (existingLegend) {
        existingLegend.remove();
    }
    
    if (css === 'legend_long') {
        Ext.DomHelper.insertAfter(node.getUI().getAnchor(),
            "<div class='"+css+"' id='legend_" + layerId + "'>" +
                "<span class='legend-toggle' style='margin-left: 5px; cursor: pointer; font-size: 12px; color: #666;' onclick='projectData.toggleLegendExpanded(\"" + layerId + "\")'>▶</span>" +
            "</div>"
        );
        
        // Add hidden expanded legend container
        Ext.DomHelper.insertAfter(node.getUI().getEl(),
            "<div class='legend-expanded' id='legend_expanded_" + layerId + "' style='display: none; margin-left: 20px; margin-top: 5px; padding: 5px; border: 1px solid #ccc; background: #f9f9f9; border-radius: 3px;'>" +
                "<img class='"+css+"_"+"img' src='" + url + "' onload='projectData.scaleLegendImage(this)'/>" +
            "</div>"
        );
    } else {
        Ext.DomHelper.insertAfter(node.getUI().getAnchor(),
            "<div class='"+css+"' id='legend_" + layerId + "'><img style='margin-top: -10px; max-height: 30px;' src=\"" + url + "\"/></div>"
        );
    }

    // var el = Ext.get('legend_' + layerId);
    // if (el) {
    //     el.setVisibilityMode(Ext.Element.DISPLAY);
    //
    //     // Add tooltip for full-size legend display
    //     var legendImg = el.child('img');
    //     if (legendImg && css === 'legend_long') {
    //         new Ext.ToolTip({
    //             target: legendImg,
    //             html: '<img src="' + url + '" style="width: 80%; height: auto;" />',
    //             autoHide: true,
    //             autoWidth: true,
    //             dismissDelay: 0,
    //             showDelay: 500,
    //             trackMouse: false,
    //             anchorToTarget: true,
    //             anchor: 'left'
    //         });
    //     }
    // }
};

projectData.toggleLegendExpanded = function(layerId) {
    var expandedLegend = Ext.get('legend_expanded_' + layerId);
    var toggleArrow = Ext.get('legend_' + layerId).query('.legend-toggle')[0];
    
    if (expandedLegend) {
        if (expandedLegend.isDisplayed()) {
            // Collapse
            expandedLegend.setDisplayed(false);
            if (toggleArrow) {
                toggleArrow.innerHTML = '▶';
            }
        } else {
            // Expand
            expandedLegend.setDisplayed(true);
            if (toggleArrow) {
                toggleArrow.innerHTML = '▼';
            }
        }
    }
};

projectData.scaleLegendImage = function(img) {
    // Scale image to 50% of its natural size
    var scaleFactor = 0.5;
    
    // Wait for image to load completely
    if (img.complete && img.naturalWidth !== 0) {
        img.style.width = Math.round(img.naturalWidth * scaleFactor) + 'px';
        img.style.height = Math.round(img.naturalHeight * scaleFactor) + 'px';
    } else {
        // If image isn't loaded yet, wait for it
        img.onload = function() {
            img.style.width = Math.round(img.naturalWidth * scaleFactor) + 'px';
            img.style.height = Math.round(img.naturalHeight * scaleFactor) + 'px';
        };
    }
};

projectData.determineLegendCssClass = function(layername, style, callback) {
    // Create JSON request to get legend details
    var legendJsonUrl = wmsURI + Ext.urlEncode({
        SERVICE: "WMS",
        VERSION: "1.3.0",
        REQUEST: "GetLegendGraphics",
        FORMAT: "application/json",
        SHOWRULEDETAILS: "TRUE",
        LAYERS: layername,
        STYLES: style || ''
    });

    var xhr = new XMLHttpRequest();
    xhr.open("GET", legendJsonUrl, true);
    xhr.addEventListener('load', function () {
        var css = 'legend'; // default
        
        if (xhr.status === 200) {
            try {
                var legendData = JSON.parse(xhr.responseText);
                
                // Check if any node has symbols property
                if (legendData.nodes && legendData.nodes.length > 0) {
                    for (var i = 0; i < legendData.nodes.length; i++) {
                        if (legendData.nodes[i].symbols && legendData.nodes[i].symbols.length > 0) {
                            css = 'legend_long';
                            break;
                        }
                    }
                }
            } catch (e) {
                // If JSON parsing fails, fall back to default
                console.warn('Failed to parse legend JSON, using default CSS class');
            }
        }
        
        callback(css);
    });
    
    xhr.addEventListener('error', function() {
        // If request fails, fall back to default
        callback('legend');
    });
    
    xhr.send();
};

//plugins
Eqwc.plugins = {};

// Initialize legend cache
projectData.initLegendCache();

var lang = projectData.lang;
//var helpfile = "help_en.html";

//Custom function to populate GetUrlParams variables
var customGetUrlParamsParser = null;

var serverAndCGI = "/proxy";
// For direct access to QGIS Server
//var serverAndCGI = "/wms";

//Optional url for print server hosted on a different server. Default: same as above.
// var serverAndCGI = "http://otherserver/cgi-bin/qgis_mapserv.fcgi";
var printServer = serverAndCGI;

var useGetProjectSettings = true;
var showLayerOrderTab = false;
var grayLayerNameWhenOutsideScale = true;
var showMetaDataInLegend = true;
var defaultIdentificationMode = Eqwc.settings.defaultIdentificationMode == undefined ? "allLayers" : Eqwc.settings.defaultIdentificationMode;
var useGeodesicMeasurement = true;
var useGeoCodeSearchBox = projectData.geoCode != null;
var iconDirectory = 'client/site/gis_icons/';
var coordinatePrecision = 2;    //precision of coordinates decimal places in GetFeatureInfo result window
var elevationPrecision = 1;     //precision of height in GetFeatureInfo result window
var minimumAddressRange = 1000;  //range in meters within address is displayed with GetFeatureInfo, if outside than only regional info is displayed

//URL for custom search scripts
var searchBoxQueryURL = projectData.wsgi ? "/wsgi/search.wsgi?query=" : null;
var searchBoxGetGeomURL = projectData.wsgi ? "/wsgi/getSearchGeom.wsgi" : null;

var autoActivateSearchGeometryLayer = true;

//TODO what to do here
// PHP based search scripts (postgis layers only)
//var searchBoxQueryURL = 'client/php/search.php?map=' + projectData.project;
//var searchBoxGetGeomURL = 'client/php/search_geom.php?map=' + projectData.project;

var enablePermalink = true;
var permaLinkURLShortener = Eqwc.settings.permaLinkURLShortener || null; // "/wsgi/createShortPermalink.wsgi";

var enableBGMaps = true;
var enableExtraLayers = true;

var mediaurl = '';
var suppressEmptyValues = false;
var suppressInfoGeometry = true;
var showFieldNamesInClickPopup = true;
var showFeatureInfoLayerTitle = true;

//templates to define tooltips for a layer, to be shown on hover identify. The layer fields must be wrapped inside <%%> special tags.
//if a layers field is found with the name "tooltip" its content will have precedence over this configuration
var tooltipTemplates = {
	'Country':{
		template: "Look for the country on Google Search: <a href='http://www.google.it/#output=search&q=<%name%>' target='_blank'><%name%></a>"
	}
};


// SearchPanel search results output configuration
// by default, search results will be shown in left panel, under the
// search form. Sometimes this is not desired, here you can choose to
// show the results in one of the other panels, like BottomPanel and
// RightPanel. These additional panels are hidden by default because
// their expansion and collapse trigger a map resize->reload cycle that
// can slow down the application.
var mapSearchPanelOutputRegion = 'default' ; // Possible values: default,right,bottom,popup

// Interactive legend. This is based on PHP get_legend.php script.
// You can define here an alternate URL for this service
//var interactiveLegendGetLegendURL = '../php/get_legend.php?map=' + project_map + '&';


//define whether you want to display a map theme switcher
//note that you have to also link a GISProjectListing.js file containing a valid
//project listing structure - the root object is called 'gis_projects'
//have a look at the template file and documentation for the correct json structure
var mapThemeSwitcherActive = false;
//you can provide an alternative template for the theme-switcher - see also file ThemeSwitcher.js (ThemeSwitcher.prototype.initialize)
var themeSwitcherTemplate = null;

//titlebar text
var titleBarText = Ext.decode(Eqwc.settings.title);

// header logo image and link
var headerLogoImg = projectData.client_logo;
var headerLogoHeight = 36; // logo image height in pixels
var headerLogoLink = (Eqwc.settings.useGisPortal && projectData.user != 'guest') ? Eqwc.settings.gisPortalRoot : projectData.client_url; // logo links to this URL
var headerTermsOfUseText = TR.logoutLabel; // set null for no link
var headerTermsOfUseLink = "./admin/login.php?action=logout"; // URL to terms of use

// Optional list of layers that should be displayed in a different image format,
// if the default image format is 8bit.
// The formats are applied in the order of the list, from highest to lowest priority.
/*
var layerImageFormats = [
  {
    format: "image/png",
    layers: ["Country"]
  },
  {
    format: "image/jpeg",
    layers: ["Shaded Relief"]
  }
];
*/

//EPSG projection code of your QGIS project
var authid = projectData.crs;

//background transparency for the QGIS server generated layer (commercial background layers not effected)
//set to true if you want the background to be transparent, layer image will be bigger (32 vs 24bit)
// if project contain any base or extra layer transparency is true, otherwise false
var qgisLayerTransparency = (projectData.baseLayers() == null && projectData.extraLayers() == null) ? false : true;


// OpenLayers global options
// see http://dev.openlayers.org/releases/OpenLayers-2.10/doc/apidocs/files/OpenLayers/Map-js.html
var MapOptions = {
  projection: new OpenLayers.Projection(authid),
  units: "m",
  numZoomLevels: Eqwc.settings.numZoomLevels == undefined ? 22 : Eqwc.settings.numZoomLevels,
  fractionalZoom: !enableBGMaps,
  zoomDuration: 10,
  controls: []
};

// Options for the main map layer (OpenLayers.layer)
//see http://dev.openlayers.org/releases/OpenLayers-2.12/doc/apidocs/files/OpenLayers/Layer-js.html
var LayerOptions = {
  buffer:0,
  singleTile:true,
  ratio:1,
  transitionEffect:"resize",
  projection:authid,
  displayOutsideMaxExtent: true,
  tileOptions: {
    // use POST for long URLs
    maxGetUrlLength: 2048
  }
};

//overview map settings - do not change variable names!
var OverviewMapOptions = {
  projection: new OpenLayers.Projection(authid),
  transitionEffect:"resize"
};
var OverviewMapSize = new OpenLayers.Size(200,200);
var OverviewMapMaximized = false; // is the overview map opend or closed by default

// change this in settings.js!
var fixedPrintResolution = Eqwc.settings.fixedPrintResolution;

// change this in settings.js!
var printCapabilities = Eqwc.settings.printCapabilities ? Eqwc.settings.printCapabilities : {
    "scales": [
        {"name": "1:100", "value": "100"},
        {"name": "1:200", "value": "200"},
        {"name": "1:250", "value": "250"},
        {"name": "1:500", "value": "500"},
        {"name": "1:1'000", "value": "1000"},
        {"name": "1:2'000", "value": "2000"},
        {"name": "1:3'000", "value": "3000"},
        {"name": "1:5'000", "value": "5000"},
        {"name": "1:7'500", "value": "7500"},
        {"name": "1:10'000", "value": "10000"},
        {"name": "1:12'000", "value": "12000"},
        {"name": "1:15'000", "value": "15000"},
        {"name": "1:20'000", "value": "20000"},
        {"name": "1:25'000", "value": "25000"},
        {"name": "1:30'000", "value": "30000"},
        {"name": "1:50'000", "value": "50000"},
        {"name": "1:75'000", "value": "75000"},
        {"name": "1:100'000", "value": "100000"},
        {"name": "1:250'000", "value": "250000"},
        {"name": "1:500'000", "value": "500000"},
        {"name": "1:750'000", "value": "750000"},
        {"name": "1:1'000'000", "value": "1000000"},
        {"name": "1:2'500'000", "value": "2500000"},
        {"name": "1:5'000'000", "value": "5000000"},
        {"name": "1:7'500'000", "value": "7500000"},
        {"name": "1:10'000'000", "value": "10000000"},
        {"name": "1:15'000'000", "value": "15000000"},
        {"name": "1:20'000'000", "value": "20000000"},
        {"name": "1:25'000'000", "value": "25000000"},
        {"name": "1:30'000'000", "value": "30000000"},
        {"name": "1:35'000'000", "value": "35000000"},
        {"name": "1:50'000'000", "value": "50000000"},
        {"name": "1:60'000'000", "value": "60000000"},
        {"name": "1:75'000'000", "value": "75000000"},
        {"name": "1:100'000'000", "value": "100000000"},
        {"name": "1:125'000'000", "value": "125000000"},
        {"name": "1:150'000'000", "value": "150000000"}
    ],
    "dpis": [
        {"name": "150 dpi", "value": "150"},
        {"name": "300 dpi", "value": "300"},
        {"name": "600 dpi", "value": "600"},
        {"name": "1200 dpi", "value": "1200"}
    ],
    "layouts": []
};

//leave this, make changes in settings.js
if (!Eqwc.settings.symbolizersHighLightLayer) {
    Eqwc.settings.symbolizersHighLightLayer = {
        "Point": {
            pointRadius: 4,
            graphicName: "circle",
            fillColor: "none",
            strokeWidth: 4,
            strokeColor: "#00FFFF"
        },
        "Line": {
            strokeWidth: 4,
            strokeOpacity: 1,
            strokeColor: "#00FFFF"
            //strokeDashstyle: "dash"
        },
        "Polygon": {
            strokeWidth: 4,
            strokeColor: "#00FFFF",
            fillColor: "none"
        }
    };
}
//styling for measure controls (distance and area)
var sketchSymbolizersMeasureControls = {
  "Point": {
    pointRadius: 4,
    graphicName: "square",
    fillColor: "#FFFFFF",
    fillOpacity: 1,
    strokeWidth: 1,
    strokeOpacity: 1,
    strokeColor: "#FF0000"
  },
  "Line": {
    strokeWidth: 3,
    strokeOpacity: 1,
    strokeColor: "#FF0000",
    strokeDashstyle: "dash"
  },
  "Polygon": {
    strokeWidth: 2,
    strokeOpacity: 1,
    strokeColor: "#FF0000",
    fillColor: "#FFFFFF",
    fillOpacity: 0.3
  }
};

//other styles
var locationAccuracyStyle = {
    fillColor: '#000',
    fillOpacity: 0.1,
    strokeWidth: 0
};

var locationMarkerStyle = {
    graphicName: 'cross',
    strokeColor: '#f00',
    strokeWidth: 2,
    fillOpacity: 0,
    pointRadius: 10
};

OpenLayers.Renderer.symbol.arrow = [0, 4, 2, 0, 4, 4, 2, 3, 0, 4];

//projection defaults from customProjections.js
var projDef = CustomProj[authid];
if (projDef !== undefined) {
    OpenLayers.Projection.defaults[authid] = {
        maxExtent: projDef.extent,
        yx: projDef.yx !== undefined ? projDef.yx : false
    };
}
