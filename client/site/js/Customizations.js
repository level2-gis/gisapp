// customInit() is called before any map initialization

function customInit() {

}

// called before map initialization
function customBeforeMapInit() {

    if(Eqwc.settings.qgisProjectGroupText > '') {
        layerTree.root.firstChild.setText(Eqwc.settings.qgisProjectGroupText);
    }

    var tablesOnStart = projectData.tablesOnStart();

    //open tables for layers from db setting
    //tabs for this tables cannot be closed and are marked for editing
    //only fields checked as WFS in qgis project
    for (var j=0; j < tablesOnStart.length;j++) {
        var myLayerName = tablesOnStart[j];
        var layerId = wmsLoader.layerTitleNameMapping[myLayerName];

        if (layerId) {
            var editable = projectData.layers[layerId].wfs;
            var layer = new QGIS.SearchPanel({
                useWmsRequest: true,
                queryLayer: myLayerName,
                gridColumns: getLayerAttributes(myLayerName).columns,
                gridLocation: 'bottom',
                gridTitle: myLayerName,
                gridResults: Eqwc.settings.limitAttributeFeatures,
                gridResultsPageSize: 20,
                gridEditable: editable,
                selectionLayer: myLayerName,
                formItems: [],
                doZoomToExtent: true,
                tabClosable: false
            });
            layer.onSubmit();
            //layer.on("featureselected", showFeatureSelected);
            layer.on("featureselectioncleared", clearFeatureSelected);
            layer.on("beforesearchdataloaded", showSearchPanelResults);
        }
    }

}

// called after map initialization
function customAfterMapInit() {

    // Apply permalink styles to layers BEFORE setting initial legends
    if (urlParams.styles) {
        var styles = urlParams.styles.split(",");
        // Get the current visible layers from the thematic layer
        var visibleLayers = [];
        if (thematicLayer && thematicLayer.params && thematicLayer.params.LAYERS) {
            visibleLayers = thematicLayer.params.LAYERS.split(',');
        }
        
        // Apply styles to layer properties before legends are created
        if (visibleLayers.length === styles.length) {
            for (var i = 0; i < visibleLayers.length; i++) {
                var layerId = visibleLayers[i];
                var styleName = styles[i];
                
                if (layerId && styleName && styleName !== 'default' && wmsLoader.layerProperties[layerId]) {
                    var layer = wmsLoader.layerProperties[layerId];
                    // Check if the style exists for this layer
                    var styleExists = layer.styles.some(function(style) {
                        return style.name === styleName;
                    });
                    
                    if (styleExists) {
                        // Set the current style BEFORE legends are created
                        layer.currentStyle = styleName;
                    }
                }
            }
        }
    }

    // Add legend symbols to the toc for initially visible layers
    // Also trigger prepareEdit in case of Editor plugin
    var treeRoot = layerTree.getNodeById("wmsNode");
    treeRoot.firstChild.cascade(
        function (n) {
            if (n.isLeaf()) {
                var layerId = wmsLoader.layerTitleNameMapping[n.text];
                //if (wmsLoader.projectSettings.capability.layerDrawingOrder.indexOf(layerId) >= 0) {
                    var layer = projectData.layers[layerId] == undefined ? {
                        provider: '',
                        layername: layerId
                    } : projectData.layers[layerId];
                    //editor
                    if (layer.wfs && (typeof (prepareEdit) == 'function') && EditorConfig && EditorConfig.autoPrepareAllLayersOnStartup) {
                        prepareEdit(layer);
                    }
                    //get legend for visible layers at startup
                    if (n.attributes.checked) {
                        projectData.setLayerLegend(layer, n);
                    }
                //}
            }
        }
    );
    
    // Update context menu style selections after legends are set
    if (urlParams.styles) {
        var styles = urlParams.styles.split(",");
        var visibleLayers = [];
        if (thematicLayer && thematicLayer.params && thematicLayer.params.LAYERS) {
            visibleLayers = thematicLayer.params.LAYERS.split(',');
        }
        
        // Update context menu style selections
        if (visibleLayers.length === styles.length) {
            for (var i = 0; i < visibleLayers.length; i++) {
                var layerId = visibleLayers[i];
                var styleName = styles[i];
                
                if (layerId && styleName && styleName !== 'default') {
                    // Find the layer node in the tree
                    var layerNode = null;
                    if (layerTree && layerTree.root) {
                        layerTree.root.cascade(function(node) {
                            if (node.isLeaf() && wmsLoader.layerTitleNameMapping[node.text] === layerId) {
                                layerNode = node;
                                return false; // Stop iteration
                            }
                        });
                    }
                    
                    if (layerNode) {
                        updateLayerContextMenuStyle(layerNode, layerId, styleName);
                    }
                }
            }
        }
    }
}

