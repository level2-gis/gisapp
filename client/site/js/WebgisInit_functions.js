/**
 * Created by uros on 5/2/17.
 */

function loadWMSConfig(topicName) {
    loadMask = new Ext.LoadMask(Ext.getCmp('MapPanel').body, {
        msg: mapLoadingString[lang]
    });
    loadMask.show();
    //load getCapabilities info in treeview
    wmsLoader = new QGIS.WMSCapabilitiesLoader({
        url: wmsURI,
        useGetProjectSettings: useGetProjectSettings,
        layerOptions: {
            buffer: 0,
            singleTile: true,
            ratio: 1
        },
        layerParams: {
            'TRANSPARENT': 'TRUE'
        },
        projectSettings: null,
        initialVisibleLayers: [],
        // customize the createNode method to add a checkbox to nodes and the ui provider
        createNode: function (attr) {
            attr.checked = false;
            if (!attr.layer.metadata.showCheckbox) {
                // hide checkbox
                attr.cls = 'layer-checkbox-hidden';
            }
            return QGIS.WMSCapabilitiesLoader.prototype.createNode.apply(this, [attr]);
        },
        baseAttrs: {
            uiProvider: Ext.tree.TriStateNodeUI
        },
        topicName: topicName,
        listeners: {
            'loadexception': function (obj, node, response) {
                exceptionLoading(response);
            }
        }
    });

    var root = new Ext.tree.AsyncTreeNode({
        id: 'wmsNode',
        text: 'WMS',
        loader: wmsLoader,
        allowDrop: false,
        expanded: true,
        expandChildNodes: true,
        listeners: {
            'load': function () {
                postLoading();
            }
        }
    });

    layerTree.setRootNode(root);

}

