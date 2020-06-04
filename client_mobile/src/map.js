/**
 * OpenLayers 3 map
 *
 * events:
 *   maprotation({rotation: <rad>})
 */

/**
 * Map loading progress info
 * Only for main topicLayer
 * @constructor
 */
function Progress() {
    this.loading = 0;
    this.loaded = 0;
}


/**
 * Increment the count of loading tiles.
 */
Progress.prototype.addLoading = function() {
    if (this.loading === 0) {
        this.show();
    }
    ++this.loading;
    this.update();
};


/**
 * Increment the count of loaded tiles.
 */
Progress.prototype.addLoaded = function() {
    var this_ = this;
    //setTimeout(function() {
        ++this_.loaded;
        this_.update();
    //}, 100);
};


/**
 * Update the progress.
 */
Progress.prototype.update = function() {

    if (this.loading === this.loaded) {
        this.loading = 0;
        this.loaded = 0;
        this.hide();
    } else {
        if (this.loading > 1) {
            this.show(I18n.properties.mapLoading + this.loaded + "/" + this.loading);
        } else {
            this.show(I18n.properties.mapLoading);
        }
    }
};


/**
 * Show the progress.
 */
Progress.prototype.show = function(par) {
    //do not show it over layer panel and don't show it if location and following are on
    if($("#panelLayer").hasClass("ui-panel-open") === false) {
       if(Map.geolocation===null || !Map.geolocation.getTracking() || !Gui.following) {
           $.mobile.loading('show', {textVisible: true, text: par, theme: 'c'});
       }
    }
};


/**
 * Hide the progress.
 */
Progress.prototype.hide = function() {
    if (this.loading === this.loaded) {
        $.mobile.loading('hide');
    }
};



var Map = {};

Map.progress = new Progress();

// topics (key = topic name)
Map.topics = {};
// current topic
Map.topic = null;
// ordered layers (key = layer name)
Map.layers = {};
// current background topic
Map.backgroundTopic = null;
// current background WMS layers
Map.backgroundLayers = {};
// OpenLayers 3 map object
Map.map = null;
// min resolution to limit max zoom
Map.minResolution = null;
// OpenLayers 3 layer objects
Map.topicLayer = null;
Map.backgroundLayer = null;
Map.selectionLayer = null;
Map.redliningLayer = null;
Map.highlightLayer = null;
Map.geolocationLayer = null;
// overlay layers (key = topic name)
Map.overlayLayers = {};
// OpenLayers 3 geolocation object
Map.geolocation = null;
// OpenLayers 3 DeviceOrientation object
Map.deviceOrientation = null;
// device window orientation
Map.windowOrientation = undefined;
// OpenLayers 3 ScaleLine control
Map.scaleLine = null;
// last click position
Map.lastClickPos = null;
// click marker
Map.clickMarker = null;
// ignore clicks on map
Map.ignoreClick = false;
// map click handlers (key = handler name)
Map.singleClickHandlers = {};

Map.useTiledWMS = Eqwc.settings.mobileUseTiledWMS;

Map.userCrs = null;  //later holds value from Map CRS selection combo
Map.userCrsTitle = function() {
    var list = Config.map.projectionList;
    var crs = list.filter(function(item) {
        return item[0] == Map.userCrs;
    });
    return crs[0][1];
};

Map.createMap = function() {
  // override from URL params
  if (Config.permalink.useTiledWMS != null) {
    Map.useTiledWMS = Config.permalink.useTiledWMS;
  }

  Map.map = new ol.Map({
    layers: [],
    target: 'map',
    view: new ol.View(Config.map.viewOptions),
    controls:[]
  });

  Map.map.getView().fit(Config.map.extent, Map.map.getSize());

  Map.map.getView().on('change:rotation', function() {
    $.event.trigger({type: 'maprotation', rotation: Map.map.getView().getRotation()});
  });

  Map.setMinScaleDenom(Config.map.minScaleDenom.map);
  Map.map.getView().on('change:resolution', function() {
    // limit max zoom
    if (Map.map.getView().getResolution() < Map.minResolution) {
      Map.map.getView().setResolution(Map.minResolution);
    }
  });

  Map.map.on('singleclick', function(e) {
    if (!Map.ignoreClick) {
      Map.lastClickPos = e.coordinate;

      for (var name in Map.singleClickHandlers) {
        var handler = Map.singleClickHandlers[name];
        if (handler.isActive()) {
          handler.handleEvent(e);
        }
      }
    }
  });
};

