/*
 *
 * LayerActions.js -- part of Extended QGIS Web Client
 *
 * Copyright (2010-2015), The QGIS Project and Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 *
 */

/* global projectData */

function buildGroupContextMenu(node) {

    var menuItems = [];
    //all get zoom to extent
    menuItems.push({
        text: contextZoomLayerExtent[lang],
        iconCls: 'x-zoom-icon',
        handler: zoomToLayerExtent
    });

    //properties
    menuItems.push({
        text: TR.properties,
        //iconCls: 'x-table-icon',
        handler: layerProperties
    });

    var menuCfg = {
        //id: 'layerContextMenu',
        items: menuItems
    };

    node.menu = new Ext.menu.Menu(menuCfg);
}


function buildLayerContextMenu(node) {

    var layerId = wmsLoader.layerTitleNameMapping[node.attributes.text];
    var layer = wmsLoader.layerProperties[layerId];
    var projDataLayer = projectData.layers[layerId];

    var menuItems = [];
    //all get zoom to extent
    menuItems.push({
        text: contextZoomLayerExtent[lang],
        iconCls: 'x-zoom-icon',
        handler: zoomToLayerExtent
    });

    //Open att table
    if (layer.queryable && typeof(layer.attributes) !== 'undefined') {
        menuItems.push({
            //itemId: 'contextOpenTable',
            text: contextOpenTable[lang],
            iconCls: 'x-table-icon',
            handler: openAttTable
        });
    }

    //Export
    if (projDataLayer != undefined && projDataLayer.provider !== 'gdal' && projDataLayer.provider !== 'wms') {
        menuItems.push({
            itemId: 'contextExport',
            text: contextDataExport[lang],
            iconCls: 'x-export-icon',
            menu: [{
                itemId: 'SHP',
                text: 'ESRI Shapefile',
                handler: exportHandler
            }, {
                itemId: 'DXF',
                text: 'AutoCAD DXF',
                handler: exportHandler
            }, {
                itemId: 'XLSX',
                text: 'MS Office Open XLSX',
                handler: exportHandler
            }, {
                itemId: 'CSV',
                text: 'Text CSV',
                handler: exportHandler
            },{
                itemId: 'KML',
                text: 'Keyhole Markup Language KML',
                handler: exportHandler
            },{
                itemId: 'GeoJSON',
                text: 'GeoJSON',
                handler: exportHandler
            }
                , "-",
                {
                    itemId: 'currentExtent',
                    text: contextUseExtent[lang],
                    checked: true,
                    hideOnClick: false
                }]
        });
    }

    //properties
    menuItems.push({
        text: TR.properties,
        //iconCls: 'x-table-icon',
        handler: layerProperties
    });

    var menuCfg = {
        //id: 'layerContextMenu',
        items: menuItems
    };

    //storefilter
    var filter=[];

    // add same specific menus if exists
    //TODO needs refactoring, different structure in json
    //if(projectData.layerSpecifics != null) {
    //    var layerSpecifics = projectData.layerSpecifics;
    //    var j = 0;
    //    for (var i = 0; i < layerSpecifics.storedFilters.length; i++) {
    //        if (layerSpecifics.storedFilters[i].layer == node.text) {
    //            j++;
    //            if (j == 1) {
    //                menuCfg.items.push({
    //                    itemId: "mapFilter",
    //                    text: layerSpecifics.storedFilters[i].menuTitle,
    //                    checked: false,
    //                    hideOnClick: true,
    //                    menu: [],
    //                    getFilter: function(){
    //                        var value=null;
    //                        this.menu.cascade(function(i){ if(i.checked){
    //                            value=i.value;
    //                        } });
    //                        return value;
    //                    },
    //                    listeners: {
    //                        checkchange: function() {
    //                            if(!this.checked) {
    //                                thematicLayer.params["FILTER"] = "";
    //                                thematicLayer.redraw();
    //                                this.menu.cascade(function(item) {
    //                                    if (item.checked) {
    //                                        item.setChecked(false);
    //                                    }
    //                                })
    //                            }
    //                            var t = Ext.getCmp('table_'+node.text);
    //                            if(typeof t == 'object') {
    //                                t.destroy();
    //                            }
    //                        }
    //                    }
    //
    //                });
    //            }
    //            menuCfg.items[menuCfg.items.length - 1].menu.push({
    //                itemId: 'storedFilter_' + j,
    //                text: layerSpecifics.storedFilters[i].title,
    //                value: layerSpecifics.storedFilters[i].filterValue,
    //                checked: false,
    //                group: "storedFilters",
    //                handler: applyWMSFilter,
    //                listeners: {
    //                    checkchange: function() {
    //                        if(this.checked) {
    //                            var m = this.parentMenu.parentMenu.getComponent('mapFilter');
    //                            m.setChecked(true);
    //                        }
    //                        var t = Ext.getCmp('table_'+node.text);
    //                        if(typeof t == 'object') {
    //                            t.destroy();
    //                        }
    //                    }
    //                }
    //            });
    //
    //            filter.push({
    //                text: layerSpecifics.storedFilters[i].title,
    //                value: layerSpecifics.storedFilters[i].filterValue
    //            });
    //        }
    //    }
    //}
    node.menu = new Ext.menu.Menu(menuCfg);
    node.filter = filter;
}