function postLoading() {

    //DescriptionPanel
    var descPanel = Ext.getCmp('DescriptionPanel');
    if (descPanel.el.dom.innerText.length>15) {
        descPanel.setVisible(true);
    }

    layerTreeSelectionChangeHandlerFunction = function (selectionModel, treeNode) {
        if (!themeChangeActive) {
            //change selected activated layers for GetFeatureInfo requests
            layerTree.fireEvent("leafschange");
        }
    };

    //setting up project specific data
    var initialBGMap = 0;
    var baseLayers = projectData.setBaseLayers(true);
    var extraLayers = projectData.setBaseLayers(false);
    var overviewLayer = makeLayer(projectData.overViewLayer(), true);

    // run the function from Customizations.js
    customBeforeMapInit();

    //set root node to active layer of layertree
    layerTree.selectPath(layerTree.root.firstChild.getPath());

    applyPermalinkParams();

    //now set all visible layers and document/toolbar title
    //var layerNode;
    layerTree.suspendEvents();
    if (layerTree.root.hasChildNodes()) {
        //set titles in document and toolbar
        // var title = layerTree.root.firstChild.text;
        // if (title in projectTitles) {
        // title = projectTitles[title];
        // }
        document.title = titleBarText;

        // set header logo and link
        if (headerLogoLink > '') {
            Ext.select('#panel_header_link a').replaceWith({
                tag: 'a',
                href: headerLogoLink,
                target: '_blank',
                children: [{
                    tag: 'img',
                    src: headerLogoImg,
                    height: headerLogoHeight
                }]
            });

            // adjust title position
            Ext.get('panel_header_title').setStyle('padding-left', '8px');
            var paddingTop = (headerLogoHeight - 18) / 2;
            Ext.get('panel_header_title').setStyle('padding-top', paddingTop + 'px');
        }
        Ext.get('panel_header_title').update(document.title);

        //user
        // adjust position
        paddingTop = (headerLogoHeight - 12) / 2;
        Ext.get('panel_header_user').setStyle('padding-top', paddingTop + 'px');

        // set terms of use link
        if ((headerTermsOfUseText != null) && !Eqwc.settings.useGisPortal) {
            Ext.select('#panel_header_terms_of_use a').replaceWith({
                tag: 'a',
                href: headerTermsOfUseLink,
                //html: headerTermsOfUseText,
                cls: 'x-tool',
                'ext:qtip': headerTermsOfUseText,
                target: '_self'
            });

            if (headerLogoImg != null) {
                // adjust terms of use position
                Ext.get('panel_header_terms_of_use').setStyle('padding-top', paddingTop + 'px');
            }
        }


        //now iterate 'visibleLayers'
        if (visibleLayers == null) {
            //in case the visible layers are not provided as URL parameter we read the visibility settings from the
            //GetProjectSettings response - we need to adapt the drawing order from the project
            visibleLayers = layersInDrawingOrder(wmsLoader.initialVisibleLayers);
        }

        layerTree.root.firstChild.expand(true, false);
        // expand all nodes in order to allow toggling checkboxes on deeper levels
        layerTree.root.findChildBy(function () {
            if (this.isExpandable()) {
                this.expand(true, false);
            }
            return false;
        }, null, true);
        for (var index = 0; index < visibleLayers.length; index++) {
            // toggle checkboxes of visible layers
            layerTree.root.findChildBy(function () {
                if (wmsLoader.layerTitleNameMapping[this.attributes["text"]] == visibleLayers[index]) {
                    this.getUI().toggleCheck(true);
                    // FIXME: never return true even if node is found to avoid TypeError
                    //				return true;
                }
                return false;
            }, null, true);
        }

        //we need to get a flat list of visible layers so we can set the layerOrderPanel
        getVisibleFlatLayers(layerTree.root.firstChild);

        // add abstracts to project node and group nodes
        addAbstractToLayerGroups();

        // add components to tree nodes while tree is expanded to match GUI layout
        // info buttons in layer tree
        //addInfoButtonsToLayerTree();

        //expand first level
        layerTree.root.firstChild.collapseChildNodes(true);
        layerTree.root.firstChild.expand(false, false);
    }
    layerTree.checkedLeafs = [];
    layerTree.resumeEvents();

    if (!initialLoadDone) {
        //deal with myTopToolbar (map tools)
        //toggle buttons
        Ext.getCmp('IdentifyTool').toggleHandler = mapToolbarHandler;
        Ext.getCmp('measureDistance').toggleHandler = mapToolbarHandler;
        Ext.getCmp('measureArea').toggleHandler = mapToolbarHandler;
        Ext.getCmp('PrintMap').toggleHandler = mapToolbarHandler;
        // check for undefined to not break existing installations
        if (typeof(enablePermalink) == 'undefined') {
            enablePermalink = true;
        }
        // Remove permaLinkButton as configured in GlobalOptions
        if (!enablePermalink) {
            Ext.getCmp('SendPermalink').destroy();
        } else {
            Ext.getCmp('SendPermalink').handler = mapToolbarHandler;
        }
        //Ext.getCmp('ShowHelp').handler = mapToolbarHandler;

        // Add custom buttons (Customizations.js)
        customToolbarLoad();

        //combobox listeners
        var ObjectIdentificationModeCombobox = Ext.getCmp('ObjectIdentificationModeCombo');
        ObjectIdentificationModeCombobox.setValue(defaultIdentificationMode);
        identificationMode = defaultIdentificationMode;
        ObjectIdentificationModeCombobox.on("select", function (combobox, record, index) {
            identificationMode = record.get("value");
            //need to updated active selected layers or all selected layers
            layerTree.fireEvent("leafschange");
        });
    }

    //test if max extent was set from URL or project settings
    //if not, set map parameters from GetProjectSettings/GetCapabilities
    //get values from first layer group (root) of project settings
    if (maxExtent instanceof OpenLayers.Bounds == false) {
        var proj = OpenLayers.Projection.defaults[authid];
        var reverseAxisOrder = proj == undefined ? false : proj.yx;

        var boundingBox = wmsLoader.projectSettings.capability.nestedLayers[0].bbox;
        //get bbox for map crs
        var bboxArray = boundingBox[authid].bbox;

        if (bboxArray != undefined) {
            maxExtent = OpenLayers.Bounds.fromArray(bboxArray, reverseAxisOrder);
            // never change the map extents when using WMTS base layers
            if (!enableWmtsBaseLayers) {
                MapOptions.maxExtent = maxExtent;
            }
        }
    }

    //now collect all selected layers (with checkbox enabled in tree)
    selectedLayers = [];
    selectedQueryableLayers = [];
    allLayers = [];
    var wmtsLayers = [];

    layerTree.root.firstChild.cascade(
        function (n) {
            if (n.isLeaf()) {
                if (n.attributes.checked) {
                    if (!wmsLoader.layerProperties[wmsLoader.layerTitleNameMapping[n.text]].wmtsLayer) {
                        selectedLayers.push(wmsLoader.layerTitleNameMapping[n.text]);
                    }
                    else {
                        wmtsLayers.push(wmsLoader.layerTitleNameMapping[n.text]);
                    }
                    if (wmsLoader.layerProperties[wmsLoader.layerTitleNameMapping[n.text]].queryable) {
                        selectedQueryableLayers.push(wmsLoader.layerTitleNameMapping[n.text]);
                    }
                }
                allLayers.push(wmsLoader.layerTitleNameMapping[n.text]);

                //create menu and filter properties from json configuration
                buildLayerContextMenu(n);

                n.on ('contextMenu', contextMenuHandler);
            }
            else {
                //disable contextmenu on groups
                //n.on("contextMenu", Ext.emptyFn, null, {preventDefault: true});

                //create menu and filter properties from json configuration
                buildGroupContextMenu(n);

                n.on ('contextMenu', contextMenuHandler);

            }
        }
    );
    mainStatusText.setText(mapLoadingString[lang]);
    format = imageFormatForLayers(selectedLayers);

    if (initialLoadDone) {
        printCapabilities.layouts = [];
    }
    // apply printing parameters from project settings
    var composerTemplates = wmsLoader.projectSettings.capability.composerTemplates;
    if (composerTemplates.length > 0) {
        printLayoutsDefined = true;
        for (var i = 0; i < composerTemplates.length; i++) {
            var composerTemplate = composerTemplates[i];
            var mapWidth = composerTemplate.map.width / ptTomm;
            var mapHeight = composerTemplate.map.height / ptTomm;
            //for some strange reason we need to provide a "map" and a "size" object with identical content
            printCapabilities.layouts.push({
                "name": composerTemplate.name,
                "map": {
                    "width": mapWidth,
                    "height": mapHeight
                },
                "size": {
                    "width": mapWidth,
                    "height": mapHeight
                },
                "rotation": true
            });
        }
    }

    // The printProvider that connects us to the print service
    printUrl = printURI + 'SERVICE=WMS&VERSION=1.3&REQUEST=GetPrint&FORMAT=pdf&EXCEPTIONS=application/vnd.ogc.se_inimage&TRANSPARENT=true';
    if (initialLoadDone) {
        printProvider.capabilities = printCapabilities;
        printProvider.url = printUrl;
    }
    else {
        printProvider = new QGIS.PrintProvider({
            method: "GET", // "POST" recommended for production use
            capabilities: printCapabilities, // from the info.json script in the html
            url: printUrl
        });
        printProvider.addListener("beforeprint", customBeforePrint);
        printProvider.addListener("afterprint", customAfterPrint);
    }

    if (!printExtent) {
        printExtent = new GeoExt.plugins.PrintExtent({
            printProvider: printProvider
        });
    }
    else {
        printExtent.printProvider = printProvider;
    }
    //set this to false, so that printExtent object will be re-initalized
    if (!printExtent.initialized) {
        printExtent.initialized = false;
    }


    if (!initialLoadDone) {
        var styleHighLightLayer = new OpenLayers.Style();
        styleHighLightLayer.addRules([
            new OpenLayers.Rule({
                symbolizer: symbolizersHighLightLayer
            })]);
        var styleMapHighLightLayer = new OpenLayers.StyleMap({
            "default": styleHighLightLayer
        });
    }

    var MapPanelRef = Ext.getCmp('MapPanel');

    // return input layers sorted by order defined in project settings
    function layersInDrawingOrder(layers) {
        var layerDrawingOrder = wmsLoader.projectSettings.capability.layerDrawingOrder;
        if (layerOrderPanel != null) {
            // override project settings (after first load)
            if (enableWmtsBaseLayers) {
                // prepend ordered WMTS layers
                var orderedLayers = layerOrderPanel.orderedLayers();
                var wmtsLayers = [];
                for (var i = 0; i < layerDrawingOrder.length; i++) {
                    var layer = layerDrawingOrder[i];
                    if (orderedLayers.indexOf(layer) == -1) {
                        wmtsLayers.push(layer);
                    }
                }
                layerDrawingOrder = wmtsLayers.concat(orderedLayers);
            }
            else {
                layerDrawingOrder = layerOrderPanel.orderedLayers();
            }
        }

        if (layerDrawingOrder != null) {
            var orderedLayers = [];
            for (var i = 0; i < layerDrawingOrder.length; i++) {
                var layer = layerDrawingOrder[i];
                if (layers.indexOf(layer) != -1) {
                    orderedLayers.push(layer);
                }
            }
            return orderedLayers;
        }
        else {
            return layers.reverse();
        }
    }

    // return layer opacities sorted by input layers order
    function layerOpacities(layers) {
        var opacities = Array();
        for (var i=0; i<layers.length; i++) {
            opacities.push(wmsLoader.layerProperties[layers[i]].opacity);
        }
        return opacities;
    }

    //Uros don't need this, problem with ThemeSwitcher, GlobalVariable
    //setupLayerOrderPanel();

    //create new map panel with a single OL layer
    selectedLayers = layersInDrawingOrder(selectedLayers);

    if (!initialLoadDone) {
        //we need to make sure that OpenLayers.map.fallThrough is set to true
        //otherwise the mouse events are swallowed
        MapOptions.fallThrough = true;
        //creating the GeoExt map panel
        geoExtMap = new GeoExt.MapPanel({
            frame: false,
            border: false,
            zoom: 1.6,
            layers: baseLayers.concat(
                extraLayers.concat(
                    [
                        thematicLayer = new OpenLayers.Layer.WMS(layerTree.root.firstChild.text,
                            wmsURI, {
                                layers: selectedLayers.join(","),
                                opacities: layerOpacities(selectedLayers),
                                format: format,
                                transparent: qgisLayerTransparency,
                                dpi: screenDpi,
                                VERSION: "1.3.0"
                            },
                            LayerOptions
                        ),
                        highlightLayer = new OpenLayers.Layer.Vector("attribHighLight", {
                            isBaseLayer: false,
                            styleMap: styleMapHighLightLayer
                        }),
                        featureInfoHighlightLayer = new OpenLayers.Layer.Vector("featureInfoHighlight", {
                            isBaseLayer: false,
                            styleMap: styleMapHighLightLayer
                        })
                    ])
            ),
            map: MapOptions,
            id: "geoExtMapPanel",
            width: MapPanelRef.getInnerWidth(),
            height: MapPanelRef.getInnerHeight(),
            renderTo: MapPanelRef.body,
            plugins: [printExtent]
        });

    }
    else {
        geoExtMap.map.addLayers(baseLayers);

        //this has no effect, TODO fix this that is always rendered below thematic layer
        //geoExtMap.map.setLayerIndex(thematicLayer,0);

        thematicLayer.name = layerTree.root.firstChild.text;
        thematicLayer.url = wmsURI;
        thematicLayer.mergeNewParams({
            "LAYERS": selectedLayers.join(","),
            "OPACITIES": layerOpacities(selectedLayers),
            "FORMAT": format
        });
    }

    if (!initialLoadDone) {

        //set EPSG text from OpenLayers
        var proj = geoExtMap.map.getProjectionObject();
        rightStatusText.setText(proj.getCode());

        if (urlParams.startExtent) {
            var startExtentParams = urlParams.startExtent.split(",");
            var startExtent = new OpenLayers.Bounds(parseFloat(startExtentParams[0]), parseFloat(startExtentParams[1]), parseFloat(startExtentParams[2]), parseFloat(startExtentParams[3]));
            //alert("startExtentOL="+startExtent.toString());
            geoExtMap.map.zoomToExtent(startExtent,false);
            //alert(geoExtMap.map.getExtent().toString());
        } //else {
        //why this?, map is already loaded, commenting
        //geoExtMap.map.zoomToMaxExtent();
        //}
        //add listener to adapt map on panel resize (only needed because of IE)
        MapPanelRef.on('resize', function (panel, w, h) {
            geoExtMap.setSize(panel.getInnerWidth(),panel.getInnerHeight());
        });

        // selection from permalink
        if (urlParams.selection) {
            thematicLayer.mergeNewParams({
                "SELECTION": urlParams.selection
            });
        }

        //scale listener to write current scale to numberfield
        geoExtMap.map.events.register('zoomend', this, function () {
            var currentScale = geoExtMap.map.getScale();
            Ext.getCmp('ScaleNumberField').setValue(Math.round(currentScale));
            if (geoExtMap.map.zoomBoxActive) {
                Ext.getCmp('navZoomBoxButton').toggle(false);
            }

            // call custom action on Zoom Event
            customActionOnZoomEvent();
        });

        //listener to call custom action on moveend event
        geoExtMap.map.events.register('moveend', this, function () {
            customActionOnMoveEvent();
        });


        //scale listener to gray out names in TOC, which are outside visible scale
        geoExtMap.map.events.register('zoomend', this, this.setGrayNameWhenOutsideScale);

        // loading listeners
        thematicLayer.events.register('loadstart', this, function() {
            mapIsLoading = true;
            // show the loadMask with a delay of two second, no need to show it for quick changes
            setTimeout("displayLoadMask()", 2000);
        });

        thematicLayer.events.register('loadend', this, function() {
            mapIsLoading = false;
            if (loadMask) {
                loadMask.hide();
                loadMask = null;
            }
        });

        //listener on numberfield to set map scale
        var ScaleNumberField = Ext.getCmp('ScaleNumberField');
        ScaleNumberField.setValue(Math.round(geoExtMap.map.getScale()));
        ScaleNumberField.on('change', function (numberField, newValue, oldValue) {
            var currentScale = Math.round(geoExtMap.map.getScale());
            if (currentScale != newValue) {
                geoExtMap.map.zoomToScale(newValue, true);
            }
        });

        ScaleNumberField.on('specialkey', function (numberField, evt) {
            if (evt.getKey() == evt.ENTER) {
                var currentScale = Math.round(geoExtMap.map.getScale());
                var newScale = numberField.getValue();
                if (currentScale != newScale) {
                    geoExtMap.map.zoomToScale(newScale, true);
                }
            }
            //supress arrow keys propagation to underlying OpenLayers
            if (evt.getKey() > 36 && evt.getKey() < 41) {
                evt.stopPropagation();
            }
        });

        //add OpenLayers map controls
        geoExtMap.map.addControl(new OpenLayers.Control.KeyboardDefaults());
        geoExtMap.map.addControl(new OpenLayers.Control.Navigation());
        geoExtMap.map.addControl(new OpenLayers.Control.Attribution());
        geoExtMap.map.addControl(new OpenLayers.Control.ScaleLine());

        //geoExtMap.map.addControl(new OpenLayers.Control.PanZoomBar({zoomWorldIcon:true,forceFixedZoomLevel:false}));
        geoExtMap.map.addControl(new OpenLayers.Control.Zoom());

        //for debuggin TODO UROS REMOVE THIS
        //geoExtMap.map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));

        //coordinate display
        coordinateTextField = Ext.getCmp('CoordinateTextField');
        geoExtMap.map.events.register('mousemove', this, function (evt) {
            var xy = geoExtMap.map.events.getMousePosition(evt);
            var geoxy = geoExtMap.map.getLonLatFromPixel(xy);
            var nDeci = 0;
            var currentScale = geoExtMap.map.getScale();
            if (currentScale <= 400) {
                nDeci = 1;
                if (currentScale <= 100) {
                    nDeci = 2;
                }
            }
            coordinateTextField.setRawValue(geoxy.lon.toFixed(nDeci) + "," + geoxy.lat.toFixed(nDeci));
        });

        coordinateTextField.on('specialkey', function (textField, evt) {
            if (evt.getKey() == evt.ENTER) {
                var coords = textField.getValue().split(",");
                var newCenter = new OpenLayers.LonLat(parseFloat(coords[0]), parseFloat(coords[1]));
                geoExtMap.map.setCenter(newCenter);
            }
            //supress arrow keys propagation to underlying OpenLayers
            if (evt.getKey() > 36 && evt.getKey() < 41) {
                evt.stopPropagation();
            }
        });
        coordinateTextField.on('change', function (numberField, newValue, oldValue) {
            var coords = newValue.split(",");
            var newCenter = new OpenLayers.LonLat(parseFloat(coords[0]), parseFloat(coords[1]));
            geoExtMap.map.setCenter(newCenter);
        });

        //navigation history
        navHistoryCtrl = new OpenLayers.Control.NavigationHistory();
        geoExtMap.map.addControl(navHistoryCtrl);
    }

    //controls for getfeatureinfo
    selectedQueryableLayers = layersInDrawingOrder(selectedQueryableLayers);

    if (initialLoadDone) {
        if (enableHoverPopup)
            geoExtMap.map.removeControl(WMSGetFInfoHover);
        geoExtMap.map.removeControl(WMSGetFInfo);
    }
    var fiLayer = new OpenLayers.Layer.WMS(layerTree.root.firstChild.text, wmsURI, {
        layers: [],
        VERSION: "1.3.0"
    }, LayerOptions);

    WMSGetFInfo = new OpenLayers.Control.WMSGetFeatureInfo({
        layers: [fiLayer],
        infoFormat: "text/xml",
        queryVisible: true,
        vendorParams: {
            QUERY_LAYERS: selectedQueryableLayers.join(",")
        }
    });
    WMSGetFInfo.events.register("getfeatureinfo", this, showFeatureInfo);
    WMSGetFInfo.events.register("beforegetfeatureinfo", this, onBeforeGetFeatureInfoClick);
    WMSGetFInfo.events.register("nogetfeatureinfo", this, noFeatureInfoClick);
    geoExtMap.map.addControl(WMSGetFInfo);

    if (enableHoverPopup) {
        WMSGetFInfoHover = new OpenLayers.Control.WMSGetFeatureInfo({
            layers: [fiLayer],
            infoFormat: "text/xml",
            queryVisible: true,
            hover: true,
            vendorParams: {
                QUERY_LAYERS: selectedQueryableLayers.join(",")
            }
        });
        WMSGetFInfoHover.events.register("getfeatureinfo", this, showFeatureInfoHover);
        geoExtMap.map.addControl(WMSGetFInfoHover);
    }

    //overview map
    if (!initialLoadDone && overviewLayer != null) {
        OverviewMapOptions.maxExtent = maxExtent;
        geoExtMap.map.addControl(new OpenLayers.Control.OverviewMap({
            size: OverviewMapSize,
            minRatio: 16,
            maxRatio: 64,
            mapOptions: OverviewMapOptions,
            maximized: OverviewMapMaximized,
            layers: [overviewLayer]
        }));

    }
    else {
        //todo: find out how to change the max extent in the OverviewMap
    }

    //navigation actions
    if (!initialLoadDone) {
        //UROS: selecting identifytool as default action
        Ext.getCmp('IdentifyTool').toggle(true);
        //do i need this?
        identifyToolActive = true;
        activateGetFeatureInfo(true);

        var myTopToolbar = Ext.getCmp('myTopToolbar');

        //zoom extent
        var zoomExtent = new Ext.Button({
            icon: iconDirectory+'mActionZoomFullExtent.png',
            id: 'navZoomFullExtent',
            scale: 'medium',
            map: geoExtMap.map,
            tooltip: zoomFullViewTooltipString[lang],
            tooltipType: 'qtip',
            handler: mapToolbarHandler
        });
        myTopToolbar.insert(0, zoomExtent);

        //zoom box
        var zoomBoxAction = new GeoExt.Action({
            icon: iconDirectory+'mActionZoomBox.png',
            id: 'navZoomBoxButton',
            scale: 'medium',
            control: new OpenLayers.Control.ZoomBox({
                out: false
            }),
            map: geoExtMap.map,
            tooltip: zoomRectangleTooltipString[lang],
            tooltipType: 'qtip',
            toggleGroup: 'mapTools',
            enableToggle: true,
            allowDepress: true
        });
        myTopToolbar.insert(1, zoomBoxAction);
        geoExtMap.map.zoomBoxActive = false;
        Ext.getCmp('navZoomBoxButton').on('toggle', mapToolbarHandler);

        var zoomToPreviousAction = new GeoExt.Action({
            icon: iconDirectory+'mActionZoomLast.png',
            scale: 'medium',
            control: navHistoryCtrl.previous,
            disabled: true,
            tooltip: navigationHistoryBackwardTooltipString[lang],
            tooltipType: 'qtip',
            id: 'zoomLast'
        });
        myTopToolbar.insert(2, zoomToPreviousAction);
        //zoom next
        var zoomToNextAction = new GeoExt.Action({
            icon: iconDirectory+'mActionZoomNext.png',
            scale: 'medium',
            control: navHistoryCtrl.next,
            disabled: true,
            tooltip: navigationHistoryForwardTooltipString[lang],
            tooltipType: 'qtip',
            id: 'zoomNext'
        });
        myTopToolbar.insert(3, zoomToNextAction);

        //geolocate control
        if (projectData.geolocation) {
            var geoLocateAction = new GeoExt.Action({
                icon: iconDirectory + 'mActionLocate.png',
                id: 'geoLocate',
                scale: 'medium',
                control: new OpenLayers.Control.Geolocate({
                    bind: false,
                    geolocationOptions: {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 7000
                    }
                }),
                map: geoExtMap.map,
                tooltip: showLocationTooltipString[lang],
                tooltipType: 'qtip',
                enableToggle: false,
                allowDepress: true,
                handler: mapToolbarHandler
            });
            myTopToolbar.insert(13, geoLocateAction);

            //geolocation additional stuff
            var pulsate = function (feature) {
                var point = feature.geometry.getCentroid(),
                    bounds = feature.geometry.getBounds(),
                    radius = Math.abs((bounds.right - bounds.left) / 2),
                    count = 0,
                    grow = 'up';

                var resize = function () {
                    if (count > 16) {
                        clearInterval(window.resizeInterval);
                    }
                    var interval = radius * 0.03;
                    var ratio = interval / radius;
                    switch (count) {
                        case 4:
                        case 12:
                            grow = 'down';
                            break;
                        case 8:
                            grow = 'up';
                            break;
                    }
                    if (grow !== 'up') {
                        ratio = -Math.abs(ratio);
                    }
                    feature.geometry.resize(1 + ratio, point);
                    featureInfoHighlightLayer.drawFeature(feature);
                    count++;
                };
                window.resizeInterval = window.setInterval(resize, 50, point, radius);
            };

            var firstGeolocation = true;

            geoLocateAction.control.events.register("locationupdated", geoLocateAction.control, function (e) {
                //TODO UROS PAZI TO
                featureInfoHighlightLayer.removeAllFeatures();
                var circle = new OpenLayers.Feature.Vector(
                    OpenLayers.Geometry.Polygon.createRegularPolygon(
                        new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                        e.position.coords.accuracy / 2,
                        40,
                        0
                    ),
                    {},
                    locationAccuracyStyle
                );
                featureInfoHighlightLayer.addFeatures([
                    new OpenLayers.Feature.Vector(
                        e.point,
                        {},
                        locationMarkerStyle
                    ),
                    circle
                ]);
                if (firstGeolocation) {
                    geoExtMap.map.zoomToExtent(featureInfoHighlightLayer.getDataExtent());
                    pulsate(circle);
                    //firstGeolocation = false;
                    geoLocateAction.control.bind = true;
                }
            });
            geoLocateAction.control.events.register("locationfailed", this, function () {
                //TODO TRANSLATE
                Ext.Msg.alert("Error", "Location detection failed");
                geoLocateAction.control.deactivate();
            });
        }

        //add QGISSearchCombo
        if (useGeoCodeSearchBox || searchBoxQueryURL != null) {
            myTopToolbar.insert(myTopToolbar.items.length, new Ext.Toolbar.Fill());

            if (useGeoCodeSearchBox) {
                qgisSearchCombo = new GeoExt.ux.GeocodingSearchCombo({
                    map: geoExtMap.map,
                    width: 300,
                    minChars: 2,
                    loadingText: geonamesLoadingString[lang],
                    emptyText: geonamesEmptyString[lang],
                    lang: lang,
                    zoom: projectData.geoCode.zoom,
                    countryString: projectData.geoCode.countryString,
                    tpl: '<tpl for="."><div class="x-combo-list-item"><h3>{name2}</h3>{postalcode} {locality}, {region}</div></tpl>',
                    layers: projectData.geoCode.layers,
                    sources: projectData.geoCode.sources,
                    //continentCode: projectData.geoCode.continentCode,
                    maxRows: 10,
                    displayField: "name2",
                    key: projectData.geoCode.key
                });
                var emptySearchFieldButton = new Ext.Button({
                    scale: 'medium',
                    icon: iconDirectory+'mActionUndo.png',
                    tooltipType: 'qtip',
                    tooltip: resetSearchFieldTooltipString[lang],
                    id: 'EmptySearchField'
                });
                emptySearchFieldButton.handler = mapToolbarHandler;
                myTopToolbar.insert(myTopToolbar.items.length, emptySearchFieldButton);
            } else {
                qgisSearchCombo = new QGIS.SearchComboBox({
                    map: geoExtMap.map,
                    highlightLayerName: 'attribHighLight',
                    hasReverseAxisOrder: false, // PostGIS returns bbox' coordinates always x/y
                    width: 300,
                    searchtables: searchtables,
                    url: searchBoxQueryURL,
                    geomUrl: searchBoxGetGeomURL,
                    srs: 3857
                });
            }
            myTopToolbar.insert(myTopToolbar.items.length, qgisSearchCombo);
        }

        myTopToolbar.doLayout();

        //map themes panel
        if (mapThemeSwitcherActive == true) {
            mapThemeSwitcher = new ThemeSwitcher(Ext.getCmp('MapPanel'));
            Ext.getCmp('mapThemeButton').show();
        }

        function showURLParametersSearch(searchPanelConfigs) {
            if ('query' in urlParams) {
                // find search config for query
                var searchConfig = null;
                for (var i = 0; i < searchPanelConfigs.length; i++) {
                    if (urlParams.query == searchPanelConfigs[i].query) {
                        searchConfig = searchPanelConfigs[i];
                        break;
                    }
                }

                // submit search request (using URL rewriting)
                Ext.Ajax.request({
                    url: wmsURI,
                    params: urlParams,
                    method: 'GET',
                    success: function (response) {
                        var featureInfoParser = new QGIS.FeatureInfoParser();
                        if (featureInfoParser.parseXML(response)) {
                            if (featureInfoParser.featureIds().length > 0) {
                                // select features in layer
                                thematicLayer.mergeNewParams({
                                    "SELECTION": searchConfig.selectionLayer + ":" + featureInfoParser.featureIds().join(',')
                                });

                                // zoom to features
                                var bbox = featureInfoParser.featuresBbox();
                                geoExtMap.map.zoomToExtent(new OpenLayers.Bounds(bbox.minx, bbox.miny, bbox.maxx, bbox.maxy));
                                var scale = geoExtMap.map.getScale() * 1.1;
                                if (scale < 500) {
                                    scale = 500;
                                }
                                geoExtMap.map.zoomToScale(scale);
                            }
                        }
                    }
                });
            }

        }



        //search panel and URL search parameters
        //Uros: bind to projectData
        var searchPanelConfigs = projectData.search;	//[];
        // if (wmsMapName in mapSearchPanelConfigs) {
        // searchPanelConfigs = mapSearchPanelConfigs[wmsMapName];
        // }
        if (searchPanelConfigs != null && searchPanelConfigs.length > 0) {
            // add QGIS search panels
            var searchTabPanel = Ext.getCmp('SearchTabPanel');
            for (var i = 0; i < searchPanelConfigs.length; i++) {
                var panel = new QGIS.SearchPanel(searchPanelConfigs[i]);
                panel.gridLocation = 'default';
                panel.gridTitle = searchResultString[lang];
                panel.gridResults = simpleWmsSearchMaxResults;
                panel.on("featureselected", showFeatureSelected);
                panel.on("featureselectioncleared", clearFeatureSelected);
                panel.on("beforesearchdataloaded", showSearchPanelResults);
                // Just for debugging...
                // panel.on("aftersearchdataloaded", function(e){console.log(e);});
                searchTabPanel.add(panel);
            }
            searchTabPanel.setActiveTab(0);

            // show search from URL parameters
            showURLParametersSearch(searchPanelConfigs);
        } else {
            // hide search panel
            var searchPanel = Ext.getCmp('SearchPanel');
            searchPanel.removeAll();
            searchPanel.hide();
        }

        //update layout of left panel and adds a listener to automatically adjust layout after resizing
        var leftPanel = Ext.getCmp('LeftPanel');
        leftPanel.doLayout();
        leftPanel.addListener('resize', function (myPanel, adjWidth, adjHeight, rawWidth, rawHeight) {
            myPanel.items.each(function (item, index, length) {
                item.width = adjWidth;
            });
            myPanel.doLayout();
        });

        //measure-controls (distance and area)
        var styleMeasureControls = new OpenLayers.Style();
        styleMeasureControls.addRules([
            new OpenLayers.Rule({
                symbolizer: sketchSymbolizersMeasureControls
            })]);
        var styleMapMeasureControls = new OpenLayers.StyleMap({
            "default": styleMeasureControls
        });

        measureControls = {
            line: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Path, {
                    persist: true,
                    handlerOptions: {
                        layerOptions: {
                            styleMap: styleMapMeasureControls
                        }
                    }
                }),
            polygon: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Polygon, {
                    persist: true,
                    handlerOptions: {
                        layerOptions: {
                            styleMap: styleMapMeasureControls
                        }
                    }
                })
        };

        var control;
        for (var key in measureControls) {
            control = measureControls[key];
            control.events.on({
                "measure": handleMeasurements,
                "measurepartial": handleMeasurements
            });
            control.setImmediate(true);
            control.geodesic = useGeodesicMeasurement;
            geoExtMap.map.addControl(control);
        }
    }

    leafsChangeFunction = function () {
        //now collect all selected queryable layers for WMS request
        selectedLayers = [];
        selectedQueryableLayers = [];
        layerTree.root.firstChild.cascade(

            function (n) {
                if (n.isLeaf() && n.attributes.checked) {
                    selectedLayers.push(wmsLoader.layerTitleNameMapping[n.text]);
                    if (wmsLoader.layerProperties[wmsLoader.layerTitleNameMapping[n.text]].queryable) {
                        selectedQueryableLayers.push(wmsLoader.layerTitleNameMapping[n.text]);
                    }
                }
                // Call custom action in Customizations.js
                customActionLayerTreeCheck(n);
            });
        format = imageFormatForLayers(selectedLayers);
        //updateLayerOrderPanel();

        //change array order
        selectedLayers = layersInDrawingOrder(selectedLayers);
        selectedQueryableLayers = layersInDrawingOrder(selectedQueryableLayers);

        //special case if only active layers are queried for feature infos
        if (identificationMode == 'activeLayers') {
            //only collect selected layers that are active
            var selectedActiveLayers = [];
            var selectedActiveQueryableLayers = [];
            //need to find active layer
            var activeNode = layerTree.getSelectionModel().getSelectedNode();
            activeNode.cascade(
                function (n) {
                    if (n.isLeaf() && n.attributes.checked) {
                        selectedActiveLayers.push(n.text);
                        if (wmsLoader.layerProperties[n.text].queryable) {
                            selectedActiveQueryableLayers.push(n.text);
                        }
                    }
                }
            );
            selectedActiveLayers = layersInDrawingOrder(selectedActiveLayers);
            selectedActiveQueryableLayers = layersInDrawingOrder(selectedActiveQueryableLayers);
        }
        thematicLayer.mergeNewParams({
            LAYERS: selectedLayers.join(","),
            OPACITIES: layerOpacities(selectedLayers),
            FORMAT: format
        });
        if (identificationMode != 'activeLayers') {
            WMSGetFInfo.vendorParams = {
                'QUERY_LAYERS': selectedQueryableLayers.join(',')
            };
            if (enableHoverPopup) {
                WMSGetFInfoHover.vendorParams = {
                    'QUERY_LAYERS': selectedQueryableLayers.join(',')
                };
            }
        } else {
            WMSGetFInfo.vendorParams = {
                'QUERY_LAYERS': selectedActiveQueryableLayers.join(',')
            };
            if (enableHoverPopup) {
                WMSGetFInfoHover.vendorParams = {
                    'QUERY_LAYERS': selectedActiveQueryableLayers.join(',')
                };
            }
        }

        // switch backgroundLayers
        //TODO UROS This is not OK, we need radio buttons
        if (enableBGMaps) {
            var checkedBackgroundNodes = [];
            var newVisibleBaseLayer = null;
            layerTree.root.lastChild.cascade(
                function (n) {
                    if (n.isLeaf() && n.attributes.checked) {
                        checkedBackgroundNodes.push(n);
                    }
                });

            if (checkedBackgroundNodes.length == 1) {
                newVisibleBaseLayer = checkedBackgroundNodes[0].layer.name;
            } else if (checkedBackgroundNodes.length == 2) {
                layerTree.removeListener("leafschange",leafsChangeFunction);
                layerTree.root.lastChild.cascade(
                    function (n) {
                        if (n.isLeaf() && n.attributes.checked) {
                            if (n.layer.name == currentlyVisibleBaseLayer) {
                                n.unselect();
                                n.layer.setVisibility(false);
                            } else {
                                newVisibleBaseLayer = n.layer.name;
                            }
                        }
                    });
                layerTree.addListener('leafschange',leafsChangeFunction);
            }
            currentlyVisibleBaseLayer = newVisibleBaseLayer;
        }
    };

    if (initialLoadDone) {
        layerTree.removeListener("leafschange",leafsChangeFunction);
    }
    //add listeners for layertree
    layerTree.addListener('leafschange',leafsChangeFunction);

    //externalWMSlayers
    if(enableExtraLayers && extraLayers.length>0) {
        var extraLayGroup = new Ext.tree.TreeNode({
            leaf: false,
            expanded: true,
            text: externalLayerTitleString[lang]
        });
        layerTree.root.appendChild(extraLayGroup);
        //disable context menu
        extraLayGroup.on("contextMenu", Ext.emptyFn, null, {preventDefault: true});

        for (var k = 0; k < extraLayers.length; k++) {
            var extraNode = new GeoExt.tree.LayerNode({
                layer: extraLayers[k],
                leaf: true,
                checked: false,
                uiProvider: Ext.tree.TriStateNodeUI
            });
            extraLayGroup.appendChild(extraNode);
            extraNode.on("contextMenu", Ext.emptyFn, null, {preventDefault: true});
        }
    }

    //deal with commercial external bg layers
    if (enableBGMaps) {
        var BgLayerList = new Ext.tree.TreeNode({
            leaf: false,
            expanded: true,
            text: backgroundLayerTitleString[lang]
        });

        layerTree.root.appendChild(BgLayerList);
        BgLayerList.on("contextMenu", Ext.emptyFn, null, {preventDefault: true});

        if (visibleBackgroundLayer != null) {
            initialBGMap = -1;
            // do not show any baseLayer if passed visibleBackgroundLayer is not found
            for (var i = 0; i < baseLayers.length; i++) {
                if (baseLayers[i].name == visibleBackgroundLayer) {
                    initialBGMap = i;
                    break;
                }
            }
        }

        for (var i = 0; i < baseLayers.length; i++) {
            baseLayers[i].setVisibility(i == initialBGMap);
            var bgnode = new GeoExt.tree.LayerNode({
                layer: baseLayers[i],
                leaf: true,
                checked: (i == initialBGMap),
                uiProvider: Ext.tree.TriStateNodeUI
            });
            if (i == initialBGMap) {
                currentlyVisibleBaseLayer = baseLayers[i].name;
            }
            BgLayerList.appendChild(bgnode);
            bgnode.on("contextMenu", Ext.emptyFn, null, {preventDefault: true});
        }
    }

    if (!initialLoadDone) {
        if (printLayoutsDefined == true) {
            //create new window to hold printing toolbar
            printWindow = new Ext.Window({
                title: printSettingsToolbarTitleString[lang],
                height: 67,
                width: 530,
                layout: "fit",
                renderTo: "geoExtMapPanel",
                resizable: false,
                closable: false,
                x: 50,
                y: 10,
                items: [{
                    tbar: {
                        xtype: 'toolbar',
                        autoHeight: true,
                        id: 'myPrintToolbar',
                        items: [{
                            xtype: 'combo',
                            id: 'PrintLayoutsCombobox',
                            width: 100,
                            mode: 'local',
                            triggerAction: 'all',
                            readonly: true,
                            store: new Ext.data.JsonStore({
                                // store configs
                                data: printCapabilities,
                                storeId: 'printLayoutsStore',
                                // reader configs
                                root: 'layouts',
                                fields: [{
                                    name: 'name',
                                    type: 'string'
                                }, 'map', 'size', 'rotation']
                            }),
                            valueField: 'name',
                            displayField: 'name',
                            listeners: {
                                'select': function (combo, record, index) {
                                    printProvider.setLayout(record);
                                }
                            }
                        }, {
                            xtype: 'tbspacer'
                        }, {
                            xtype: 'combo',
                            id: 'PrintScaleCombobox',
                            width: 95,
                            mode: 'local',
                            triggerAction: 'all',
                            store: new Ext.data.JsonStore({
                                // store configs
                                data: printCapabilities,
                                storeId: 'printScalesStore',
                                // reader configs
                                root: 'scales',
                                fields: [{
                                    name: 'name',
                                    type: 'string'
                                }, {
                                    name: 'value',
                                    type: 'int'
                                }]
                            }),
                            valueField: 'value',
                            displayField: 'name',
                            listeners: {
                                'select': function (combo, record, index) {
                                    printExtent.page.setScale(record);
                                }
                            }
                        }, {
                            xtype: 'tbspacer'
                        }, {
                            xtype: 'combo',
                            id: 'PrintDPICombobox',
                            width: 70,
                            mode: 'local',
                            triggerAction: 'all',
                            store: new Ext.data.JsonStore({
                                // store configs
                                data: printCapabilities,
                                storeId: 'printDPIStore',
                                // reader configs
                                root: 'dpis',
                                fields: [{
                                    name: 'name',
                                    type: 'string'
                                }, {
                                    name: 'value',
                                    type: 'int'
                                }]
                            }),
                            valueField: 'value',
                            displayField: 'name',
                            listeners: {
                                'select': function (combo, record, index) {
                                    printProvider.setDpi(record);
                                }
                            }
                        }, {
                            xtype: 'tbspacer'
                        }, {
                            xtype: 'tbspacer'
                        }, {
                            xtype: 'label',
                            text: printSettingsRotationTextlabelString[lang]
                        }, {
                            xtype: 'tbspacer'
                        }, {
                            xtype: 'spinnerfield',
                            id: 'PrintLayoutRotation',
                            width: 60,
                            value: 0,
                            allowNegative: true,
                            autoStripChars: true,
                            allowDecimals: false,
                            minValue: -360,
                            maxValue: 360,
                            enableKeyEvents: true,
                            listeners: {
                                'spin': function () {
                                    printExtent.page.setRotation(Ext.getCmp('PrintLayoutRotation').getValue(), true);
                                },
                                'keyup': function (textField, event) {
                                    printExtent.page.setRotation(Ext.getCmp('PrintLayoutRotation').getValue(), true);
                                    event.stopPropagation();
                                },
                                'keydown': function (textField, event) {
                                    event.stopPropagation();
                                },
                                'keypress': function (textField, event) {
                                    event.stopPropagation();
                                }
                            }
                        }, {
                            xtype: 'tbspacer'
                        }, {
                            xtype: 'button',
                            tooltip: printButtonTooltipString[lang],
                            text: printButtonTextString[lang],
                            tooltipType: 'qtip',
                            iconCls: '',
                            scale: 'medium',
                            id: 'StartPrinting',
                            listeners: {
                                'click': function () {
                                    Ext.getCmp('PrintMap').toggle(false);
                                    printProvider.print(geoExtMap, [printExtent.page]);
                                }
                            }
                        }, {
                            xtype: 'button',
                            tooltip: printCancelButtonTooltipString[lang],
                            text: printCancelButtonTextString[lang],
                            tooltipType: 'qtip',
                            iconCls: '',
                            scale: 'medium',
                            id: 'CancelPrinting',
                            listeners: {
                                'click': function () {
                                    Ext.getCmp('PrintMap').toggle(false);
                                }
                            }
                        }]
                    }
                }]
            });
        }
    }
    else {
        printLayoutsCombobox = Ext.getCmp('PrintLayoutsCombobox');
        printLayoutsCombobox.store.removeAll();
        printLayoutsCombobox.store.loadData(printCapabilities);
    }
    if (printLayoutsDefined == false) {
        //need to disable printing because no print layouts are defined in
        var printMapButton = Ext.getCmp('PrintMap');
        printMapButton.disable();
        printMapButton.setTooltip(printMapDisabledTooltipString[lang]);
    }
    else {
        printLayoutsCombobox = Ext.getCmp('PrintLayoutsCombobox');
        printLayoutsCombobox.setValue(printLayoutsCombobox.store.getAt(0).data.name);
        var printDPICombobox = Ext.getCmp('PrintDPICombobox');
        printDPICombobox.setValue("300");
        //need to manually fire the event, because .setValue doesn't; index omitted, not needed
        printDPICombobox.fireEvent("select", printDPICombobox, printDPICombobox.findRecord(printDPICombobox.valueField, "300"));
        //if the var fixedPrintResolution in GlobalOptions.js is set, the printLayoutsCombobox will be hidden
        if (fixedPrintResolution != null && parseInt(fixedPrintResolution) > 0){
            printDPICombobox.hide(); // hide dpi combobox
            printWindow.setWidth(printWindow.width - 80); // reduce the legth of the print window
        }
        //bug in spinnerField: need to explicitly show/hide printWindow (toolbar)
        printWindow.show();
        printWindow.hide();
    }
    printExtent.hide();

    if (initialLoadDone) {
        if (identifyToolWasActive) {
            identifyToolWasActive = false;
            Ext.getCmp('IdentifyTool').toggle(true);
        }
        themeChangeActive = false;
    }

    //handle selection events
    var selModel = layerTree.getSelectionModel();
    //add listeners to selection model
    selModel.addListener("selectionChange", layerTreeSelectionChangeHandlerFunction);

    //show that we are done with initializing the map
    //mainStatusText.setText(modeNavigationString[lang]);
    if (loadMask) {
        loadMask.hide();
    }
    initialLoadDone = true;

    //draw layers outside scale gray
    setGrayNameWhenOutsideScale();

    // run the function in the Customizations.js
    customAfterMapInit();
}