Map.clearLayers = function() {
  Map.map.getLayers().clear();
  Map.topicLayer = null;
  Map.backgroundLayer = null;
  Map.backgroundTopic = null;
  Map.backgroundLayers = {};
  Map.selectionLayer = null;
  Map.redliningLayer = null;
  Map.highlightLayer = null;
  Map.overlayLayers = {};
};

Map.setTopicLayer = function() {
  // add new layer
  var wmsParams = $.extend({}, Config.map.wmsParams, {
    'LAYERS': Map.visibleLayers().join(','),
    'OPACITIES': Map.layerOpacities()
  });
  if (Map.backgroundTopic) {
    // use transparent layer with background
    wmsParams['TRANSPARENT'] = true;
  }
  var source = null;
  var wmsOptions = {
    url: Map.topics[Map.topic].wms_url,
    params: wmsParams,
    serverType: Config.map.wmsServerType,
    dpi: Config.map.dpi     //TODO check this
  };
  Map.topicLayer = null;
  if (Map.useTiledWMS) {
    source = new ol.source.TileWMS(wmsOptions);
    source.on('tileloaderror', function(evt) {
        Eqwc.common.redirect();
    });
    Map.topicLayer = new ol.layer.Tile({
        //extent: Config.map.extent,
        source: source
    });
  }
  else {
    wmsOptions['ratio'] = 1;
    source = new ol.source.ImageWMS(wmsOptions);
      source.on('imageloadstart', function() {
          Map.progress.addLoading();
      });
      source.on('imageloadend', function() {
        Map.progress.addLoaded();
    });
      source.on('imageloaderror', function() {
          Map.progress.addLoaded();
          Eqwc.common.redirect();
      });
    Map.topicLayer = new ol.layer.Image({
        //extent: Config.map.extent,
        source: source
    });
  }
  Map.topicLayer.name = 'topic';

  Map.map.addLayer(Map.topicLayer);
};

