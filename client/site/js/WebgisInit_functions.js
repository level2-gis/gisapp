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

            //check if we need to hide it
            var hiddenLayers = Eqwc.common.getHiddenLayersFromSettings();
            if (hiddenLayers.indexOf(attr.text) > -1) {
                attr.hidden = true;
                //if (attr.text != Eqwc.settings.QgisUsersPrintName) {
                    attr.layer.metadata.visible = false;
                //}
            }

            //hide layer if we have same baselayer name
            var baseArr = projectData.baseLayers();
            if (baseArr !== null) {
                Ext.each(baseArr, function (currentValue, index, array) {
                    var attr = this;
                    if (currentValue.title == attr.text) {
                        attr.hidden = true;
                        attr.layer.metadata.visible = false;
                        return false;   //exit from looping array
                    }
                }, attr);
            }

            //hide layer if we have same extralayer name
            var extraArr = projectData.extraLayers();
            if (extraArr !== null) {
                Ext.each(extraArr, function (currentValue, index, array) {
                    var attr = this;
                    if (currentValue.title == attr.text) {
                        attr.hidden = true;
                        attr.layer.metadata.visible = false;
                        return false;   //exit from looping array
                    }
                }, attr);
            }

            if (!attr.layer.metadata.showCheckbox) {
                // hide checkbox
                attr.cls = 'layer-checkbox-hidden';
                attr.checked = undefined;
            }

            //layer must be in projectData.layers, if not hide it!
            if (projectData.layers[attr.layer.metadata.prefix] === undefined && attr.leaf) {
                attr.hidden = true;
            }

            //dont' create node for hidden elements
            if (!attr.hidden) {
                return QGIS.WMSCapabilitiesLoader.prototype.createNode.apply(this, [attr]);
            }
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
    layerTree.on('click', function (node) {
        var layerId = wmsLoader.layerTitleNameMapping[node.text];   //current click
        if (layerId == undefined) {
            return;
        }
        var prop = projectData.layers[layerId];
        if (prop == undefined) {
            return;
        }
        //save currently selected layer
        if (node.leaf && prop.geom_type) {
            Eqwc.currentSelectedLayerId = layerId;
        }
    });

}

