/**
 * @file Global Extended QGIS Web Client configuration template file in `/client_common/` folder. You have to copy `settings-template.js` to `settings.js` to use default settings or adjust values explained below to your needs!
 */

/**
 * Global Extended QGIS Web Client object
 * @namespace Eqwc
 * @property {Object} Eqwc.settings    Web and Mobile client settings
 * @property {Object} Eqwc.common      Common functions
 * @property {Object} Eqwc.plugins     Plugin information
 */
var Eqwc = {
    /**
     * Web and Mobile client setting
     * @namespace Eqwc.settings
     */
    settings:   {},
    common:     {},
    plugins:    {}
};

/**
 * QGIS Server version installed. Use only major number (2.18, 3.4,...)
 * @type {string}
 * @default "3.4"
 */
Eqwc.settings.qgisVersion = "3.4";

/**
 * Template string for web client header and browser window title
 * @type {string}
 * @default "projectData.title+' '+projectData.client_display_name";
 * @example "TR.appName+projectData.title+' '+projectData.client_display_name";
 */
Eqwc.settings.title = "projectData.title+' '+projectData.client_display_name";

/**
 * Limit number of features to request from server for displaying layer attribute table. If number of returned features is equal to limit then load more button is displayed in table toolbar.
 * @type {number}
 * @default 2000
 */
Eqwc.settings.limitAttributeFeatures = 2000;

/**
 * Enable by default synchronizing attribute table with current map extent. User can manage displaying whole table (with [limitAttributeFeatures]{@link Eqwc.settings.limitAttributeFeatures}) or display only visible elements with button below table (it is updated on map zoom or move).
 * @type {boolean}
 * @default false
 */
Eqwc.settings.syncAttributeTableWithView = false;

/**
 * Number of results in SearchPanel and Identify result window. _FEATURE_COUNT_ value in WMS request
 * @type {number}
 * @default 10
 */
Eqwc.settings.limitSearchMaxResults = 10;

/**
 * Tolerances for WMS GetFeatureInfo requests on QGIS Server
 *
 * tolerance values are in pixels at map dpi and will be scaled with the actual pixel ratio value for high resolution rendering
 * @type {{point: number, line: number, polygon: number}}
 * @default {{point: 4, line: 4, polygon: 2}}
 */
Eqwc.settings.featureInfoTolerances = {
    point: 4,
    line: 4,
    polygon: 2
};

/**
 * Enable tooltip text when mouse cursor is over features
 * @type {boolean}
 * @default false
 */
Eqwc.settings.enableHoverPopup = false;

/**
 * Set default mode for identify option
 * > Possible values are: `"allLayers"`, `"topMostHit"`, `"activeLayers"`
 *
 * > Note: You can control visibility of this combo for specific project in gisapp database.
 * @type {string}
 * @default "allLayers"
 */
Eqwc.settings.defaultIdentificationMode = "allLayers";

/**
 * By default project CRS is selected for displaying coordinates. You can change it with this setting.
 *
 * > Note: CRS must have it's definition loaded (EPSG js file) and must be added to QGIS project properties CRS restriction part.
 * @type {null|number}
 * @default null
 * @example 3794
 */
Eqwc.settings.defaultCoordinatesCrsCode = null;

/**
 * Display coordinates of clicked location on top of identify window results
 * @type {boolean}
 * @default true
 */
Eqwc.settings.showCoordinatesIdentify = true;

/**
 * Replace layer name in GetFeatureInfo request (identify and attributes table) and in layer export. Useful to create database view for layer, where you can reorder fields or create new read only fields from geometry, like: area, length, X, Y. This data will be displayed in identify window and attributes table and used in layer export instead of data from original layer.
 * You could use view in QGIS in the first place for ordinary layers, but if you wish that layer is editable it cannot be connected to view.
 * > Prepare:
 * 1. Write in this array layer name as it is in QGIS project,
 * 2. Create corresponding view named as *your_layer_name_view* and add it to the QGIS project. View will be hidden from legend and map.
 * 3. Set view symbology to transparent or no symbol, to avoid "seeing" it in print, because it must be added to print layers in case if its table is used in print layout.
 *
 * > If layer name is **"points"**, view name must be **"points_view"**, add in array only **"points"**
 * @example "['points']";
 * @type {Array}
 */
Eqwc.settings.replaceIdentifyLayerWithView = [];

/**
 * Set print table name from QGIS project needed to store information about title and description for each user last print.
 * > To enable: add **users_print_view** into QGIS project from gisapp database. You must add table to print layout, table will always have max 1 row for current user.
 * This table is removed from EQWC legend tree
 * @type {string}
 * @default "users_print_view"
 */
Eqwc.settings.QgisUsersPrintName = "users_print_view";

