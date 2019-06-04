/**
 * jQuery Mobile GUI
 *
 * events:
 *   topiclayersloaded({topic: <topic>}) 
 */

var Gui = {};

// login status
Gui.signedIn = false;

// location tracking
Gui.tracking = false;
Gui.following = true;
Gui.orientation = true;

// flag if this is the load on startup
Gui.initialLoad = true;
// currently selected layer in layer order panel
Gui.selectedLayer = null;
// original position of currently dragged layer in layer order panel
Gui.draggedLayerIndex = null;
// flag if layer order has been changed manually
Gui.layerOrderChanged = false;

Gui.updateLayout = function() {
  // use full content size for map
  $('#map').height(window.innerHeight);
  $('#map').width(window.innerWidth);

  // limit panels to screen height
  $('#panelTopics').height(window.innerHeight - 60);
  $('#panelLayerAll').height(window.innerHeight - 60);
  $('#panelLayerOrder').height(window.innerHeight - 60);
  $('#panelFeatureInfo #featureInfoResults').height(window.innerHeight - 40);
  $('#panelSearch .ui-listview').height(window.innerHeight);
  $('#panelPropertiesMap').height(window.innerHeight - 60);
  $('#panelPropertiesEditor').height(window.innerHeight - 60);
};

// show selected panel
Gui.panelSelect = function(panel) {
  $('#panelTopics').toggle(panel === 'panelTopics');
  $('#panelLayerAll').toggle(panel === 'panelLayerAll');
  $('#panelLayerOrder').toggle(panel === 'panelLayerOrder');
  // mark panel button
  $('#buttonTopics').toggleClass('selected', panel === 'panelTopics');
  $('#buttonLayerAll').toggleClass('selected', panel === 'panelLayerAll');
  $('#buttonLayerOrder').toggleClass('selected', panel === 'panelLayerOrder');
};

Gui.propertiesSelect = function(panel) {
    $('#panelPropertiesMap').toggle(panel === 'panelPropertiesMap');
    $('#panelPropertiesEditor').toggle(panel === 'panelPropertiesEditor');
    // mark panel button
    $('#buttonPropertiesMap').toggleClass('selected', panel === 'panelPropertiesMap');
    $('#buttonPropertiesEditor').toggleClass('selected', panel === 'panelPropertiesEditor');
};

//location panel
Gui.showLocationPanel = function (show) {

    // convert radians to degrees
    function radToDeg(rad) {
        return rad * 360 / (Math.PI * 2);
    }

    if (show) {

        var units = proj4.defs[Map.userCrs].units;
        var prec = 2;
        if (units == 'degrees') {
            prec = 4;
        }

        var coordinates = Map.geolocation.getPosition();
        var pos = new ol.geom.Point(coordinates);

        if(Map.userCrs != projectData.crs) {
            pos.transform(projectData.crs, Map.userCrs);
        }

        var accuracy = Map.geolocation.getAccuracy();
        var altitude = Map.geolocation.getAltitude();

        if (typeof Map.geolocation.getAltitudeCorrected == 'function') {
            altitude = Map.geolocation.getAltitudeCorrected();
        }

        var extra = Map.geolocation.getProperties();
        var heading = Map.geolocation.getHeading();
        var speed = Map.geolocation.getSpeed();

        var html = [
            pos.getCoordinates()[0].toFixed(prec) + ', ' + pos.getCoordinates()[1].toFixed(prec)
        ];

        if (Eqwc.settings.mobileShowAccuracy) {
            if (typeof(Editor) == 'function') {
                if (accuracy < EditorConfig.accuracyLimit) {
                    html.push(I18n.geolocation.accuracy + ': ' + accuracy.toPrecision(3) + ' m');
                } else {
                    html.push('<span style="color:red;font-weight:bold;">' + I18n.geolocation.accuracy + ': ' + accuracy.toPrecision(4) + ' m </span>');
                }
            } else {
                html.push(I18n.geolocation.accuracy + ': ' + accuracy.toPrecision(3) + ' m');
            }
        }

        if (altitude) {
            html.push(I18n.geolocation.altitude+': ' + altitude.toFixed(2)+ ' m');
            if(extra.altCorrection>0) {
                html.push(extra.altCorrectionSource);
            }
            //if(extra.source == 'Android API') {
                html.push('AH: ' + parseFloat(extra.antenna-extra.antennaOffset)+ ' m ' + extra.antennaType);
            //}
        }

        if (heading && speed>1) {
            html.push(I18n.geolocation.heading+': ' + Math.round(radToDeg(heading)) + '&deg;');
            html.push(I18n.geolocation.speed+': ' + (speed * 3.6).toFixed(1) + ' km/h');
        }


        $('#locationPanel').html(html.join('<br />'));
        $('#locationPanel').show();
    } else {
        $('#locationPanel').hide();
        if (typeof(Editor) == 'function' && mobGoto) {
            mobGoto.showGotoPanel(false);
        }
    }
};

// fill topics list
Gui.loadTopics = function(categories) {
  var html = "";
  var coll = "";
  Map.topics = {};
  for (var i=0; i<categories.length; i++) {
    var category = categories[i];

    //html += '<li data-role="list-provider">' + category.title + '</li>';

    for (var j=0;j<category.topics.length; j++) {
      var topic = category.topics[j];

      if (topic.main_layer != false) {
        //html += '<li class="topic" data-topic="' + topic.name + '">';
        html +=   '<a href="'+Eqwc.settings.gisPortalRoot+'" target="_self"><img style="padding:5px" src="' + topic.icon + '"/></a>';
        //html +=   '<p style="white-space:pre-wrap">' + category.title + '</p>';
        //html +=   '<a href="#" data-role="button" data-inline="true">'+category.title+'</a>';
        //html += '</li>';
      }

      Map.topics[topic.name] = {
        title: topic.title,
        wms_url: topic.wms_url,
        background_layer: topic.background_layer,
        overlay_layer: topic.overlay_layer,
        minscale: topic.minscale,
        bg_topic: topic.bg_topic,
        overlay_topics: topic.overlay_topics
      };
    }

      coll += '<div id="topicList" data-role="collapsible">';
      coll += '<h4>' + topic.title + '</h4>';
      coll += '<p>'+projectData.project+'</p>';
      coll += '<p>'+projectData.crs+'</p>';
      if(projectData.description!='{}') {
          coll += '<p>' + projectData.description + '</p>';
      }

      coll += '</div>';
  }

    var panel = $('#topicMain');

    //var collaps =  $('#topicList');
    panel.prepend(coll);
    panel.prepend(html);
    panel.find('div[data-role=collapsible]').collapsible({theme:'c',refresh:true});

    // select initial topic
    Gui.selectTopic(Config.permalink.initialTopic || Config.data.initialTopic);
};