/*
 * Show search panel results
 */
function showSearchPanelResults(searchPanelInstance, features) {
    if (features.length) {
        // Here we select where to show the search results
        var targetComponent = null;
        //if (typeof(mapSearchPanelOutputRegion) == 'undefined') {
        //    mapSearchPanelOutputRegion = 'default';
        //}

        // These option are for different output modes
        var collapsible = true;
        var autoHeight = true;
        var searchPanelId = '';
        switch (searchPanelInstance.gridLocation) {
            case 'right':
                targetComponent = Ext.getCmp('RightPanel');
                searchPanelId = 'SearchPanelResultsGrid';
                break;
            case 'bottom':
                //this is tabpanel
                targetComponent = Ext.getCmp('BottomPanel');
                searchPanelId = 'table_'+searchPanelInstance.queryLayer;
                collapsible = false; // No collapsible in bottom
                autoHeight = false;
                break;
            case 'popup':
                if (typeof(Ext.getCmp('SearchResultsPopUp')) == 'undefined') {
                    targetComponent = new Ext.Window(
                        {
                            id: 'SearchResultsPopUp',
                            layout: 'fit',
                            width: "80%",
                            height: 300,
                            modal: false,
                            closeAction: 'hide'
                        });
                }
                autoHeight = false; // No scrollbars if true
                collapsible = false; // No collapsible in popup
                targetComponent = Ext.getCmp('SearchResultsPopUp');
                break;
            case 'default':
            default:
                collapsible = false;
                targetComponent = searchPanelInstance;
                break;
        }
        // Make sure it's shown and expanded
        //targetComponent.show();
        //targetComponent.collapsible && targetComponent.expand();
        // Delete and re-create
        try {
            Ext.getCmp('SearchPanelResultsGrid').destroy();
        } catch (e) {
            // Eventually log...
        }

        //filter config
        var filters = new Ext.ux.grid.GridFilters({
            // encode and local configuration options
            encode: false, // json encode the filter query
            local: true,   // defaults to false (remote filtering)
            menuFilterText: TR.menuFilterText

//            filters: [{
//                type: 'numeric',
//                dataIndex: 'id'
//            }, {
//                type: 'string',
//                dataIndex: 'company',
//                disabled: true
//            }, {
//                type: 'numeric',
//                dataIndex: 'price'
//            }, {
//                type: 'date',
//                dataIndex: 'date'
//            }, {
//                type: 'list',
//                dataIndex: 'size',
//                options: ['small', 'medium', 'large', 'extra large'],
//                phpMode: true
//            }, {
//                type: 'boolean',
//                dataIndex: 'visible'
//            }]
        });

        //test if we need paging (not actual size of results, just initial settings
        var pagingConfig = {};
        if (searchPanelInstance.gridResults>searchPanelInstance.gridResultsPageSize) {
            pagingConfig = new Ext.ux.PagingToolbar({
                pageSize: searchPanelInstance.gridResultsPageSize,
                store: searchPanelInstance.store,
                displayInfo: false
            });

        }

        var tt = searchPanelInstance.gridTitle + " ("+searchPanelInstance.store.totalCount+")";
        if (searchPanelInstance.wmsFilter>"") {
            tt+=" ["+searchPanelInstance.wmsFilter+"]";
        }

        //assumption that if we have less than 5 columns in grid we want forceFit (no horizontal scroller)
        var horFit = false;
        if (searchPanelInstance.gridColumns.length<5){
            horFit = true;
        }

        searchPanelInstance.resultsGrid = new Ext.grid.GridPanel({
            id:  searchPanelId,
            title: tt,
            itemId: searchPanelInstance.gridTitle,
            closable: searchPanelInstance.tabClosable,
            collapsible: collapsible,
            collapsed: false,
            store: searchPanelInstance.store,
            columns: searchPanelInstance.gridColumns,
            plugins: [filters],
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            autoHeight: autoHeight, // No vert. scrollbars in popup if true!!
            viewConfig: {
                forceFit: horFit
            },
            // paging bar on the bottom
            bbar: pagingConfig,
            //select record if we have one result
            listeners: {
                render : function(grid){
                    grid.store.on('load', function(store, records, options){
                        if(features.length==1) {
                            grid.getSelectionModel().selectFirstRow();
                            grid.fireEvent('rowClick', grid, 0);
                        }
                    });
                },
                filterupdate : function() {

                    if (typeof searchPanelInstance.resultsGrid === 'object') {
                        var wmsFilter = [];
                        var layer = searchPanelInstance.queryLayer;
                        var layerId = wmsLoader.layerTitleNameMapping[layer];
                        var filt = Ext.decode(Ext.encode(searchPanelInstance.resultsGrid.filters.getFilterData()));
                        Ext.each(filt, function (f) {
                            if (f.data.type == 'string') {
                                wmsFilter.push("\"" + f.field + "\" LIKE \'%" + f.data.value + "%\'");
                            } else if (f.data.type == 'numeric') {
                                var sep = '';
                                switch (f.data.comparison) {
                                    case 'gt':
                                        sep = '>';
                                        break;
                                    case 'lt':
                                        sep = '<';
                                        break;
                                    case 'eq':
                                        sep = '=';
                                        break;
                                }
                                wmsFilter.push("\"" + f.field + "\" "+ sep + " " + f.data.value );
                            }
                        });


                        thematicLayer.mergeNewParams({FILTER: layerId + ":" + wmsFilter.join(" AND ")});
                    }
                }
            }

        });

        //additional buttons in bottom toolbar
        //if paging config is defined, otherwise we don't need this
        if(pagingConfig.displayInfo==false) {

            searchPanelInstance.resultsGrid.getBottomToolbar().add([
                //{
                //text: 'All Filter Data',
                //tooltip: 'Get Filter Data for Grid',
                //handler: function () {
                //    var data = Ext.encode(searchPanelInstance.resultsGrid.filters.getFilterData());
                //    Ext.Msg.alert('All Filter Data',data);
                //}
                //},
                {


                    iconCls: 'x-clearfilter-icon',
                    tooltip: TR.clearFilter,
                    //scale: 'medium',
                    //disabled: true,
                    handler: function () {
                        searchPanelInstance.resultsGrid.filters.clearFilters();
                    }
                },
                {


                    iconCls: 'x-clear-icon',
                    tooltip: TR.clearSelection,
                    //scale: 'medium',
                    //disabled: true,
                    handler: clearTableSelection
                }
            ]);
        }

        searchPanelInstance.resultsGrid.on('rowclick', searchPanelInstance.onRowClick, searchPanelInstance);
        searchPanelInstance.resultsGrid.on('keypress', function(e){
            //pressing enter in selected row forces OnRowClick
            if(e.getKey()==13) {
                var rowIndex = this.getSelectionModel().last;
                this.fireEvent('rowclick',this,rowIndex);
            }
        });

        targetComponent.add(searchPanelInstance.resultsGrid);
        targetComponent.doLayout();
        // Always make sure it's shown and expanded
        searchPanelInstance.resultsGrid.show();
        searchPanelInstance.resultsGrid.collapsible && searchPanelInstance.resultsGrid.expand();

        //zoom to the extent from GetFeatureInfo results
        //var bx = searchPanelInstance.store.totalBbox;
        //var bbox = new OpenLayers.Bounds(bx.minx,bx.miny,bx.maxx,bx.maxy);
        //geoExtMap.map.zoomToExtent(bbox,false);

    } else {
        // No features: shouldn't we warn the user?

        //remove loading mask
        var maskElement = this.el;
        if(this.gridLocation=='bottom') {
            maskElement = Ext.getCmp('BottomPanel').el;
        }

        maskElement.unmask();

        Ext.MessageBox.alert(searchPanelTitleString[lang], searchNoRecordsFoundString[lang]);
        try {
            Ext.getCmp('SearchPanelResultsGrid').destroy();
        } catch (e) {
            // Eventually log...
        }
        searchPanelInstance.resultsGrid = null;
    }
    return true;
}