Map.setBackgroundLayer = function (layerName, layerId, isBase) {
    //var wmsParams = $.extend({}, Config.map.wmsParams, {
    //  'LAYERS': Map.backgroundLayers
    //});
    //var wmsOptions = {
    //  url: Map.topics[Map.backgroundTopic].wms_url,
    //  params: wmsParams,
    //  extent: Config.map.extent,
    //  serverType: Config.map.wmsServerType,
    //  dpi: Config.map.dpi
    //};
    //Map.backgroundLayer = null;
    //if (Config.map.useTiledBackgroundWMS) {
    //  Map.backgroundLayer = new ol.layer.Tile({
    //    source: new ol.source.TileWMS(wmsOptions)
    //  });
    //}
    //else {
    //  Map.backgroundLayer = new ol.layer.Image({
    //    source: new ol.source.ImageWMS(wmsOptions)
    //  });
    //}

    var lay = isBase ? Config.data.baselayers[layerId] : Config.data.extralayers[layerId];

    var layOl3 = {};
    var visible = (layerId == 0 && isBase && Eqwc.settings.visibleFirstBaseLayer) ? true : false;

    switch (lay.type) {
        case 'OSM' :
            layOl3 = new ol.layer.Tile({
                visible: visible,
                //name: lay.name,
                source: new ol.source.OSM
            });

            break;

        case 'XYZ' :
            var definition = $.parseJSON(lay.definition);
            layOl3 = new ol.layer.Tile({
                visible: visible,
                //name: lay.name,
                source: new ol.source.XYZ({
                    url: definition.url
                })
            });

            break;

        case 'Bing' :
            var definition = $.parseJSON(lay.definition);
            layOl3 = new ol.layer.Tile({
                visible: visible,
                //name: lay.name,
                preload: Infinity,
                source: new ol.source.BingMaps({
                    key: definition.key,
                    imagerySet: definition.imagerySet
                })
            });

            break;

        case 'WMTS' :

            var definition = $.parseJSON(lay.definition);
            //first load capabilities
            //not used because certain capabilities does not return tileGrid extent
            //$.ajax(definition.capabilitiesUrl).then(function(response) {
            //    var result = new ol.format.WMTSCapabilities().read(response);
            //    var options = ol.source.WMTS.optionsFromCapabilities(result, {
            //        layer: definition.layer,
            //        matrixSet: definition.matrixSet,
            //        requestEncoding: definition.requestEncoding,
            //        style: definition.style,
            //        projection: Config.map.projection,
            //        format: definition.format
            //    });
            //
            //    var layOl3 = new ol.layer.Tile({
            //        visible: visible,
            //        //name: lay.name,
            //        source: new ol.source.WMTS(options)
            //    });
            //
            //    layOl3.name = lay.name;
            //
            //    // add background as base layer
            //    Map.map.getLayers().insertAt(0, layOl3);
            //});

            var matrixIds = [];
            var resolutions = [];
            var serverResolutions = eval(definition.serverResolutions);
            var projectionExtent = Config.map.projection.getExtent();
            var size = ol.extent.getWidth(projectionExtent) / 256;
            var num = serverResolutions !== undefined ? serverResolutions.length : eval(definition.numZoomLevels);

            //FIX for removing extent from OL2 definition
            var extent = Config.extractStringFromObject("OpenLayers", definition.maxExtent);

            for (var z = 0; z < num; ++z) {
                matrixIds[z] = z;
                resolutions[z] = size / Math.pow(2, z);
            }

            if (definition.matrixIds !== undefined) {
                matrixIds = eval(definition.matrixIds);
            }

            if (serverResolutions !== undefined) {
                resolutions = serverResolutions;
            }

            //if extra layer take visibility from options if exists
            var visibility = visible;
            if (!visible && definition.visibility != undefined) {
                visibility = definition.visibility;
            }

            layOl3 = new ol.layer.Tile({
                visible: visibility,
		opacity: definition.opacity, 
		extent: projectData.restrictToStartExtent ? projectData.extent.split(',') : undefined,
                source: new ol.source.WMTS({
                    url: definition.url,
                    layer: definition.layer,
                    matrixSet: definition.matrixSet,
                    requestEncoding: definition.requestEncoding,
                    style: definition.style,
                    projection: Config.map.projection,
                    format: definition.format,
                    tileGrid: new ol.tilegrid.WMTS({
                        extent: eval(extent),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    })
                })
            });

            break;

        case 'WMS' :

            var definition = $.parseJSON(lay.definition);

            //if extra layer take visibility from options if exists
            var visibility = visible;
            if (!visible && definition.visibility != undefined) {
                visibility = definition.visibility;
            }

            //tiled wms layer
            layOl3 = new ol.layer.Tile({
                visible: visibility,
                //name: lay.name,
                source: new ol.source.TileWMS({
                    url: definition.url,
                    params: definition.params
                })
            });

            break;

    }

    //this is layer id, must be same as layer name from database!
    layOl3.name = lay.name;

    // add background as base layer
    Map.map.getLayers().insertAt(0, layOl3);
    Map.backgroundLayers[layOl3.name] = layOl3;
};

//Map.toggleBackgroundLayer = function(visible) {
//  if (Map.backgroundLayer != null) {
//    Map.backgroundLayer.setVisible(visible);
//  }
//};

