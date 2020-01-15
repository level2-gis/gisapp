/*
 *
 * LegendAndMetadataDisplay.js -- part of Quantum GIS Web Client
 *
 * Copyright (2010-2013), The QGIS Project All rights reserved.
 * Quantum GIS Web Client is released under a BSD license. Please see
 * https://github.com/qgis/qgis-web-client/blob/master/README
 * for the full text of the license and the list of contributors.
 *
*/ 

//scripts to display legend graphic and per layer metadata in a separate Ext window
//function showInteractiveLegendAndMetadata(layertitle) {
//	var layername = wmsLoader.layerTitleNameMapping[layertitle];
//	//initialize Ext Window if undefined
//	if (legendMetadataWindow == undefined) {
//		setupLegendAndMetadataWindow();
//	}
//	legendMetadataWindow.setTitle(legendMetadataWindowTitleString[lang] + " '"+layertitle+"'");
//	if (legendMetadataWindow_active == false) {
//		legendMetadataWindow.show();
//	}
//	//create legend URI from GlobalOptions.js interactiveLegendGetLegendURL
//    if (typeof(interactiveLegendGetLegendURL) == 'undefined'){
//        Ext.MessageBox.alert('Configuration error', 'interactiveLegendGetLegendURL is not defined. Set it in GlobalOptions.js');
//        return;
//    }
//	var legendUrl =  interactiveLegendGetLegendURL + Ext.urlEncode({
//		layer: layername
//	});
//	legendMetaTabPanel = Ext.getCmp('legendMetaTabPanel');
//
//	//create metadata text
//	legendMetaTabPanel.activate(metadataTab);
//	var metadataText = '<style type="text/css">.even { background-color:rgb(240,240,240);border:none;} .mdCell {padding:0.3em;border:none;} .mdHeader {padding:0.3em;font-weight:bold;border:none;}</style>';
//	metadataText += '<div style="margin:1em;"><h1 style="margin-bottom:0.8em;">'+metadataSectionTitleString[lang]+'"'+layertitle+'"</h1>';
//	//abstract
//	if (wmsLoader.layerProperties[layername].abstract) {
//		metadataText += '<p><b>'+abstractString[lang]+'</b><p><p>'+wmsLoader.layerProperties[layername].abstract+'</p>';
//	}
//	//is layer queryable
//	metadataText += '<p style="margin-top:1em;">'+layerQueryable[lang];
//	if (wmsLoader.layerProperties[layername].queryable) {
//		metadataText += yesString[lang];
//	}
//	else {
//		metadataText += noString[lang];
//	}
//	metadataText += '</p>';
//	//display field
//	if (wmsLoader.layerProperties[layername].queryable) {
//		// wmsLoader.layerProperties[layername].displayField is null if GetCapabilities is used
//		if (wmsLoader.layerProperties[layername].displayField) {
//			metadataText += '<p style="margin-top:1em;"><b>'+displayFieldString[lang]+":</b> "+wmsLoader.layerProperties[layername].displayField + '</p>';
//		}
//	}
//	//coordinate systems
//	metadataText += '<p style="margin-top:1em;margin-bottom:0.4em;font-weight:bold;">'+coordinateSystemsString[lang]+"</p><ul>";
//	for (srs in wmsLoader.layerProperties[layername].srsList) {
//		metadataText += '<li style="list-style-type:square;list-style-position:inside;">'+srs+'</li>';
//	}
//	metadataText += '</ul>';
//	//geographic extent
//	metadataText += '<p style="margin-top:1em;margin-bottom:0.4em;font-weight:bold;">'+geographicExtentString[lang]+"</p><ul>";
//	metadataText += '<table style="margin-top:0.5em;border:none;border-collapse:collapse;"><tr class="even"><th class="mdHeader">'+westString[lang]+'</th><th class="mdHeader">'+southString[lang]+'</th><th class="mdHeader">'+eastString[lang]+'</th><th class="mdHeader">'+northString[lang]+'</th></tr>';
//	metadataText += '<tr><td class="mdCell">'+wmsLoader.layerProperties[layername].bbox[0]+'</td><td class="mdCell">'+wmsLoader.layerProperties[layername].bbox[1]+'</td><td class="mdCell">'+wmsLoader.layerProperties[layername].bbox[2]+'</td><td class="mdCell">'+wmsLoader.layerProperties[layername].bbox[3]+'</td></tr>';
//	metadataText += '</table>';
//
//	//attributes/fields
//	if (wmsLoader.layerProperties[layername].attributes) {
//		metadataText += '<p style="margin-top:1em"><b>'+attributesString [lang]+'</b></p><table style="margin-top:0.5em;border:none;border-collapse:collapse;"><tr class="even"><th class="mdHeader">'+attributeNameString[lang]+'</th><th class="mdHeader">'+attributeTypeString[lang]+'</th><th class="mdHeader">'+attributeCommentString[lang]+'</th><th class="mdHeader">'+attributeLengthString[lang]+'</th><th class="mdHeader">'+attributePrecisionString[lang]+'</th></tr>';
//		var rowCounter = 1;
//		for (var i=0;i<wmsLoader.layerProperties[layername].attributes.length;i++) {
//			attribute = wmsLoader.layerProperties[layername].attributes[i];
//			if (rowCounter % 2 == 0) {
//				metadataText += '<tr class="even">';
//			}
//			else {
//				metadataText += '<tr>';
//			}
//			metadataText += '<td class="mdCell">'+attribute.name+'</td><td class="mdCell">'+attribute.type+'</td><td class="mdCell">'+attribute.comment+'</td><td class="mdCell">'+attribute.length+'</td><td class="mdCell">'+attribute.precision+'</td></tr>';
//			rowCounter++;
//		}
//		metadataText += '</table>'
//	}
//	metadataText += '</div>'
//	metadataTab.update(metadataText);
//
//    // Set loading... text
//    legendTab.update(legendTabLoadingString[lang]);
//
//	//create legend image
//	legendMetaTabPanel.activate(legendTab);
//    // Build the legend with an Ajax call
//    Ext.Ajax.request({
//        url: legendUrl,
//        params: '',
//        method: 'GET',
//        success: function (response) {
//            var legendText = '';
//            var t = new Ext.Template('<tr><td><img src="data:image/png;base64,{image}" /></td><td>{name}</td></tr>');
//            Ext.each(Ext.decode(response.responseText), function(k){
//                legendText += t.apply(k);
//            });
//            legendTab.update('<table>' + legendText + '</table>');
//        }
//    });
//}