function getVisibleLayers(visibleLayers, currentNode){
    while (currentNode != null){
        if (currentNode.attributes.checked) {
            visibleLayers.push(wmsLoader.layerTitleNameMapping[currentNode.text]);
        } else if (currentNode.attributes.checked == null) {
            // this node is partly checked, so it is a layer group with some layers visible
            // dive into this group for layer visibility
            for (var i = 0; i < currentNode.childNodes.length; i++) {
                visibleLayers = getVisibleLayers(visibleLayers, currentNode.childNodes[i]);
            }
        }
        currentNode = currentNode.nextSibling;
    }
    return visibleLayers;
}

function getVisibleFlatLayers(currentNode) {
    visibleLayers = [];
    currentNode.cascade(function(node) {
        if (node.isLeaf() && node.attributes.checked) {
            visibleLayers.push(wmsLoader.layerTitleNameMapping[node.text]);
        }
    });
}

function getVisibleBackgroundLayer() {
    var visibleBackgroundLayer = null;

    if (enableBGMaps) {
        layerTree.root.lastChild.cascade(function(node) {
            if (node.isLeaf() && node.attributes.checked) {
                visibleBackgroundLayer = node.text;
            }
        });
    }
    return visibleBackgroundLayer;
}


function uniqueLayersInLegend(origArr) {
    var newArr = [],
        origLen = origArr.length,
        found,
        x, y;

    for ( x = 0; x < origLen; x++ ) {
        found = undefined;
        for ( y = 0; y < newArr.length; y++ ) {
            if ( origArr[x] === newArr[y] ) {
                found = true;
                break;
            }
        }
        if ( !found) newArr.push( origArr[x] );
    }
    return newArr;
}