Map.clearOverlayLayers = function() {
  for (var layer in Map.overlayLayers) {
    // remove overlay layer
    Map.map.removeLayer(layer);
  }
  Map.overlayLayers = {};
};

Map.addOverlayLayer = function(overlayTopic, overlayLayers) {
  var wmsParams = $.extend({}, Config.map.wmsParams, {
    'LAYERS': overlayLayers.join(','),
    'TRANSPARENT': true
  });
  var wmsOptions = {
    url: Map.topics[overlayTopic].wms_url,
    params: wmsParams,
    extent: Config.map.extent,
    serverType: Config.map.wmsServerType,
    dpi: Config.map.dpi
  };
  var overlayLayer = null;
  if (Config.map.useTiledOverlayWMS) {
    overlayLayer = new ol.layer.Tile({
      source: new ol.source.TileWMS(wmsOptions)
    });
  }
  else {
    overlayLayer = new ol.layer.Image({
      source: new ol.source.ImageWMS(wmsOptions)
    });
  }
  overlayLayer.name = 'overlay_' + overlayTopic;

  if (Map.overlayLayers[overlayTopic] != undefined) {
    // remove any existing layer for this overlay topic
    Map.map.removeLayer(Map.overlayLayers[overlayTopic]);
  }
  Map.overlayLayers[overlayTopic] = overlayLayer;
  Map.map.addLayer(overlayLayer);
};

Map.toggleOverlayLayer = function(overlayTopic, visible) {
  if (Map.overlayLayers[overlayTopic] != undefined) {
    Map.overlayLayers[overlayTopic].setVisible(visible);
  }
};

Map.setSelectionLayer = function(layer) {
  if (Map.selectionLayer != null) {
    // remove selection layer
    Map.map.removeLayer(Map.selectionLayer);
    Map.selectionLayer = null;
  }

  if (layer != null) {
    // add new selection layer on top
    Map.selectionLayer = layer;
    Map.map.addLayer(Map.selectionLayer);
  }
};

Map.toggleSelectionLayer = function(visible) {
  if (Map.selectionLayer != null) {
    Map.selectionLayer.setVisible(visible);
  }
};

Map.setRedliningLayer = function(layer) {
  if (Map.redliningLayer != null) {
    // remove redlining layer
    Map.map.removeLayer(Map.redliningLayer);
    Map.redliningLayer = null;
  }

  if (layer != null) {
    // add new redlining layer on top
    Map.redliningLayer = layer;
    Map.map.addLayer(Map.redliningLayer);
  }
};

Map.toggleRedliningLayer = function(visible) {
  if (Map.redliningLayer != null) {
    Map.redliningLayer.setVisible(visible);
  }
};

Map.setHighlightLayer = function(layer) {
  if (Map.highlightLayer != null) {
    // remove highlight layer
    Map.map.removeLayer(Map.highlightLayer);
    Map.highlightLayer = null;
  }

  if (layer != null) {
    // add new highlight layer on top
    Map.highlightLayer = layer;
    Map.map.addLayer(Map.highlightLayer);
  }
};

Map.setLayerVisible = function(layername, visible, updateMap) {
  Map.layers[layername].visible = visible;
  if (updateMap) {
    Map.mergeWmsParams({
      'LAYERS': Map.visibleLayers().join(',')
    });
  }
};

Map.visibleLayers = function() {
  // collect visible layers
  var visibleLayers = [];
  for (var key in Map.layers) {
    if (Map.layers[key].visible) {
      projectData.use_ids ? visibleLayers.push(Map.layers[key].id) : visibleLayers.push(Map.layers[key].title);
    }
  }
  return visibleLayers;
};

