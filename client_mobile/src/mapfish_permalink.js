/**
 * Mapfish Appserver permalink
 *
 * back=<background topic name>
 * over=<comma separated overlay topic names>
 * x=<x>
 * y=<y>
 * scale=<scale>
 * offlayers=<comma separated layer names>
 * seltopic=<selection topic>
 * sellayer=<selection layer>
 * selproperty=<selection property>
 * selvalues=<selection values>
 * redlining=<WKT geometries + JSON text labels>
 * locate=<locate type>
 * locations=<locate params>
 */

function MapfishPermalink(locateUrlCallback) {
  // locateUrlCallback(locate, locations)
  this.locateUrlCallback = locateUrlCallback;
  /**
   * {
   *   seltopic: <selection topic>,
   *   sellayer: <selection layer>,
   *   selproperty: <selection property>,
   *   selvalues: <selection value>,
   * }
   */
  this.selection = null;
  // WKT + attributes
  this.redlining = null;
}

// inherit from Permalink
MapfishPermalink.prototype = new Permalink();

/**
 * read URL parameters to setup map accordingly and invoke the callback to init the viewer
 *
 * urlParams = {
 *   <key>: <value>
 * }
 * callback(): init viewer
 */
MapfishPermalink.prototype.read = function(urlParams, callback) {
  // default permalink parameters
  Permalink.prototype.read.call(this, urlParams);

  // background topic
  if (urlParams.back != undefined) {
    this.initialBackgroundTopic = urlParams.back;
  }
  // overlay topics
  if (urlParams.over != undefined) {
    this.initialOverlayTopics = urlParams.over.split(',');
  }

  // map extent
  if (urlParams.x != undefined && urlParams.y != undefined) {
    this.startCenter = [parseFloat(urlParams.x), parseFloat(urlParams.y)];
  }
  if (urlParams.scale != undefined) {
    this.startScale = parseFloat(urlParams.scale);
  }

  // layers
  if (urlParams.offlayers != undefined) {
    this.inactiveLayers = urlParams.offlayers.split(',');
  }

  // selection
  if (urlParams.seltopic != undefined) {
    this.selection = {
      topic: urlParams.seltopic,
      layer: urlParams.sellayer,
      property: urlParams.selproperty,
      values: urlParams.selvalues
    };
  }

  // redlining
  if (urlParams.redlining != undefined) {
    this.redlining = urlParams.redlining;
  }

  // locate
  if (urlParams.locate != undefined && urlParams.locations != undefined) {
    var url = this.locateUrlCallback(urlParams.locate, urlParams.locations);

    // request location
    var self = this;
    $.getJSON(url, function(data) {
      if (data.success) {
        self.startExtent = data.bbox;
        self.selection = data.selection;
        // set topic if not defined in location
        self.selection.topic = self.selection.topic || urlParams.topic || Config.data.initialTopic;
      }
      // init viewer
      callback();
    });
  }
  else {
    // init viewer
    callback();
  }
};

/**
 * add any selection or redlining layers after loading topic layers
 * 
 * selectionCallback(<OL3 layer>): add selection layer to map
 * redliningCallback(<OL3 layer>): add redlining layer to map
 */
MapfishPermalink.prototype.addOverlays = function(selectionCallback, redliningCallback) {
  this.addSelection(selectionCallback);
  this.addRedlining(redliningCallback);
};

/**
 * add selection layer
 */
MapfishPermalink.prototype.addSelection = function(callback) {
  if (this.selection != null) {
    var topic = Map.topics[this.selection.topic];
    if (topic != undefined) {
      // add selection layer
      var layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: topic.wms_url,
          params: $.extend({}, Config.map.wmsParams, {
            LAYERS: '',
            'SELECTION[LAYER]': this.selection.layer,
            'SELECTION[PROPERTY]': this.selection.property,
            'SELECTION[VALUES]': this.selection.values,
            TRANSPARENT: true
          }),
          extent: Config.map.extent,
          serverType: Config.map.wmsServerType,
          dpi: Config.map.dpi,
          ratio: 1
        }),
        opacity: 0.6
      });
      layer.name = 'selection';
      callback(layer);
    }
  }
};

/**
 * add redlining layer
 */
MapfishPermalink.prototype.addRedlining = function(callback) {
  // redlining
  if (this.redlining != null) {
    // split param into WKT and attributes
    var wkt = this.redlining;
    var separatorIndex = this.redlining.indexOf('+');
    if (separatorIndex != -1) {
        wkt = this.redlining.substring(0, separatorIndex);
    }

    // convert WKT to features
    var format = new ol.format.WKT({splitCollection: true});
    var features = format.readFeatures(wkt);

    if (separatorIndex != -1) {
      // add feature attributes
      var attributes = $.parseJSON(this.redlining.substring(separatorIndex + 1, this.redlining.length));
      for (var key in attributes) {
        var values = attributes[key];
        for (var featureIndex in values) {
          var feature = features[featureIndex];
          feature.set(key, values[featureIndex]);
        }
      }
    }

    // feature style
    var style = function(feature, resolution) {
      var stroke = new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 0.7)',
        width: 2
      });
      var fill = new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.3)'
      });

      if (feature.get('text')) {
        // text label
        var text = new ol.style.Text({
          text: feature.get('text'),
          textAlign: 'left',
          font: 'normal 12px Helvetica,Arial,sans-serif',
          fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 1.0)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(255, 255, 255, 1.0)',
            width: 2
          })
        });
        return [new ol.style.Style({
          fill: fill,
          stroke: stroke,
          text: text
        })];
      }
      else {
        // geometry
        return [new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: fill,
            stroke: stroke
          }),
          fill: fill,
          stroke: stroke
        })];
      }
    };

    // add redlining layer
    var layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: features
      }),
      style: style
    });
    layer.name = 'redlining';
    callback(layer); 
  }
};
