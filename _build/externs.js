/**
 * @externs
 */

/**
 * @type {Object}
 */
var GeoExt = {};
var Ext = {};
var QGIS = {};

var TR = {};
var Eqwc = {};

var projectData = {};

var geoExtMap;
var layerTree;
var selectedLayers; //later an array containing all visible (selected) layers
var selectedQueryableLayers; //later an array of all visible (selected and queryable) layers
var allLayers; //later an array containing all leaf layers
var thematicLayer, highlightLayer, featureInfoHighlightLayer;
var highLightGeometry = [];
var WMSGetFInfo , WMSGetFInfoHover;
//var lastLayer, lastFeature;
var featureInfoResultLayers;
var measureControls;
var mainStatusText, rightStatusText;
var loadMask; //mask displayed during loading or longer operations
var screenDpi;
var qgisSearchCombo; //modified search combobox
var wmsLoader; //modified WMSCapabilitiesLoader from GeoExt
//var xsiNamespace = "http://www.w3.org/2001/XMLSchema-instance";
var hoverPopup = null;
var clickPopup = null;
var printWindow;
var printProvider, printExtent;
var ptTomm = 0.35277; //conversion pt to mm
//var printScaleCombobox;
var coordinateTextField; //reference to number field for coordinate display
var printLayoutsDefined = false; //true if ComposerTemplates are found in QGIS
var navHistoryCtrl; //OpenLayers NavigationHistory control
var identificationMode; //can have a value from objectIdentificationModes
var mapInfoFieldName = "tooltip"; // this field is suppressed in the AttributeTree panel
var identifyToolActive = false; // a state variable used to track whether the tooltip should be displayed or not
var identifyToolWasActive = false; //this state variable is used during theme switching
var initialLoadDone = false; //a state variable defining if an initial project was loaded or not
var themeChangeActive = false; //status to indicate if theme change is active
var mapThemeSwitcher = null; //later optionally holds reference to themeSwitcher
var layerTreeSelectionChangeHandlerFunction; //a reference to the handler function of the selection tree
var layerOrderPanel = null;
var help_active = false; //help window is active or not
var helpWin; //Ext window that will display the help file
var legendMetadataWindow_active = false; //legend graphic and metadata window is active or not
var legendMetadataWindow; //Ext window that will hold the legend and metatadata
var feedbackWin;
var legendMetaTabPanel; //a reference to the Ext tabpanel holding the tabs for legend graphic and metadata
var legendTab; //a reference to the Ext tab holding the legend graphic
var metadataTab; //a reference to the Ext tab holding the metadata information
var measurePopup;
var currentlyVisibleBaseLayer = null;
var layerImageFormats;

var OpenLayers = {
    /**
     * @constructor
     */
    Bounds: function(){},
    /**
     * @constructor
     */
    Control: function(){},
    /**
     * @constructor
     */
    Map: function(){},

    /**
     * @constructor
     */
    Feature: {
        /**
         * @constructor
         * @param {OpenLayers.Geometry} geometry
         * @param {Object=} attributes
         * @param {Object=} style
         */
        Vector: function(geometry, attributes, style){}
    }
};

/**
 * @constructor
 */
OpenLayers.Geometry;

/**
 * @constructor
 * @extends OpenLayers.Geometry
 */
OpenLayers.Geometry.Point = function(a, b){};

/**
 * @constructor
 */
OpenLayers.Layer = function(){};

/**
 * @constructor
 * @param {String|string} name
 * @param {Object=} options
 */
OpenLayers.Layer.Vector = function(name, options){}

/**
 * @constructor
 */
OpenLayers.Strategy = function(){};