Map.featureInfoLayers = function () {
    // collect visible layers for current scale
    var featureInfoLayers = [];
    var currentRes = Map.map.getView().getResolution();
    for (var key in Map.layers) {
        var layer = Map.layers[key];
        if (layer.visible && layer.identify) {
            var visible = true;

            // check if layer is in scale range
            if (layer.minscale != undefined) {
                visible = (currentRes >= Map.scaleDenomToResolution(layer.minscale, false));
            }
            if (visible && layer.maxscale != undefined) {
                visible = (currentRes <= Map.scaleDenomToResolution(layer.maxscale, false));
            }

            if (visible) {
                featureInfoLayers.push(key);
            }
        }
    }

    //check if have to replace layers for identify
    var checkArr = Eqwc.settings.replaceIdentifyLayerWithView;
    if (checkArr) {
        for (var i = 0; i < checkArr.length; i++) {
            var sourceLay = checkArr[i];
            var sourceLayId = Eqwc.common.getLayerId(sourceLay);
            var replaceLayId = sourceLayId;
            if(sourceLayId) {
                var replaceLay = Eqwc.common.getIdentifyLayerName(sourceLayId);
                replaceLayId = Eqwc.common.getLayerId(replaceLay);
            }
            var j = featureInfoLayers.indexOf(sourceLayId);
            if (j > -1) {
                featureInfoLayers[j] = replaceLayId;
            }
        }
    }
    return featureInfoLayers;
};

// coordinate: [x, y]
Map.getGetFeatureInfoUrl = function(coordinate, params) {
  var view = Map.map.getView();
  return Map.topicLayer.getSource().getGetFeatureInfoUrl(
    coordinate,
    view.getResolution(),
    view.getProjection(),
    params
  );
};

// transparency between 0 and 100
Map.setLayerTransparency = function(layername, transparency, updateMap) {
  Map.layers[layername].transparency = transparency;
  if (updateMap) {
    Map.mergeWmsParams({
      'OPACITIES': Map.layerOpacities()
    });
  }
};

Map.layerOpacities = function() {
  var layerOpacities = [];
  var opacitiesActive = false;
  for (var key in Map.layers) {
    if (Map.layers[key].visible) {
      // scale transparency[0..100] to opacity[255..0]
      var opacity = Math.round((100 - Map.layers[key].transparency) / 100 * 255);
      layerOpacities.push(opacity);
      opacitiesActive = opacitiesActive || (opacity != 255);
    }
  }
  if (opacitiesActive) {
    return layerOpacities.join(',');
  }
  else {
    // remove OPACITIES param
    return null;
  }
};

Map.refresh = function() {
  var visibleLayers = Map.visibleLayers();
  if (visibleLayers.length > 0) {
    Map.mergeWmsParams({
      'LAYERS': visibleLayers.join(','),
      'OPACITIES': Map.layerOpacities()
    });
  }
  // hide map layer if there are no visible layers
  Map.topicLayer.setVisible(visibleLayers.length > 0);
};

// force redraw
Map.redraw = function() {
  Map.mergeWmsParams({t: new Date().getTime()});
};

Map.mergeWmsParams = function(params) {
  var source = Map.topicLayer.getSource();
  var newParams = $.extend({}, source.getParams(), params);
  source.updateParams(newParams);
};

// set map rotation in rad
Map.setRotation = function(rotation) {
  Map.map.getView().setRotation(rotation);
};

// get resolution for a scale
// set closest to get closest view resolution
Map.scaleDenomToResolution = function(scaleDenom, closest) {
  // resolution = scaleDenom / (metersPerUnit * dotsPerMeter)
  var res = scaleDenom / (Map.map.getView().getProjection().getMetersPerUnit() * (Config.map.dpi / 0.0254));
  if (closest) {
    return Map.map.getView().constrainResolution(res);
  }
  else {
    return res;
  }
};

// set max zoom of map
Map.setMinScaleDenom = function(scaleDenom) {
  Map.minResolution = Map.scaleDenomToResolution(scaleDenom, true);
  Map.clampToScale(scaleDenom);
};

