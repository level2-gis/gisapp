/**
 * Client configuration template file. You have to copy this to settings.js and then adjust values to your needs!
 *
 * See documentation at gisapp/docs/Eqwc.settings.html
 */

var Eqwc = {
    settings:   {},
    common:     {},
    plugins:    {}
};

Eqwc.settings.qgisVersion = "2.18";
Eqwc.settings.title = "projectData.title+' '+projectData.client_display_name";
Eqwc.settings.limitAttributeFeatures = 2000;
Eqwc.settings.syncAttributeTableWithView = false;
Eqwc.settings.limitSearchMaxResults = 10;
Eqwc.settings.featureInfoTolerances = {
    point: 4,
    line: 4,
    polygon: 2
};
Eqwc.settings.enableHoverPopup = false;
Eqwc.settings.defaultIdentificationMode = "allLayers";
Eqwc.settings.defaultCoordinatesCrsCode = null;
Eqwc.settings.showCoordinatesIdentify = true;
Eqwc.settings.replaceIdentifyLayerWithView = [];
Eqwc.settings.QgisUsersPrintName = "users_print_view";
Eqwc.settings.visibleFirstBaseLayer = true;
Eqwc.settings.noDataValue = "";
Eqwc.settings.overWriteRasterFieldName = {};
Eqwc.settings.numZoomLevels = 22;
Eqwc.settings.fixedPrintResolution = null;
Eqwc.settings.printCapabilities={
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
    "dpis": [
        {"name": "150 dpi", "value": "150"},
        {"name": "300 dpi", "value": "300"},
        {"name": "600 dpi", "value": "600"},
        {"name": "1200 dpi", "value": "1200"}
    ],
    "layouts":[]
};
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
Eqwc.settings.useGisPortal = false;
Eqwc.settings.gisPortalRoot = '/gisportal/index.php/';
Eqwc.settings.gisPortalTitle = '';
Eqwc.settings.mailServiceUrl = Eqwc.settings.gisPortalRoot + 'mail/send';
Eqwc.settings.gisPortalProfile = Eqwc.settings.gisPortalRoot + 'profile';
Eqwc.settings.mobileUseTiledWMS = false;
Eqwc.settings.mobileEnableTracking = false;
Eqwc.settings.mobileMinScale = 50;
Eqwc.settings.mobileShowAccuracy = true;
Eqwc.settings.qgisFilesFieldAlias = 'files';
Eqwc.settings.measurementsUnitSystem = 'metric';
Eqwc.settings.layerLegendMaxHeightPx = 200;
Eqwc.settings.vectorExportFormats = [
    ['SHP', 'ESRI Shapefile'],
    ['DXF', 'AutoCAD DXF'],
    ['XLSX', 'MS Office Open XLSX'],
    ['CSV', 'Text CSV (semicolon)'],
    ['TSV', 'Text TSV (tab)'],
    ['KML', 'Keyhole Markup Language KML'],
    ['GeoJSON', 'GeoJSON']
];
Eqwc.settings.tableExportFormats = [
    ['XLSX', 'MS Office Open XLSX'],
    ['CSV', 'Text CSV (semicolon)'],
    ['TSV', 'Text TSV (tab)']
];