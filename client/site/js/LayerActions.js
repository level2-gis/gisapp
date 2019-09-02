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
    var hasGeom = true;

    if(projDataLayer && projDataLayer.geom_type == 'No geometry') {
        hasGeom = false;
    }

    var menuItems = [];
    //all get zoom to extent, except tables
    if(hasGeom) {
        menuItems.push({
            text: contextZoomLayerExtent[lang],
            iconCls: 'x-zoom-icon',
            handler: zoomToLayerExtent
        });
    }

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
        if(hasGeom && Eqwc.settings.vectorExportFormats && Eqwc.settings.vectorExportFormats.length>0) {
            menuItems.push({
                itemId: 'contextExport',
                text: contextDataExport[lang],
                iconCls: 'x-export-icon',
                handler: exportHandler
            });
        } else if (!hasGeom && Eqwc.settings.tableExportFormats && Eqwc.settings.tableExportFormats.length>0) {
            menuItems.push({
                itemId: 'contextExport',
                text: contextDataExport[lang],
                iconCls: 'x-export-icon',
                handler: exportTableHandler
            });
        }
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

function exportWindowHandler(btn) {
    var win = Ext.getCmp('exportWindow');
    var id = btn.itemId;
    if(id == 'cancel') {
        win.close();
        win.destroy();
    } else {
        var fieldValues = win.items.item(0).getForm().getFieldValues(); //layer, format, crs
        var values = win.items.item(0).getForm().getValues();   //extent
        var exportExtent = values.extent == 'map' ? true : false;

        //validate stuff before export
        var myLayerName = fieldValues.layer;
        var layerId = wmsLoader.layerTitleNameMapping[myLayerName];
        var myFormat = fieldValues.format;

        if(myFormat == 'KOF') {
            var layer = projectData.layers[layerId];
            if(layer.provider != 'postgres') {
                Ext.Msg.alert('Error','Provider: '+layer.provider + ' not supported!');
                return false;
            }
        } else {
            myLayerName = Eqwc.common.getIdentifyLayerName(layerId);
        }

        exportData(myLayerName, myFormat, exportExtent, fieldValues.crs);

        win.close();
        win.destroy();
    }
}

function exportTableHandler(item) {
    var myLayerName = layerTree.getSelectionModel().getSelectedNode().text;
    var hasGeom = false;

    var exportWin = getExportWin(myLayerName, hasGeom);
    exportWin.show();
}

function exportHandler(item) {
    var myLayerName = layerTree.getSelectionModel().getSelectedNode().text;
    var hasGeom = true;
    //var myFormat = item.container.menuItemId;

    var exportWin = getExportWin(myLayerName, hasGeom);
    exportWin.show();
    //var exportExtent = item.ownerCt.getComponent('currentExtent') ? item.ownerCt.getComponent('currentExtent').checked : false;
    //var useMapCrs = item.ownerCt.getComponent('useMapCRS');
    //var crs = (useMapCrs && useMapCrs.checked) ? Eqwc.currentMapProjection[0] : projectData.layers[layerId].crs;

    //exportData(exportLayer, myFormat, exportExtent, crs);
}