/**
 * Should first baselayer be visible on opening project
 * @type {boolean}
 * @default true
 */
Eqwc.settings.visibleFirstBaseLayer = true;

/**
 * Display NULL values
 * @type {string}
 * @default ""
 */
Eqwc.settings.noDataValue = "";

/**
 * Overwrite identify values for raster data, instead of Band 1 write desired value to be displayed as a column name
 * @type {{}}
 * @default {}
 * @example {["layername"] = ["Band 1", "Your value"]}
 * @example {["my_elevation.tif"] = ["Band 1", "Elevation"]}
 */
Eqwc.settings.overWriteRasterFieldName = {};

/**
 * Number of Zoom levels in map. This is relevant only in cases where Map does not contain base layers!
 * @type {number}
 * @default 22
 */
Eqwc.settings.numZoomLevels = 22;

/**
 * Allow users to choose [print options]{@link Eqwc.settings.printCapabilities} (leave null) or to have fixed resolution (type number for fixed DPI value).
 * @type {null|number}
 * @default null
 * @example 200
 */
Eqwc.settings.fixedPrintResolution = null;

/**
 * Define print options (scales and DPIs). For fixed DPI value look [fixedPrintResolution]{@link Eqwc.settings.fixedPrintResolution}
 * @type {Object}
 */
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

/**
 * Styling definition for highlight Layer (GetFeatureInfo and search result visualization)
 * > [OpenLayers2 Style definition]{@link http://dev.openlayers.org/docs/files/OpenLayers/Style-js.html}
 * @type {}
 */
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

/**
 * Integrate separate gisportal code to browse projects and manage database
 * > [gisportal]{@link https://github.com/level2-gis/gisportal}
 * @type {boolean}
 * @default false
 */
Eqwc.settings.useGisPortal = false;

Eqwc.settings.gisPortalRoot = '/gisportal/index.php/';

/**
 * Optional prefix to browser window title
 * @type {string}
 * @default ''
 */
Eqwc.settings.gisPortalTitle = '';
Eqwc.settings.mailServiceUrl = Eqwc.settings.gisPortalRoot + 'mail/send';
Eqwc.settings.gisPortalProfile = Eqwc.settings.gisPortalRoot + 'profile';

/**
 * Use tiled WMS requests for QGIS project
 * > Mobile only
 * @type {boolean}
 * @default false
 */
Eqwc.settings.mobileUseTiledWMS = false;

/**
 * Enable tracking by default (auto center map on current position when position is on)
 * > Mobile only
 * @type {boolean}
 * @default false
 * @deprecated since release 1.9.2 (setting not needed anymore)
 */
Eqwc.settings.mobileEnableTracking = false;

/**
 * Minimum scale (maximum zoom to scale) for map
 * > Mobile only
 * @type {number}
 * @default 50
 */
Eqwc.settings.mobileMinScale = 50;

/**
 * Show accuracy information in location panel
 * > Mobile only
 * @type {boolean}
 * @default true
 */
Eqwc.settings.mobileShowAccuracy = true;

/**
 * Change that if you set alias for files field in QGIS, then enter same alias here
 * >Editor plugin
 * @type {string}
 * @default "files"
 */
Eqwc.settings.qgisFilesFieldAlias = 'files';

/**
 * Unit system for displaying distance and area measurements.
 * > Possible values are: `"metric"`, `"english"`, `"geographic"`
 *
 * > **metric**: "km", "m"
 *
 * > **english**: "mi", "ft", "in" for length and "ac" for area
 *
 * > **geographic**: "dd"
 *
 * @type {string}
 * @default "metric"
 */
Eqwc.settings.measurementsUnitSystem = 'metric';

/**
 * Maximum allowed height in pixels for layer legend. If legend height is larger, vertical scroller will be used
 * @type {number}
 * @default 200
 */
Eqwc.settings.layerLegendMaxHeightPx = 200;

/**
 * Possible vector layers export formats in form: `['name'], ['description']`. You can remove formats from list or rename format description (keep format name as it is!)
 * @type {string[][]}
 * @example [
    ['SHP', 'ESRI Shapefile'],
    ['DXF', 'AutoCAD DXF'],
    ['XLSX', 'MS Office Open XLSX'],
    ['CSV', 'Text CSV (semicolon)'],
    ['TSV', 'Text TSV (tab)'],
    ['KML', 'Keyhole Markup Language KML'],
    ['GeoJSON', 'GeoJSON']
 ]
 */
Eqwc.settings.vectorExportFormats = [
    ['SHP', 'ESRI Shapefile'],
    ['DXF', 'AutoCAD DXF'],
    ['XLSX', 'MS Office Open XLSX'],
    ['CSV', 'Text CSV (semicolon)'],
    ['TSV', 'Text TSV (tab)'],
    ['KML', 'Keyhole Markup Language KML'],
    ['GeoJSON', 'GeoJSON']
];

