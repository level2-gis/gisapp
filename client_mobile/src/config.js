/**
 * Custom configuration
 */
var Config = {};


Config.parseExtentToArray = function(str){
    var ext2 = [];
    var extent = str.split(',');
    ext2.push(parseInt(extent[0]));
    ext2.push(parseInt(extent[1]));
    ext2.push(parseInt(extent[2]));
    ext2.push(parseInt(extent[3]));
    return ext2;
};

Config.extractStringFromObject = function (objName, string) {

    if (string.indexOf(objName)==-1) {
        return string;
    }

    var ret = '';
    var start = string.indexOf('(')+1;
    var end = string.indexOf(')');
    ret = '['+string.substring(start, end)+']';

    return ret;
};

Config.getLayerName = function (lid) {
    if (projectData.layers[lid]) {
        return projectData.use_ids ? projectData.layers[lid].layername : lid;
    }
    else {
        return lid;
    }
};

Config.baseLayerExists = function (name) {
    var bl = projectData.baseLayers();
    for (var i in bl) {
        if (bl[i].title == name) {
            return true;
        }
    }
    return false;
};

Config.extraLayerExists = function (name) {
    var bl = projectData.extraLayers();
    for (var i in bl) {
        if (bl[i].title == name) {
            return true;
        }
    }
    return false;
};


// flag to activate debug code
Config.debug = false;


// GUI
Config.gui = {
  hideShareButton: true,
  hideLoginButton: false,
  useLayertreeGroupCheckboxes: true
};


// login (if hideLoginButton is false)
Config.login = new Login();

// enable this to redirect to HTTPS before login
Config.sslLogin = false;

/* Configuration for Mapfish Appserver:
Config.login = new MapfishLogin();
*/


// data configuration
Config.data = {};

//Config.data.topicsUrl = "client_mobile/data/topics.json";

//Config.data.layersUrl = function(topicName) {
//    return "client_mobile/data/layers/layers_" + topicName + ".json";
//};

/* Configuration for Mapfish Appserver:
Config.data.topicsUrl = "/topics.json?gbapp=default";

Config.data.layersUrl = function(topicName) {
return "/layers.json?topic=" + topicName;
}
*/

Config.data.initialTopic = projectData.project;

// default properties
Config.defaultProperties = {
  following: Eqwc.settings.mobileEnableTracking,
  orientation: false,
  scalebar: true
};


// feature info
Config.featureInfo = {};

// feature info format ('text/xml' or 'text/html')
Config.featureInfo.format = 'text/xml';

// enable this to use WMS GetFeatureInfo requests
Config.featureInfo.useWMSGetFeatureInfo = true;

// max number of features per layer for WMS GetFeatureInfo requests (null to use WMS default)
Config.featureInfo.wmsMaxFeatures = Eqwc.settings.limitSearchMaxResults ? Eqwc.settings.limitSearchMaxResults : null;

/**
 * Tolerances for WMS GetFeatureInfo requests on QGIS Server
 *
 * tolerance values are in pixels at map dpi and will be scaled with
 * the actual pixel ratio value for high resolution rendering
 */
Config.featureInfo.tolerances = {
  point: 4,
  line: 4,
  polygon: 2
};

/**
 * custom feature info URL when not using WMS GetFeatureInfo
 *
 * topicName: current topic
 * coordinate: clicked position as [x, y]
 * layers: array of visible WMS layer names
 *//*
Config.featureInfo.url = function(topicName, coordinate, layers) {
  // DEBUG: sample static files for demonstration purposes
  if (Config.featureInfo.format === 'text/xml') {
    // sample QGIS Server XML query results
    return "data/get_feature_info_response.xml";
  }
  else {
    // sample HTML results
    return "data/get_feature_info_response.html";
  }
};*/

/* Configuration for Mapfish Appserver:
Config.featureInfo.format = 'text/html';
Config.featureInfo.useWMSGetFeatureInfo = false;
Config.featureInfo.url = function(topicName, coordinate, layers) {
  return "/topics/query?" + $.param({
    bbox: [coordinate[0], coordinate[1], coordinate[0], coordinate[1]].join(','),
    infoQuery: '{"queryTopics":[{"topic":"' + topicName + '","divCls":"legmain","layers":"' + layers.join(',') + '"}]}',
    mobile: 1
  });
}
// add styles for feature info results HTML to custom.css
*/


// map configuration
Config.map = {};

// DPI for scale calculations and WMS requests
Config.map.dpi = 96;

// ol.Extent [<minx>, <miny>, <maxx>, <maxy>]
Config.map.extent = Config.parseExtentToArray(projectData.extent);

//Config.map.scaleDenoms = [2000000, 1000000, 400000, 200000, 80000, 40000, 20000, 10000, 8000, 6000, 4000, 2000, 1000, 500, 250, 100];

Config.map.init = {
  center: ol.extent.getCenter(Config.map.extent),
  zoom: 6
};