// adjust max zoom
Map.clampToScale = function(scaleDenom) {
  var minRes = Map.scaleDenomToResolution(scaleDenom, true);
  if (Map.map.getView().getResolution() < minRes) {
    Map.map.getView().setResolution(minRes);
  }
};

// zoom to extent and clamp to max zoom level
// extent as [<minx>, <miny>, <maxx>, maxy>]
Map.zoomToExtent = function(extent, minScaleDenom) {
  Map.map.getView().fit(extent, Map.map.getSize());
  if (minScaleDenom != null) {
    Map.clampToScale(minScaleDenom);
  }
};

// center map
// center as [<x>, <y>]
Map.setCenter = function(center) {
  Map.map.getView().setCenter(center);
};

// zoom to scale
Map.setScale = function(scaleDenom) {
  var res = Map.scaleDenomToResolution(scaleDenom, true);
  Map.map.getView().setResolution(res);
};

// zoom to zoom level
Map.setZoom = function(zoom) {
  Map.map.getView().setZoom(zoom);
};

//This part is called from native Android app
Map.updateAndroidLocation = function(data) {
    //assuming Map.geolocation instanceof AndroidLocation
    Map.geolocation.setLocation(data, Gui.tracking);
};

Map.toggleTracking = function (enabled) {
    if (Map.geolocation == null) {
        // create geolocation
        if(typeof Android == 'undefined') {
            Map.geolocation = new ol.Geolocation({
                projection: Map.map.getView().getProjection(),
                trackingOptions: {
                    enableHighAccuracy: true,
                    maximumAge: 20000,
                    timeout: 21000
                }
            });
            Map.geolocation.set('source', 'Geolocation API');
        } else {
            Map.geolocation = new ol.AndroidLocation({projection: Map.map.getView().getProjection()});
            Map.geolocation.set('source', 'Android API');
        }

        var antenna = parseFloat($('#antennaHeight').length > 0 ? $('#antennaHeight')[0].value : 0);
        if (isNaN(antenna)) {
            antenna = 0;
        }

        //adjust antennatype offset if set
        var antOffset = 0;
        var antType = '';
        if (typeof(Editor)=='function') {
            antOffset = mobEditor.getAntennaOffset();
            antenna+=antOffset;
            antType = mobEditor.getAntennaType();
        }

        Map.geolocation.setProperties({
            altCorrection: 0,
            altCorrectionSource: '',
            antenna: antenna,
            antennaOffset: antOffset,
            antennaType: antType
        });

        Map.geolocation.on('error', function (error) {
            //if (error.code == error.PERMISSION_DENIED) {
            //  alert(I18n.geolocation.permissionDeniedMessage);
            //}
            if(error.code == Eqwc.geolocationErrors.TIMEOUT) {
                //fix Firefox issue with restarting gelocation tracking
                Map.geolocation.setTracking(false);
                Map.geolocation.setTracking(true);
            } else {
                alert(error.message);
                $('#btnLocation .ui-icon').toggleClass('ui-icon-location_on', false);
                $('#btnLocation .ui-icon').toggleClass('ui-icon-location_off', true);
                Gui.tracking = false;
                Gui.showLocationPanel(false);
                $('#locationMarker').toggle(false);

                //switch off geolocation layer
                Map.geolocationLayer.setVisible(false);
            }
        });

        Map.geolocation.on('change', function () {
            var coordinates = Map.geolocation.getPosition();
            marker.setPosition(coordinates);
            Gui.showLocationPanel(true);

            if (typeof(Editor)=='function') {
                mobEditor.showEditPanel(true);
                if ( typeof(Record)=='function' && mobRecord.layer) {
                    mobRecord.updateRecording();
                }
                if (mobGoto && mobGoto.feature) {
                    mobGoto.updateGotoContent();
                }
            }
            $('#btnInfo').show();

            //switch on geolocation layer
            Map.geolocationLayer.setVisible(true);
        });

        //location accuracy geometry
        var accuracyFeature = new ol.Feature();
        accuracyFeature.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.05)'
            })
        }));

        // add geolocation marker
        var marker = new ol.Overlay({
            element: ($('<div id="locationMarker" class="locationMarkerNormal"></div>'))[0],
            positioning: 'center-center',
            stopEvent: false
        });

        Map.geolocation.on('change:accuracy', function () {
            var acc = Map.geolocation.getAccuracy();
            var el = $('#locationMarker');
            if(typeof(Editor) == 'function') {
                if (acc < EditorConfig.accuracyLimit) {
                    el.addClass('locationMarkerGood').removeClass('locationMarkerNormal');
                    accuracyFeature.setStyle(new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(0, 255, 0, 0.05)'
                        })
                    }));
                } else {
                    el.addClass('locationMarkerNormal').removeClass('locationMarkerGood');
                    accuracyFeature.setStyle(new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 0, 0, 0.05)'
                        })
                    }));
                }
            }

        });

        Map.geolocation.on('change:accuracyGeometry', function () {
            accuracyFeature.setGeometry(Map.geolocation.getAccuracyGeometry());
        });

        Map.geolocationLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [accuracyFeature]
            })
            //style: style
        });
        Map.geolocationLayer.name = 'geolocation';
        Map.map.addLayer(Map.geolocationLayer);

        Map.map.addOverlay(marker);
        //marker.bindTo('position', Map.geolocation);
    }

    Map.geolocation.setTracking(enabled);
    $('#locationMarker').toggle(enabled);

    if (enabled) {
        // always jump to first geolocation
        Map.geolocation.once('change:position', Map.initialCenterOnLocation);
    } else {
        Gui.showLocationPanel(false);
        if (typeof(Editor)=='function') {
            mobEditor.showEditPanel(false);
            if (typeof (Record) == 'function') {
                mobRecord.showRecordPanel(false);
            }
        }
        $('#btnInfo').hide();
        Map.geolocationLayer.setVisible(false);
    }
};