Gui.selectTopic = function(topic) {
  Map.clearLayers();
  Map.topic = topic;
  Map.setMinScaleDenom(Map.topics[Map.topic].minscale || Config.map.minScaleDenom.map);

  // background topic
  Map.backgroundTopic = Map.topics[Map.topic].bg_topic || null;
  if (Gui.initialLoad) {
    // background topic from permalink
    if (Config.permalink.initialBackgroundTopic) {
      Map.backgroundTopic = Config.permalink.initialBackgroundTopic;
    }
  }
  if (Map.topics[Map.backgroundTopic] == undefined || !Map.topics[Map.backgroundTopic].background_layer) {
    // invalid background topic
    Map.backgroundTopic = null;
  }

  // load layers
  Layers.loadLayers(null, Gui.loadLayers);

  //Layers.loadLayers(null, Gui.loadExtraLayers);
    Gui.loadExtraLayers();
    Gui.loadBackgroundLayers();

  //if (Map.backgroundTopic != null) {
    // load background layers
    //Layers.loadLayers(Config.data.layersUrl(Map.backgroundTopic), Gui.loadBackgroundLayers);
    //Layers.loadLayers(null, Gui.loadBackgroundLayers);
  //}

  // mark topic button
  //$('#topicList li.topic').removeClass('selected');
  //$('#topicList li.topic[data-topic=' + topic + ']').addClass('selected');
};

// update layers list
Gui.loadLayers = function (data) {
    var html = "";
    var layers = [];

    function fillLayertree(node, parent, depth, type) {
        if (node.layers.length > 0) {
            // add group
            html += '<div data-role="collapsible" data-theme="c"';
            if (Config.gui.useLayertreeGroupCheckboxes) {
                html += ' data-groupcheckbox="true"';
            }
            html += '>';
            html += '<h3>' + node.name + '</h3>';
        }
        else {
            // find layer parent group
            var groupTitle = parent || Layers.markerPrefix + node.name;
            var group = $.grep(data.groups, function (el) {
                return el.title === groupTitle;
            })[0];
            if (group != undefined) {
                // find layer in group
                var layer = $.grep(group.layers, function (el) {
                    return el.layername === node.name;
                })[0];

                //skip if it is hidden layer
                if (Eqwc.common.getHiddenLayersFromSettings().indexOf(layer.layername) > -1) {
                    return;
                }

                //skip if layer with same name exists in backgroundLayers
                if (Config.baseLayerExists(layer.layername)) {
                    return;
                }
                if (Config.extraLayerExists(layer.layername)) {
                    return;
                }

                // add layer
                html += '<label>';
                html += '<input type="' + type + '" ';

                //group layer + legend
                //html += '<div data-role="collapsible" data-theme="c"';
                //html += ' data-iconpos="right" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-groupcheckbox="true"';
                //html += '>';
                //html += '<h3>' + node.name + '</h3>';
                //
                //// add layer, but hidden, checkbox in group above will control layer on/off
                //html += '<label style="display:none">';
                //html += '<input style="display:none" type="' + type + '" ';
                if (parent != null) {
                    // prevent auto-enhancement by jQuery Mobile if layer belongs to a group
                    html += 'data-role="none" ';
                }
                html += 'name="' + layer.layername + '" ';
                html += 'data-layer="' + layer.id + '" ';
                if (layer.visini) {
                    html += 'checked ';
                }
                html += '>' + layer.toclayertitle;
                html += '</input>';
                html += '</label>';

                //var legendUrl = Map.topics[Map.topic].wms_url +
					//	"?SERVICE=WMS"+
					//	"&VERSION=1.3.0"+
					//	"&REQUEST=GetLegendGraphics"+
					//	"&FORMAT=image/png"+
					//	"&EXCEPTIONS=application/vnd.ogc.se_inimage"+
					//	"&BOXSPACE=1"+
					//	"&LAYERSPACE=2"+
					//	"&SYMBOLSPACE=1"+
					//	"&SYMBOLHEIGHT=2"+
					//	"&LAYERFONTSIZE=8"+
					//	"&ITEMFONTSIZE=8"+
                //        "&LAYERTITLE=FALSE"+
                //        "&LAYERTITLESPACE=0"+
                //        "&TRANSPARENT=TRUE"+
					//	"&LAYERS="+encodeURIComponent(layer.id)+
					//	"&DPI="+encodeURIComponent(Config.map.dpi);
                //html+='<img data-layer="'+layer.id+'" src="' + legendUrl + '"';
                //html += '</img>';
                //
                //html += '</div>';
                //if (!layer.visini) {
                //    html += '" style="display:none;" ';
                //}
                //html+=' />';
                layers.push({
                    id: layer.id,
                    layername: layer.layername,
                    title: layer.toclayertitle,
                    wms_sort: layer.wms_sort,
                    visible: layer.visini,
                    minscale: layer.minscale,
                    maxscale: layer.maxscale,
                    hidden_attributes: layer.hidden_attributes,
                    hidden_values: layer.hidden_values
                });
            }
        }

        // traverse children
        for (var i = 0; i < node.layers.length; i++) {
            fillLayertree(node.layers[i], node.name, depth + 1, "checkbox");
        }

        if (node.layers.length > 0) {
            html += '</div>';
        }
    }

    // fill layer tree
    for (var i = 0; i < data.layertree.length; i++) {
        fillLayertree(data.layertree[i], null, 0, "checkbox");
    }

    $('#panelLayerAll').html(html);
    $('#panelLayerAll').trigger('create');

    // enhance checkboxes of group children when expanding for the first time
    function enhanceCheckbox() {
        var labels = $(this).children('.ui-collapsible-content').children('label');
        labels.find(':checkbox[data-role="none"]').attr('data-role', null);
        labels.trigger('create');
        $(this).unbind('expand', enhanceCheckbox);
    }
    var groups = $('#panelLayerAll').find('.ui-collapsible');
    groups.bind('expand', enhanceCheckbox);

    // root group change (NOTE: add binding after building the layer tree, to skip events during creation)
    $('#panelLayerAll').children('.ui-collapsible[data-groupcheckbox=true]').bind('groupchange', function (e) {
        var visibleLayers = Map.visibleLayers();
        $(this).find(':checkbox').each(function (index) {
            var layerVisible = (visibleLayers.indexOf($(this).data('layer')) != -1);
            if (layerVisible != $(this).is(':checked')) {
                // layer visibility changed
                Map.setLayerVisible($(this).data('layer'), $(this).is(':checked'), false);
                Gui.updateLayerOrder($(this).data('layer'), $(this).is(':checked'));
            }
        });
    });

    // store layers sorted by wms_sort
    layers = layers.sort(function (a, b) {
        return a.wms_sort - b.wms_sort;
    });
    Map.layers = {};
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        Map.layers[layer.id] = {
            id: layer.id,
            title: layer.title,
            visible: layer.visible,
            wms_sort: layer.wms_sort,
            minscale: layer.minscale,
            maxscale: layer.maxscale,
            hidden_attributes: layer.hidden_attributes,
            hidden_values: layer.hidden_values,
            transparency: 0
        };
    }

    Gui.layerOrderChanged = false;
    if (Gui.initialLoad) {
        Gui.applyPermalink();
    }
    Map.setTopicLayer();
    Gui.resetLayerOrder();

    // add any overlay topics
    var overlayTopics = Map.topics[Map.topic].overlay_topics || [];
    if (Gui.initialLoad && Config.permalink.initialOverlayTopics != null) {
        // add any additional overlay topics from permalink
        for (var i = 0; i < Config.permalink.initialOverlayTopics.length; i++) {
            var overlayTopic = Config.permalink.initialOverlayTopics[i];
            if (overlayTopics.indexOf(overlayTopic) == -1) {
                overlayTopics.push(overlayTopic);
            }
        }
    }
    Gui.setupOverlayTopics(overlayTopics);

    // add any overlays from permalink
    Config.permalink.addOverlays(Gui.setSelectionLayer, Gui.setRedliningLayer);

    if (Gui.initialLoad) {
        Gui.initialLoad = false;
    }

    $.event.trigger({type: 'topiclayersloaded', topic: Map.topic});
};