/**
 * Possible table layers (no geometry) export formats in form: `['name'], ['description']`. You can remove formats from list or rename format description (keep format name as it is!)
 * @type {string[][]}
 * @example [
 ['XLSX', 'MS Office Open XLSX'],
 ['CSV', 'Text CSV (semicolon)'],
 ['TSV', 'Text TSV (tab)']
 ]
 */
Eqwc.settings.tableExportFormats = [
    ['XLSX', 'MS Office Open XLSX'],
    ['CSV', 'Text CSV (semicolon)'],
    ['TSV', 'Text TSV (tab)']
];

/**
 * Height for initial bookmarks panel in px. User can resize it later. Only visible if there are any bookmarks stored in QGIS project. Set value to 0 to hide bookmark panel.
 * @type {number}
 */
Eqwc.settings.bookmarkPanelHeight = 200;

/**
 * Configuration for formatting values in web client identify window.
 * Possible actions are:
 *  - display fixed tooltip for field values
 *  - display dynamic tooltip using database and WSGI part for specific field value
 *  - link to URL using field value as part of URL, use HTML <a> tag
 *  Format:
 *  {
 *      FIELD_NAME1_UPPER_CASE: {template: string},
 *      FIELD_NAME2_UPPER_CASE: {template: string}
 *  }
 * @type {}
 * @example {
 * 'DB_LOOKUP_FIELD': {template: "%VALUE%", url: 'https://your_server/wsgi/lookup.wsgi?table=db_table_name&code='},
 * 'LINK_AND_TOOLTIP_FIELD': {template: "<a class='link' ext:qtitle='Tip title' ext:qwidth='150' ext:qtip='This is a quick tip from markup!' href='http://www.google.it/#output=search&q=%VALUE%' target='_blank'>%VALUE%</a>"}
 * }
 * @default {}
 */
Eqwc.settings.fieldTemplates = {};

/**
 * This text is displayed as tooltip when dynamic tooltip using configuration above cannot retrieve data from WSGI script
 * @type {string}
 */
Eqwc.settings.toolTipEmptyText = 'no data';

/**
 * Display of modal window that guest users must accept before continue. Write title for window to display it.
 * @type {null|string}
 */
Eqwc.settings.guestWinTitle = null;

/**
 * Button text for accepting conditions for guest users
 * @type {string}
 */
Eqwc.settings.guestWinConfirm = 'Accept and continue';

/**
 * Detail text in HTML for modal window
 * @type {string}
 */
Eqwc.settings.guestWinText = '<p><b>Conditions of use of web client</b></p><p>Details</p>';

/**
 * By default project CRS is selected for displaying coordinates. You can change default display of coordinates with this setting.
 *
 * > Note: CRS must have it's definition loaded (EPSG js file) and must be added to QGIS project properties CRS restriction part.
 * > Note: This setting here is global for all projects. Can be overwritten per each project by adding data into *project.json* file into *defaultCoordinatesCrsCode* property.
 * @type {null|number}
 * @default null
 * @example 3794
 */
Eqwc.settings.defaultCoordinatesCrsCode = null;

/**
 * By default all groups inside QGIS project will be closed in web client. This setting to true opens all groups in web client on project open.
 * > Note: This setting here is global for all projects. Can be overwritten per each project by adding data into *project.json* file into *expandAllGroups* property.
 * @type {boolean}
 * @default false
 */
Eqwc.settings.expandAllGroups = false;

/**
 * [More information - search panels]{@link https://github.com/level2-gis/gisapp/wiki/5.2.-JSON#1-search-panels}
 * > Note: This setting here is global for all projects. Can be overwritten per each project by adding data into *project.json* file into *search* property.
 * @type {string[]}
 */
Eqwc.settings.search = [];

/**
 * [More information - search combo]{@link https://github.com/level2-gis/gisapp/wiki/5.2.-JSON#2-search-combo}
 * > Note: This setting here is global for all projects. Can be overwritten per each project by adding data into *project.json* file into *geocode* property.
 * @type {{}}
 */
Eqwc.settings.geocode = {};

/**
 * [More information - search combo]{@link https://github.com/level2-gis/gisapp/wiki/5.2.-JSON#2-search-combo}
 * > Note: This setting here is global for all projects. Can be overwritten per each project by adding data into *project.json* file into *wsgi* property.
 * @type {{}}
 */
Eqwc.settings.wsgi = {};

/**
 * More information - https://github.com/level2-gis/gisapp/wiki/5.2.-JSON#3-location-services
 * > Note: This setting here is global for all projects. Can be overwritten per each project by adding data into *project.json* file into *locationServices* property.
 * @type {string[]}
 */
Eqwc.settings.locationServices = [];