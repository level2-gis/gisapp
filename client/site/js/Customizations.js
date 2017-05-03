// customInit() is called before any map initialization

function customInit() {

}

// called before map initialization
function customBeforeMapInit() {

    var tablesOnStart = projectData.tablesOnStart();

    //open tables for layers from db setting
    //tabs for this tables cannot be closed and are marked for editing
    //only fields checked as WFS in qgis project
    for (var j=0; j < tablesOnStart.length;j++) {
        var myLayerName = tablesOnStart[j];
        var layerId = wmsLoader.layerTitleNameMapping[myLayerName];
        var editable = projectData.layers[layerId].wfs;

        if (wmsLoader.projectSettings.capability.layerDrawingOrder.indexOf(layerId)>=0) {
            var layer = new QGIS.SearchPanel({
                useWmsRequest: true,
                queryLayer: myLayerName,
                gridColumns: getLayerAttributes(myLayerName).columns,
                gridLocation: 'bottom',
                gridTitle: myLayerName,
                gridResults: 2000,
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

    // Add legend symbols to the toc
    var treeRoot = layerTree.getNodeById("wmsNode");
    treeRoot.firstChild.cascade(
        function (n) {
            if (n.isLeaf()) {
                if (n.attributes.checked) {
                    var layerId = wmsLoader.layerTitleNameMapping[n.text];
                    var layer = projectData.layers[layerId] == undefined ? {provider: '', layername: layerId} : projectData.layers[layerId];
                    var legendUrl = projectData.getLegendUrl(layer);
                    Ext.DomHelper.insertAfter(n.getUI().getAnchor(),
                        "<div id='legend_"+n.text.replace(" ", "-")+"'><img style='vertical-align: middle; margin-left: 50px' src=\""+legendUrl+"\"/></div>"
                    );
                }

            }
        }
    );
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
        if (n.attributes.checked) {
            var toAdd = Ext.get ( "legend_"+n.text.replace(" ", "-") );
            if (toAdd) {
            } else {
                var layerId = wmsLoader.layerTitleNameMapping[n.text];
                var layer = projectData.layers[layerId];
                var legendUrl = projectData.getLegendUrl(layer);

                Ext.DomHelper.insertAfter(n.getUI().getAnchor(),
                    "<div id='legend_"+n.text.replace(" ", "-")+"'><img style='vertical-align: middle; margin-left: 50px' src=\""+legendUrl+"\"/></div>"
                );
            }
        } else {
            var toRemove = Ext.get ( "legend_"+n.text.replace(" ", "-") );
            if (toRemove) {
                toRemove.remove();
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
}