function postLoading() {

    addBookmarks();

    //DescriptionPanel
    var descPanel = Ext.getCmp('DescriptionPanel');
    if (descPanel.el.dom.innerText.length>15) {
        descPanel.setVisible(true);
    }

    var layerTreeSelectionChangeHandlerFunction = function (selectionModel, treeNode) {
        if (!themeChangeActive) {
            //change selected activated layers for GetFeatureInfo requests
            layerTree.fireEvent("leafschange");
        }
    };

    var leafsChangeFunction = function(node, checked) {

        var lay = wmsLoader.layerTitleNameMapping[node.text];

        if (node.isLeaf() && lay) {
            //check if have to replace for identify
            var queryLay = Eqwc.common.getIdentifyLayerName(lay);
            var queryLayId = wmsLoader.layerTitleNameMapping[queryLay];

            if (checked) {
                selectedLayers.push(lay);
                if (wmsLoader.layerProperties[lay].queryable) {
                    selectedQueryableLayers.push(queryLayId);
                }
            }
            else {
                var i = selectedLayers.indexOf(lay);
                if (i>-1) {
                    selectedLayers.splice(i,1);
                }
                var j = selectedQueryableLayers.indexOf(queryLayId);
                if (j>-1) {
                    selectedQueryableLayers.splice(j,1);
                }
            }
        }
        // Call custom action in Customizations.js
        customActionLayerTreeCheck(node);

        format = imageFormatForLayers(selectedLayers);
        //updateLayerOrderPanel();

        //change array order
        selectedLayers = layersInDrawingOrder(selectedLayers);
        selectedQueryableLayers = layersInDrawingOrder(selectedQueryableLayers);

        if (selectedQueryableLayers.length == 0) {
            thematicLayer.setVisibility(false);
        } else {
            thematicLayer.setVisibility(true);
        }

        //don't add layer default styles until there is really change in any layers style
        var styles = '';
        if(thematicLayer.params.STYLES>"") {
            styles = layerStyles(selectedLayers).join(',');
        }

        thematicLayer.mergeNewParams({
            LAYERS: selectedLayers.join(","),
            //OPACITIES: layerOpacities(selectedLayers),
            STYLES: styles,
            FORMAT: format
        });
    };

    var baseChangeFunction = function (node, checked) {
        // switch backgroundLayers
        if (enableBGMaps && baseLayers.length > 0) {
            var newVisibleBaseLayer = checked ? node.layer.name : null;

            layerTree.root.lastChild.cascade(
                function (n) {
                    if (n.isLeaf() && n.attributes.checked && n.layer.name != node.layer.name) {
                        var silent = true;
                        n.unselect(silent);
                        n.removeListener("checkchange", baseChangeFunction);
                        n.layer.setVisibility(false);
                        n.addListener("checkchange", baseChangeFunction);
                    }
                });

            currentlyVisibleBaseLayer = newVisibleBaseLayer;
        }
    };

    //setting up project specific data
    var initialBGMap = Eqwc.settings.visibleFirstBaseLayer ? 0 : -1;
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
        document.title = Eqwc.settings.gisPortalTitle ? titleBarText + ' | ' + Eqwc.settings.gisPortalTitle : titleBarText;

        // set header logo and link
        if (headerLogoLink > '') {
            Ext.select('#panel_header_link a').replaceWith({
                tag: 'a',
                href: headerLogoLink,
                //target: '_blank',
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
        Ext.get('panel_header_title').update(titleBarText);

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
        //getVisibleFlatLayers(layerTree.root.firstChild);

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
        var boundingBox = wmsLoader.projectSettings.capability.nestedLayers[0].bbox;
        //get bbox for map crs
        if (boundingBox[authid] == undefined) {
            exceptionLoading({status: 200, responseText: 'Map CRS ' + authid + ' not published in QGIS Project properties OWS Server!'});
        }
        var bboxArray = boundingBox[authid].bbox;

        if (bboxArray != undefined) {
            maxExtent = projectData.makeExtentFromArray(bboxArray, true);
            //MapOptions.maxExtent = maxExtent;
            LayerOptions.maxExtent = maxExtent;
        }
    }

    //now collect all selected layers (with checkbox enabled in tree)
    selectedLayers = [];
    selectedQueryableLayers = [];
    allLayers = [];

    layerTree.root.firstChild.cascade(
        function (n) {
            if (n.isLeaf()) {
                if (n.attributes.checked) {
                    selectedLayers.push(wmsLoader.layerTitleNameMapping[n.text]);

                    if (wmsLoader.layerProperties[wmsLoader.layerTitleNameMapping[n.text]].queryable) {
                        //check if have to replace for identify
                        var layerId = wmsLoader.layerTitleNameMapping[n.text];
                        var node2 = Eqwc.common.getIdentifyLayerName(layerId);
                        var lay =  wmsLoader.layerTitleNameMapping[node2];
                        selectedQueryableLayers.push(lay);
                    }
                }
                allLayers.push(wmsLoader.layerTitleNameMapping[n.text]);

                //create menu and filter properties from json configuration
                buildLayerContextMenu(n);

                n.on('contextMenu', contextMenuHandler);
                n.on('checkchange', leafsChangeFunction);
            }
            else {
                //disable contextmenu on groups
                //n.on("contextMenu", Ext.emptyFn, null, {preventDefault: true});

                //create menu and filter properties from json configuration
                buildGroupContextMenu(n);

                n.on ('contextMenu', contextMenuHandler);
                n.on('checkchange', leafsChangeFunction);
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
        for (var i = 0; i < composerTemplates.length; i++) {
            var composerTemplate = composerTemplates[i];
            if(composerTemplate.map) {
                printLayoutsDefined = true;
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
            } else {
                printLayoutsDefined = false;
            }
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
            printProvider: printProvider,
            init: function(mapPanel) {
                this.map = mapPanel.map;
                mapPanel.on("destroy", this.onMapPanelDestroy, this);

                if (!this.layer) {
                    this.layer = new OpenLayers.Layer.Vector(null, {
                        displayInLayerSwitcher: false
                    });
                }
                this.createControl();

                //for (var i=0, len=this.pages.length; i<len; ++i) {
                //    this.addPage(this.pages[i]);
                //}
                //this.show();
            }
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
                symbolizer: Eqwc.settings.symbolizersHighLightLayer
            })]);
        var styleMapHighLightLayer = new OpenLayers.StyleMap({
            "default": styleHighLightLayer
        });
    }

    var MapPanelRef = Ext.getCmp('MapPanel');

    //handle restricted extent
    if(projectData.restrictToStartExtent) {
        MapOptions.restrictedExtent = projectData.makeExtentFromArray(projectData.extent.split(','), false);

        var widthUnits = MapOptions.restrictedExtent.getWidth();
        var widthPx = MapPanelRef.getInnerWidth();

        MapOptions.maxResolution = widthUnits / widthPx;
    }

    // return input layers sorted by order defined in project settings
    function layersInDrawingOrder(layers) {
        var layerDrawingOrder = wmsLoader.projectSettings.capability.layerDrawingOrder;
        if (layerOrderPanel != null) {
            layerDrawingOrder = layerOrderPanel.orderedLayers();
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

        var reverseExtra = Eqwc.common.reverseArray(extraLayers);

        //creating the GeoExt map panel
        geoExtMap = new GeoExt.MapPanel({
            frame: false,
            border: false,
            //zoom: 1.6,
            extent: projectData.makeExtentFromArray(projectData.extent.split(','), false),
            layers: baseLayers.concat(
                reverseExtra.concat(
                    [
                        thematicLayer = new OpenLayers.Layer.WMS(layerTree.root.firstChild.text,
                            wmsURI, {
                                layers: selectedLayers.join(","),
                                //opacities: layerOpacities(selectedLayers),
                                format: format,
                                transparent: qgisLayerTransparency,
                                dpi: screenDpi,
                                VERSION: "1.3.0",
                                EXCEPTIONS: "XML"
                            },
                            LayerOptions
                        ),
                        highlightLayer = new OpenLayers.Layer.Vector("attribHighLight", {
                            isBaseLayer: false,
                            styleMap: styleMapHighLightLayer
                        }),
                        featureInfoHighlightLayer = new OpenLayers.Layer.Vector("Selection", {
                            isBaseLayer: false,
                            styleMap: styleMapHighLightLayer,
                            metadata:'editor'   //to use geometry in editor plugin
                        })
                    ])
            ),
            map: MapOptions,
            id: "geoExtMapPanel",
            //width: MapPanelRef.getInnerWidth(),
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
            //"OPACITIES": layerOpacities(selectedLayers),
            "FORMAT": format
        });
    }

    if (!initialLoadDone) {

        //listeners for thematicLayer
        thematicLayer.events.register('loadend', this, function () {
            if (!initialLoadDone) {
                //show that we are done with initializing the map
                //mainStatusText.setText(modeNavigationString[lang]);
                if (loadMask) {
                    loadMask.hide();
                }
                initialLoadDone = true;
                // run the function in the Customizations.js
                customAfterMapInit();
            }
        });
        thematicLayer.events.register('tileerror', this, function () {
            Eqwc.common.redirect();
        });

        //set crs values
        rightStatusText.store.on("load", function() {

            //initial CRS to display coordinates. Take setting if exists or first item crsComboStore which is QGIS project CRS.
            var value = this.data.itemAt(0).data.code;
            if(projectData.defaultCoordinatesCrsCode) {
                var test = projectData.getProjectionsList('EPSG:'+projectData.defaultCoordinatesCrsCode)[0];
                if(test && test.length>0) {
                    value = test[0];
                }
            }

            rightStatusText.setValue(value);
            Eqwc.currentMapProjection = projectData.getProjectionsList(value)[0];
        });
        rightStatusText.store.loadData(projectData.crsComboStore());



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
            //only update size if we are enlarging window
            var oldH = geoExtMap.map.getSize().h; //geoExtMap.getHeight();
            var oldW = geoExtMap.map.getSize().w; //geoExtMap.getWidth();
            var newW = panel.getInnerWidth();
            var newH = panel.getInnerHeight();
            if (oldW < newW) {
                geoExtMap.map.updateSize();
            }
            if (oldH < newH) {
                geoExtMap.setHeight(newH);
            }
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

        var scaleInUnits = 'm';
        var scaleOutUnits = 'km';

        if (Eqwc.settings.measurementsUnitSystem == 'english') {
            scaleInUnits = 'ft';
            scaleOutUnits = 'mi';
        }

        //add OpenLayers map controls
        geoExtMap.map.addControl(new OpenLayers.Control.KeyboardDefaults());
        geoExtMap.map.addControl(new OpenLayers.Control.Navigation());
        geoExtMap.map.addControl(new OpenLayers.Control.Attribution());
        geoExtMap.map.addControl(new OpenLayers.Control.ScaleLine({
            geodesic: true,
            topInUnits: scaleInUnits,
            topOutUnits: scaleOutUnits
        }));

        //geoExtMap.map.addControl(new OpenLayers.Control.PanZoomBar({zoomWorldIcon:true,forceFixedZoomLevel:false}));
        geoExtMap.map.addControl(new OpenLayers.Control.Zoom());

        //for debuggin TODO UROS REMOVE THIS
        //geoExtMap.map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));

        //coordinate display
        coordinateTextField = Ext.getCmp('CoordinateTextField');
        geoExtMap.map.events.register('mousemove', this, function (evt) {
            var projectCrs = projectData.crs;
            var mapCrs = rightStatusText.getValue();
            var mapCrsUnits = Eqwc.currentMapProjection[2].proj.units;
            var xy = geoExtMap.map.events.getMousePosition(evt);
            var geoxy = geoExtMap.map.getLonLatFromPixel(xy);
            var nDeci = 0;
            if(mapCrsUnits=='degrees') {
                nDeci = 5;
            }
            var currentScale = geoExtMap.map.getScale();
            if (currentScale <= 400) {
                nDeci += 1;
                if (currentScale <= 100) {
                    nDeci += 2;
                }
            }
            if(projectCrs != mapCrs) {
                geoxy.transform(geoExtMap.map.getProjectionObject(),Eqwc.currentMapProjection[2]);
            }
            coordinateTextField.setRawValue(geoxy.lon.toFixed(nDeci) + "," + geoxy.lat.toFixed(nDeci));
        });

        coordinateTextField.on('specialkey', function (textField, evt) {
            if (evt.getKey() == evt.ENTER) {
                var projectCrs = projectData.crs;
                var mapCrs = rightStatusText.getValue();
                var coords = textField.getValue().split(",");
                var newCenter = new OpenLayers.LonLat(parseFloat(coords[0]), parseFloat(coords[1]));
                if(projectCrs != mapCrs) {
                    newCenter.transform(Eqwc.currentMapProjection[2],geoExtMap.map.getProjectionObject());
                }
                geoExtMap.map.setCenter(newCenter);
            }
            //supress arrow keys propagation to underlying OpenLayers
            if (evt.getKey() > 36 && evt.getKey() < 41) {
                evt.stopPropagation();
            }
        });
        coordinateTextField.on('change', function (numberField, newValue, oldValue) {
            var projectCrs = projectData.crs;
            var mapCrs = rightStatusText.getValue();
            var coords = newValue.split(",");
            var newCenter = new OpenLayers.LonLat(parseFloat(coords[0]), parseFloat(coords[1]));
            if(projectCrs != mapCrs) {
                newCenter.transform(Eqwc.currentMapProjection[2],geoExtMap.map.getProjectionObject());
            }
            geoExtMap.map.setCenter(newCenter);
        });

        //navigation history
        navHistoryCtrl = new OpenLayers.Control.NavigationHistory();
        geoExtMap.map.addControl(navHistoryCtrl);
    }

    //controls for getfeatureinfo
    selectedQueryableLayers = layersInDrawingOrder(selectedQueryableLayers);

    if (initialLoadDone) {
        if (Eqwc.settings.enableHoverPopup)
            geoExtMap.map.removeControl(WMSGetFInfoHover);
        geoExtMap.map.removeControl(WMSGetFInfo);
        //geoExtMap.map.removeControl(ExtraFInfo);
    }


    //TEST, WHY MAKE NEW LAYER
    //var fiLayer = new OpenLayers.Layer.WMS(layerTree.root.firstChild.text, wmsURI, {
    //    layers: [],
    //    VERSION: "1.3.0"
    //}, LayerOptions);

    //test, prepare for GetFeatureInfo call for external layers
    //not finished, disabled
    //ExtraFInfo = new OpenLayers.Control.WMSGetFeatureInfo({
    //    layers: [],
    //    infoFormat: "text/xml",
    //    queryVisible: true
    //});
    ////ExtraFInfo.events.register("getfeatureinfo", this, showExtraFeatureInfo);
    //ExtraFInfo.events.register("beforegetfeatureinfo", this, onBeforeGetExtraFeatureInfoClick);
    ////ExtraFInfo.events.register("nogetfeatureinfo", this, noExtraFeatureInfoClick);
    //geoExtMap.map.addControl(ExtraFInfo);

    WMSGetFInfo = new OpenLayers.Control.WMSGetFeatureInfo({
        layers: [thematicLayer],
        infoFormat: "text/xml",
        queryVisible: true,
        maxFeatures: Eqwc.settings.limitSearchMaxResults,
        vendorParams: {
            QUERY_LAYERS: selectedQueryableLayers.join(","),
            WITH_MAPTIP: true,
            WITH_GEOMETRY: true
        }
    });
    WMSGetFInfo.events.register("getfeatureinfo", this, showFeatureInfo);
    WMSGetFInfo.events.register("beforegetfeatureinfo", this, onBeforeGetFeatureInfoClick);
    WMSGetFInfo.events.register("nogetfeatureinfo", this, noFeatureInfoClick);
    geoExtMap.map.addControl(WMSGetFInfo);

    if (Eqwc.settings.enableHoverPopup) {
        WMSGetFInfoHover = new OpenLayers.Control.WMSGetFeatureInfo({
            layers: [thematicLayer],
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
        var olMap = new OpenLayers.Control.OverviewMap({
            size: OverviewMapSize,
            minRatio: 16,
            maxRatio: 64,
            mapOptions: OverviewMapOptions,
            maximized: OverviewMapMaximized,
            layers: [overviewLayer]
        });
        geoExtMap.map.addControl(olMap);
        olMap.maximizeDiv.innerHTML = "<a href='#'><<</a>";
        olMap.minimizeDiv.innerHTML = "<a href='#'>>></a>";
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
            id: 'zoomLast',
            hidden: !projectData.zoom_back_forward
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
            id: 'zoomNext',
            hidden: !projectData.zoom_back_forward
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
                    highlightLayerName: 'attribHighLight',
                    width: Math.round(geoExtMap.getWidth()/3),
                    minChars: 2,
                    loadingText: geonamesLoadingString[lang],
                    emptyText: geonamesEmptyString[lang],
                    lang: lang,
                    zoom: projectData.geoCode.zoom ? projectData.geoCode.zoom : 18,
                    country: projectData.geoCode.country ? projectData.geoCode.country : '',
                    tpl: '<tpl for="."><div class="x-combo-list-item"><h3>{text}</h3>{place_name}</div></tpl>',
                    layers: projectData.geoCode.layers,
                    provider: projectData.geoCode.provider,
                    displayField: 'text',
                    maxRows: 10
                });
            } else {
                var conf = {
                    map: geoExtMap.map,
                    highlightLayerName: 'attribHighLight',
                    hasReverseAxisOrder: false, // PostGIS returns bbox' coordinates always x/y
                    width: Math.round(geoExtMap.getWidth()/3),
                    searchtables: searchtables,
                    emptyText: (projectData.wsgi && projectData.wsgi.emptytext) ? projectData.wsgi.emptytext : searchFieldDefaultTextString[lang],
                    url: searchBoxQueryURL,
                    geomUrl: searchBoxGetGeomURL,
                    srs: projectData.crs.split(':')[1]        //this is the map coordinate system and that's what we need to get from server
                }
                if (projectData.wsgi.limit) {
                    conf.limit = projectData.wsgi.limit;
                }
                if (projectData.wsgi.filter) {
                    conf.filter = projectData.wsgi.filter;
                }
                if (projectData.wsgi.connect) {
                    conf.connect = projectData.wsgi.connect;
                }
                qgisSearchCombo = new QGIS.SearchComboBox(conf);
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
            for (var j = 0; j < searchPanelConfigs.length; j++) {
                //set pointer cursor for first column
                searchPanelConfigs[j].gridColumns[0].renderer = function (val, metadata, record) {
                    metadata.style = 'cursor: pointer;';
                    return val;
                };

                var panel = new QGIS.SearchPanel(searchPanelConfigs[j]);
                panel.gridLocation = 'default';
                panel.gridTitle = searchResultString[lang];
                panel.gridResults = Eqwc.settings.limitSearchMaxResults ? Eqwc.settings.limitSearchMaxResults: 10;
                panel.on("featureselected", showRecordSelected);
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

            geoExtMap.map.updateSize();
        });
        leftPanel.addListener('collapse', function (myPanel) {
            geoExtMap.map.updateSize();
        });
        leftPanel.addListener('expand', function (myPanel) {
            geoExtMap.map.updateSize();
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
                    },
                    getBestArea: function (geometry) {
                        var units = this.displaySystemUnits[this.displaySystem];
                        var unit, area;
                        for (var i = 0, len = units.length; i < len; ++i) {
                            unit = units[i];
                            area = this.getArea(geometry, unit);
                            if (area > 1) {
                                break;
                            }
                        }

                        //modification for acres
                        if (this.displaySystem === 'english') {
                            if (unit === 'mi') {
                                area = area * 640;
                                unit = 'ac';
                            } else if (unit === 'ft' && area > 43559) {
                                area = area * .000022957;
                                unit = 'ac';
                            }
                        } else {
                            unit += "<sup>2</sup>";
                        }

                        return [area, unit];
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
            control.displaySystem = Eqwc.settings.measurementsUnitSystem ? Eqwc.settings.measurementsUnitSystem : 'metric';
            geoExtMap.map.addControl(control);
        }
    }

    //if (initialLoadDone) {
    //    layerTree.removeListener("checkchange",leafsChangeFunction);
    //}
    ////add listeners for layertree
    //layerTree.addListener('checkchange',leafsChangeFunction);

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
                checked: extraLayers[k].visibility,
                uiProvider: Ext.tree.TriStateNodeUI
            });
            extraLayGroup.appendChild(extraNode);
            extraNode.on("contextMenu", Ext.emptyFn, null, {preventDefault: true});
        }
    }

    //deal with commercial external bg layers
    if (enableBGMaps && baseLayers.length>0) {
        var BgLayerList = new Ext.tree.TreeNode({
            leaf: false,
            expanded: true,
            text: backgroundLayerTitleString[lang]
        });

        layerTree.root.appendChild(BgLayerList);
        BgLayerList.on("contextMenu", Ext.emptyFn, null, {preventDefault: true});

        if (visibleBackgroundLayer != null) {
            //initialBGMap = -1;
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
            bgnode.on('checkchange', baseChangeFunction);
        }
    }

    if (!initialLoadDone) {
        if (printLayoutsDefined == true) {
            //create new window to hold printing toolbar
            printWindow = new Ext.Window({
                title: printSettingsToolbarTitleString[lang],
                height: projectData.user == 'guest' ? 100 : 160,
                width: 470,
                layout: "fit",
                renderTo: "geoExtMapPanel",
                resizable: false,
                closable: false,
                x: 8,
                y: 8,
                items: [{
                    xtype: 'form',
                    padding: '3',
                    items: [
                            {
                                id: 'printTitle',
                                xtype: 'textfield',
                                //fieldLabel: 'TITLE',
                                hideLabel: true,
                                emptyText: TR.emptyPrintTitleText,
                                hidden: projectData.user=='guest',
                                anchor:'100%',
                                autoCreate: {tag: 'input', type: 'text', autocomplete: 'off', maxlength: '50'}
                            },{
                                id: 'printDescription',
                                xtype: 'textarea',
                                maxLength: 100,
                                boxMaxHeight: 35,
                                boxMinHeight: 35,
                                height: 35,
                                //fieldLabel: 'DESCRIPTION',
                                hideLabel: true,
                                emptyText: TR.emptyPrintDescriptionText,
                                hidden: projectData.user=='guest',
                                anchor:'100%'
                            }],


                        bbar: {
                            xtype: 'toolbar',
                            autoHeight: true,
                            id: 'myPrintToolbar',
                            items: [{
                                xtype: 'combo',
                                id: 'PrintLayoutsCombobox',
                                width: 180,
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
                                xtype: 'label',
                                text: printSettingsRotationTextlabelString[lang]
                            }, {
                                xtype: 'tbspacer'
                            }, {
                                xtype: 'spinnerfield',
                                id: 'PrintLayoutRotation',
                                width: 50,
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
                            }]
                        },
                        buttons: [{
                            tooltip: printButtonTooltipString[lang],
                            text: printButtonTextString[lang],
                            tooltipType: 'qtip',
                            iconCls: '',
                            scale: 'small',
                            id: 'StartPrinting',
                            listeners: {
                                'click': function () {
                                    Ext.getCmp('PrintMap').toggle(false);

                                    var usersPrint = wmsLoader.layerTitleNameMapping[Eqwc.settings.QgisUsersPrintName];

                                    //additional hidden layers from map need to add to print layers
                                    var addLayers = [];
                                    var hdnLayers = Eqwc.common.getHiddenLayersFromSettings();
                                    for (var x=0; x<hdnLayers.length;x++) {
                                        if(wmsLoader.layerTitleNameMapping[hdnLayers[x]]) {
                                            addLayers.push(wmsLoader.layerTitleNameMapping[hdnLayers[x]]);
                                        }
                                    }
                                    printProvider.additionalLayers = addLayers;

                                    //adding title,decription and user for filter to PrintProvider
                                    printProvider.customParams = {
                                        description: Ext.getCmp('printDescription').getValue(),
                                        title: Ext.getCmp('printTitle').getValue()
                                    };

                                    if (usersPrint !== undefined) {
                                        printProvider.customParams.filterToAdd = usersPrint+':"user_name" = \''+projectData.user+'\'';
                                    }

                                    printProvider.print(geoExtMap, [printExtent.page]);
                                }
                            }
                        }, {
                            tooltip: printCancelButtonTooltipString[lang],
                            text: printCancelButtonTextString[lang],
                            tooltipType: 'qtip',
                            iconCls: '',
                            scale: 'small',
                            id: 'CancelPrinting',
                            listeners: {
                                'click': function () {
                                    Ext.getCmp('PrintMap').toggle(false);
                                }
                            }
                        }]
                    }]
                }
            );
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
        var dpiVal = Eqwc.settings.printCapabilities.dpis[0].value ? Eqwc.settings.printCapabilities.dpis[0].value : 300;
        printDPICombobox.setValue(dpiVal);
        //need to manually fire the event, because .setValue doesn't; index omitted, not needed
        printDPICombobox.fireEvent("select", printDPICombobox, printDPICombobox.findRecord(printDPICombobox.valueField, dpiVal));
        //if the var fixedPrintResolution in GlobalOptions.js is set, the printLayoutsCombobox will be hidden
        if (fixedPrintResolution != null && parseInt(fixedPrintResolution) > 0) {
            printDPICombobox.hide(); // hide dpi combobox
            printWindow.setWidth(printWindow.width - 71); // reduce the legth of the print window
        }
        //bug in spinnerField: need to explicitly show/hide printWindow (toolbar)
        printWindow.show();
        printWindow.hide();
    }
    //move to other spot
    //printExtent.hide();

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

    //draw layers outside scale gray
    setGrayNameWhenOutsideScale();
}