// add background layer
Gui.loadBackgroundLayers = function(data) {

    if (Config.data.baselayers.length == 0) {
        return;
    }

    var html = '<div data-role="collapsible" data-theme="c"';

    html += '>';
    html +=   '<h3>' + I18n.layers.background + '</h3>';

    for (var i=0;i<Config.data.baselayers.length;i++) {
        var el = Config.data.baselayers[i];
        var selected ='';

        // add background layer button
        //select first in array in case of setting
        if(i==0 && Eqwc.settings.visibleFirstBaseLayer) {
            selected = ' checked="checked"';
        }
        html += '<label><input type="checkbox" name="_background_" id="' + el.name + '" data-background="true"' +selected+ '>' + el.title + '</label>'
        //create ol3 layer object, first time only, visibility false
        Map.setBackgroundLayer(el.name,i, true);

    }

    //if (Map.backgroundTopic) {

    html += '</div>';

    $('#panelLayerAll').append(html);
    $('#panelLayerAll').trigger('create');

    // background toggle
    $('#panelLayerAll :checkbox[data-background=true]').on('change', function(e) {

        var selected = $(this).attr("id");
        var layer = Map.backgroundLayers[selected];
        var isChecked = $(this).is(':checked');

        layer.setVisible(isChecked);
        //uncheck others
        $('#panelLayerAll :checkbox[data-background=true]').not($(this)).prop("checked",false).checkboxradio("refresh");

        for (var i=0; i<Config.data.baselayers.length; i++) {
            var lay = Config.data.baselayers[i].name;
            if (lay !== selected) {
                Map.backgroundLayers[lay].setVisible(false);
            }
        }
    });
};

Gui.loadExtraLayers = function(data) {

    if (Config.data.extralayers == undefined) {
        return;
    }

    var html = '<div data-role="collapsible" data-theme="c"';
    //if (Config.gui.useLayertreeGroupCheckboxes) {
    //    html += ' data-groupcheckbox="true"';
    //}
    html += '>';
    html +=   '<h3>' + I18n.layers.overlays + '</h3>';

    for (var i=0;i<Config.data.extralayers.length;i++) {
        var el = Config.data.extralayers[i];
        var selected ='';

        var definition = $.parseJSON(el.definition);

        if(definition.visibility) {
            selected = ' checked="checked"';
        }
        html += '<label><input type="checkbox" name="_extra_" id="' + el.name + '" data-extra="true"' +selected+ '>' + el.title + '</label>'
        //create ol3 layer object, first time only, visibility false
        Map.setBackgroundLayer(el.name,i, false);

    }

    html += '</div>';

    $('#panelLayerAll').append(html);
    $('#panelLayerAll').trigger('create');

    // selection toggle
    $('#panelLayerAll :checkbox[data-extra=true]').bind('change', function(e) {
        var selected = $(this).attr("id");
        var layer = Map.backgroundLayers[selected];
        var isChecked = $(this).is(':checked');

        layer.setVisible(isChecked);
    });
};


