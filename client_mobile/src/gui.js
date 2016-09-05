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
  $('#panelTopics .ui-listview').height(window.innerHeight - 90);
  $('#panelLayerAll').height(window.innerHeight - 90);
  $('#panelLayerOrder .ui-listview').height(window.innerHeight - 200);
  $('#panelFeatureInfo #featureInfoResults').height(window.innerHeight - 80);
  $('#panelSearch .ui-listview').height(window.innerHeight - 170);
  $('#properties').height(window.innerHeight - 80);
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

// fill topics list
Gui.loadTopics = function(categories) {
  var html = "";
  Map.topics = {};
  for (var i=0; i<categories.length; i++) {
    var category = categories[i];

    html += '<li data-role="list-provider">' + category.title + '</li>';

    for (var j=0;j<category.topics.length; j++) {
      var topic = category.topics[j];

      if (topic.main_layer != false) {
        html += '<li class="topic" data-topic="' + topic.name + '">';
        html +=   '<img src="' + topic.icon + '"/>';
        html +=   '<p style="white-space:pre-wrap">' + topic.title + '</p>';
        html += '</li>';
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
  }

  $('#topicList').html(html);
  $('#topicList').listview('refresh');

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
  Layers.loadLayers(Config.data.layersUrl(topic), Gui.loadLayers);
  if (Map.backgroundTopic != null) {
    // load background layers
    Layers.loadLayers(Config.data.layersUrl(Map.backgroundTopic), Gui.loadBackgroundLayers);
  }

  // mark topic button
  $('#topicList li.topic').removeClass('selected');
  $('#topicList li.topic[data-topic=' + topic + ']').addClass('selected');
};

// update layers list
Gui.loadLayers = function(data) {
  var html = "";
  var layers = [];

  function fillLayertree(node, parent, depth) {
    if (node.layers.length > 0) {
      // add group
      html += '<div data-role="collapsible" data-theme="c"';
      if (Config.gui.useLayertreeGroupCheckboxes) {
        html += ' data-groupcheckbox="true"';
      }
      html += '>';
      html +=   '<h3>' + node.name + '</h3>';
    }
    else {
      // find layer parent group
      var groupTitle = parent || Layers.markerPrefix + node.name;
      var group = $.grep(data.groups, function(el) {
        return el.title === groupTitle;
      })[0];
      if (group != undefined) {
        // find layer in group
        var layer = $.grep(group.layers, function(el) {
          return el.layername === node.name;
        })[0];

        // add layer
        html += '<label>';
        html +=   '<input type="checkbox" ';
        if (parent != null) {
          // prevent auto-enhancement by jQuery Mobile if layer belongs to a group
          html +=   'data-role="none" ';
        }
        html +=     'name="' + layer.layername + '" ';
        html +=     'data-layer="' + layer.layername + '" ';
        if (layer.visini) {
          html +=   'checked ';
        }
        html +=   '>' + layer.toclayertitle;
        html += '</label>';

        layers.push({
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
    for (var i=0; i<node.layers.length; i++) {
      fillLayertree(node.layers[i], node.name, depth + 1);
    }

    if (node.layers.length > 0) {
      html += '</div>';
    }
  }

  // fill layer tree
  for (var i=0; i<data.layertree.length; i++) {
    fillLayertree(data.layertree[i], null, 0);
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
  $('#panelLayerAll').children('.ui-collapsible[data-groupcheckbox=true]').bind('groupchange', function(e) {
    var visibleLayers = Map.visibleLayers();
    $(this).find(':checkbox').each(function(index) {
      var layerVisible = (visibleLayers.indexOf($(this).data('layer')) != -1);
      if (layerVisible != $(this).is(':checked')) {
        // layer visibility changed
        Map.setLayerVisible($(this).data('layer'), $(this).is(':checked'), false);
        Gui.updateLayerOrder($(this).data('layer'), $(this).is(':checked'));
      }
    });
  });

  // store layers sorted by wms_sort
  layers = layers.sort(function(a, b) {
    return a.wms_sort - b.wms_sort;
  });
  Map.layers = {};
  for (var i=0; i<layers.length; i++) {
    var layer = layers[i];
    Map.layers[layer.layername] = {
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
    for (var i=0; i<Config.permalink.initialOverlayTopics.length; i++) {
      var overlayTopic = Config.permalink.initialOverlayTopics[i];
      if (overlayTopics.indexOf(overlayTopic) == -1) {
        overlayTopics.push(overlayTopic);
      }
    }
  }
  Gui.setupOverlayTopics(overlayTopics);

  if (Map.backgroundTopic) {
    // add background layer button
    var html = '<label><input type="checkbox" name="_background_" data-background="true" checked>' + I18n.layers.background + '</label>';
    $('#panelLayerAll').append(html);
    $('#panelLayerAll').trigger('create');

    // background toggle
    $('#panelLayerAll :checkbox[data-background=true]').bind('change', function(e) {
      Map.toggleBackgroundLayer($(this).is(':checked'));
    });
  }

  // add any overlays from permalink
  Config.permalink.addOverlays(Gui.setSelectionLayer, Gui.setRedliningLayer);

  if (Gui.initialLoad) {
    Gui.initialLoad = false;
  }

  $.event.trigger({type: 'topiclayersloaded', topic: Map.topic});
};

// add background layer
Gui.loadBackgroundLayers = function(data) {
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
  Map.backgroundLayers = sortedLayers.join(',');
  Map.setBackgroundLayer();
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
  Map.refresh();
};

// select layer in layer order panel
Gui.selectLayer = function(layer) {
  // unselect all layer buttons
  $('#listOrder li').removeClass('selected');

  Gui.selectedLayer = layer;
  if (Gui.selectedLayer != null) {
    // mark layer button
    $('#listOrder li[data-layer="' + layer + '"]').addClass('selected');

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
Gui.showFeatureInfoResults = function(data) {
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
Gui.showXMLFeatureInfoResults = function(results) {
  var html = "";
  for (var i=0; i<results.length; i++) {
    var result = results[i];
    var layer = Map.layers[result.layer];

    var layerTitle = result.layer;
    if (layer != undefined) {
      layerTitle = layer.title;
    }

    html += '<div data-role="collapsible" data-collapsed="false" data-theme="c">';
    html +=   '<h3>' + layerTitle + '</h3>';

    var hiddenAttributes = [];
    if (layer != undefined && layer.hidden_attributes != undefined) {
      hiddenAttributes = layer.hidden_attributes;
    }
    var hiddenValues = [];
    if (layer != undefined && layer.hidden_values != undefined) {
      hiddenValues = layer.hidden_values;
    }

    for (var j=0; j<result.features.length; j++) {
      var feature = result.features[j];
      var title = feature.id === null ? I18n.featureInfo.raster : I18n.featureInfo.feature + feature.id;

      html += '<div class="feature" data-role="collapsible" data-collapsed="false" data-theme="c">';
      html +=   '<h3>' + title + '</h3>';
      html +=   '<ul class="ui-listview-inset ui-corner-all" data-role="listview">';

      for (var k=0; k<feature.attributes.length; k++) {
        var attribute = feature.attributes[k];

        // skip hidden attributes and hidden values
        if ($.inArray(attribute.name, hiddenAttributes) == -1 && $.inArray(attribute.value, hiddenValues) == -1) {
          html += '<li>';
          if (attribute.value.match(/^https?:\/\/.+\..+/i)) {
            // add link to URL from value
            html += '<a href="' + attribute.value + '" target="_blank" class="link">';
            html +=   '<span class="name">' + attribute.name + '</span>';
            html += '</a>';
          }
          else {
            // add attribute name and value
            html += '<span class="name">' + attribute.name + ': </span>';
            html += '<span class="value">' + attribute.value + '</span>';
          }
          html += '</li>';
        }
      }

      html +=   '</ul>';
      html += '</div>';
    }

    html += '</div>';
  }
  if (results.length == 0) {
    html = I18n.featureInfo.noFeatureFound;
  }

  $('#featureInfoResults').html(html);
  $('#featureInfoResults').trigger('create');
};

// show search results list
Gui.showSearchResults = function(results) {
  $('#searchResultsList').empty();

  for (var i=0; i<results.length; i++) {
    var categoryResults = results[i];

    // category title
    if (categoryResults.category != null) {
      $('#searchResultsList').append($('<li class="category-title">' + categoryResults.category + '</li>'));
    }

    // results
    for (var j=0;j<categoryResults.results.length; j++) {
      var result = categoryResults.results[j];
      var li = $('<li><a href="#">' + result.name + '</a></li>');
      li.data('bbox', result.bbox);
      li.data('highlight', result.highlight);
      $('#searchResultsList').append(li);
    }
  }

  $('#searchResultsList').listview('refresh');

  $('#searchResults').show();

  // automatically jump to single result
  if (results.length === 1 && results[0].bbox != null) {
    Gui.jumpToSearchResult(results[0].bbox);
    if (results[0].highlight != undefined) {
      Config.search.highlight(results[0].highlight, Map.setHighlightLayer);
    }
  }
};

// bbox as [<minx>, <miny>, <maxx>, <maxy>]
Gui.jumpToSearchResult = function(bbox) {
  Map.zoomToExtent(bbox, Config.map.minScaleDenom.search);

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

  $('#panelProperties b').html(I18n.properties.header);
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

  $('#panelLayer #buttonTopics .ui-btn-text').html(I18n.layers.topics);
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
  if (result.success) {
    $('#dlgLogin').popup('close');
    $('#buttonSignOut .ui-btn-text').html(I18n.login.signOut + " - " + result.user);
    $('#panelProperties').panel('close');
  }
  Gui.toggleLogin(result.success);
};

Gui.login = function(result) {
  if (result.success) {
    // reload topics
    Topics.loadTopics(Config.data.topicsUrl, Gui.loadTopics);

    $('#dlgLogin').popup('close');
    $('#buttonSignOut .ui-btn-text').html(I18n.login.signOut + " - " + result.user);
    Gui.toggleLogin(true);
    $('#panelProperties').panel('close');
  }
  else {
    alert(I18n.login.signInFailed);
  }
};

Gui.logout = function() {
  // reload topics
  Topics.loadTopics(Config.data.topicsUrl, Gui.loadTopics);

  Gui.toggleLogin(false);
};

Gui.toggleLogin = function(signedIn) {
  Gui.signedIn = signedIn;
  $('#buttonLogin').toggle(!signedIn);
  $('#buttonSignOut').toggle(signedIn);
};

Gui.initViewer = function() {
  Gui.updateTranslations();

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
  Topics.loadTopics(Config.data.topicsUrl, Gui.loadTopics);
  // topic selection
  $('#topicList').delegate('li.topic', 'vclick', function(e) {
    Gui.selectTopic($(this).data('topic'));
    $('#panelLayer').panel('close');
  });

  // layer change
  $('#panelLayerAll').delegate(':checkbox[data-layer]', 'change', function(e) {
    var layerVisible = (Map.visibleLayers().indexOf($(this).data('layer')) != -1);
    if (layerVisible != $(this).is(':checked')) {
      Map.setLayerVisible($(this).data('layer'), $(this).is(':checked'), false);
      Gui.updateLayerOrder($(this).data('layer'), $(this).is(':checked'));
    }
  });
  Gui.panelSelect('panelTopics');

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
  $('#btnLocation').on('tap', function() {
    Gui.tracking = !Gui.tracking;
    $('#btnLocation .ui-icon').toggleClass('ui-icon-location_off', !Gui.tracking);
    $('#btnLocation .ui-icon').toggleClass('ui-icon-location_on', Gui.tracking);
    Map.toggleTracking(Gui.tracking);
    Map.toggleFollowing(Gui.tracking && Gui.following);
  });

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
  var resetSearchResults = function() {
    // reset search panel
    $('#searchResults').hide();
    // reset highlight
    Map.setHighlightLayer(null);
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
    if ($(this).data('bbox') != null) {
      Gui.jumpToSearchResult($(this).data('bbox'));
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

  // invoke custom post viewer init
  Config.customInitViewer();
};

$(document).ready(function(e) {
  UrlParams.parse();
  Config.permalink.read(UrlParams.params, Gui.initViewer);
});
