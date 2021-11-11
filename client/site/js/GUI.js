/*
 *
 * GUI.js -- part of QGIS Web Client
 *
 * Copyright (2010-2012), The QGIS Project All rights reserved.
 * QGIS Web Client is released under a BSD license. Please see
 * https://github.com/qgis/qgis-web-client/blob/master/README
 * for the full text of the license and the list of contributors.
 *
*/ 

//this file contains the main gui definition (viewport) as edited through extjs designer
//source file for ext designer
//ext data store for combobox for selection of object identification modes (only active layer, all layers, top most hit)
objectIdentificationModes = Ext.extend(Ext.data.JsonStore, {
	constructor: function (cfg) {
		cfg = cfg || {};
		objectIdentificationModes.superclass.constructor.call(this, Ext.apply({
			storeId: 'objIdentificationModes',
			autoLoad: true,
			data: {
				"modes": [{
					"name": objectIdentificationModeString["topMostHit"][lang],
					"value": "topMostHit"
				}, {
					"name": objectIdentificationModeString["allLayers"][lang],
					"value": "allLayers"
				}, {
					"name": objectIdentificationModeString["activeLayers"][lang],
					"value": "activeLayers"
				}]
			},
			root: 'modes',
			fields: [{
				name: 'name',
				type: 'string',
				allowBlank: false
			}, {
				name: 'value',
				type: 'string',
				allowBlank: false
			}]
		}, cfg));
	}
});
new objectIdentificationModes();

//definition of main GUI
var layoutHeaderCfg = {
	tag: 'div',
	cls: 'x-panel-header',
	id: 'panel_header',
	children: [
		{
			tag: 'div',
			id: 'panel_header_link',
			html: '<a></a>'
		},
		{
			tag: 'div',
			id: 'panel_header_title',
			html: '',
            style: {
                cursor: 'default'
            }
		},
		{
			tag: 'div',
			id: 'panel_header_terms_of_use',
			html: '<a></a>'
		},
		{
			tag: 'div',
			id: 'panel_header_user',
            html: Eqwc.settings.useGisPortal ? '<a href="' + Eqwc.settings.gisPortalProfile + '"><img height="' + headerLogoHeight + 'px" src="' + userLogoImg + '"></img></a>' : '<img height="' + headerLogoHeight + 'px" src="' + userLogoImg + '"></img>'
		}		
	]
};
if (headerLogoImg != null) {
	// NOTE: header height must be fixed on creation or layout will not match
	layoutHeaderCfg['style'] = 'height: ' + headerLogoHeight + 'px;';
}


/*
 * The main application viewport.
 *
 * It contains the following regions:
 *
 *  +++++++++++++++++++++++++++++++++++
 *  +           toolbar               +
 *  +++++++++++++++++++++++++++++++++++
 *  +       +                +        +
 *  + Left  + CenterPanel    + Right  +
 *  + Panel +                + Panel  +
 *  +       +                +        +
 *  +++++++++++++++++++++++++++++++++++
 *  +         BottomPanel             +
 *  +++++++++++++++++++++++++++++++++++
 *
 * Right and Bottom panel are hidden by default but can be enabled on
 * request, see an example in Customizations.js: function
 * customAfterMapInit()
 * 
 */