// add layer group for overlay topics
Gui.setupOverlayTopics = function(overlayTopics) {
  // filter overlayable topics
  overlayTopics = $.grep(overlayTopics, function(topic, index) {
    return Map.topics[topic] != undefined && Map.topics[topic].overlay_layer;
  });

  // remove overlays
  Map.clearOverlayLayers();
  $('#overlayTopics').remove();

  if (overlayTopics.length > 0) {
    // add overlay group to layer tree
    var html = '<div id="overlayTopics" data-role="collapsible" data-theme="c" data-groupcheckbox="false">';
    html +=      '<h3>' + I18n.layers.overlays + '</h3>';

    // add overlay layers to group (from bottom to top)
    for (var i=overlayTopics.length - 1; i>=0; i--) {
      var overlayTopic = overlayTopics[i];
      html += '<label>';
      html +=   '<input type="checkbox" ';
      html +=     'name="overlayTopic_' + overlayTopic + '" ';
      html +=     'data-overlay_topic="' + overlayTopic + '" ';
      html +=     'checked';
      html +=   '>' + Map.topics[overlayTopic].title;
      html += '</label>';
    }

    html += '</div>';

    $('#panelLayerAll').append(html);
    $('#panelLayerAll').trigger('create');

    // add overlay layers (last on top)
    for (var i=0; i<overlayTopics.length; i++) {
      Gui.addOverlayTopicLayer(overlayTopics[i]);
    }

    // overlay toggle
    $('#panelLayerAll :checkbox[data-overlay_topic]').bind('change', function(e) {
      Map.toggleOverlayLayer($(this).data('overlay_topic'), $(this).is(':checked'));
    });
  }
};

// add overlay layer
Gui.addOverlayTopicLayer = function(topic) {
  // load overlay topic layers
  Layers.loadLayers(Config.data.layersUrl(topic), function(data) {
    // collect visible layers
    var groups = data.groups;
    var layers = [];
    for (var i=0; i<groups.length; i++) {
      var group = groups[i];
      for (var j=0;j<group.layers.length; j++) {
        var layer = group.layers[j];
        if (layer.visini) {
          layers.push({
            layername: layer.layername,
            wms_sort: layer.wms_sort
          });
        }
      }
    }
    // sort by wms_sort
    layers = layers.sort(function(a, b) {
      return a.wms_sort - b.wms_sort;
    });
    var sortedLayers = [];
    for (var i=0; i<layers.length; i++) {
      sortedLayers.push(layers[i].layername);
    }
    // add overlay layer
    Map.addOverlayLayer(topic, sortedLayers);
  });
};

// add selection overlay layer
Gui.setSelectionLayer = function(layer) {
  if (layer != null) {
    // add layer button
    var html = '<label><input type="checkbox" name="_selection_" data-selection="true" checked>' + I18n.layers.selection + '</label>';
    $('#panelLayerAll').append(html);
    $('#panelLayerAll').trigger('create');

    // selection toggle
    $('#panelLayerAll :checkbox[data-selection=true]').bind('change', function(e) {
      Map.toggleSelectionLayer($(this).is(':checked'));
    });
  }
  else {
    // remove layer button
    $('#panelLayerAll :checkbox[data-selection=true]').parent('.ui-checkbox:first').remove();
  }

  Map.setSelectionLayer(layer);
};

// add redlining overlay layer
Gui.setRedliningLayer = function(layer) {
  if (layer != null) {
    // add layer button
    var html = '<label><input type="checkbox" name="_redlining_" data-redlining="true" checked>' + I18n.layers.redlining + '</label>';
    $('#panelLayerAll').append(html);
    $('#panelLayerAll').trigger('create');

    // redlining toggle
    $('#panelLayerAll :checkbox[data-redlining=true]').bind('change', function(e) {
      Map.toggleRedliningLayer($(this).is(':checked'));
    });
  }
  else {
    // remove layer button
    $('#panelLayerAll :checkbox[data-redlining=true]').parent('.ui-checkbox:first').remove();
  }

  Map.setRedliningLayer(layer);
};

// fill layer order panel from visible layers
Gui.resetLayerOrder = function() {
  var html = '';
  for (var layer in Map.layers) {
    if (Map.layers[layer].visible) {
      // NOTE: fill in reverse order, with layers drawn from bottom to top
      html = '<li data-layer="' + layer + '" data-wms_sort="' + Map.layers[layer].wms_sort + '">' + Map.layers[layer].title + '</li>' + html;
    }
  }
  $('#listOrder').html(html);
  $('#listOrder').listview('refresh');

  Gui.selectLayer(null);
};

// add/remove layer in layer order panel
Gui.updateLayerOrder = function(layer, layerAdded) {
  if (layerAdded) {
    var html = '<li data-layer="' + layer + '" data-wms_sort="' + Map.layers[layer].wms_sort + '">' + Map.layers[layer].title + '</li>';

    if (Gui.layerOrderChanged) {
      // add layer on top if layer order has been changed manually
      $('#listOrder').prepend(html);
    }
    else {
      // insert layer at wms_sort position
      // find list element with lower sort order
      var el = $('#listOrder li').filter(function() {
        return $(this).data('wms_sort') < Map.layers[layer].wms_sort;
      }).first();
      if (el.length > 0) {
        el.before(html);
      }
      else {
        // find list element with higher sort order
        el = $('#listOrder li').filter(function() {
          return $(this).data('wms_sort') > Map.layers[layer].wms_sort;
        }).last();
        if (el.length > 0) {
          el.after(html);
        }
        else {
          // add layer on top
          $('#listOrder').prepend(html);
        }
      }
    }
  }
  else {
    // remove layer
    $('#listOrder li[data-layer="' + layer + '"]').remove();
  }
  $('#listOrder').listview('refresh');

  Gui.onLayerOrderChanged(null, null);
};

Gui.onLayerDrag = function(event, ui) {
  // keep track of original position in layer order
  Gui.draggedLayerIndex = $('#listOrder li').index(ui.item);
};

// update layer order in map
Gui.onLayerOrderChanged = function(event, ui) {
  if (ui != null) {
    if ($('#listOrder li').index(ui.item) != Gui.draggedLayerIndex) {
      // layer order has been changed manually
      Gui.layerOrderChanged = true;
    }
  }

  // unselect layer
  Gui.selectLayer(null);

  // get layer order from GUI
  var orderedLayers = {};
  $($('#listOrder li').get().reverse()).each(function(index) {
    var layer = $(this).data('layer');
    orderedLayers[layer] = Map.layers[layer];
  });

  // append inactive layers
  for (var layer in Map.layers) {
    if (orderedLayers[layer] === undefined) {
      orderedLayers[layer] = Map.layers[layer];
    }
  }

  // update map
  Map.layers = orderedLayers;
  setTimeout(function() {
    Map.refresh();
  }, 1000);
};