//scripts to display legend graphic and per layer metadata in a separate Ext window
function showLegendAndMetadata(layertitle) {
	var layername = wmsLoader.layerTitleNameMapping[layertitle];
	//initialize Ext Window if undefined
	if (legendMetadataWindow == undefined) {
		setupLegendAndMetadataWindow();
	}
	legendMetadataWindow.setTitle(legendMetadataWindowTitleString[lang] + ' "'+layertitle+'"');
	if (legendMetadataWindow_active == false) {
		legendMetadataWindow.show();
	}

    var projDataLayer = projectData.layers[layername];
    var properties = {};

    //create legend URI
    var legendUrl = wmsURI + Ext.urlEncode({
            SERVICE: "WMS",
            VERSION: "1.3.0",
            REQUEST: "GetLegendGraphics",
            FORMAT: "image/png",
            EXCEPTIONS: "application/vnd.ogc.se_inimage",
            BOXSPACE: 1,
            LAYERSPACE: 2,
            SYMBOLSPACE: 1,
            SYMBOLHEIGHT: 2,
            LAYERFONTSIZE: 8,
            ITEMFONTSIZE: 8,
            LAYERS: layername,
            DPI: screenDpi
        });
    legendMetaTabPanel = Ext.getCmp('legendMetaTabPanel');
    //create legend image
    if (wmsLoader.layerProperties[layername].showLegend) {
        legendMetaTabPanel.activate(legendTab);
        var legendImage = '<img src="' + legendUrl + '" />';
        legendTab.update(legendImage);
    }

    if (projDataLayer) {

        var describeUrl = wmsURI + Ext.urlEncode({
                SERVICE: "WFS",
                VERSION: "1.1.0",
                REQUEST: "DescribeFeatureType",
                TYPENAME: layertitle
            });
        var describeUrlLink = '<a target="_blank" href="'+describeUrl+'">DescribeFeatureType</a>';

        var type = projDataLayer.geom_type;
        if (type == '' && (projDataLayer.provider == 'ogr' || projDataLayer.provider == 'spatialite')) {
            type = 'vector';
        }
        if (type == '' && (projDataLayer.provider == 'gdal' || projDataLayer.provider == 'wms')) {
            type = 'raster';
        }

        properties = {
            'TYPE': type,
            'PROVIDER': projDataLayer.provider,
            'CRS': projDataLayer.crs,
            'IDENTIFY': wmsLoader.layerProperties[layername].queryable ? Ext.MessageBox.buttonText.yes : Ext.MessageBox.buttonText.no,
            'EDITABLE': projDataLayer.wfs ?  Ext.MessageBox.buttonText.yes : Ext.MessageBox.buttonText.no,
            'ID': projDataLayer.id
        };

        if (type == 'No geometry') {
            delete properties.CRS;
        }
    }
	
	//create metadata text
	legendMetaTabPanel.activate(metadataTab);
	var metadataText = '<style type="text/css">.even { background-color:rgb(240,240,240);border:none;} .mdCell {padding:0.3em;border:none;} .mdHeader {padding:0.3em;font-weight:bold;border:none;}</style>';
	metadataText += '<div style="margin:1em;"><h1 style="margin-bottom:0.8em;">'+metadataSectionTitleString[lang]+' "'+layertitle+'"</h1>';
	//abstract
	if (wmsLoader.layerProperties[layername].abstract) {
		metadataText += '<p><b>'+abstractString[lang]+'</b><p><p>'+wmsLoader.layerProperties[layername].abstract+'</p>';
	}
    if(projDataLayer && projDataLayer.wfs) {
        metadataText += '<p>'+describeUrlLink+'</p>';
    }
	//is layer queryable
	//metadataText += '<p style="margin-top:1em;">'+layerQueryable[lang];
	//if (wmsLoader.layerProperties[layername].queryable) {
	//	metadataText += yesString[lang];
	//}
	//else {
	//	metadataText += noString[lang];
	//}
	//metadataText += '</p>';
	//display field
	//if (wmsLoader.layerProperties[layername].queryable) {
	//	// wmsLoader.layerProperties[layername].displayField is null if GetCapabilities is used
	//	if (wmsLoader.layerProperties[layername].displayField) {
	//		metadataText += '<p style="margin-top:1em;"><b>'+displayFieldString[lang]+":</b> "+wmsLoader.layerProperties[layername].displayField + '</p>';
	//	}
	//}
	//coordinate systems
	//metadataText += '<p style="margin-top:1em;margin-bottom:0.4em;font-weight:bold;">'+coordinateSystemsString[lang]+"</p><ul>";
	//for (srs in wmsLoader.layerProperties[layername].srsList) {
	//	metadataText += '<li style="list-style-type:square;list-style-position:inside;">'+srs+'</li>';
	//}
	//metadataText += '</ul>';
	//geographic extent
    if(projDataLayer && projDataLayer.geom_type != 'No geometry') {
        metadataText += '<p style="margin-top:1em;margin-bottom:0.4em;font-weight:bold;">' + geographicExtentString[lang] + "</p><ul>";
        metadataText += '<table style="margin-top:0.5em;border:none;border-collapse:collapse;"><tr class="even"><th class="mdHeader">' + westString[lang] + '</th><th class="mdHeader">' + southString[lang] + '</th><th class="mdHeader">' + eastString[lang] + '</th><th class="mdHeader">' + northString[lang] + '</th></tr>';
        metadataText += '<tr><td class="mdCell">' + wmsLoader.layerProperties[layername].bbox[0] + '</td><td class="mdCell">' + wmsLoader.layerProperties[layername].bbox[1] + '</td><td class="mdCell">' + wmsLoader.layerProperties[layername].bbox[2] + '</td><td class="mdCell">' + wmsLoader.layerProperties[layername].bbox[3] + '</td></tr>';
        metadataText += '</table>';
    }
	
	//attributes/fields
	if (wmsLoader.layerProperties[layername].attributes) {
		metadataText += '<p style="margin-top:1em"><b>'+attributesString [lang]+'</b></p><table style="margin-top:0.5em;border:none;border-collapse:collapse;"><tr class="even"><th class="mdHeader">'+attributeNameString[lang]+'</th><th class="mdHeader">'+attributeTypeString[lang]+'</th><th class="mdHeader">'+attributeCommentString[lang]+'</th><th class="mdHeader">'+attributeLengthString[lang]+'</th><th class="mdHeader">'+attributePrecisionString[lang]+'</th></tr>';
		var rowCounter = 1;
		for (var i=0;i<wmsLoader.layerProperties[layername].attributes.length;i++) {
			attribute = wmsLoader.layerProperties[layername].attributes[i];
			if (rowCounter % 2 == 0) {
				metadataText += '<tr class="even">';
			}
			else {
				metadataText += '<tr>';
			}
			metadataText += '<td class="mdCell">'+attribute.name+'</td><td class="mdCell">'+attribute.type+'</td><td class="mdCell">'+attribute.comment+'</td><td class="mdCell">'+attribute.length+'</td><td class="mdCell">'+attribute.precision+'</td></tr>';
			rowCounter++;
		}
		metadataText += '</table>';
	}
	metadataText += '</div>';

    var text = metadataTab.getComponent('propertyText');
    text.update(metadataText);

    var grid = metadataTab.getComponent('propertyGrid');
    grid.setSource(properties);

    //if no metadata shall be displayed, remove tab
    //the var showMetaDataInLegend is defined in GlobalOptions.js
    if (! showMetaDataInLegend ){
        legendMetaTabPanel.remove('metadataTab', true);
    }
}

