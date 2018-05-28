/*
 *
 * FeatureInfoDisplay.js -- part of Quantum GIS Web Client
 *
 * Copyright (2010-2012), The QGIS Project All rights reserved.
 * Quantum GIS Web Client is released under a BSD license. Please see
 * https://github.com/qgis/qgis-web-client/blob/master/README
 * for the full text of the license and the list of contributors.
 *
 */

/* FeatureInfos are presented to the user in two ways using OpenLayers.Popup classes:
 * If the mouse stops and GetFeatureInfo has results for this mouse position
 * a small box presents the contents of the info field (GetProjectSettings) or the
 * field named "toolbox" (GetCapabilities), this is called hoverPopup throughout this script.
 * If the user clicks in the map the contents of all visible fields (and if activated the wkt geometry)
 * is presented in a popup called clickPopup throughout this script.
 * hoverPopups are disabled when a clickPopup is open, however clicking at another position in the map
 * closes the currently opened clickPopup and opens a new one (if there is GetFeatureInfo response).
 * If the cursor is at a position where there is GetFeatureInfo response it indicates the possibility
 * to click by changing to "hand".
 */

function showFeatureInfo(evt) {
    removeClickPopup();
    if (hoverPopup) {
        removeHoverPopup();
    }

    if (identifyToolActive) {
        var map = geoExtMap.map; // gets OL map object
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(evt.text, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(evt.text);
        }

        //start locationservices
        var text = "";
        var locationText = "<h2>" + TR.fiLocation + "</h2>";
        var locationUnits = map.getLonLatFromPixel(evt.xy);
        var locationObj = new QGIS.LocationService({location: locationUnits, language: projectData.lang});
        var popupItems = [];

        if (Eqwc.settings.showCoordinatesIdentify) {
            text = "</br>";
            popupItems.push(
                {
                    xtype: 'box',
                    html: locationText
                }, {
                    id: "fi_location",
                    //margins: '5 5 5 5',
                    xtype: 'box',
                    html: '<tr><td>' + locationObj.locationToString() + '</td></tr>'
                });
        }

        if (projectData.locationServices != null) {
            text = "</br>";
            for (var l = 0; l < projectData.locationServices.length; l++) {
                locationObj.getService({
                    name: projectData.locationServices[l].name,
                    key: projectData.locationServices[l].key,
                    provider: projectData.locationServices[l].provider
                });

                popupItems.push({
                    id: "fi_" + projectData.locationServices[l].name,
                    //margins: '5 5 5 5',
                    xtype: 'box',
                    html: '</br>'
                });
            }
        }

        locationObj.on("elevation", updateElevation);
        locationObj.on("address", updateAddress);

        // open AttributeTree panel
        featureInfoResultLayers = [];
        highLightGeometry = [];
        parseFIResult(xmlDoc);
        featureInfoResultLayers.reverse();
        //highLightGeometry.reverse();

        //    if (hoverPopup) {
        //        removeHoverPopup();
        //    }
        //    if (clickPopup) {
        //        removeClickPopup();
        //    }
        //
        if (featureInfoResultLayers.length > 0) {

            if (identificationMode == 'topMostHit') {
                text += featureInfoResultLayers[0];
                //        featureInfoHighlightLayer.addFeatures(highLightGeometry[0]);
                //        //feature.geometry.getBounds().getCenterLonLat()
            } else {
                for (var i = 0; i < featureInfoResultLayers.length; i++) {
                    text += featureInfoResultLayers[i];
                    //featureInfoHighlightLayer.addFeatures(highLightGeometry[i]);
                }
            }

            popupItems.push({
                id: "fi_qgis",
                xtype: 'box',
                //margins: '3 0 3 3',
                html: text
            });
        }

        //new way GeoExt Popup
        clickPopup = new GeoExt.Popup({
            title: clickPopupTitleString[lang],
            location: locationUnits,
            map: map,
            autoScroll: true,
            bodyStyle: 'padding:5px',
            //layout: 'accordion',
            items: popupItems,
            maximizable: true,
            collapsible: true,
            listeners: {
                close: onClickPopupClosed,
                beforeshow: function () {

                    var maxHeight = geoExtMap.getHeight() * 0.8;
                    var minWidth = 280;

                    if ((geoExtMap.getWidth() * 0.25) > minWidth) {
                        this.setWidth(geoExtMap.getWidth() * 0.25);
                    } else {
                        this.setWidth(minWidth);
                    }

                    if (this.getHeight() > maxHeight) {
                        this.setHeight(maxHeight);
                    }
                }
            }
        });
        if (popupItems.length>0) {
            clickPopup.show();
        }

        //old way with OpenLayers.Popup
        // clickPopup = new OpenLayers.Popup.FramedCloud(
        // null, // id
        // map.getLonLatFromPixel(evt.xy), // lonlat
        // null, //new OpenLayers.Size(1,1), // contentSize
        // text, //contentHTML
        // null, // anchor
        // true,  // closeBox
        // onClickPopupClosed // closeBoxCallBackFunction
        // );
        // // For the displacement problem
        // clickPopup.panMapIfOutOfView = Ext.isGecko;
        // clickPopup.autoSize = true;
        // clickPopup.events.fallThrough = false;
        // map.addPopup(clickPopup); //*/
        changeCursorInMap("default");
    }
    activateGetFeatureInfo(true);

}