// select layer in layer order panel
Gui.selectLayer = function(layer) {
  // unselect all layer buttons
  $('#listOrder li').removeClass('selected');

  Gui.selectedLayer = layer;
  if (Gui.selectedLayer != null) {
    // mark layer button
    $('#listOrder li[data-layer="' + layer + '"]').addClass('selected');
	//$('img[data-layer="'+layer+'"]').show();
    // update slider
    $('#sliderTransparency').val(Map.layers[layer].transparency).slider("refresh");
    $('#sliderTransparency').slider("enable");
  }
  else {
    $('#sliderTransparency').val(0).slider("refresh");
    $('#sliderTransparency').slider("disable");
  }
};

// show feature info results
Gui.showFeatureInfoResults = function(status, data) {
    if(status != 'success') {
        Map.toggleClickMarker(true);
        alert(data);
        return;
    }

    if (Config.featureInfo.format === 'text/xml') {
        Gui.showXMLFeatureInfoResults(data);
    }
    else {
        $('#featureInfoResults').html(data.join(''));
    }

    $('#panelFeatureInfo').panel('open');
    Map.toggleClickMarker(true);
};

// convert XML feature info results to HTML
Gui.showXMLFeatureInfoResults = function (results) {
    var html = "";
    var filesAlias = Eqwc.settings.qgisFilesFieldAlias ? Eqwc.settings.qgisFilesFieldAlias : 'files';
    filesAlias = filesAlias.toUpperCase();

    //add button
    if (typeof(Editor) == 'function' && mobEditor.layer) {
        html += '<a href="javascript:mobEditor.addPointOnClickPos();" data-theme="a" data-inline="true" data-mini="true" data-role="button">'+TR.editAdd+'</a>';
    }

    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var layer = Map.layers[result.layer];

        //replace back layer
        if (layer == undefined) {
            var source = Config.getLayerName(result.layer);
            var layerName = Eqwc.common.getIdentifyLayerNameRevert(source);
            var layerId = Eqwc.common.getLayerId(layerName);
            layer = Map.layers[layerId];
        }

        var layerTitle = result.layer;
        if (layer != undefined) {
            layerTitle = layer.title;
        }

        html += '<div data-role="collapsible" data-collapsed="false" data-theme="c">';
        html += '<h3>' + layerTitle + ' ('+result.features.length+')</h3>';

        var hiddenAttributes = [];
        if (layer != undefined && layer.hidden_attributes != undefined) {
            hiddenAttributes = layer.hidden_attributes;
        }
        var hiddenValues = [];
        if (layer != undefined && layer.hidden_values != undefined) {
            hiddenValues = layer.hidden_values;
        }

        for (var j = 0; j < result.features.length; j++) {
            var feature = result.features[j];
            var title = feature.id === null ? I18n.featureInfo.raster : I18n.featureInfo.feature + feature.id;

            html += '<div class="feature" data-role="collapsible" data-collapsed="false" data-theme="c">';
            html += '<h3>' + title + '</h3>';

            //add edit and goto button in case of editor plugin and layer is available for editing
            if(typeof(Editor) == 'function' && Config.data.wfslayers[layer.id]) {
                html += '<a href="javascript:Eqwc.common.callEditor(\''+layer.id+'\','+feature.id+', \'edit\');" data-theme="b" data-inline="true" data-mini="true" data-role="button">'+TR.editEdit+'</a>';
            }
            if(typeof(Editor) == 'function' && Config.data.gotolayers[layer.id]) {
                html += '<a href="javascript:Eqwc.common.callEditor(\''+layer.id+'\','+feature.id+', \'goto\');" data-theme="e" data-inline="true" data-mini="true" data-role="button">'+I18n.editor.goto+'</a>';
            }

            html += '<ul class="ui-listview-inset ui-corner-all" data-role="listview">';

            for (var k = 0; k < feature.attributes.length; k++) {
                var attribute = feature.attributes[k];
                var name = attribute.name.toUpperCase();

                // skip hidden attributes and hidden values
                //if ($.inArray(attribute.name, hiddenAttributes) == -1 && $.inArray(attribute.value, hiddenValues) == -1) {
                    html += '<li>';

                    if (name == filesAlias) {
                        if (attribute.value > '') {
                            var attArr = $.parseJSON(attribute.value);
                            var newArr = [];
                            if  (attArr === null) {
                                attribute.value = Eqwc.settings.noDataValue;
                            }   else {
                                for (var l = 0; l < attArr.length; l++) {
                                    newArr.push(Eqwc.common.manageFile(attArr[l], true));
                                }
                                attribute.value = newArr.join('</br>');
                            }
                        }
                    } else {
                        attribute.value = Eqwc.common.createHyperlink(attribute.value, null, null);
                    }

                    // add attribute name and value
                    //hide field name in this cases, hardcoded
                    if (name !== 'MAPTIP' && name !== filesAlias) {
                        html += '<span class="name">' + attribute.name + ': </span>';
                    }
                    html += '<span class="value">' + attribute.value + '</span>';
                //}
                html += '</li>';

            }

            html += '</ul>';
            html += '</div>';
        }

        html += '</div>';
    }
    if (results.length == 0) {
        html += '</br>'+I18n.featureInfo.noFeatureFound;
    }

    $('#featureInfoResults').html(html);
    $('#featureInfoResults').trigger('create');
};