function mapToolbarHandler(btn, evt) {
    removeMeasurePopup();

    // Call custom toolbar handler in Customizations.js
    customMapToolbarHandler(btn, evt);

    if (btn.id == "IdentifyTool") {
        if (btn.pressed) {
            identifyToolActive = true;
            activateGetFeatureInfo(true);
            mainStatusText.setText(modeObjectIdentificationString[lang]);
        } else {
            identifyToolActive = false;
            activateGetFeatureInfo(false);
            if (hoverPopup) {removeHoverPopup();}
            if (clickPopup) {removeClickPopup();}
            //featureInfoHighlightLayer.removeAllFeatures();
            clearFeatureSelected();
            mainStatusText.setText(modeNavigationString[lang]);
        }
    }
    if (btn.id == "measureDistance") {
        if (btn.pressed) {
            measureControls["line"].activate();
            mainStatusText.setText(modeMeasureDistanceString[lang]);
            changeCursorInMap("crosshair");
        } else {
            measureControls["line"].deactivate();
            mainStatusText.setText(modeNavigationString[lang]);
            changeCursorInMap("default");
        }
    }
    if (btn.id == "measureArea") {
        if (btn.pressed) {
            measureControls["polygon"].activate();
            mainStatusText.setText(modeMeasureAreaString[lang]);
            changeCursorInMap("crosshair");
        } else {
            measureControls["polygon"].deactivate();
            mainStatusText.setText(modeNavigationString[lang]);
            changeCursorInMap("default");
        }
    }
    if (btn.id == "EmptySearchField") {
        qgisSearchCombo.clearSearchResult();
    }
    if (btn.id == "PrintMap") {
        if (btn.pressed) {
            printWindow.show();
            if (printExtent.initialized == false) {
                printExtent.addPage();
                printExtent.page.lastScale = Math.round(printExtent.page.scale.data.value);
                printExtent.page.lastRotation = 0;
                Ext.getCmp('PrintScaleCombobox').setValue(printExtent.page.lastScale);
                //listener when page scale changes from page extent widget
                printExtent.page.on('change', function (page, modifications) {
                    if (page.scale.data.value != printExtent.page.lastScale) {
                        Ext.getCmp('PrintScaleCombobox').setValue(page.scale.data.value);
                        printExtent.page.lastScale = page.scale.data.value;
                    }
                    if (Math.round(page.rotation) != printExtent.page.lastRotation) {
                        Ext.getCmp('PrintLayoutRotation').setValue(Math.round(page.rotation));
                        printExtent.page.lastRotation = Math.round(page.rotation);
                    }
                });
                printExtent.initialized = true;
            }
            //need to check if current page matches entry of PrintLayoutsCombobox
            var printLayoutsCombobox = Ext.getCmp('PrintLayoutsCombobox');
            var currentIndex = printLayoutsCombobox.store.findExact('name',printLayoutsCombobox.getValue());
            var currentRecord = printLayoutsCombobox.store.getAt(currentIndex);
            if (printProvider.layout.data.size.width != currentRecord.data.size.width || printProvider.layout.data.size.height != currentRecord.data.size.height) {
                printProvider.setLayout(currentRecord);
            }
            printExtent.page.setRotation(0, true);
            Ext.getCmp('PrintLayoutRotation').setValue(0);
            printExtent.page.fit(geoExtMap, {
                'mode': 'screen'
            });
            printExtent.show();
            mainStatusText.setText(modePrintingString[lang]);
        } else {
            printWindow.hide();
            printExtent.hide();
            mainStatusText.setText(modeNavigationString[lang]);
        }
    }
    if (btn.id == "navZoomBoxButton") {
        if (btn.pressed) {
            geoExtMap.map.zoomBoxActive = true;
            mainStatusText.setText(modeZoomRectangle[lang]);
        } else {
            geoExtMap.map.zoomBoxActive = false;
            mainStatusText.setText(modeNavigationString[lang]);
        }
    }

    if(btn.id == "navZoomFullExtent") {
        geoExtMap.map.zoomToExtent(maxExtent,false);
    }

    if (btn.id == "SendPermalink") {
        var permalink = createPermalink();
        if (permaLinkURLShortener) {
            var servername = location.protocol+"//"+location.href.split(/\/+/)[1];
            Ext.Ajax.request({
                url: servername + permaLinkURLShortener,
                success: receiveShortPermalinkFromDB,
                failure: function ( result, request) {
                    alert("failed to get short URL from Python wsgi script.\n\nError Message:\n\n"+result.responseText);
                },
                method: 'GET',
                params: { longPermalink: permalink }
            });
        }
        else {
            //openPermaLink(encodeURIComponent(permalink));
            openPermaLink(permalink);
        }
    }

    if (btn.id == 'ShowFeedback') {
        openFeedbackWin();
    }



    if (btn.id == "ShowHelp") {
        if (help_active == true){
            help_active = false;
            helpWin.close();
        } else {
            help_active = true;
            //test if helpfile was specified, otherwise display default english help or language version if available
            if (typeof(helpfile) === 'undefined') {
                helpfile = "help_en.html";
                if (availableHelpLanguages.indexOf(lang) != -1) {
                    helpfile = "help_"+lang+".html";
                }
            }
            helpWin = new Ext.Window({
                title: helpWindowTitleString[lang]
                ,width: geoExtMap.getWidth()
                ,height: geoExtMap.getHeight() * 0.7
                ,id:'autoload-win'
                ,autoScroll:true
                ,maximizable: true
                ,autoLoad:{
                    url:helpfile
                }
                ,listeners:{
                    show:function() {
                        this.loadMask = new Ext.LoadMask(this.body, {
                            msg:pleaseWaitString[lang]
                        });
                    },
                    hide:function() {
                        help_active = false;
                        helpWin.close();
                    }
                }
            });
            helpWin.show();
        }
    }
    if (btn.id == "geoLocate") {
        var gl = Ext.getCmp('geoLocate').baseAction.control;
        featureInfoHighlightLayer.removeAllFeatures();

        if (btn.pressed) {
            gl.deactivate();
            gl.watch = false;
            //firstGeolocation = true;

        }
        else {

            //firstGeolocation = true;
            gl.activate();
        }
    }
}