function showFeatureInfoHover(evt) {
    var map = geoExtMap.map; // gets OL map object
    if (identifyToolActive) {
        if (hoverPopup) {
            removeHoverPopup();
        }
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(evt.text, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(evt.text);
        }
        var layerNodes = xmlDoc.getElementsByTagName("Layer");
        var text = '';
        var result = false;
        //test if we need to show the feature info layer title
        //either from global setting or from project setting
        var showFILayerTitle = showFeatureInfoLayerTitle;
        if (mapThemeSwitcher) {
            if (mapThemeSwitcher.activeProjectData != undefined) {
                showFILayerTitle = mapThemeSwitcher.activeProjectData.showFeatureInfoLayerTitle;
            }
        }

        for (var i = layerNodes.length - 1; i > -1; --i) {
            //case vector layers
            var featureNodes = layerNodes[i].getElementsByTagName("Feature");
            // show layer display field or if missing, the attribute 'tooltip'
            var tooltipAttributeName = wmsLoader.layerProperties[layerNodes[i].getAttribute("name")].displayField || "tooltip";
            for (var j = 0; j < featureNodes.length; ++j) {
                if (j == 0) {
                    if (showFILayerTitle) {
                        text += '<h2 class="hoverLayerTitle">' + wmsLoader.layerProperties[layerNodes[i].getAttribute("name")].title + '</h2>';
                    }
                    result = true;
                }
                var attribNodes = featureNodes[j].getElementsByTagName("Attribute");
                var attributesDict = {};
                for (var k = 0; k < attribNodes.length; ++k) {
                    attributesDict[attribNodes[k].getAttribute("name")] = attribNodes[k].getAttribute("value");
                }

                var tooltipFieldAvailable = attributesDict.hasOwnProperty(tooltipAttributeName);
                var geometryFieldAvailable = attributesDict.hasOwnProperty('geometry');

                if (tooltipFieldAvailable) {
                    var aValue = attributesDict[tooltipAttributeName]
                    if (aValue.match(/</)) {
                        text += aValue;
                    }
                    else {
                        attribText = '<p>' + aValue.replace(/\n/, "<br/>");
                        attribText = attribText.replace("\n", "<br/>");
                        text += attribText + '</p>';
                    }
                    text += '<hr class="hrHoverLayer"/>';
                }
                else if (tooltipTemplates && tooltipTemplates.hasOwnProperty(layerNodes[i].getAttribute("name"))) {
                    templateText = tooltipTemplates[layerNodes[i].getAttribute("name")].template;
                    tooltipText = templateText.replace(/<%(\w*)%>/g, function (m, key) {
                        var value = attributesDict.hasOwnProperty(key) ? attributesDict[key] : "";
                        return value.replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/"/g, "&quot;")
                            .replace(/'/g, "&#039;");
                    });
                    text += tooltipText + "<br/>";
                } else if (tooltipAttributeName.indexOf('[%') !== -1) { // Look into displayField for template tags...
                    var tooltipText = tooltipAttributeName;
                    var re = new RegExp(/\[%[^"]*"(.*?)"[^"]*%\]/g);
                    var ttmatch;
                    while (ttmatch = re.exec(tooltipAttributeName)) {
                        var key = ttmatch[1];
                        var val = attributesDict.hasOwnProperty(key) ? attributesDict[key] : "";
                        tooltipText = tooltipText.replace(ttmatch[0], val);
                    }
                    text += tooltipText + "<br/>";
                }
                if (geometryFieldAvailable) {
                    var feature = new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT(attributesDict["geometry"]));
                    featureInfoHighlightLayer.addFeatures([feature]);
                }
            }
            //case raster layers
            var rasterAttributeNodes = [];
            var rasterLayerChildNode = layerNodes[i].firstChild;
            while (rasterLayerChildNode) {
                if (rasterLayerChildNode.nodeName == "Attribute") {
                    rasterAttributeNodes.push(rasterLayerChildNode);
                }
                rasterLayerChildNode = rasterLayerChildNode.nextSibling;
            }
            for (var j = 0; j < rasterAttributeNodes.length; ++j) {
                if (j == 0) {
                    if (showFILayerTitle) {
                        text += '<h2 class="hoverLayerTitle">' + wmsLoader.layerProperties[layerNodes[i].getAttribute("name")].title + '</h2>';
                    }
                    result = true;
                }
                text += '<p>' + rasterAttributeNodes[j].getAttribute("name") + ": " + rasterAttributeNodes[j].getAttribute("value") + '</p>';
                text += '<hr class="hrHoverLayer"/>';
            }
            if (identificationMode == 'topMostHit' && result) {
                break;
            }
        }

        if (result) {
            changeCursorInMap("pointer");
            if (!clickPopup) {
                // only show hoverPopup if no clickPopup is open
                //get rid of last <hr/>
                text = text.replace(/<hr class="hrHoverLayer"\/>$/, '');
                hoverPopup = new OpenLayers.Popup.FramedCloud(
                    null, // id
                    map.getLonLatFromPixel(evt.xy), // lonlat
                    null, // new OpenLayers.Size(1,1), // contentSize
                    text, //contentHTML
                    null, // anchor
                    false, // closeBox
                    null // closeBoxCallback
                );
                hoverPopup.autoSize = true;
                hoverPopup.keepInMap = true;
                hoverPopup.panMapIfOutOfView = false;
                hoverPopup.events.on({"click": onHoverPopupClick});
                map.addPopup(hoverPopup);
            }
        } else {
            changeCursorInMap("default");
        }
    }
}