function getExportWin(layer, geom) {

    var formatCombo = new Ext.form.ComboBox({
        xtype: 'combo',
        hideLabel: false,
        editable: false,
        mode: 'local',
        triggerAction: 'all',
        width: '100%',
        name: 'format',
        fieldLabel: TR.exportFormat,
        valueField: 'code',
        displayField: 'description',
        store: {
            xtype: 'arraystore',
            // store configs
            autoDestroy: true,
            storeId: 'crsStore',
            // reader configs
            idIndex: 0,
            fields: [{
                name: 'code', mapping: 0
            }, {
                name: 'description', mapping: 1
            }]
        }
    });
    formatCombo.store.on("load", function () {
        formatCombo.setValue(this.data.itemAt(0).data.code);
    });

    if (geom) {
        var crsCombo = formatCombo.cloneConfig({fieldLabel: TR.exportCrs, name: 'crs'});
        //set crs values
        crsCombo.store.on("load", function () {
            crsCombo.setValue(Eqwc.currentMapProjection[0]);
        });
        crsCombo.store.loadData(projectData.crsComboStore());
        formatCombo.store.loadData(Eqwc.settings.vectorExportFormats);

        var items = [
            {
                xtype: 'displayfield',
                fieldLabel: TR.exportLayer,
                name: 'layer',
                value: layer,
                inputValue: layer
            },
            formatCombo,
            crsCombo,
            {
                xtype: 'radiogroup',
                allowBlank: false,
                fieldLabel: TR.exportExtent,
                name: 'extent_group',
                border: false,
                itemCls: 'x-check-group-alt',
                columns: 1,
                vertical: true,
                submitValue: false,
                items: [{
                    boxLabel: contextUseExtent[lang],
                    inputValue: 'map',
                    name: 'extent',
                    checked: true
                },{
                    boxLabel: TR.exportLayerExtent,
                    inputValue: 'layer',
                    name: 'extent'
                }]
            }
        ];
    } else {
        formatCombo.store.loadData(Eqwc.settings.tableExportFormats);

        var items = [
            {
                xtype: 'displayfield',
                fieldLabel: TR.exportLayer,
                name: 'layer',
                value: layer,
                inputValue: layer
            },
            formatCombo
        ];
    }

    return new Ext.Window({
        id: 'exportWindow',
        title: TR.exportData+'...',
        width: 350,
        renderTo: "geoExtMapPanel",
        resizable: false,
        closable: false,
        items: [{
            xtype: 'form',
            padding: '3',
            items: items
        }],
            buttons: [{
                itemId: 'ok',
                text: Ext.MessageBox.buttonText.ok,
                handler: exportWindowHandler
            }, {
                itemId: 'cancel',
                text: Ext.MessageBox.buttonText.cancel,
                handler: exportWindowHandler
            }]

    });

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

        var extent = OpenLayers.Bounds.fromArray([bbox.minx, bbox.miny, bbox.maxx, bbox.maxy]);

        //duplicate code from QGISExtensions (QGIS.SearchComboBox)
        //make sure that map extent is not too small for point data
        //need to improve this for units other than "m", e.g. degrees

        var extWidth = extent.getWidth();
        var extHeight = extent.getHeight();
        if (extWidth < 50) {
            var centerX = extent.left + extWidth * 0.5;
            extent.left = centerX - 25;
            extent.right = centerX + 25;
        }
        else {
            extent.left -= extWidth * 0.05;
            extent.right += extWidth * 0.05;
        }
        if (extHeight < 50) {
            var centerY = extent.bottom + extHeight * 0.5;
            extent.bottom = centerY - 25;
            extent.top = centerY + 25;
        }
        else {
            extent.bottom -= extHeight = 0.05;
            extent.top += extHeight = 0.05;
        }
        record.data.bbox = extent;
    }

    showRecordSelected(record.data);
}

function showRecordSelected(args) {

        //var layer = args["layer"] == null ? args["fid"].split('.')[0] : args["layer"];
        //var layerId = wmsLoader.layerTitleNameMapping[layer];

        // select feature in layer
        //this is yellow selection, problem is that we get double request to server, one for selection + another to zoom mao
        //currently disabled
        //thematicLayer.mergeNewParams({
        //    "SELECTION": layerId + ":" + args["id"]
        //});

        if (args["doZoomToExtent"]) {
            geoExtMap.map.zoomToExtent(args["bbox"]);
        }
        else {
            geoExtMap.map.setCenter(new OpenLayers.LonLat(args["x"], args["y"]), args["zoom"]);
        }
}