function zoomToLayerExtent(item) {
    var myLayerName = layerTree.getSelectionModel().getSelectedNode().text;
    var layerId = wmsLoader.layerTitleNameMapping[myLayerName];
    var bbox = new OpenLayers.Bounds(wmsLoader.layerProperties[layerId].bbox).transform('EPSG:4326', geoExtMap.map.projection);
    geoExtMap.map.zoomToExtent(bbox);
}

function exportHandler(item) {
    var myLayerName = layerTree.getSelectionModel().getSelectedNode().text;
    var layerId = wmsLoader.layerTitleNameMapping[myLayerName];
    var exportLayer = Eqwc.common.getIdentifyLayerName(layerId);
    var myFormat = item.container.menuItemId;

    var exportExtent = item.ownerCt.getComponent('currentExtent');

    exportData(exportLayer, myFormat, exportExtent.checked);
}

function layerProperties(item) {
    var myLayerName = layerTree.getSelectionModel().getSelectedNode().text;
    showLegendAndMetadata(myLayerName);
}

// Show the menu on right click of the leaf node of the layerTree object
function contextMenuHandler(node) {

    //var layerId = wmsLoader.layerTitleNameMapping[node.attributes.text];
    //var layer = wmsLoader.layerProperties[layerId];
    //
    //disable export for guest users
    var exportMenu = node.menu.getComponent('contextExport');
    if (exportMenu != undefined) {
        if (projectData.user == 'guest')
            exportMenu.setDisabled(true);
        else
            exportMenu.setDisabled(false);
    }

    node.select();
    node.menu.show ( node.ui.getAnchor());
}

function zoomHandler(grid, rowIndex, colIndex, item, e) {
    var store = grid.getStore();
    var record = store.getAt(rowIndex);
    var recId = record.id;
    var selectedLayer = grid.itemId;

    grid.getSelectionModel().selectRow(rowIndex);

    //add fields as it would be from search results
    record.data.layer = selectedLayer;
    record.data.doZoomToExtent = true;
    record.data.id= recId;

    //fix bbox
    var bbox = record.data.bbox;
    if(!(record.data.bbox instanceof OpenLayers.Bounds)) {
        record.data.bbox = OpenLayers.Bounds.fromArray([bbox.minx, bbox.miny, bbox.maxx, bbox.maxy]);
    }

    showRecordSelected(record.data);
}

function showRecordSelected(args) {

        var layer = args["layer"] == null ? args["fid"].split('.')[0] : args["layer"];
        var layerId = wmsLoader.layerTitleNameMapping[layer];

        // select feature in layer
        thematicLayer.mergeNewParams({
            "SELECTION": layerId + ":" + args["id"]
        });

        if (args["doZoomToExtent"]) {
            geoExtMap.map.zoomToExtent(args["bbox"]);
        }
        else {
            geoExtMap.map.setCenter(new OpenLayers.LonLat(args["x"], args["y"]), args["zoom"]);
        }
}