// disable all GetFeatureInfoRequest until we have a reponse
function onBeforeGetFeatureInfoClick(evt) {

    evt.object.layers[0].setVisibility(thematicLayer.getVisibility());

    activateGetFeatureInfo(false);
}

//function onBeforeGetExtraFeatureInfoClick(evt) {
//    var lay = geoExtMap.map.getLayersBy('metadata','identify');
//
//    //WATCH: only first one is used
//    if (lay.length>0) {
//        evt.object.layers = [geoExtMap.map.getLayersBy('metadata', 'identify')[0]];
//    }
//}

// reenable GetFeatureInfo
function noFeatureInfoClick(evt) {
    activateGetFeatureInfo(true);
}

/* we need this function in order to pass through the click to the map events
 * */
function onHoverPopupClick(evt) {
    if (hoverPopup) {
        removeHoverPopup();
    }
    var map = geoExtMap.map; // gets OL map object
    evt.xy = map.events.getMousePosition(evt); // non api function of OpenLayers.Events
    map.events.triggerEvent("click", evt);
}

function onClickPopupClosed(evt) {
    removeClickPopup();
    // enable the hover popup for the curent mosue position
    if (Eqwc.settings.enableHoverPopup)
        WMSGetFInfoHover.activate();
    var map = geoExtMap.map; // gets OL map object
    evt.xy = map.events.getMousePosition(evt); // non api function of OpenLayers.Events
    map.events.triggerEvent("mousemove", evt);
}