function exportData(layername,format, useBbox, crs) {

    function joinObj(obj, attr) {
        var out = [];
        for (var i=0; i<obj.length; i++) {
            out.push(obj[i][attr]);
        }
        return out.join(",");
    }


    var layerId = wmsLoader.layerTitleNameMapping[layername];
    var layerCrs = projectData.layers[layerId].crs;
    var layerFields = layerId.indexOf("_view")>-1 ? "" : joinObj(wmsLoader.layerProperties[layerId].attributes,'name'); //workaround for ogr issue when selecting field names with specific language characters. In case of view export all fields

    var exportUrl = "./admin/export.php?";

    //var mapCrsBbox = null;
    var layCrsBbox = null;
    //current view is used as bounding box for exporting data
    if (useBbox) {
        //mapCrsBbox = geoExtMap.map.calculateBounds(); //.transform(authid,layerCrs);
        layCrsBbox = geoExtMap.map.calculateBounds().transform(authid, layerCrs);
    }
    //Ext.Msg.alert('Info',layer+' ' + bbox);

    if(format == 'KOF') {

        layerFields = [];

        var def = Eqwc.settings.vectorExportFormats.find(function(item) {if(item[0] == 'KOF') {return item;}});
        var zField = 'use_geom';

        if (def.length == 3) {
            if (Eqwc.common.layerFieldNameExists(layerId, def[2].name)) {
                layerFields.push(def[2].name);
            } else {
                layerFields.push(projectData.layers[layerId].key);
            }
            if (Eqwc.common.layerFieldNameExists(layerId, def[2].code)) {
                layerFields.push(def[2].code);
            }
            if (Eqwc.common.layerFieldNameExists(layerId, def[2].h)) {
                zField = def[2].h;
            }
        }

        exportUrl = "./admin/text_export.php?";
        exportUrl+= Ext.urlEncode({
            map: projectData.project,
            SRS: crs,
            layer_extent: layCrsBbox,
            layer: layername,
            fields: layerFields.join(','),
            z: zField,
            format: format
        })

    } else {

        exportUrl += Ext.urlEncode({
            map: projectData.project,
            SRS: crs,
            //map0_extent: mapCrsBbox,
            layer_extent: layCrsBbox,
            layer: layername,
            fields: layerFields,
            format: format
        });
    }

    Ext.Ajax.request({
        url: exportUrl,
        disableCaching: false,
        params: {
            cmd: 'prepare'
        },
        method: 'GET',
        success: function (response) {

            var result = Ext.util.JSON.decode(response.responseText);

            if (result.success) {
                var key = result.message;

                window.location = exportUrl + "&cmd=get&key=" + key;

                //var body = Ext.getBody();
                //var frame = body.createChild({
                //    tag: 'iframe',
                //    cls: 'x-hidden',
                //    id: 'hiddenform-iframe',
                //    name: 'iframe',
                //    src: exportUrl + "&cmd=get&key=" + key
                //});
            }
            else {
                Ext.Msg.alert("Error", result.message);
            }
        },
        //this doesn't fire, why?
        failure: function (response, opts) {
            Ext.Msg.alert('Error', 'server-side failure with status code ' + response.status);
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
    var hasGeom = true;

    var layer = projectData.layers[layerId];
    if(layer && layer.geom_type == 'No geometry') {
        hasGeom = false;
    }

    var m = this.parentMenu.getComponent('mapFilter');
    if (m) {
        filter = m.getFilter();
    }

    var name = myLayerName;// + filter;¸
    var btm = Ext.getCmp('BottomPanel');
    var table = Ext.getCmp('table_' + name);
    if (table == undefined) {

        layer = new QGIS.SearchPanel({
            hasGeom: hasGeom,
            useWmsRequest: true,
            useBbox: (Eqwc.settings.syncAttributeTableWithView && hasGeom) ? Eqwc.settings.syncAttributeTableWithView : false,
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

function switchBbox(btn,state) {
    var grid = this;
    grid.useBbox = state;
    grid.onSubmit(true);
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

        if (fieldType.indexOf('DateTime')>-1) {
            fieldType = 'time';
        } else if (fieldType.indexOf('Date')>-1) {
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
            ret.columns[i].format = 'Y-m-d';
        }

        if(fieldType=='time') {
            ret.columns[i].xtype = 'datecolumn';
            ret.columns[i].format = 'Y-m-d H:i:s';
        }

        if(fieldType=='boolean') {
            ret.columns[i].xtype = 'booleancolumn';
            ret.columns[i].falseText = '-';
            ret.columns[i].trueText = Ext.MessageBox.buttonText.yes;
        }
    }

    var actionColumn = getActionColumns(sourceLayerId);
    if(actionColumn!=null) {
        ret.columns.unshift(actionColumn);
    }

    ret.columns.unshift(new Ext.ux.grid.RowNumberer({width: 32}));

    return ret;
}

function getActionColumns(layerId) {

    var lay = projectData.layers[layerId];

    if(lay && lay.geom_type == 'No geometry') {
        return null;
    }

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