/*
 * Show search panel results
 */
function showSearchPanelResults(searchPanelInstance, features) {
    //if (features.length) {
        // Here we select where to show the search results
        var targetComponent = null;
        //if (typeof(mapSearchPanelOutputRegion) == 'undefined') {
        //    mapSearchPanelOutputRegion = 'default';
        //}

        // These option are for different output modes
        var collapsible = true;
        var autoHeight = true;
        var horFit = false;      //forceFit (no horizontal scroller)
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

                // Make sure it's shown and expanded
                targetComponent.show();

                if (searchPanelInstance.resultsGrid == null) {
                    targetComponent.expand();
                }
                break;
            case 'popup':
                var win = Ext.getCmp('window_'+searchPanelInstance.selectionLayer);
                //searchPanelId = 'popup_'+searchPanelInstance.queryLayer;
                if (typeof(win) == 'undefined') {
                    new Ext.Window(
                        {
                            id: 'window_'+searchPanelInstance.selectionLayer,
                            layout: 'fit',
                            width: "60%",
                            height: 250,
                            modal: false,
                            title: searchPanelInstance.selectionLayer,
                            items: [{
                                xtype: 'tabpanel',
                                title: ''
                            }]
                            //closeAction: 'hide'
                        }).show();
                    win = Ext.getCmp('window_'+searchPanelInstance.selectionLayer);
                    win.setTitle(searchPanelInstance.windowTitle);
                } else {
                    win.toFront();
                }
                autoHeight = false; // No scrollbars if true
                collapsible = false; // No collapsible in popup
                targetComponent = win.items.item(0);
                break;
            default:
                collapsible = false;
                horFit = true;
                searchPanelId = 'SearchPanelResultsGrid';
                targetComponent = searchPanelInstance;
                break;
        }
        // Make sure it's shown and expanded
        //targetComponent.show();
        //targetComponent.collapsible && targetComponent.expand();
        // Delete and re-create
        //try {
        //    Ext.getCmp('SearchPanelResultsGrid').destroy();
        //} catch (e) {
        //    // Eventually log...
        //}

        //test if we need paging (not actual size of results, just initial settings
        var pagingConfig = {};
        if (searchPanelInstance.gridResults>searchPanelInstance.gridResultsPageSize) {
            pagingConfig = new Ext.ux.PagingToolbar({
                pageSize: searchPanelInstance.gridResultsPageSize,
                store: searchPanelInstance.store,
                displayInfo: false,
                grid: searchPanelInstance,
                doRefresh: function () {
                    this.grid.onSubmit(true);
                }
            });

        }

        if (!searchPanelInstance.resultsGrid) {

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


            searchPanelInstance.resultsGrid = new Ext.grid.GridPanel({
                id: searchPanelId,
                hasGeom: searchPanelInstance.hasGeom,
                panel: searchPanelInstance,
                title: searchPanelInstance.gridTitle,
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
                    forceFit: horFit,
                    templates: {
                        cell: new Ext.Template(
                            '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',
                            '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
                            '</td>'
                        )
                    }
                },
                // paging bar on the bottom
                bbar: pagingConfig,
                //select record if we have one result
                listeners: {
                    render: function (grid) {
                        grid.store.on('load', function (store, records, options) {
                            if (features.length == 1) {
                                grid.getSelectionModel().selectFirstRow();
                                grid.fireEvent('rowClick', grid, 0);
                            }
                        });
                    },
                    filterupdate: function () {

                        if (searchPanelInstance.resultsGrid !== null) {
                            var wmsFilter = [];
                            var layer = searchPanelInstance.queryLayer;
                            var sourceLayer = Eqwc.common.getIdentifyLayerNameRevert(layer);
                            var layerId = wmsLoader.layerTitleNameMapping[sourceLayer];
                            var filt = Ext.decode(Ext.encode(searchPanelInstance.resultsGrid.filters.getFilterData()));
                            Ext.each(filt, function (f) {
                                var sep = '';
                                var valStr = "'"+f.data.value+"'";
                                if (f.data.type == 'string') {
                                    wmsFilter.push("\"" + f.field + "\" ILIKE \'%" + f.data.value + "%\'");
                                } else if (f.data.type == 'numeric' || f.data.type == 'date') {
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
                                    if(f.data.type=='numeric') {
                                        valStr = f.data.value;
                                    }
                                    wmsFilter.push("\"" + f.field + "\" " + sep + " " + valStr);
                                } else {
                                    sep = '=';
                                    wmsFilter.push("\"" + f.field + "\" " + sep + " " + valStr);
                                }
                            });

                            //filter also view (for print table)
                            if(layer.indexOf('_view')>-1) {
                                thematicLayer.mergeNewParams({
                                    FILTER: layerId + ":" + wmsFilter.join(" AND ") + ";" + wmsLoader.layerTitleNameMapping[layer] + ":" + wmsFilter.join(" AND ")
                                });
                            } else {
                                thematicLayer.mergeNewParams({FILTER: layerId + ":" + wmsFilter.join(" AND ")});
                            }

                            //store filter
                            wmsLoader.layerProperties[layerId].currentFilter = wmsFilter.join(" AND ");
                        }
                    }
                }

            });

            //update title and other stuff on store datachanged event
            searchPanelInstance.resultsGrid.store.on("datachanged", function() {
                var grid = this;
                var store = grid.store;

                var cnt_all = store.totalCount;
                var cnt_filt = store.getTotalCount();

                if(grid.getBottomToolbar()) {
                    var complete = (store.totalCount == store.maxResults) ? false : true;
                    var loadmore = grid.getBottomToolbar().getComponent('loadmore');
                    if (loadmore != undefined) {
                        if (complete) {
                            loadmore.setVisible(false);
                        } else {
                            loadmore.setVisible(true);
                        }
                    }
                }

                if (cnt_filt < cnt_all) {
                    grid.setTitle(store.gridTitle + "* (" + cnt_filt + ")");
                } else {
                    grid.setTitle(store.gridTitle + " (" + cnt_all + ")");
                }
            }, searchPanelInstance.resultsGrid);

            //additional buttons in bottom toolbar
            var toolBar = [{
                iconCls: 'x-clearfilter-icon',
                tooltip: TR.clearFilter,
                //scale: 'medium',
                //disabled: true,
                handler: function () {
                    searchPanelInstance.resultsGrid.filters.clearFilters();
                }
            }, {
                iconCls: 'x-clear-icon',
                tooltip: TR.clearSelection,
                //scale: 'medium',
                //disabled: true,
                handler: clearTableSelection
            }];

            if (searchPanelInstance.useBbox) {
                toolBar.push({
                    iconCls: 'x-extent-icon',
                    tooltip: TR.tableUseExtent,
                    pressed: Eqwc.settings.syncAttributeTableWithView,
                    //scale: 'medium',
                    //disabled: true,
                    enableToggle: true,
                    toggleHandler: switchBbox,
                    scope: searchPanelInstance
                });
            }
            if (!searchPanelInstance.hasGeom && searchPanelInstance.gridEditable && (typeof (prepareEdit) == 'function')) {
                if (Eqwc.common.findParentRelation(this.gridTitle) == false) {
                    toolBar.push({
                        iconCls: 'x-add-icon',
                        tooltip: TR.tableAddRecord,
                        handler: addRecord,
                        scope: searchPanelInstance
                    });
                } else if (projectData.relations.hideJoinField == false) {
                    toolBar.push({
                        iconCls: 'x-add-icon',
                        tooltip: TR.tableAddRecord,
                        handler: addRecord,
                        scope: searchPanelInstance
                    });
                }
            }

            toolBar.push(
                {
                    itemId: 'loadmore',
                    iconCls: 'x-exclamation-icon',
                    text: TR.loadMore,
                    hidden: true,
                    tooltip: TR.loadMoreToolTip,
                    scope: searchPanelInstance,
                    handler: loadMore
                });

            //if paging config is defined, otherwise we don't need this
            if(pagingConfig.displayInfo==false) {
                searchPanelInstance.resultsGrid.getBottomToolbar().add(toolBar);
            }

            targetComponent.add(searchPanelInstance.resultsGrid);
        }



        searchPanelInstance.resultsGrid.on('rowclick', searchPanelInstance.onRowClick, searchPanelInstance);
        searchPanelInstance.resultsGrid.on('keypress', function(e){
            //pressing enter in selected row forces OnRowClick
            if(e.getKey()==13) {
                var rowIndex = this.getSelectionModel().last;
                this.fireEvent('rowclick',this,rowIndex);
            }
        });

        targetComponent.doLayout();
        // Always make sure it's shown and expanded
        searchPanelInstance.resultsGrid.show();
        //searchPanelInstance.resultsGrid.collapsible && searchPanelInstance.resultsGrid.expand();

        //zoom to the extent from GetFeatureInfo results
        //var bx = searchPanelInstance.store.totalBbox;
        //var bbox = new OpenLayers.Bounds(bx.minx,bx.miny,bx.maxx,bx.maxy);
        //geoExtMap.map.zoomToExtent(bbox,false);

    //} else {
    //    // No features: shouldn't we warn the user?
    //
    //    //remove loading mask
    //    var maskElement = this.el;
    //    if(this.gridLocation=='bottom') {
    //        maskElement = Ext.getCmp('BottomPanel').el;
    //    }
    //
    //    maskElement.unmask();
    //
    //    //Ext.MessageBox.alert(searchPanelTitleString[lang], searchNoRecordsFoundString[lang]);
    //    //try {
    //    //    Ext.getCmp('SearchPanelResultsGrid').destroy();
    //    //} catch (e) {
    //    //    // Eventually log...
    //    //}
    //    //searchPanelInstance.resultsGrid = null;
    //}
    return true;
}