function removeClickPopup() {
    //var map = geoExtMap.map; // gets OL map object
    //map.removePopup(clickPopup);
    if (clickPopup) {
        clickPopup.destroy();
    }
    clickPopup = null;
    //featureInfoHighlightLayer.removeAllFeatures();
}

function removeHoverPopup() {
    var map = geoExtMap.map; // gets OL map object
    map.removePopup(hoverPopup);
    hoverPopup.destroy();
    hoverPopup = null;
    featureInfoHighlightLayer.removeAllFeatures();
}

function showFeatureSelected(args) {

    //TODO It would be useful to switch on layer if it is off

    var layer = args["layer"] == null ? args["fid"].split('.')[0] : args["layer"];
    var layerId = wmsLoader.layerTitleNameMapping[layer];
    //var layerData = projectData.layers[layerId];

    featureInfoHighlightLayer.removeAllFeatures();
    featureInfoHighlightLayer.addFeatures([args]);

    geoExtMap.map.zoomToExtent(args.geometry.bounds);
}

function clearFeatureSelected() {
    // clear selection
    if (thematicLayer.params['SELECTION'] != undefined) {
        thematicLayer.mergeNewParams({
            "SELECTION": null
        });
    }

    featureInfoHighlightLayer.removeAllFeatures();
}