function removeMeasurePopup() {
    var map = geoExtMap.map; // gets OL map object
    if (measurePopup) {
        map.removePopup(measurePopup);
        measurePopup.destroy();
        measurePopup = null;
    }
}

function handleMeasurements(event) {
    var geometry = event.geometry;
    var units = event.units;
    var order = event.order;
    var measure = event.measure;
    var out = "";
    if (order == 1) {
        out += measureDistanceResultPrefixString[lang] + ": " + measure.toFixed(2) + units;
    } else {
        out += measureAreaResultPrefixString[lang] + ": " + measure.toFixed(2) + units + "<sup>2</sup>";
    }
    var map = geoExtMap.map; // gets OL map object
    removeMeasurePopup();
    measurePopup = new OpenLayers.Popup.Anchored(
        "measurePopup", // id
        geometry.getBounds().getCenterLonLat(), // lonlat
        null, // new OpenLayers.Size(1,1), // contentSize
        out , //contentHTML
        null, // anchor
        false, // closeBox
        null // closeBoxCallback
    );
    measurePopup.autoSize = true;
    measurePopup.keepInMap = true;
    measurePopup.panMapIfOutOfView = true;
    map.addPopup(measurePopup);
    //measurePopup.setBackgroundColor("gray");
    measurePopup.setOpacity(0.8);
}

// function to display a loadMask during lengthy load operations
function displayLoadMask() {
    if (mapIsLoading) { // check if layer is still loading
        loadMask = new Ext.LoadMask(Ext.getCmp('MapPanel').body, {msg:mapLoadingString[lang]});
        loadMask.show();
    }
}