// called at the end of GetMapUrls
function customAfterGetMapUrls() {
}

// called when DOM is ready (Ext.onReady in WebgisInit.js)
function customPostLoading() {
//    Ext.get("panel_header").addClass('sogis-header').insertHtml('beforeEnd', '<div style="float: right; width: 250px;">hello world</div>');
}

// called when starting print
function customBeforePrint() {
    // do something. e.g. rearrange your layers
}

// called when printing is launched
function customAfterPrint() {
    // do something. e.g. rearrange your layers
}


// new buttons for the toolbar
var customButtons = [ 
   
//    // Add a separator and a button
//    {
//      xtype: 'tbseparator'
//    }, {
//      xtype: 'button',
//      enableToggle: true,
//      allowDepress: true,
//      toggleGroup: 'mapTools',
//      scale: 'medium',
//      icon: 'gis_icons/test.gif',
//      tooltipType: 'qtip',
//      tooltip: "Test button - click on the map",
//      id: 'TESTBUTTON'
//    }
];

// code to add buttons in the toolbar
function customToolbarLoad() {
//     // Handle the button click
//     Ext.getCmp('TESTBUTTON').toggleHandler = mapToolbarHandler;

    //load toolbar for each plugin
    function load(key) {
        this[key].customToolbarLoad();
    }

    Ext.iterate(Eqwc.plugins, load, Eqwc.plugins);
}

// called when an event on toolbar is invoked
function customMapToolbarHandler(btn, evt) {
//     // Check if the button is pressed or unpressed
//     if (btn.id == "TESTBUTTON") {
//         if (btn.pressed) {
//              alert ( "You clicked on Test Button!" );
//              openlayersClickEvent.activate();
//         }
//         else
//         {
//              alert ( "TEST button is toggled up!" );
//              openlayersClickEvent.deactivate();
//         }
//     }
}

// called when the user clicks on a check in layerTree.
// n is a Ext.TreeNode object
function customActionLayerTreeCheck(n) {
    if (n.isLeaf()) {

        var layerId = wmsLoader.layerTitleNameMapping[n.text];

        if (wmsLoader.projectSettings.capability.layerDrawingOrder.indexOf(layerId)==-1) {
            return;
        }

        //check if we have to enable/disable layer vector data
        if (typeof activatedEditors == 'object') {
            var layerEditor = activatedEditors[layerId];
        }

        if (n.attributes.checked) {
            if (layerEditor != undefined) {
                if (editor.editMode) {
                    layerEditor.editLayer.setVisibility(n.attributes.checked);
                }
                //layerEditor.attributesForm.drawControl.setVisibleLabelLayers(n.attributes.checked && projectData.visibleEditLabels);
            }

            var toAdd = Ext.get("legend_"+layerId);
            if (toAdd) {
                toAdd.show();
            } else {
                var layer = projectData.layers[layerId] == undefined ? {provider: '', layername: layerId} : projectData.layers[layerId];
                projectData.setLayerLegend(layer,n);
            }
        } else {
            if (layerEditor != undefined) {
                    layerEditor.editLayer.setVisibility(n.attributes.checked);
            }

            var toRemove = Ext.get("legend_"+layerId);
            if (toRemove) {
                toRemove.hide();
                
                // Close any expanded legend_long containers when layer is turned off
                var expandedLegend = Ext.get('legend_expanded_' + layerId);
                if (expandedLegend) {
                    expandedLegend.setDisplayed(false);
                    // Reset arrow to collapsed state
                    var toggleArrow = toRemove.query('.legend-toggle')[0];
                    if (toggleArrow) {
                        toggleArrow.innerHTML = '▶';
                    }
                }
            }

        }
    }
}


// called when the user zooms.
function customActionOnZoomEvent() {
	// NOTE: if you define customActionOnMoveEvent() (see below)
	// that function is called during zooms, too!

	// ... action to do on call
}

// called after a drag, pan, or zoom completed
function customActionOnMoveEvent() {
	// ... action to do on call
    var btm = Ext.getCmp('BottomPanel');
    var tab = btm.getActiveTab();
    if(tab == null) {
        return;
    }
    if(tab.panel.useBbox) {
        tab.panel.onSubmit();
    }
}