function parseFIResult(node) {
    if (node.hasChildNodes()) {
        //test if we need to show the feature info layer title
        //either from global setting or from project setting
        var showFILayerTitle = showFeatureInfoLayerTitle;
        if (mapThemeSwitcher) {
            if (mapThemeSwitcher.activeProjectData != undefined) {
                showFILayerTitle = mapThemeSwitcher.activeProjectData.showFeatureInfoLayerTitle;
            }
        }
        if (node.hasChildNodes() && node.nodeName == "Layer") {
            var hasAttributes = false;
            var rasterData = false;
            var htmlText = "";

            var layerChildNode = node.firstChild;
            var sourceLayerId = node.getAttribute("name");
            var sourceLayerName = wmsLoader.layerProperties[sourceLayerId].title;
            var layerName = Eqwc.common.getIdentifyLayerNameRevert(sourceLayerName);
            var layerId = wmsLoader.layerTitleNameMapping[layerName];
            var layer = wmsLoader.layerProperties[layerId];
            var layerTitle = layer.title;
            if (showFILayerTitle) {
                htmlText += "<h2>" + layerTitle + "</h2>";
            }

            var fid = layerTitle+"."+node.firstElementChild.getAttribute("id");
            while (layerChildNode) {



                if (layerChildNode.hasChildNodes() && layerChildNode.nodeName === "Feature") {
                    var attributeNode = layerChildNode.firstChild;

                    htmlText += '<table><tbody>';
                    //case vector data

                    //add geometry actions if layer is WFS published or geometry is added to response
                    var addActions = projectData.use_ids ? (projectData.layers[layerId].wfs || projectData.add_geom)  : false;

                    if (projectData.user == 'guest') {
                        addActions = false;
                    }

                    if (addActions) {
                        var select = '<a class="i-select" href="javascript:;" onclick="identifyAction(\'select\',\'' + fid + '\');"></a>';
                        var clear = '<a class="i-clear" href="javascript:;" onclick="identifyAction(\'clear\',\'\');"></a>';
                        var edit = '';
                        if (Eqwc.plugins["editing"] !== undefined) {
                            edit = '<a class="i-edit" href="javascript:;" onclick="identifyAction(\'edit\',\'' + fid + '\');"></a>';
                        }
                        htmlText += "<tr><td colspan='2'>" + select + edit + clear + "</td></tr>";
                    }
                    while (attributeNode) {
                        if (attributeNode.nodeName == "Attribute") {
                            var attName = attributeNode.getAttribute("name");
                            var attValue = attributeNode.getAttribute("value").replace("NULL", Eqwc.settings.noDataValue);
                            if ((attName !== mapInfoFieldName) && ((suppressEmptyValues == true && attValue.replace(/^\s\s*/, '').replace(/\s\s*$/, '') !== "") || suppressEmptyValues == false)) {
                                if (attName === "geometry") {
                                    var feature = new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT(attValue));
                                    //var feature = {};
                                    //feature.geometry = attValue;
                                    feature.fid = fid;
                                    highLightGeometry.push(feature);
                                    if (!suppressInfoGeometry) {
                                        htmlText += "\n   <tr>";
                                        if (showFieldNamesInClickPopup) {
                                            htmlText += "<td>" + attName + ":</td>";
                                        }
                                        htmlText += "<td>" + attValue + "</td></tr>";
                                        hasAttributes = true;
                                    }
                                } else {
                                    //specific check if attribute name is "files" and we have an alias
                                    var filesAlias = Eqwc.settings.qgisFilesFieldAlias ? Eqwc.settings.qgisFilesFieldAlias : 'files';

                                    //if (attName !== "maptip") {
                                    htmlText += "\n   <tr>";
                                    if (showFieldNamesInClickPopup && attName !== "maptip" && attName!== filesAlias) {
                                        htmlText += "<td>" + attName + ":</td>";
                                    }

                                    if (attName == filesAlias){
                                        if (attValue>'') {
                                            var attArr = Ext.util.JSON.decode(attValue);
                                            var newArr = [];
                                            Ext.each(attArr, function (item, index, array) {
                                                var value = this;
                                                value.push(Eqwc.common.manageFile(item, true));
                                            }, newArr);
                                            attValue = newArr.join('</br>');
                                        }
                                    } else {
                                        attValue = Eqwc.common.createHyperlink(attValue, null, mediaurl);
                                    }

                                    if (attName == 'maptip' || attName == filesAlias) {
                                        htmlText += "<td colspan='2'>" + attValue + "</td></tr>";
                                    } else {
                                        htmlText += "<td>" + attValue + "</td></tr>";
                                    }
                                    hasAttributes = true;
                                    //}
                                }
                            }
                        }
                        attributeNode = attributeNode.nextSibling;
                    }
                    htmlText += "\n  </tbody>\n </table></br>";
                }
                else if (layerChildNode.nodeName === "Attribute") {
                    //case raster data
                    if (rasterData == false) {
                        htmlText += "\n <p></p>\n <table>\n  <tbody>";
                    }
                    htmlText += '\n<tr><td>' + Eqwc.common.getRasterFieldName(layerTitle, layerChildNode.getAttribute("name")) + '</td><td>' + layerChildNode.getAttribute("value") + '</td></tr>';
                    hasAttributes = true;
                    rasterData = true;
                }
                layerChildNode = layerChildNode.nextSibling;
            }
            //htmlText += "\n</ul>";
            if (hasAttributes) {
                if (rasterData) {
                    htmlText += "\n  </tbody>\n </table></br>";
                }
                //alert(htmlText);
                featureInfoResultLayers.push(htmlText);
            }
        } else {
            var child = node.firstChild;
            while (child) {
                parseFIResult(child);
                child = child.nextSibling;
            }
        }
    }
}


