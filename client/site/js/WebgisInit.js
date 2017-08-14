/*
 *
 * WebgisInit.js -- part of QGIS Web Client
 *
 * Copyright (2010-2013), The QGIS Project All rights reserved.
 * QGIS Web Client is released under a BSD license. Please see
 * https://github.com/qgis/qgis-web-client/blob/master/README
 * for the full text of the license and the list of contributors.
 *
 */

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
var layerImageFormats = layerImageFormats || []; // use config from GlobalOptions if any

// Call custom Init in Customizations.js
customInit();

Ext.onReady(function () {
    //dpi detection
    screenDpi = document.getElementById("dpiDetection").offsetHeight;
    OpenLayers.DOTS_PER_INCH = screenDpi;
    //test
    //OpenLayers.DOTS_PER_INCH = 90.71428571428572;

    //fix for IE <= 8, missing indexOf function
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }
    }

    //some references
    layerTree = Ext.getCmp('LayerTree');
    mainStatusText = Ext.getCmp('mainStatusText');
    rightStatusText = Ext.getCmp('rightStatusText');

    //set some status messsages
    mainStatusText.setText(mapAppLoadingString[lang]);

    if (urlParamsOK) {
		loadWMSConfig(null);
    } else {
        alert(errMessageStartupNotAllParamsFoundString[lang]);
    }

    if (fullColorLayers.length > 0) {
        // add fullColorLayers to layerImageFormats
        var fullColorLayersAppended = false;
        for (var i = 0; i < layerImageFormats.length; i++) {
            var layerImageFormat = layerImageFormats[i];
            if (layerImageFormat.format == "image/jpeg") {
                // append fullColorLayers to jpeg format
                layerImageFormat.layers = layerImageFormat.layers.concat(fullColorLayers);
                fullColorLayersAppended = true;
                break;
            }
        }
        if (!fullColorLayersAppended) {
            // add new jpeg config with fullColorLayers
            layerImageFormats.push({
                format: "image/jpeg",
                layers: fullColorLayers
            });
        }
    }

    customPostLoading(); //in Customizations.js
});