// show search results list
Gui.showSearchResults = function (results) {
    $('#searchResultsList').empty();

    for (var i = 0; i < results.length; i++) {
        var categoryResults = results[i];

        // category title
        if (categoryResults.category != null) {
            $('#searchResultsList').append($('<li class="category-title">' + categoryResults.category + '</li>'));
        }

        // results
        for (var j = 0; j < categoryResults.results.length; j++) {
            var result = categoryResults.results[j];
            var li = $('<li><a href="#">' + result.name + '</a></li>');
            li.data('bbox', result.bbox);
            li.data('highlight', result.highlight);
            li.data('point', result.point);
            $('#searchResultsList').append(li);
        }
    }

    $('#searchResultsList').listview('refresh');
    $('#searchResults').show();

    // automatically jump to single result
    //TODO FIX this need total results length
    //if (results.length === 1 && result.point != null) {
    //    Gui.jumpToSearchResult(result.point);
    //    if (results[0].highlight != undefined) {
    //        Config.search.highlight(results[0].highlight, Map.setHighlightLayer);
    //    }
    //}
};

// bbox as [<minx>, <miny>, <maxx>, <maxy>]
Gui.jumpToSearchResult = function(point) {

  Map.searchMarker.setPosition(point.getCoordinates());

  Map.zoomToExtent(point.getExtent(), Config.map.minScaleDenom.search);

  // disable following
  $('#switchFollow').val('off');
  $('#switchFollow').slider('refresh');
  Gui.toggleFollowing(false);

  $('#panelSearch').panel('close');
};

// binds the reorder functionality to the visible layer list
$(document).bind('pageinit', function() {
  $('#listOrder').sortable();
  $('#listOrder').bind('sortstart', Gui.onLayerDrag);
  $('#listOrder').bind('sortstop', Gui.onLayerOrderChanged);
});

Gui.updateTranslations = function() {
  document.title = I18n.title;

  $('#panelSearch b').html(I18n.search.header);
  $('#panelSearch #searchResults b').html(I18n.search.results);

  $('#panelProperties #buttonPropertiesMap .ui-btn-text').html(I18n.properties.header);

  $('#panelProperties label[for=switchFollow]').html(I18n.properties.mapFollowing);
  $('#panelProperties label[for=switchOrientation]').html(I18n.properties.mapRotation);
  $('#panelProperties label[for=switchScale]').html(I18n.properties.scaleBar);
  $('#panelProperties .ui-slider-label:contains(Ein)').html(I18n.properties.on);
  $('#panelProperties .ui-slider-label:contains(Aus)').html(I18n.properties.off);
  $('#panelProperties #buttonLogo .ui-btn-text').html(I18n.properties.about);
  $('#dlgAbout h1').html(I18n.about.header);
  $('#panelProperties #buttonShare .ui-btn-text').html(I18n.properties.share);
  $('#panelProperties #buttonLogin .ui-btn-text').html(I18n.properties.login);
  $('#panelProperties #buttonLoginSSL .ui-btn-text').html(I18n.properties.login);
  $('#dlgLogin h1').html(I18n.login.header);
  $('#dlgLogin label[for=user]').html(I18n.login.user);
  $('#dlgLogin label[for=password]').html(I18n.login.password);
  $('#dlgLogin #buttonSignIn .ui-btn-text').html(I18n.login.signIn);
  $('#dlgLogin #buttonLoginCancel .ui-btn-text').html(I18n.login.cancel);
  $('#panelProperties #buttonSignOut .ui-btn-text').html(I18n.login.signOut);

  $('#panelLayer #buttonTopics .ui-btn-text').html(I18n.layers.project);
  $('#panelLayer #buttonLayerAll .ui-btn-text').html(I18n.layers.layers);
  $('#panelLayer #buttonLayerOrder .ui-btn-text').html(I18n.layers.layerOrder);
  $('#panelLayer #sliderTransparency-label').html(I18n.layers.transparency);

  $('#panelFeatureInfo b').html(I18n.featureInfo.header);
};

Gui.toggleFollowing = function(enabled) {
  Gui.following = enabled;
  Map.toggleFollowing(Gui.tracking && Gui.following);
};

Gui.toggleOrientation = function(enabled) {
  Gui.orientation = enabled;
  Map.toggleOrientation(Gui.orientation);
};

Gui.applyPermalink = function() {
  // map extent
  if (Config.permalink.startExtent != null) {
    Map.zoomToExtent(Config.permalink.startExtent, null);
  }
  else {
    if (Config.permalink.startCenter != null) {
      Map.setCenter(Config.permalink.startCenter);
    }
    if (Config.permalink.startScale != null) {
      Map.setScale(Config.permalink.startScale);
    }
    else if (Config.permalink.startZoom != null) {
      Map.setZoom(Config.permalink.startZoom);
    }
  }

  var toggleLayer = function(layer, active) {
    // override layer visibility
    Map.layers[layer].visible = active;

    // update layer tree
    var checkbox = $('#panelLayerAll :checkbox[data-layer="' + layer + '"]');
    if (checkbox.is(':checked') != active) {
      checkbox.prop('checked', active).checkboxradio('refresh').trigger('change');
    }
  };

  if (Config.permalink.activeLayers != null) {
    // active layers and layer order
    var layers = [];
    var layerOrderChanged = false;
    var lastIndex = -1;
    for (var layer in Map.layers) {
      var index = $.inArray(layer, Config.permalink.activeLayers);
      var active = (index != -1);

      toggleLayer(layer, active);

      if (active) {
        layers.push({
          layername: layer,
          sort: index
        });
        // check if layer order differs from original
        if (!layerOrderChanged) {
          layerOrderChanged = (index < lastIndex);
          lastIndex = index;
        }
      }
    }
    layers = layers.sort(function(a, b) {
      return a.sort - b.sort;
    });

    // update layer order in map
    var orderedLayers = {};
    for (var i=0; i<layers.length; i++) {
      var layer = layers[i].layername;
      // append active layers
      orderedLayers[layer] = Map.layers[layer];
    }
    // append inactive layers
    for (var layer in Map.layers) {
      if (orderedLayers[layer] === undefined) {
        orderedLayers[layer] = Map.layers[layer];
      }
    }
    Map.layers = orderedLayers;
    Gui.layerOrderChanged = layerOrderChanged;
  }
  else if (Config.permalink.inactiveLayers != null) {
    // keep layer visibilities from topic and additionally turn off inactiveLayers
    for (var layer in Map.layers) {
      var index = $.inArray(layer, Config.permalink.inactiveLayers);
      if (index != -1) {
        // turn off layer
        toggleLayer(layer, false);
      }
    }
  }

  // opacities
  if (Config.permalink.opacities != null) {
    for (var layer in Config.permalink.opacities) {
      if (Map.layers[layer] != undefined) {
        // scale opacity[255..0] to transparency[0..100]
        var transparency = Math.round((255 - Config.permalink.opacities[layer]) / 255 * 100);
        Map.layers[layer].transparency = transparency;
      }
    }
  }

  // login
  if (Config.permalink.openLogin) {
    if (Config.sslLogin && UrlParams.useSSL && !Gui.signedIn) {
      // open login form
      $('#panelProperties').panel('open');
      $('#dlgLogin').popup('open');
    }
  }
};