function listLayersWithFeatures(node) {
    if (node.hasChildNodes()) {
        if (node.nodeName == "Layer") {
            featureInfoResultLayers.push(node.getAttribute("name"));
        } else {
            var child = node.firstChild;
            while (child) {
                listLayersWithFeatures(child);
                child = child.nextSibling;
            }
        }
    }
}

function getFeatures(layerName, node) {
    if (node.hasChildNodes()) {
        if (node.nodeName == "Layer" && node.getAttribute("name") == layerName) {
            return node.firstChild;
        } else {
            var child = node.firstChild;
            while (child) {
                getFeatures(layerName, child);
                child = child.nextSibling;
            }
        }
    }
}

function updateElevation(data, location, field, template) {

    var pan = Ext.getCmp('fi_elevation');
    if (pan == undefined) {
        return;
    }
    var tem = new Ext.Template(template);

    if (data !== undefined) {
        if (!(isNaN(data[field])) && data[field] !== null) {
            if (data[field] === parseInt(data[field])) {
                //
            }
            else {
                data[field] = data[field].toFixed(elevationPrecision);
            }

            var label = tem.apply(data);

            pan.update(label);
        }
    }


}

function updateAddress(data, location, field, template, templateMin, factor) {

    var pan = Ext.getCmp('fi_address');
    if (pan == undefined) {
        return;
    }

    var distance = 0;
    var results;

    if ((field == '') || (field == null))
        results = data;
    else
        results = data[field];

    if (results.distance != null) {
        distance = results.distance;
        results.distance = distance * factor;
    }
    if (distance * factor > minimumAddressRange) {
        tem = new Ext.Template(templateMin);
    }
    else {
        tem = new Ext.Template(template);
    }

    var label = tem.apply(results);

    pan.update(label);

}

function identifyAction(type,id) {

    var layer = id.split('.')[0];
    if (id.split('.')[1] == 'undefined') {
        return;
    }
    var layerId = wmsLoader.layerTitleNameMapping[layer];

    switch (type) {
        case 'clear' :

            clearFeatureSelected();
            break;

        case 'edit' :

            var check = checkEditorState(layerId);
            if(check) {
                var preparePass = prepareEdit(projectData.layers[layerId]);

                if (preparePass) {
                    editor.attributesForm.requestAndLoadFeature(id);
                }
            }

            break;

        case 'select' :

            var hasGeom = false;

            Ext.each(highLightGeometry, function (feature, index, array) {
                if (feature.fid === this[1]) {
                    showFeatureSelected(feature);
                    hasGeom = true;
                }
            }, arguments);

            //no geometry, make WFS call
            if (!hasGeom) {
                var filter = new OpenLayers.Filter.FeatureId({
                    fids: [id]
                });

                var protocol = new OpenLayers.Protocol.WFS({
                    version: '1.0.0',
                    url: wmsURI,
                    headers: {'Content-Type':'text/xml; charset=utf-8'},
                    featureType: layer,
                    //featureNS: "http://www.qgis.org/gml",
                    geometryName: "geometry",       //always geometry not this:  layer.geom_column,
                    filter: filter
                    //srsName: projectData.crs //doesn't work, have to transform results
                });

                function callback(response) {
                    //check response status
                    if(response.priv.status==200) {
                        if(response.features.length==1) {
                            var feat = response.features[0];
                            var layer = feat.fid.split('.')[0];
                            var layerId = wmsLoader.layerTitleNameMapping[layer];
                            var layerData = projectData.layers[layerId];

                            feat.geometry.transform(layerData.crs,projectData.crs);

                            highLightGeometry.push(feat);
                            showFeatureSelected(feat);
                        }
                    } else {
                        Ext.Msg.alert('Get feature error', response.priv.status + ' ' + response.priv.statusText+ '</br></br>'+response.priv.responseText);
                    }

                }

                protocol.read({
                    maxFeatures: 1,
                    callback: callback,
                    scope: this
                });
            }


            break;

    }

}