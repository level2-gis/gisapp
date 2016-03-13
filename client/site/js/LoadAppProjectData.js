/*
 *
 * LoadAppProjectData.js -- part of Extended QGIS Web Client
 *
 * Copyright (2010-2015), The QGIS Project and Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 *
 */


//This file is used instead of GlobalOptions.js from QWC

var lang = "en";
var helpfile = "help_en.html";

//Custom function to populate GetUrlParams variables
var customGetUrlParamsParser = null;

var serverAndCGI = "/proxy";

//Optional url for print server hosted on a different server. Default: same as above.
// var serverAndCGI = "http://otherserver/cgi-bin/qgis_mapserv.fcgi";
var printServer = serverAndCGI;

var useGetProjectSettings = true;
var showLayerOrderTab = false;
var grayLayerNameWhenOutsideScale = true;
var showMetaDataInLegend = true;
var enableHoverPopup = false;
var defaultIdentificationMode = "allLayers";
var useGeodesicMeasurement = true;
var useGeoNamesSearchBox = projectData.geoNames != null;
var iconDirectory = 'client/site/gis_icons/';
var coordinatePrecision = 2;    //precision of coordinates decimal places in GetFeatureInfo result window
var elevationPrecision = 1;     //precision of height in GetFeatureInfo result window
var minimumAddressRange = 1000;  //range in meters within address is displayed with GetFeatureInfo, if outside than only regional info is displayed

//URL for custom search scripts
var searchBoxQueryURL = null; // "/wsgi/search.wsgi?query=";
var searchBoxGetGeomURL = null; // "/wsgi/getSearchGeom.wsgi";

var autoActivateSearchGeometryLayer = true;

//TODO what to do here
// PHP based search scripts (postgis layers only)
//var searchBoxQueryURL = 'client/php/search.php?map=' + projectData.project;
//var searchBoxGetGeomURL = 'client/php/search_geom.php?map=' + projectData.project;

var enablePermalink = true;
var permaLinkURLShortener = null; // "/wsgi/createShortPermalink.wsgi";

var enableBGMaps = true;
var enableExtraLayers = false;

// enable to use WMTS base layers
var enableWmtsBaseLayers = false;
// NOTE: also set MapOptions according to WMTS

var mediaurl = '';
var suppressEmptyValues = false;
var suppressInfoGeometry = true;
var showFieldNamesInClickPopup = true;
var showFeatureInfoLayerTitle = true;
var noDataValue = '';    //what do you want to display instead of NULL values

//config for QGIS.SearchPanel
//Number of results: FEATURE_COUNT in WMS request
var simpleWmsSearchMaxResults = 10;

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

//first part of titlebar text
var titleBarText = TR.appName; // will be appended with project title

// header logo image and link
var headerLogoImg = projectData.client_logo;
var headerLogoHeight = 24; // logo image height in pixels
var headerLogoLink = projectData.client_url; // logo links to this URL
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
var qgisLayerTransparency = true;


// OpenLayers global options
// see http://dev.openlayers.org/releases/OpenLayers-2.10/doc/apidocs/files/OpenLayers/Map-js.html
var MapOptions = {
  projection: new OpenLayers.Projection(authid),
  units: "m",
  numZoomLevels:22,
  fractionalZoom: !enableBGMaps,
  transitionEffect:"resize",
  zoomDuration: 1,
  controls: []
};

// Options for the main map layer (OpenLayers.layer)
//see http://dev.openlayers.org/releases/OpenLayers-2.12/doc/apidocs/files/OpenLayers/Layer-js.html
var LayerOptions = {
  buffer:0,
  singleTile:true,
  ratio:1,
  transitionEffect:"resize",
  isBaseLayer: false,
  projection:authid,
  yx: {"EPSG:900913": false},
  // If your projection is known to have an inverse axis order in WMS 1.3 compared to WMS 1.1 enter true for yx.
  // For EPSG:900913 OpenLayers should know it by default but because of a bug in OL 2.12 we enter it here.
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

// prevent the user from choosing a print resolution
// if fixedPrintResolution = null, the user is allowed to choose the print resolution.
var fixedPrintResolution = null; // for a fixed resolution of 200dpi fill 200

//print options - scales and dpi
var printCapabilities={
  "scales":[
    {"name":"1:100","value":"100"},
    {"name":"1:200","value":"200"},
    {"name":"1:250","value":"250"},
    {"name":"1:500","value":"500"},
    {"name":"1:1'000","value":"1000"},
    {"name":"1:2'000","value":"2000"},
    {"name":"1:3'000","value":"3000"},
    {"name":"1:5'000","value":"5000"},
    {"name":"1:7'500","value":"7500"},
    {"name":"1:10'000","value":"10000"},
    {"name":"1:12'000","value":"12000"},
    {"name":"1:15'000","value":"15000"},
    {"name":"1:20'000","value":"20000"},
    {"name":"1:25'000","value":"25000"},
    {"name":"1:30'000","value":"30000"},
    {"name":"1:50'000","value":"50000"},
    {"name":"1:75'000","value":"75000"},
    {"name":"1:100'000","value":"100000"},
    {"name":"1:250'000","value":"250000"},
    {"name":"1:500'000","value":"500000"},
    {"name":"1:750'000","value":"750000"},
    {"name":"1:1'000'000","value":"1000000"},
    {"name":"1:2'500'000","value":"2500000"},
    {"name":"1:5'000'000","value":"5000000"},
    {"name":"1:7'500'000","value":"7500000"},
    {"name":"1:10'000'000","value":"10000000"},
    {"name":"1:15'000'000","value":"15000000"},
    {"name":"1:20'000'000","value":"20000000"},
    {"name":"1:25'000'000","value":"25000000"},
    {"name":"1:30'000'000","value":"30000000"},
    {"name":"1:35'000'000","value":"35000000"},
    {"name":"1:50'000'000","value":"50000000"},
    {"name":"1:60'000'000","value":"60000000"},
    {"name":"1:75'000'000","value":"75000000"},
    {"name":"1:100'000'000","value":"100000000"},
    {"name":"1:125'000'000","value":"125000000"},
    {"name":"1:150'000'000","value":"150000000"}
 ],
  "dpis":[
    {"name":"150 dpi","value":"150"},
    {"name":"300 dpi","value":"300"},
    {"name":"600 dpi","value":"600"},
    {"name":"1200 dpi","value":"1200"}
  ],
  "layouts":[]
};

// <------------ No changes should be needed below here ------------------>

//styling definitions for highlightLayer
//is used for hightlighting features (GetFeatureInfo and search result visualization)
//see http://dev.openlayers.org/releases/OpenLayers-2.10/doc/apidocs/files/OpenLayers/Style-js.html
var symbolizersHighLightLayer = {
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

var streetViewMarkerStyle = {
    graphicName: "arrow",
    strokeColor: '#333333',
    fillColor: '#FF9900',
    strokeWidth: 2,
    pointRadius: 8,
    rotation: 0
};

OpenLayers.Renderer.symbol.arrow = [0, 4, 2, 0, 4, 4, 2, 3, 0, 4];