Map.toggleFollowing = function(enabled) {
  if (Map.geolocation != null) {
    if (enabled) {
      Map.geolocation.on('change:position', Map.centerOnLocation);
    }
    else {
      Map.geolocation.un('change:position', Map.centerOnLocation);
    }
  }
};

Map.initialCenterOnLocation = function () {

    var pos = Map.geolocation.getPosition();
    var view = Map.map.getView();

    if (Config.map.initialGeolocationMaxScale != null) {
        var maxRes = Map.scaleDenomToResolution(Config.map.initialGeolocationMaxScale, true);
        if (Map.map.getView().getResolution() > maxRes) {
            view.animate({center: pos, resolution: maxRes});
        } else {
            view.animate({center: pos});
        }
    } else {
        view.animate({center: pos});
    }

    if (typeof(Editor) == 'function') {
        if (EditorConfig.altCorrectionLayer) {
            mobEditor.getHeightCorrection();
        }
        if (typeof (Record) == 'function') {
            mobRecord.showRecordPanel(true);
        }
    }
    // disable after first update
    Map.geolocation.un('change:position', Map.initialCenterOnLocation);
};

Map.centerOnLocation = function() {
    //we do not recenter every position update
    var view = Map.map.getView();
    var center = view.getCenter();
    var pos = Map.geolocation.getPosition();
    var dx = Math.abs(center[0]-pos[0]);
    var dy = Math.abs(center[1]-pos[1]);
    var extent = Map.map.getView().calculateExtent();
    if(dx > (ol.extent.getWidth(extent) / 4) || (dy > (ol.extent.getHeight(extent) / 4))) {
        view.animate({center: pos});
        Map.clampToScale(Config.map.minScaleDenom.geolocation);
    }
};