MyViewportUi = Ext.extend(Ext.Viewport, {
	layout: 'fit',
	initComponent: function () {
		this.items = [{
			xtype: 'panel',
			layout: 'border',
			id: 'GisBrowserPanel',
			headerCfg: layoutHeaderCfg,
			items: [{
				xtype: 'panel',
				margins: '3 0 3 3',
				cmargins: '3 3 3 3',
				title: leftPanelTitleString[lang],
				height: 333,
				width: 250,
				collapsible: true,
				boxMinWidth: 200,
				boxMaxWidth: 400,
				layout: 'vbox',
				region: 'west',
				//floatable: false,
				minWidth: 200,
				maxWidth: 400,
				split: true,
				//collapseMode: 'mini',
				id: 'LeftPanel',
				items: [{
					xtype: 'button',
					height: '1.5em',
					width: '100%',
					text: mapThemeButtonTitleString[lang],
					id: 'mapThemeButton',
					tooltip: mapThemeButtonTooltipString[lang],
					enableToggle: false,
					allowDepress: false,
					flex: 0.1,
					hidden: true
				}, {
					xtype: 'panel',
					layout: 'accordion',
					border: false,
					frame: false,
					id: 'collapsiblePanels',
					flex: 0.9,
					width: '100%',
					layoutConfig: {
						titleCollapse: true,
						animate: true,
						activeOnTop: false
					},
					activeItem: 2,
					items: [{
                        id: 'DescriptionPanel',
                        xtype: 'panel',
                        title: TR.description,
                        html: projectData.description,
                        hidden: true,
                        padding: 5,
                        autoScroll: true
                        }, {
						xtype: 'panel',
						title: searchPanelTitleString[lang],
						id: 'SearchPanel',
                        //iconCls: 'x-cols-icon',
                        border: false,
						frame: false,
						items: [{
							xtype: 'tabpanel',
							enableTabScroll: true,
							activeTab: 0,
							id: 'SearchTabPanel',
							items: []
						}]
					}, {
						xtype: 'panel',
						title: layerTreeTitleString[lang],  //mapPanelTitleString[lang],
						layout: 'border',
						id: 'leftPanelMap',
                        //iconCls: 'x-cols-icon',
						border: false,
						frame: false,
						items: [{
							xtype: 'treepanel',
							lines: false,   //rather disable lines since they are missing now with legend inside layer tree
							border: false,
							frame: false,
							title: '', //layerTreeTitleString[lang],
							height: 159,
							split: true,
							region: 'center',
							collapsible: false,
							rootVisible: false,
							autoScroll: true,
							//containerScroll: true,
							cls: 'x-tree-noicon',
							id: 'LayerTree',
							root: {
								text: 'Root',
								expanded: true,
								singleClickExpand: true
							},
							loader: {}
						},
							{
								region: 'south',
								xtype: 'panel',
								id: 'BookmarkPanel',
								layout: 'fit',
								hidden: true,
								title: TR.bookmarks,
								split: true,
								collapsible: true,
								collapsed: false,
								titleCollapse: true,
								autoScroll: true,
								height: Eqwc.settings.bookmarkPanelHeight ? Eqwc.settings.bookmarkPanelHeight : 200,
								border: false,
								frame: false
							}
						] // map items
					}] // accordion items
				}] // left panel items
			}, {
				xtype: 'panel',
                border: false,
                frame: false,
                margins: '3 3 3 0',
				flex: 1,
				region: 'center',
				width: 100,
				layout: 'border',
				id: 'CenterPanel',
				items: [{
					xtype: 'panel',
					region: 'center',
					tpl: '',
					layout: 'fit',
					id: 'MapPanel',
					tbar: {
						xtype: 'toolbar',
						autoHeight: true,
						id: 'myTopToolbar',
						items: [{
							xtype: 'tbseparator',
                            id: 'separator1'
						}, {
							xtype: 'button',
							tooltip: objIdentificationTooltipString[lang],
							toggleGroup: 'mapTools',
							enableToggle: true,
							icon: iconDirectory+'mActionIdentify.png',
							allowDepress: true,
							tooltipType: 'qtip',
							iconCls: '',
							scale: 'medium',
							id: 'IdentifyTool',
                            hidden:false
						}, {
							xtype: 'tbtext',
							text: objectIdentificationTextLabel[lang],
                            id: 'ObjectIdentificationText',
                            hidden: !projectData.identify_mode
						}, {
							xtype: 'combo',
							width: 120,
							store: 'objIdentificationModes',
							valueField: 'value',
                            editable: false,
							mode: 'local',
							displayField: 'name',
							triggerAction: 'all',
							id: 'ObjectIdentificationModeCombo',
                            hidden: !projectData.identify_mode
						//}, {
						//	xtype: 'tbseparator',
                        //    id: 'separator2'
						}, {
							xtype: 'button',
							enableToggle: true,
							allowDepress: true,
							toggleGroup: 'mapTools',
							icon: iconDirectory+'mActionMeasure.png',
							tooltip: measureDistanceTooltipString[lang],
							tooltipType: 'qtip',
							scale: 'medium',
							id: 'measureDistance',
                            hidden: !projectData.measurements
						}, {
							xtype: 'button',
							enableToggle: true,
							allowDepress: true,
							toggleGroup: 'mapTools',
							scale: 'medium',
							icon: iconDirectory+'mActionMeasureArea.png',
							tooltipType: 'qtip',
							tooltip: measureAreaTooltipString[lang],
							id: 'measureArea',
                            hidden: !projectData.measurements
						}, {
							xtype: 'tbseparator',
                            id: 'separator3'
						}, {
							xtype: 'button',
							enableToggle: true,
							allowDepress: true,
							toggleGroup: 'mapTools',
							scale: 'medium',
							icon: iconDirectory+'mActionFilePrint.png',
							tooltipType: 'qtip',
							tooltip: printMapTooltipString[lang],
							id: 'PrintMap',
                            hidden: !projectData.print
						}, {
							xtype: 'button',
							enableToggle: false,
							allowDepress: false,
							scale: 'medium',
							icon: iconDirectory+'mActionPermalink.png',
							tooltipType: 'qtip',
							tooltip: sendPermalinkTooltipString[lang],
							id: 'SendPermalink',
                            hidden: !projectData.permalink
						}, {
							xtype: 'tbseparator',
                            id: 'separator4'
						}
						,   {
                                xtype: 'button',
                                enableToggle: false,
                                allowDepress: false,
                                scale: 'medium',
                                icon: iconDirectory+'mActionMailSend.png',
                                tooltipType: 'qtip',
                                tooltip: TR.feedback,
                                id: 'ShowFeedback',
                                handler: mapToolbarHandler,
                                hidden: !projectData.userFeedback
						    }
						]
					},
					bbar: {
						xtype: 'toolbar',
						id: 'myBottomToolbar',
						items: [{
							xtype: 'tbtext',
							text: mapAppLoadingString[lang],
							id: 'mainStatusText'
						}, {
							xtype: 'tbfill'
						}, {
                            xtype: 'combo',
                            id: 'rightStatusText',
                            hideLabel: true,
                            editable: false,
                            mode: 'local',
                            triggerAction: 'all',
                            width: 160,
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
                            },
                            //value: projectData.crsComboStore()[0][1],
                            listeners: {
                                "select": function(combo, record, index) {
                                    Eqwc.currentMapProjection = projectData.getProjectionsList(record.data.code)[0];
                                }
                                //"render": function(c) {
                                //    new Ext.ToolTip({
                                //        target: c.getEl(),
                                //        html: 'Tooltip content'
                                //    });
                                //}
                            }
						}, {
							xtype: 'tbtext',
							text: coordinateTextLabel[lang]
						}, {
							xtype: 'tbspacer'
						}, {
							xtype: 'textfield',
							width: 120,
							//regex: /^\d{6}\.?\d{0,2},\d{6}\.?\d{0,2}$/,
							maskRe: /[0-9]/,
                            enableKeyEvents: true,
							id: 'CoordinateTextField'
						}, {
							xtype: 'tbtext',
							text: '1:'
						}, {
							xtype: 'numberfield',
							minValue: 1,
							allowNegative: false,
							allowDecimals: false,
							width: 65,
							enableKeyEvents: true,
							id: 'ScaleNumberField'
						}]
					}
				}]
			},
            {
                xtype: 'panel',
                id: 'RightPanel',
                title: '',
                region: 'east',
                split: true,
                collapsible: true,
                collapsed: true,
				//hidden: true,
                width: 300
            },
            {
                xtype: 'tabpanel',
                id: 'BottomPanel',
                title: '',
                region: 'south',
                split: true,
                collapsible: true,
                collapsed: true,
                hidden: false,
                height: 300,
                listeners: {
                    tabchange: function() {
                        if(this.items.getCount()==0) {
                            this.collapse();
                        }
                    }
                }
            }]
		}];

		// Appends custom buttons from customizations.js
		this.items[0].items[1].items[0].tbar.items = this.items[0].items[1].items[0].tbar.items.concat ( customButtons ) ;

		MyViewportUi.superclass.initComponent.call(this);
	}
});

//initialize main gui
MyViewport = Ext.extend(MyViewportUi, {
	initComponent: function () {
		MyViewport.superclass.initComponent.call(this);
	}
});

//initialize tooltips and render main gui
Ext.onReady(function () {
	Ext.QuickTips.init();
	var cmp1 = new MyViewport({
		renderTo: Ext.getBody()
	});
	cmp1.show();
});