// ol.proj.Projection
// add definition if doesn't exist
if(proj4.defs[projectData.crs] === undefined) {
    proj4.defs(projectData.crs, projectData.proj4);

    var projDef = CustomProj[projectData.crs];

    Config.map.projection = new ol.proj.Projection({
        code: projectData.crs,
        extent: projDef.extent,
        units: projDef.units,
        axisOrientation: projDef.yx === false ? 'enu' : 'neu'
    });
}
else {
    Config.map.projection = ol.proj.get(projectData.crs);
}

//Config.map.projection.setExtent(Config.map.extent);

// calculate resolutions from scales
//Config.map.scaleDenomsToResolutions = function(scales) {
//  var resolutions = $.map(scales, function(scale, index) {
//    return scale / (Config.map.projection.getMetersPerUnit() * (Config.map.dpi / 0.0254));
//  });
//  return resolutions;
//};

// ol.View options
Config.map.viewOptions = {
  projection: Config.map.projection,
  //resolutions: Config.map.scaleDenomsToResolutions(Config.map.scaleDenoms),
  //center: Config.map.init.center,
  extent: projectData.restrictToStartExtent ? Config.map.extent : undefined
  //zoom: Config.map.init.zoom,
};

Config.data.baselayers = [];
//remove google from array
//get resolutions from WMTS layer. If more last will be used
if (projectData.baseLayers() !== null) {
    for (var i = 0; i < projectData.baseLayers().length; i++) {
        var bl = projectData.baseLayers()[i];
        if (bl.type != 'Google') {
            Config.data.baselayers.push(bl);
        }
        if (bl.type == 'WMTS') {
            Config.map.viewOptions.resolutions = $.parseJSON(bl.definition).resolutions;
        }
    }
}

Config.data.extralayers = projectData.extraLayers();

Config.data.wfslayers = {};
Config.data.gotolayers = {};

// WMS server type ('geoserver', 'mapserver', 'qgis'), used for adding WMS dpi parameters
Config.map.wmsServerType = 'qgis';

Config.map.wmsParams = {
  'FORMAT': 'image/png; mode=8bit',
  'TRANSPARENT': (projectData.baseLayers() == null && projectData.extraLayers() == null) ? false : true
};

Config.map.useTiledBackgroundWMS = true;
Config.map.useTiledOverlayWMS = false;

// limit max zoom to this scale (e.g. minScaleDenom=500 for 1:500)
//UROS don't see point of this
Config.map.minScaleDenom = {
  map: 5000, // if topic.minscale is not set
  geolocation: null, // on location following
  search: 5000 // jump to search results
};

// limit min zoom to this scale on the initial geolocation update (null to disable)
Config.map.initialGeolocationMaxScale = 2000;


// search configuration
var sCon = projectData.geoCode ? projectData.geoCode : null;
if (sCon != null) {
    Config.search = new Geocode(sCon.layers, sCon.country, 10, sCon.provider, projectData.lang);
}
if (sCon == null && projectData.wsgi) {
    Config.search = new WsgiSearch("/wsgi/search.wsgi", "/wsgi/getSearchGeom.wsgi", false, projectData.wsgi.searchtables);
}

/**
 * Mapfish Appserver search
 */

// create query URL from search params
Config.mapfishSearchUrl = function(searchParams) {
  // DEBUG: sample static file for demonstration purposes
  return "data/mapfish_search_response.json";
/*
  return "/search/fullsearch.json?" + $.param({
    begriff: searchParams
  });
*/
};

// return category, feature name, highlighting data and bbox=[<minx>, <miny>, <maxx>, <maxy>]
Config.mapfishParseFeature = function(feature) {
  return {
    category: feature.kategorie,
    name: feature.begriff,
    highlight: {
      fid: feature.fid,
      layer: "FullSearch" + feature.kategorie
    },
    bbox: [feature.bbox_xmin, feature.bbox_ymin, feature.bbox_xmax, feature.bbox_ymax]
  };
};

// WMS URL for highlighting the selected search result
Config.mapfishHighlightWmsUrl = "/wms/FullSearch";

//Config.search = new MapfishSearch(Config.mapfishSearchUrl, Config.mapfishParseFeature, Config.mapfishHighlightWmsUrl);




// permalink configuration
Config.permalink = new Permalink();


/**
 * Mapfish Appserver permalink
 */

// create locate URL from locate and locations params
Config.mapfishLocateUrl = function(locate, locations) {
  return "/locate/" + locate + "?" + $.param({
    locations: locations
  });
};

//Config.permalink = new MapfishPermalink(Config.mapfishLocateUrl);


/**
 * QGIS Web Client permalink
 */
//Config.permalink = new QgisPermalink();


/**
 * Printing from browser
 */
Config.print = {
  hires: false, // enable high resolution printing
  dpi: 300 // target print resolution
};


/**
 * called after viewer init
 *
 * e.g. setup custom click handlers here
 */
Config.customInitViewer = function() {

};