Gui.loginStatus = function(result) {

    result.success = true;
    result.user = projectData.user;

    if (result.success) {
    $('#dlgLogin').popup('close');
    if (Eqwc.settings.useGisPortal) {
        $('#buttonSignOut .ui-btn-text').html(result.user);
    } else {
        $('#buttonSignOut .ui-btn-text').html(I18n.login.signOut + " - " + result.user);
    }
    $('#panelProperties').panel('close');
  }
  Gui.toggleLogin(result.success);
};

Gui.login = function(result) {
  if (result.success) {
    // reload topics
    Topics.loadTopics(null, Gui.loadTopics);

    $('#dlgLogin').popup('close');
    if (Eqwc.settings.useGisPortal) {
        $('#buttonSignOut .ui-btn-text').html(result.user);
    } else {
        $('#buttonSignOut .ui-btn-text').html(I18n.login.signOut + " - " + result.user);
    }
    Gui.toggleLogin(true);
    $('#panelProperties').panel('close');
  }
  else {
    alert(I18n.login.signInFailed);
  }
};

Gui.logout = function() {
  // reload topics
  //Topics.loadTopics(null, Gui.loadTopics);

  //Gui.toggleLogin(false);
  $('#panelProperties').panel('close');

  //change to profile view if gisportal
  window.location.href = Eqwc.settings.useGisPortal ? Eqwc.settings.gisPortalProfile : "./admin/login.php?action=logout";
};

Gui.toggleLogin = function(signedIn) {
  Gui.signedIn = signedIn;
  $('#buttonLogin').toggle(!signedIn);
  $('#buttonSignOut').toggle(signedIn);
};

Gui.fillMapCrs = function() {
    $.each(Config.map.projectionList, function (i, item) {
        $('#mapCrs').append($('<option>', {
            value: item[0],
            text: item[1]
        }));
    });

    $('#mapCrs').on('change', function () {
        Map.userCrs = this.value;
        if($('#locationPanel').is(":visible") && Map.geolocation) {
            Gui.showLocationPanel(true);
        }
    });

    $('#mapCrs').val(projectData.crs).change();
};