function changeCursorInMap(cursorStyle) {
    var mapViewPort = Ext.query(".olMapViewport", document.getElementById("geoExtMapPanel"))[0];
    mapViewPort.style.cursor = cursorStyle;
}

//function for the help viewer
function scrollToHelpItem(targetId) {
    Ext.get(targetId).dom.scrollIntoView();
}

//function that creates a permalink
function createPermalink(){
    var visibleLayers = [];
    var permalink;
    var permalinkParams = {};
    visibleLayers = getVisibleLayers(visibleLayers, layerTree.root.firstChild);
    visibleLayers = uniqueLayersInLegend(visibleLayers);
    var visibleBackgroundLayer = getVisibleBackgroundLayer();
    var startExtentArray = geoExtMap.map.getExtent().toArray();
    var startExtent = startExtentArray[0] + "," + startExtentArray[1] + "," + startExtentArray[2] + "," + startExtentArray[3];

    if (!norewrite){
        var servername = location.href.split(/\/+/)[1];
        permalink = location.protocol+"//"+servername;
        if (projectData.gis_projects) {
            permalink += projectData.gis_projects.path;
        }
        else {
            permalink += "/";
        }
        permalink += wmsMapName+"?";
    } else {
        permalink = urlArray[0] + "?map=";
        permalink = permalink + "/" + wmsMapName.replace("/", "");
        //add .qgs if it is missing
        if (!permalink.match(/\.qgs$/)) {
            permalink += ".qgs";
        }
        permalink += "&";
    }

    // extent
    permalinkParams.startExtent = startExtent;

    // visible BackgroundLayer
    permalinkParams.visibleBackgroundLayer = visibleBackgroundLayer;

    // visible layers and layer order
    permalinkParams.visibleLayers = visibleLayers.toString();

    // layer opacities as hash of <layername>: <opacity>
    var opacities = null;
    for (layer in wmsLoader.layerProperties) {
        if (wmsLoader.layerProperties.hasOwnProperty(layer)) {
            var opacity = wmsLoader.layerProperties[layer].opacity;
            // collect only non-default values
            if (opacity != 255) {
                if (opacities == null) {
                    opacities = {};
                }
                opacities[layer] = opacity;
            }
        }
    }
    if (opacities != null) {
        permalinkParams.opacities = Ext.util.JSON.encode(opacities);
    }

    //layer order
    if(showLayerOrderTab) {
        permalinkParams.initialLayerOrder = layerOrderPanel.orderedLayers().toString();
    }

    //language
    permalinkParams.lang = lang;

    // selection
    if(typeof(thematicLayer.params.SELECTION) != 'undefined')
        permalinkParams.selection = thematicLayer.params.SELECTION;

    if (permaLinkURLShortener) {
        permalink = encodeURIComponent(permalink + decodeURIComponent(Ext.urlEncode(permalinkParams)));
    }
    else {
        permalink = permalink + Ext.urlEncode(permalinkParams);
    }

    return permalink;
}

//function addInfoButtonsToLayerTree() {
//    var treeRoot = layerTree.getNodeById("wmsNode");
//    treeRoot.firstChild.cascade(
//        function (n) {
//            // info button
//            var buttonId = 'layer_' + n.id;
//            Ext.DomHelper.insertBefore(n.getUI().getAnchor(), {
//                tag: 'b',
//                id: buttonId,
//                cls: 'layer-button x-tool custom-x-tool-info'
//            });
//            Ext.get(buttonId).on('click', function(e) {
//                if(typeof(interactiveLegendGetLegendURL) == 'undefined'){
//                    showLegendAndMetadata(n.text);
//                } else {
//                    showInteractiveLegendAndMetadata(n.text);
//                }
//            });
//        }
//    );
//}

function addAbstractToLayerGroups() {
    var treeRoot = layerTree.getNodeById("wmsNode");
    treeRoot.firstChild.cascade(
        function (n) {
            if (! n.isLeaf()) {
                if (n == treeRoot.firstChild) {
                    var thisAbstract = wmsLoader.projectSettings.service.abstract;
                } else {
                    var thisAbstract = layerGroupString[lang]+ ' "' + n.text + '"';
                }
                var layerId = wmsLoader.layerTitleNameMapping[n.text];
                wmsLoader.layerProperties[layerId].abstract = thisAbstract;
            }
        }
    );
}

function applyPermalinkParams() {
    // restore layer opacities from hash of <layername>: <opacity>
    var opacities = undefined;
    //see if this comes in as a URL parameter
    if (urlParams.opacities) {
        opacities = Ext.util.JSON.decode(urlParams.opacities);
    }
    else {
        //see if project is defined in GIS ProjectListing
        //and has an opacities property
        //TODO UROS: tule brezveze zanka da primerja z project titlom, ker imam že povezavo na projekt alias=projectFile
        //if (projectData.gis_projects) {
        //    for (var i=0;i<projectData.gis_projects.topics.length;i++) {
        //        for (var j=0;j<projectData.gis_projects.topics[i].projects.length;j++) {
        //            if (projectData.gis_projects.topics[i].projects[j].name == layerTree.root.firstChild.text) {
        //                opacities = projectData.gis_projects.topics[i].projects[j].opacities;
        //            }
        //        }
        //    }
        //}
    }
    if (opacities) {
        for (layer in opacities) {
            if (opacities.hasOwnProperty(layer)) {
                wmsLoader.layerProperties[layer].opacity = opacities[layer];
            }
        }
    }
}

//function setupLayerOrderPanel() {
//    layerOrderPanel = Ext.getCmp('LayerOrderTab');
//
//    /* initial layer order: (highest priority on top)
//     * - initialLayerOrder from permalink/URL param
//     * - layerDrawingOrder from GetProjectSettings
//     * - layer tree from GetCapabilities
//     */
//    var orderedLayers = [];
//    if (initialLayerOrder != null) {
//        // use order from permalink or URL parameter
//        orderedLayers = initialLayerOrder;
//        //TODO: we need to add additional layers if the initialLayerOrder is shorter than the layerDrawingOrder from the project
//        if (wmsLoader.projectSettings.capability.layerDrawingOrder != null) {
//            //case GetProjectSettings supported
//            if (initialLayerOrder.length < wmsLoader.projectSettings.capability.layerDrawingOrder.length) {
//                for (var i=0;i<wmsLoader.projectSettings.capability.layerDrawingOrder.length;i++) {
//                    if (orderedLayers.indexOf(wmsLoader.projectSettings.capability.layerDrawingOrder[i]) == -1) {
//                        var layerIndex = wmsLoader.projectSettings.capability.layerDrawingOrder.indexOf(wmsLoader.projectSettings.capability.layerDrawingOrder[i]);
//                        if (layerIndex >= orderedLayers.length) {
//                            orderedLayers.push(wmsLoader.projectSettings.capability.layerDrawingOrder[i]);
//                        }
//                        else {
//                            orderedLayers.splice(layerIndex,0,wmsLoader.projectSettings.capability.layerDrawingOrder[i]);
//                        }
//                    }
//                }
//            }
//        }
//        else {
//            //only GetCapabilities is supported
//            if (initialLayerOrder.length < allLayers.length) {
//                for (var i=0;i<allLayers.length;i++) {
//                    if (orderedLayers.indexOf(allLayers[i]) == -1) {
//                        var layerIndex = allLayers.indexOf(allLayers[i]);
//                        if (layerIndex >= orderedLayers.length) {
//                            orderedLayers.push(allLayers[i]);
//                        }
//                        else {
//                            orderedLayers.splice(layerIndex,0,allLayers[i]);
//                        }
//                    }
//                }
//            }
//        }
//    }
//    else if (wmsLoader.projectSettings.capability.layerDrawingOrder != null) {
//        // use order from GetProjectSettings
//        orderedLayers = wmsLoader.projectSettings.capability.layerDrawingOrder;
//    }
//    else {
//        // use order from GetCapabilities
//        orderedLayers = allLayers.reverse();
//    }
//
//    layerOrderPanel.clearLayers();
//    for (var i=0; i<orderedLayers.length; i++) {
//        //because of a but in QGIS server we need to check if a layer from layerDrawingOrder actually really exists
//        //QGIS server is delivering invalid layer when linking to different projects
//        if (wmsLoader.layerProperties[orderedLayers[i]]) {
//            layerOrderPanel.addLayer(orderedLayers[i], wmsLoader.layerProperties[orderedLayers[i]].opacity);
//        }
//    }
//
//    if (!initialLoadDone) {
//        if (showLayerOrderTab) {
//            // handle layer order panel events
//            layerOrderPanel.on('layerVisibilityChange', function(layer) {
//                // deactivate layer node in layer tree
//                layerTree.root.findChildBy(function() {
//                    if (wmsLoader.layerTitleNameMapping[this.attributes["text"]] == layer) {
//                        this.getUI().toggleCheck();
//                        // update active layers
//                        layerTree.fireEvent("leafschange");
//                        return true;
//                    }
//                    return false;
//                }, null, true);
//            });
//
//            layerOrderPanel.on('orderchange', function() {
//                // update layer order after drag and drop
//                layerTree.fireEvent("leafschange");
//            });
//
//            layerOrderPanel.on('opacitychange', function(layer, opacity) {
//                // update layer opacities after slider change
//                wmsLoader.layerProperties[layer].opacity = opacity;
//                layerTree.fireEvent("leafschange");
//            });
//            //hack to set title of southern panel - normally it is hidden in ExtJS
//            Ext.layout.BorderLayout.Region.prototype.getCollapsedEl = Ext.layout.BorderLayout.Region.prototype.getCollapsedEl.createSequence(function() {
//                if ( ( this.position == 'south' ) && !this.collapsedEl.titleEl ) {
//                    this.collapsedEl.titleEl = this.collapsedEl.createChild({cls: 'x-collapsed-title', cn: this.panel.title});
//                }
//            });
//            Ext.getCmp('leftPanelMap').layout.south.getCollapsedEl().titleEl.dom.innerHTML = layerOrderPanelTitleString[lang];
//        } else {
//            Ext.getCmp('leftPanelMap').layout.south.getCollapsedEl().setVisible(showLayerOrderTab);
//        }
//    }
//}

//function updateLayerOrderPanel() {
//    // update layer order panel
//    var layersForOrderPanel = [];
//    layersForOrderPanel = layersForOrderPanel.reverse();
//    for (var i=0; i<layersForOrderPanel.length; i++) {
//        layerOrderPanel.addLayer(layersForOrderPanel[i], wmsLoader.layerProperties[layersForOrderPanel[i]].opacity);
//    }
//}