function exportData(layername,format, useBbox) {

    function joinObj(obj, attr) {
        var out = [];
        for (var i=0; i<obj.length; i++) {
            out.push(obj[i][attr]);
        }
        return out.join(",");
    }


    var layerId = wmsLoader.layerTitleNameMapping[layername];
    var layerCrs = projectData.layers[layerId].crs;
    var layerFields = joinObj(wmsLoader.layerProperties[layerId].attributes,'name');
    var mapCrsBbox = null;
    var layCrsBbox = null;
    //current view is used as bounding box for exporting data
    if (useBbox) {
        mapCrsBbox = geoExtMap.map.calculateBounds(); //.transform(authid,layerCrs);
        layCrsBbox = geoExtMap.map.calculateBounds().transform(authid,layerCrs);
    }
    //Ext.Msg.alert('Info',layer+' ' + bbox);

    var exportUrl = "./admin/export.php?" + Ext.urlEncode({
            map:projectData.project,
            SRS:authid,
            map0_extent:mapCrsBbox,
            layer_extent:layCrsBbox,
            layer:layername,
            fields: layerId.indexOf("_view")>-1 ? "" : layerFields,     //workaround for ogr issue when selecting field names with specific language characters. In case of view export all fields
            format:format
        });

    Ext.Ajax.request({
        url: exportUrl,
        disableCaching : false,
        params: {
          cmd: 'prepare'
        },
        method: 'GET',
        success: function (response) {

            var result = Ext.util.JSON.decode(response.responseText);

            if(result.success) {
                var key = result.message;
                var body = Ext.getBody();
                var frame = body.createChild({
                    tag: 'iframe',
                    cls: 'x-hidden',
                    id: 'hiddenform-iframe',
                    name: 'iframe',
                    src: exportUrl + "&cmd=get&key="+key
                });
            }
            else {
                Ext.Msg.alert("Error",result.message);
            }
        },
        //this doesn't fire, why?
        failure: function(response, opts) {
            Ext.Msg.alert('Error','server-side failure with status code ' + response.status);
        }
    });



}

function openAttTable() {
    var node = layerTree.getSelectionModel().getSelectedNode();
    var myLayerName = node.text;
    var layerId = wmsLoader.layerTitleNameMapping[myLayerName];
    var myQueryLayerName = Eqwc.common.getIdentifyLayerName(layerId);
    var editable = projectData.use_ids ? projectData.layers[layerId].wfs : false;
    var filter = null;
    var layer = null;

    var m = this.parentMenu.getComponent('mapFilter');
    if (m) {
        filter = m.getFilter();
    }

    var name = myLayerName;// + filter;¸
    var btm = Ext.getCmp('BottomPanel');
    var table = Ext.getCmp('table_' + name);
    if (table == undefined) {

        layer = new QGIS.SearchPanel({
            useWmsRequest: true,
            wmsFilter: filter,
            queryLayer: myQueryLayerName,
            gridColumns: getLayerAttributes(myQueryLayerName).columns,
            gridLocation: 'bottom',
            gridEditable: editable,
            gridTitle: name,
            gridResults: Eqwc.settings.limitAttributeFeatures,
            gridResultsPageSize: 20,
            selectionLayer: myLayerName,
            formItems: [],
            doZoomToExtent: true
        });

        //Ext.getCmp('BottomPanel').setTitle(layer.gridTitle,'x-cols-icon');
        //Ext.get('BottomPanel').setStyle('padding-top', '2px');

        layer.onSubmit();

        //layer.on("featureselected", showFeatureSelected);
        layer.on("featureselectioncleared", clearFeatureSelected);
        layer.on("beforesearchdataloaded", showSearchPanelResults);
    }
    else {
        btm.activate(table);
        // Make sure it's shown and expanded
        btm.show();
        btm.collapsible && btm.expand();
    }
}