Gui.initViewer = function() {
  Gui.updateTranslations();
  Gui.fillMapCrs();

  Gui.updateLayout();
  $(window).on('resize', function() {
    Gui.updateLayout();
  });
  Map.setWindowOrientation(window.orientation);
  $(window).on('orientationchange', function(e) {
    Map.setWindowOrientation(window.orientation);
  });

  // map
  Map.createMap();
  Gui.updateLayout();

  // layer panel navigation
  $('#buttonTopics').on('tap', function() {
    Gui.panelSelect('panelTopics');
  });
  $('#buttonLayerAll').on('tap', function() {
    Gui.panelSelect('panelLayerAll');
  });
  $('#buttonLayerOrder').on('tap', function() {
    Gui.panelSelect('panelLayerOrder');
  });

  //tab properties
  $('#buttonPropertiesMap').on('tap', function() {
    Gui.propertiesSelect('panelPropertiesMap');
  });

  $('#buttonPropertiesEditor').on('tap', function() {
    Gui.propertiesSelect('panelPropertiesEditor');
  });


  // default properties
  $('#switchFollow').val(Config.defaultProperties.following ? 'on' : 'off');
  $('#switchFollow').slider('refresh');
  Gui.toggleFollowing(Config.defaultProperties.following);
  $('#switchOrientation').val(Config.defaultProperties.orientation ? 'on' : 'off');
  $('#switchOrientation').slider('refresh');
  Gui.toggleOrientation(Config.defaultProperties.orientation);
  $('#switchScale').val(Config.defaultProperties.scalebar ? 'on' : 'off');
  $('#switchScale').slider('refresh');
  Map.toggleScalebar(Config.defaultProperties.scalebar);

  // topics
  Topics.loadTopics(null, Gui.loadTopics);
  // topic selection
  $('#topicList').delegate('li.topic', 'vclick', function(e) {
    Gui.selectTopic($(this).data('topic'));
    $('#panelLayer').panel('close');
  });

  // layer change
  $('#panelLayerAll').delegate(':checkbox[data-layer]', 'change', function(e) {
    var layer = projectData.use_ids ? $(this).data('layer') : projectData.layers[$(this).data('layer')].layername;
    var layerVisible = (Map.visibleLayers().indexOf(layer) != -1);
    if (layerVisible != $(this).is(':checked')) {
      Map.setLayerVisible($(this).data('layer'), $(this).is(':checked'), false);
      Gui.updateLayerOrder($(this).data('layer'), $(this).is(':checked'));
    }
    //if ($(this).is(':checked')) {
	//	$('img[data-layer="'+$(this).data('layer')+'"]').show();
	//} else
	//$('img[data-layer="'+$(this).data('layer')+'"]').hide();
  });
  Gui.panelSelect('panelLayerAll');
  Gui.propertiesSelect('panelPropertiesMap');

  // selection in layer order
  $('#listOrder').delegate('li', 'vclick', function() {
    Gui.selectLayer($(this).data('layer'));
  });
  // layer transparency
  $('#sliderTransparency').on('slidestop', function() {
    Map.setLayerTransparency(Gui.selectedLayer, $(this).val(), true);
  }).parent().on('swipeleft',function(e,ui) {
    // block panel close
    e.stopPropagation();
  });

  // compass
  $(document).on('maprotation', function(e) {
    $('#btnCompass').find('.ui-icon').css('transform', 'rotate(' + e.rotation + 'rad)');
  });
  $('#btnCompass').on('tap', function() {
    Map.setRotation(0);
  });

  // geolocation
  if (!projectData.geolocation) {
    $("#btnLocation").hide();
  }

  //hide location panel and info button until location activated
  $('#locationPanel').hide();
  $("#btnInfo").hide();
  $("#gotoPanel").hide();
  $("#editPanel").hide();

  $('#btnLocation').on('tap', function() {
    Gui.tracking = !Gui.tracking;
    $('#btnLocation .ui-icon').toggleClass('ui-icon-location_off', !Gui.tracking);
    $('#btnLocation .ui-icon').toggleClass('ui-icon-location_on', Gui.tracking);
    Map.toggleTracking(Gui.tracking);
      if (Gui.tracking) {
          $('#locationPanel').html(I18n.geolocation.obtaining);
          $('#locationPanel').show();
      }
    Map.toggleFollowing(Gui.tracking && Gui.following);
  });

  //call getfeatureinfo in location provided by geolocation
  $("#btnInfo").click(Map.featureInfoOnLocation);

  // feature info
  var featureInfo = new FeatureInfo(Gui.showFeatureInfoResults);
  Map.registerClickHandler('featureInfo', featureInfo);
  Map.activateClickHandler('featureInfo');

  $('#panelFeatureInfo').on('panelclose', function() {
    Map.toggleClickMarker(false);
  });
  $('#featureInfoResults').parent().on('swipeleft',function(e,ui) {
    // block panel close
    e.stopPropagation();
  });

  // search
  if (!Config.search) {
      $("#btnSearching").addClass('ui-disabled');
  }
  var resetSearchResults = function() {
    // reset search panel
    $('#searchResults').hide();
    // reset highlight
    Map.setHighlightLayer(null);
    //reset marker
    Map.searchMarker.setPosition(undefined);

  };
  $('#searchInput').bind('change', function(e) {
    if ($(this).val() == "") {
      // clear search
      resetSearchResults();
    }
  });
  $('#searchForm').bind('submit', function(e) {
    resetSearchResults();

    var searchString = $('#searchInput').val();
    if (searchString != "") {
      // submit search
      Config.search.submit(searchString, Gui.showSearchResults);
      // close virtual keyboard
      $('#searchInput').blur();
    }

    // block form submit
    e.preventDefault();
    e.stopPropagation();
  });
  $('#searchResultsList').delegate('li', 'vclick', function() {
    if ($(this).data('point') != null) {
      Gui.jumpToSearchResult($(this).data('point'));
    }
    if ($(this).data('highlight') != undefined) {
      Config.search.highlight($(this).data('highlight'), Map.setHighlightLayer);
    }
  });

  // properties
  $('#switchFollow').on('change', function(e) {
    Gui.toggleFollowing($(this).val() == 'on');
  }).parent().on('swiperight',function(e,ui) {
    // block panel close
    e.stopPropagation();
  });
  $('#switchOrientation').on('change', function(e) {
    Gui.toggleOrientation($(this).val() == 'on');
  }).parent().on('swiperight',function(e,ui) {
    // block panel close
    e.stopPropagation();
  });
  $('#switchScale').on('change', function(e) {
    Map.toggleScalebar($(this).val() == 'on');
  }).parent().on('swiperight',function(e,ui) {
    // block panel close
    e.stopPropagation();
  });

  // about popup
  $('#aboutContent').html(I18n.about.content);

  // toggle buttons
  $('#buttonShare').toggle(!Config.gui.hideShareButton);
  $('#buttonLogin').toggle(!Config.gui.hideLoginButton);
  $('#buttonLoginSSL').hide();
  $('#buttonSignOut').hide();

  // login
  if (!Config.gui.hideLoginButton) {
    if (Config.sslLogin && !UrlParams.useSSL) {
      // link to secure login
      var url = UrlParams.baseUrl.replace(/^http:/, "https:");
      var params = $.extend(
        {
          openLogin: true
        },
        UrlParams.params
      );
      url += "?" + $.param(params);
      $('#buttonLoginSSL').attr('href', url);
      $('#buttonLoginSSL').show();
      $('#buttonLogin').hide();
    }
    else {
      // login
      $('#buttonSignIn').on('tap', function() {
        Config.login.signIn($('#user').val(), $('#password').val(), Gui.login);
      });
      $('#buttonLoginCancel').on('tap', function() {
        $('#dlgLogin').popup('close');
      });
      $('#buttonSignOut').on('tap', function() {
        Config.login.signOut(Gui.logout);
      });
      // initial login status
      Config.login.status(Gui.loginStatus);
    }
  }

  // workaround for erroneus map click despite open panels on iOS
  $('#panelFeatureInfo, #panelLayer, #panelSearch').on('panelopen', function() {
    Map.toggleClickHandling(false);
  });
  $('#panelFeatureInfo, #panelLayer, #panelSearch').on('panelclose', function() {
    Map.toggleClickHandling(true);
  });

    //this is marker to display location of search result (geocoding)
    Map.searchMarker = new ol.Overlay({
        element: ($('<div id="searchMarker"></div>'))[0],
        positioning: 'center-center',
        stopEvent: false
    });
    Map.map.addOverlay(Map.searchMarker);

  // invoke custom post viewer init
  Config.customInitViewer();
};

$(document).ready(function(e) {

    //ajax global loading enable
    $(document).on({
        ajaxSend: function () { loading('show'); },
        ajaxStart: function () { loading('show'); },
        ajaxStop: function () { loading('hide'); },
        ajaxError: function () { loading('hide'); }
    });

    function loading(showOrHide) {
        setTimeout(function(){
            $.mobile.loading(showOrHide);
        }, 1);
    }

    //Thanks: https://github.com/jquery/jquery-mobile/issues/3414
    $.mobile.loader.prototype.defaultHtml = "<div class='ui-loader'>" +
    "<span class='ui-icon ui-icon-loading'></span>" +
    "<h1></h1>" +
    "<div class='ui-loader-curtain'></div>" +
    "</div>";


  UrlParams.parse();
  Config.permalink.read(UrlParams.params, Gui.initViewer);
});