// function getVisibleLayers(visibleLayers, currentNode){
//     while (currentNode != null){
//         if (currentNode.attributes.checked) {
//             visibleLayers.push(wmsLoader.layerTitleNameMapping[currentNode.text]);
//         } else if (currentNode.attributes.checked == null) {
//             // this node is partly checked, so it is a layer group with some layers visible
//             // dive into this group for layer visibility
//             for (var i = 0; i < currentNode.childNodes.length; i++) {
//                 visibleLayers = getVisibleLayers(visibleLayers, currentNode.childNodes[i]);
//             }
//         }
//         currentNode = currentNode.nextSibling;
//     }
//     return visibleLayers;
// }

// function getVisibleFlatLayers(currentNode) {
//     visibleLayers = [];
//     currentNode.cascade(function(node) {
//         if (node.isLeaf() && node.attributes.checked) {
//             visibleLayers.push(wmsLoader.layerTitleNameMapping[node.text]);
//         }
//     });
// }

function getVisibleBackgroundLayer() {
    var visibleBackgroundLayer = null;

    if (enableBGMaps) {
        layerTree.root.lastChild.cascade(function (node) {
            if (node.isLeaf() && node.attributes.checked) {
                visibleBackgroundLayer = node.text;
            }
        });
    }
    return visibleBackgroundLayer;
}