function setupLegendAndMetadataWindow() {
    legendMetadataWindow = new Ext.Window({
        title: legendMetadataWindowTitleString[lang],
        width: 400, //geoExtMap.getWidth() * 0.5,
        height: 300, //geoExtMap.getHeight() * 0.5,
        autoScroll: true,
        maximizable: true,
        layout: 'fit',
        shadow: false,
        items: [{
            xtype: 'tabpanel',
            activeTab: 0,
            defaults: {autoScroll: true},
            id: 'legendMetaTabPanel',
            items: [{
                title: metadataTabTitleString[lang],
                //layout: 'fit',
                id: 'metadataTab',
                items: [
                    new Ext.grid.PropertyGrid({
                        //title: 'Properties Grid',
                        itemId: 'propertyGrid',
                        autoHeight: true,
                        stripeRows: false,
                        hideHeaders: true,
                        //width: 300,
                        //renderTo: 'grid-ct',
                        viewConfig: {
                            forceFit: true,
                            scrollOffset: 2, // the grid will never have scrollbars
                            templates: {cell: new Ext.Template(
                                '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',
                                '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
                                '</td>'
                                )}
                        },
                        listeners: {
                            'beforeedit': function (e) {
                                return false;
                            }
                        }
                    }), new Ext.Container({
                        itemId: 'propertyText'
                    })]
            }, {
                title: legendTabTitleString[lang],
                id: 'legendTab'
            }]
        }],
        listeners: {
            show: function () {
                legendMetadataWindow_active = true;
            },
            hide: function () {
                legendMetadataWindow_active = false;
            },
            close: function () {
                legendMetadataWindow = undefined;
            }
        }
    });
    legendMetaTabPanel = Ext.getCmp('legendMetaTabPanel');
    legendTab = Ext.getCmp('legendTab');
    metadataTab = Ext.getCmp('metadataTab');
}