function activateGetFeatureInfo(doIt) {
    // activate/deactivate FeatureInfo
    if (doIt) {
        WMSGetFInfo.activate();
        if (enableHoverPopup)
            WMSGetFInfoHover.activate();
    } else {
        WMSGetFInfo.deactivate();
        if (enableHoverPopup)
            WMSGetFInfoHover.deactivate();
    }
}

function openPermaLink(permalink) {
    //var mailToText = "mailto:?subject="+sendPermalinkLinkFromString[lang]+titleBarText+layerTree.root.firstChild.text+"&body="+permalink;
    //var mailWindow = window.open(mailToText);
    //if (mailWindow){
    //    mailWindow.close();

    if (typeof(PermaLinkWin) != 'undefined'){
        PermaLinkWin.close();
    }

    PermaLinkWin = new Ext.Window({
        title: sendPermalinkLinkFromString[lang],    //+titleBarText+layerTree.root.firstChild.text,
        width: 200,
        layout: 'fit',
        items: [{
            xtype: 'textarea',
            grow: true,
            value: permalink,
            anchor: '100%',
            selectOnFocus: true
        }]
    }).show();
}

function openFeedbackWin() {

    var form = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        labelWidth: 55,
        url: 'save-form.php',
        layout: {
            type: 'vbox',
            align: 'stretch'  // Child items are stretched to full width
        },
        defaults: {
            xtype: 'textfield'
        },

        items: [
        //    {
        //    xtype: 'combo',
        //    store: ['test@example.com', 'someone-else@example.com' ],
        //    plugins: [ Ext.ux.FieldReplicator, Ext.ux.FieldLabeler ],
        //    fieldLabel: 'Send To',
        //    name: 'to'
        //},{
        //    plugins: [ Ext.ux.FieldLabeler ],
        //    fieldLabel: 'Subject',
        //    name: 'subject'
        //},
            {
            xtype: 'textarea',
            fieldLabel: 'Message text',
            hideLabel: true,
            name: 'msg',
            flex: 1  // Take up all *remaining* vertical space
        }, {
                xtype: 'label',
                text: TR.feedbackDescription,
                hideLabel: true
            }]
    });


    if (typeof(feedbackWin) != 'undefined'){
        feedbackWin.show();
    } else {

        feedbackWin = new Ext.Window({
            title: TR.feedbackTitle,
            width: 450,
            height: 300,
            minWidth: 300,
            minHeight: 200,
            layout: 'fit',
            closeAction: 'hide',
            plain: true,
            //bodyStyle: 'padding:5px;',
            buttonAlign: 'center',
            items:form,
            buttons: [{
                itemId: 'send',
                text: TR.send,
                handler: feedbackHandler
                //scope: this
            },{
                itemId: 'cancel',
                text: TR.cancel,
                handler: feedbackHandler
                //scope: this
            }]

        }).show();
    }
}

function feedbackHandler(btn) {
    var id = btn.itemId;
    var silent = false;
    if (id == 'cancel') {
        feedbackWin.hide();
    }
    if (id == 'send') {
        var data = [];
        var form = feedbackWin.items.get(0).getForm();
        var message = form.findField('msg').getValue();
        var link = createPermalink();
        data.push('USER: '+projectData.user);
        data.push('MESSAGE: '+message);
        data.push('LINK: '+link);
        feedbackWin.hide();
        form.reset();
        sendMail(projectData.userFeedbackMailto, 'EQWC '+projectData.project+" "+ TR.feedback, data.join('\r\n'), silent);
    }
}

function sendMail(to, subject, body, silent) {

    var data = {};
    data.mailto = to;
    data.subject = subject;
    data.body = body;

    if (Eqwc.settings.mailServiceUrl > '') {

        Ext.Ajax.request({
            url: Eqwc.settings.mailServiceUrl,
            params: data,
            method: 'POST',
            success: function (response) {
            },
            failure: function (response) {
                if (!silent) {
                    Ext.Msg.alert('Error sending feedback', response.statusText);
                }
            }
        });
    }

}




function receiveShortPermalinkFromDB(result, request) {
    var result = eval("("+result.responseText+")");
    openPermaLink(result.shortUrl);
}

// get best image format for a list of layers
function imageFormatForLayers(layers) {
    var format = origFormat;
    if (layerImageFormats.length > 0 && origFormat.match(/8bit/)) {
        for (var f = 0; f < layerImageFormats.length; f++) {
            var layerImageFormat = layerImageFormats[f];
            for (var l = 0; l < layerImageFormat.layers.length; l++) {
                if (layers.indexOf(layerImageFormat.layers[l]) != -1) {
                    format = layerImageFormat.format;
                    break;
                }
            }
            if (format != origFormat) {
                break;
            }
        }
    }
    return format;
}

//this function checks if layers and layer-groups are outside scale-limits.
//if a layer is outside scale-limits, its label in the TOC is being displayed in a light gray
//TODO UROS Tale funkcija ni optimalna, preurediti da bo lahko upoštevala tudi zunanje sloje
function setGrayNameWhenOutsideScale() {
    if ( grayLayerNameWhenOutsideScale ) { //only if global boolean is set

        //layers
        //------
        var allLayersWithIDs = [];

        //iterate layer tree to get title and layer-id
        layerTree.root.firstChild.cascade(
            function (n) {
                if (n.isLeaf()) {
                    allLayersWithIDs.push([n.text,n.id]);
                }
            }
        );

        //iterate ProjectSettings
        for (var i=0;i<wmsLoader.projectSettings.capability.layers.length;i++){

            MaxScale = Math.round(wmsLoader.projectSettings.capability.layers[i].maxScale);
            //if no MaxScale is defined
            if (MaxScale < 1){
                MaxScale = 1;
            }

            MinScale = Math.round(wmsLoader.projectSettings.capability.layers[i].minScale);
            //if no MinScale is defined
            if (MinScale < 1){ //if not defined, this value is very small
                MinScale = 150000000; //within terrestrial dimensions big enough
            }

            //set content gray
            if (wmsLoader.projectSettings.capability.layers[i].maxScale > geoExtMap.map.getScale() ||
                wmsLoader.projectSettings.capability.layers[i].minScale < geoExtMap.map.getScale()) {
                for (var j=0;j<allLayersWithIDs.length;j++){
                    //comparison layerTree and info from getProjectsettings
                    if (allLayersWithIDs[j][0] == wmsLoader.projectSettings.capability.layers[i].title) {
                        layerTree.root.findChild('id', allLayersWithIDs[j][1], true).setCls('outsidescale');//add css for outside scale
                        strTOCTooltip = tooltipLayerTreeLayerOutsideScale[lang] + ' 1:' + MaxScale + ' - 1:' + MinScale;
                        layerTree.root.findChild('id', allLayersWithIDs[j][1], true).setTooltip(strTOCTooltip);
                        layerTree.root.findChild('id', allLayersWithIDs[j][1], true).isOutsideScale = true;
                        layerTree.root.findChild('id', allLayersWithIDs[j][1], true).MinScale = MinScale;
                        layerTree.root.findChild('id', allLayersWithIDs[j][1], true).MaxScale = MaxScale;
                    }
                }

                // reset gray
            } else {
                for (var j=0;j<allLayersWithIDs.length;j++){
                    if (allLayersWithIDs[j][0] == wmsLoader.projectSettings.capability.layers[i].title) {
                        layerTree.root.findChild('id', allLayersWithIDs[j][1], true).setTooltip(''); //empty tooltip
                        node = layerTree.root.findChild('id', allLayersWithIDs[j][1], true); //remove css class
                        node.ui.removeClass('outsidescale'); //remove css class
                        layerTree.root.findChild('id', allLayersWithIDs[j][1], true).isOutsideScale = false;
                        layerTree.root.findChild('id', allLayersWithIDs[j][1], true).MinScale = MinScale;
                        layerTree.root.findChild('id', allLayersWithIDs[j][1], true).MinScale = MaxScale;
                    }
                }
            }
        }

        // layer-groups
        // ------------
        var arrLayerGroups = []; //array containing all layer-groups
        var arrOutsideScale = []; //array with the state of all layers within the group
        var arrMaxScale = []; //array with the defined max-scale of the group
        var arrMinScale = []; //array with the defined min-scale of the group

        //iterate layer tree
        layerTree.root.firstChild.cascade(
            function (n) {
                if (!(n.isLeaf())) {
                    layerTree.root.findChild('id', n.id, true).cascade(
                        function (m) {
                            // has to be a leaf and outside scale
                            if (m.isLeaf()){
                                arrOutsideScale.push(m.isOutsideScale);
                                arrMaxScale.push(m.MaxScale);
                                arrMinScale.push(m.MinScale);
                            }
                        });
                    //arrLayerGroups: layer-id, layer-name, boolean if currently outside scale, maxscale, minscale
                    arrLayerGroups.push([n.id, n.text, arrOutsideScale, arrMaxScale, arrMinScale]);
                }
                // empty arrays for next iteration
                arrOutsideScale = [];
                arrMaxScale = [];
                arrMinScale = [];
            });

        //iterate all leaf layers within a group
        for (var i=0;i<arrLayerGroups.length;i++){
            bolGroupOutsideScale = true;
            MinScale = 0; //set an extreme minscale
            MaxScale = 150000000; //set an extreme maxscale

            for (var j=0;j<arrLayerGroups[i][2].length;j++){
                //in each iteration take the bigger minscale
                if (MinScale < arrLayerGroups[i][4][j]){
                    MinScale = arrLayerGroups[i][4][j];
                }
                //in each iteration take the smallest maxscale
                if (MaxScale > arrLayerGroups[i][3][j]){
                    MaxScale = arrLayerGroups[i][3][j];
                }

                //if one single leaf layer is visible, the group has as well to be visible
                if ( !arrLayerGroups[i][2][j] ){ //[2] = arrOutsideScale
                    bolGroupOutsideScale = false;
                }
            }

            //the group is invisible
            if ( bolGroupOutsideScale ) {
                layerTree.root.findChild('id', arrLayerGroups[i][0], true).setCls('outsidescale'); // add css class
                strTOCTooltip = tooltipLayerTreeLayerOutsideScale[lang] + ' 1:' + MaxScale + ' - 1:' + MinScale;
                layerTree.root.findChild('id', arrLayerGroups[i][0], true).setTooltip(strTOCTooltip);

                //the group is visible
            } else {
                node = layerTree.root.findChild('id', arrLayerGroups[i][0], true); //remove css class
                node.ui.removeClass('outsidescale'); //remove css class
                layerTree.root.findChild('id', arrLayerGroups[i][0], true).setTooltip('');
            }
        }
    }
}

function exceptionLoading(res) {
    loadMask.hide();

    Ext.Msg.show({
        title: 'Error code: '+res.status,
        msg: res.responseText,
        //width: 300,
        buttons: Ext.MessageBox.OK,
        //multiline: true,
        fn: logout
    });
}

function logout() {
    window.location.href = "./admin/login.php?action=logout";
}