function clearTableSelection() {
    var selmod = this.ownerCt.ownerCt.getSelectionModel();
    selmod.clearSelections();

    //clears selection in map
    clearFeatureSelected();
}

function loadMore() {
    var grid = this;
    grid.gridResults = grid.gridResults*2;
    grid.onSubmit();
}

function applyWMSFilter(item) {
    var idx = item.itemId.split('_')[1]-1;
    var node = layerTree.getSelectionModel().getSelectedNode();
    var filter = node.filter[idx].value;

    thematicLayer.params["FILTER"] = node.text+":"+filter;
    thematicLayer.redraw();

}

/**
 *
 * @param layer
 * @returns {{}}
 */
function getLayerAttributes(layer) {

    var layerId = wmsLoader.layerTitleNameMapping[layer];
    var sourceLayerId = wmsLoader.layerTitleNameMapping[Eqwc.common.getIdentifyLayerNameRevert(layer)];
    var ret = {};
    ret.columns = [];
    //ret.fields = [];

    for (var i=0;i<wmsLoader.layerProperties[layerId].attributes.length;i++) {
        ret.columns[i] = {};
        //ret.fields[i] = {};
        var attribute = wmsLoader.layerProperties[layerId].attributes[i];
        var fieldType = attribute.type;
        var editType = attribute.editType;

        //boolean is type QString, to correct this we look at editType
        if (editType == 'CheckBox') {
            fieldType='boolean';
        }

        if (fieldType == 'QDateTime') {
            fieldType = 'date';
        }

        //if(fieldType=='int' || fieldType=='date' || fieldType=='boolean') {
        //    ret.fields.push({name: attribute.name,type:fieldType});
        //}
        //else {
        //    if (fieldType == 'double') {
        //        ret.fields.push({name: attribute.name, type: 'float'});
        //    } else {
        //        ret.fields.push({name: attribute.name, type: 'string'});
        //    }
        //}

        ret.columns[i].header = attribute.alias == null ? attribute.name : attribute.alias;
        ret.columns[i].dataIndex = attribute.name;
        ret.columns[i].menuDisabled = false;
        ret.columns[i].sortable = true;
        ret.columns[i].filterable = true;
        ret.columns[i].renderer = function(value) {
            if (this.dataIndex == 'files') {
                if (value>'') {
                    var attArr = Ext.util.JSON.decode(value);
                    var newArr = [];
                    Ext.each(attArr, function (item, index, array) {
                        var val = this;
                        val.push(Eqwc.common.manageFile(item, false));
                    }, newArr);
                    value = newArr.join(', ');
                }
                return value;
            } else {
                return Eqwc.common.createHyperlink(value, null, mediaurl);
            }
        };

        if(fieldType=='double') {
            ret.columns[i].xtype = 'numbercolumn';
            ret.columns[i].format = '0.000,00/i';
            ret.columns[i].align = 'right';
            //no effect
            //ret[i].style = 'text-align:left'
        }
        if(fieldType=='int') {
            ret.columns[i].xtype = 'numbercolumn';
            ret.columns[i].format = '000';
            ret.columns[i].align = 'right';
        }

        if(fieldType=='date') {
            ret.columns[i].xtype = 'datecolumn';
            ret.columns[i].format = 'Y-m-d H:i:s';

        }

        //if(fieldType=='boolean') {
        //    ret.columns[i].xtype = 'booleancolumn';
        //    //ret.columns[i].falseText = 'f';
        //    //ret.columns[i].trueText = 't';
        //}
    }

    var actionColumn = getActionColumns(sourceLayerId);
    if(actionColumn!=null) {
        ret.columns.unshift(actionColumn);
    }

    ret.columns.unshift(new Ext.ux.grid.RowNumberer({width: 32}));

    return ret;
}

function getActionColumns(layerId) {

    var action = new Ext.grid.ActionColumn({
        width: 22,
        items: [{
            icon: iconDirectory + "contextmenu/zoom.png",
            tooltip: TR.show,
            disabled: false,
            handler: zoomHandler
        }]
    });

    return action;
}