Map.setWindowOrientation = function(orientation) {
  Map.windowOrientation = orientation;
  if (Map.deviceOrientation != null && Map.deviceOrientation.getTracking() && Map.deviceOrientation.getHeading() != undefined) {
    Map.setRotation(Map.adjustedHeading(-Map.deviceOrientation.getHeading()));
  }
};

Map.adjustedHeading = function(heading) {
  if (Map.windowOrientation != undefined) {
    // include window orientation (0, 90, -90 or 180)
    heading -= Map.windowOrientation * Math.PI / 180.0;
  }
  return heading;
};

Map.toggleOrientation = function(enabled) {
  if (Map.deviceOrientation == null) {
    Map.deviceOrientation = new ol.DeviceOrientation();

    Map.deviceOrientation.on('change:heading', function(event) {
      var heading = Map.adjustedHeading(-event.target.getHeading());
      if (Math.abs(Map.map.getView().getRotation() - heading) > 0.0175) {
        Map.setRotation(heading);
      }
    });
  }

  Map.deviceOrientation.setTracking(enabled);
};

Map.toggleClickMarker = function(enabled) {
  if (Map.clickMarker == null) {
    Map.clickMarker = new ol.Overlay({
      element: ($('<div id="clickMarker"></div>'))[0],
      positioning: 'center-center',
      stopEvent: false
    });
    Map.map.addOverlay(Map.clickMarker);
  }
  Map.clickMarker.setPosition(enabled ? Map.lastClickPos : undefined);
};

Map.toggleScalebar = function(enabled) {
  if (Map.scaleLine == null) {

      var units = Eqwc.settings.measurementsUnitSystem ? Eqwc.settings.measurementsUnitSystem : 'metric';
      if(units.toLowerCase()=='english') {
          units='us';
      } else if (units.toLowerCase()=='geographic') {
          units='degrees';
      }

      Map.scaleLine = new ol.control.ScaleLine({
      units: units
    });
  }
  if (enabled && Map.scaleLine.getMap() == null) {
    Map.map.addControl(Map.scaleLine);
  }
  else {
    Map.map.removeControl(Map.scaleLine);
  }
};

// do not forward click events to click handlers if disabled
Map.toggleClickHandling = function(enabled) {
  Map.ignoreClick = !enabled;
};

// register a MapClickHandler under a name
Map.registerClickHandler = function(name, handler) {
  Map.singleClickHandlers[name] = handler;
};

// unregister a MapClickHandler by name
Map.unregisterClickHandler = function(name) {
  if (Map.singleClickHandlers[name]) {
    Map.singleClickHandlers[name].toggle(false);
    delete Map.singleClickHandlers[name];
  }
};

// activate a MapClickHandler by name (null to deactivate all)
Map.activateClickHandler = function(name) {
  // deactivate other handlers
  for (var key in Map.singleClickHandlers) {
    var handler = Map.singleClickHandlers[key];
    handler.toggle(false);
  }

  // activate requested handler
  if (name != null && Map.singleClickHandlers[name]) {
    Map.singleClickHandlers[name].toggle(true);
  }
};

Map.featureInfoOnLocation = function() {
    if (!Map.ignoreClick) {
        var location = Map.geolocation.getPosition();
        var fi = new FeatureInfo(Gui.showFeatureInfoResults);
        fi.callOnLocation(location, Config.featureInfo.useWMSGetFeatureInfo, null);
        Map.lastClickPos = location;
    }
};

Map.openNavigation = function() {

    var destination = new ol.geom.Point(Map.lastClickPos);
    var destWgs = destination.transform(projectData.crs,'EPSG:4326');
    var url = "https://www.google.com/maps/dir/?api=1&";
    var params = {};
    params.destination = destWgs.getCoordinates().reverse().toString();

    //if (Map.geolocation) {
    //    params.origin = Map.geolocation.getPositionRaw().reverse().toString();  //wgs84
    //}

    //console.log(url+ $.param(params));
    window.open(url+ $.param(params), '_blank');
};