// function uniqueLayersInLegend(origArr) {
//     var newArr = [],
//         origLen = origArr.length,
//         found,
//         x, y;
//
//     for ( x = 0; x < origLen; x++ ) {
//         found = undefined;
//         for ( y = 0; y < newArr.length; y++ ) {
//             if ( origArr[x] === newArr[y] ) {
//                 found = true;
//                 break;
//             }
//         }
//         if ( !found) newArr.push( origArr[x] );
//     }
//     return newArr;
// }

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
            changeCursorInMap("default");
            if (hoverPopup) {removeHoverPopup();}
            if (clickPopup) {removeClickPopup();}
            //featureInfoHighlightLayer.removeAllFeatures();
            //clearFeatureSelected();
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
        geoExtMap.map.zoomToExtent(thematicLayer.maxExtent,false);
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
    var measureFormat = OpenLayers.Number.format(Number(measure.toFixed(2)), null);
    var out = "";
    if (order == 1) {
        out += measureDistanceResultPrefixString[lang] + ": " + measureFormat + units;
    } else {
        out += measureAreaResultPrefixString[lang] + ": " + measureFormat + units;
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
function createPermalink() {
    var visibleLayers = [];
    var permalink;
    var permalinkParams = {};
    //visibleLayers = getVisibleLayers(visibleLayers, layerTree.root.firstChild);
    //visibleLayers = uniqueLayersInLegend(visibleLayers);
    var visibleLayers = thematicLayer.params.LAYERS;
    var visibleBackgroundLayer = getVisibleBackgroundLayer();
    var startExtent = geoExtMap.map.getExtent().toBBOX(1, OpenLayers.Projection.defaults[authid].yx);

    if (!norewrite) {
        var servername = location.href.split(/\/+/)[1];
        permalink = location.protocol + "//" + servername;
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
        //ExtraFInfo.activate();
        if (Eqwc.settings.enableHoverPopup)
            WMSGetFInfoHover.activate();
    } else {
        WMSGetFInfo.deactivate();
        //ExtraFInfo.deactivate();
        if (Eqwc.settings.enableHoverPopup)
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
        width: 300,
        height: 200,
        layout: {
            type: 'vbox',
            align: 'stretch'  // Child items are stretched to full width
        },
        items: [{
            xtype: 'textarea',
            readOnly: true,
            value: permalink,
            selectOnFocus: true,
            flex: 1
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
        data.push(message.replaceAll('\n', '<br>'));
        data.push(" ");
        data.push(I18n.login.user + ': ' + projectData.user);
        data.push('<a href="' + link + '">' + TR.link + '<a/>');
        feedbackWin.hide();
        form.reset();
        sendMail(projectData.userFeedbackMailto, projectData.title + " - " + TR.feedback, data.join('<br>'), silent);
    }
}

function sendMail(to, subject, body, silent, template) {

    var data = {};
    data.mailto = to;
    data.subject = subject;
    data.body = body;
    data.template = '';

    if(template) {
        data.template = template;
    }

    if (Eqwc.settings.mailServiceUrl > '') {

        Ext.Ajax.request({
            url: Eqwc.settings.mailServiceUrl,
            params: data,
            method: 'POST',
            success: function (response) {
                if (!silent) {
                    Ext.Msg.alert(TR.feedbackSuccessTitle, TR.feedbackSuccessMsg);
                }
            },
            failure: function (response) {
                if (!silent) {
                    Ext.Msg.alert(TR.feedbackErrorTitle, TR.feedbackErrorMsg + '<br>' + response.statusText);
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
//TODO Fix this, duplicate declarations, global vars..., have to simplify this and also use it on base and extra layers
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
                        var node = layerTree.root.findChild('id', allLayersWithIDs[j][1], true); //remove css class
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
            var bolGroupOutsideScale = true;
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
        fn: Eqwc.common.redirect
    });
}

function getExternalWMSDefinition(layer) {

    var layerName = layer.id;
    var definition = {};
    var type = layer.params.SERVICE ? layer.params.SERVICE : 'unknown';

    if(Eqwc.settings.qgisVersion && parseInt(Eqwc.settings.qgisVersion)<3) {
        return null;
    }

    if(type=='WMS') {
        definition[layerName+':url']        = layer.url.toLowerCase().replace('https','http');    //QGIS issue with https, assume URL is working also on http
        definition[layerName+':format']     = layer.params.FORMAT;
        definition[layerName+':crs']        = projectData.crs;
        definition[layerName+':layers']     = layer.params.LAYERS;
        definition[layerName+':styles']     = layer.params.STYLES;

        return {name: 'EXTERNAL_WMS:'+layerName, definition: Ext.urlEncode(definition)};
    } else if (layer.print) {
        definition[layerName+':url']        = layer.print.url.toLowerCase().replace('https','http');    //QGIS issue with https, assume URL is working also on http
        definition[layerName+':format']     = layer.print.format;
        definition[layerName+':crs']        = projectData.crs;
        definition[layerName+':layers']     = layer.print.layers;
        definition[layerName+':styles']     = layer.print.styles;

        return {name: 'EXTERNAL_WMS:'+layerName, definition: Ext.urlEncode(definition)};
    }
    return null;
}

function getVisibleExtraLayersForPrint() {
    var ret = [];
    var extraLayers = projectData.extraLayers();
    if(extraLayers==null) {
        return '';
    }
    for (var i=0; i<extraLayers.length; i++) {
        var extra = extraLayers[i];
        var lay = geoExtMap.map.getLayersByName(extra.title)[0];
        if (lay && lay.visibility) {
            if(wmsLoader.layerTitleNameMapping[extra.title]) {
                ret.push({name: wmsLoader.layerTitleNameMapping[extra.title], definition: ''});
            } else {
                var externalWms = getExternalWMSDefinition(lay);
                if(externalWms) {
                    ret.push({name: externalWms.name, definition: externalWms.definition});
                }
            }
        }
    }
    return ret;
}

function layerStyles(layerIds) {
    var styles = [];
    for (var i=0; i<layerIds.length; i++) {
        if(typeof layerIds[i] == 'undefined') {
            continue;
        }
        var layer = wmsLoader.layerProperties[layerIds[i]];
        if(layer && layer.currentStyle > '') {
            styles.push(layer.currentStyle);
        } else {
            if(layer.styles.length==1) {
                styles.push(layer.styles[0].name);
            } else {
                styles.push('default');
            }
        }
    }
    return styles;
}

function addBookmarks() {
    if (Ext.decode(projectData.bookmarks).length == 0) {
        return;
    }

    if (Eqwc.settings.bookmarkPanelHeight == 0) {
        return;
    }

    // shared reader
    var reader = new Ext.data.ArrayReader({}, [
        {name: 'name'},
        {name: 'group'},
        {name: 'extent'},
        {name: 'id'},
        {name: 'crs'}
    ]);

    var store = new Ext.data.GroupingStore({
        reader: reader,
        data: Ext.decode(projectData.bookmarks),
        sortInfo:{field: 'name', direction: "ASC"},
        groupField:'group'
    });

    var grid = new Ext.grid.GridPanel({
        //title: TR.bookmarks,
        store: store,
        columns: [
            {id: 'name', header: TR.bookmarkName, sortable: true, dataIndex: 'name'},
            {
                header: TR.bookmarkGroup,
                hidden: true,
                sortable: true,
                dataIndex: 'group',
                emptyGroupText: TR.bookmarkEmptyGroupText
            }
        ],
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '{text} ({[values.rs.length]})',
            showGroupName: false
        }),
        listeners: {
            rowclick: showBookmark
        }
    });

    var panel = Ext.getCmp('BookmarkPanel');
    panel.setVisible(true);
    panel.add(grid);
    panel.doLayout();
}

function showBookmark(grid, index) {
    var row = grid.getStore().getAt(index);
    var extentWkt = row.data.extent;
    var crs = row.data.crs;
    var wkt = new OpenLayers.Format.WKT;
    var feature = wkt.read(extentWkt);
    feature.geometry.calculateBounds();

    if(crs != projectData.crs) {
        if(OpenLayers.Projection.defaults[crs] == undefined) {
            console.log('Cant transform, missing projection details for: '+crs);
        } else {
            feature.geometry.transform(crs, projectData.crs);
            feature.geometry.calculateBounds();
        }
    }

    geoExtMap.map.zoomToExtent(feature.geometry.bounds);
}