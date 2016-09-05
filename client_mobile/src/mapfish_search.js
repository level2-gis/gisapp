/**
 * Mapfish Appserver search
 */

function MapfishSearch(urlCallback, parseFeatureCallback, highlightWmsUrl) {
  // create query URL from search params
  this.urlCallback = urlCallback;

  // get feature name and bbox
  this.parseFeatureCallback = parseFeatureCallback;

  // WMS URL for highlighting the selected search result
  this.highlightWmsUrl = highlightWmsUrl;
}

// inherit from Search
MapfishSearch.prototype = new Search();

/**
 * submit search query
 */
MapfishSearch.prototype.submit = function(searchParams, callback) {
  var request = $.ajax({
    url: this.urlCallback(searchParams),
    dataType: 'json',
    context: this
  });

  request.done(function(data, status) {
    this.parseResults(data, status, callback);
  });

  request.fail(function(jqXHR, status) {
    alert(I18n.search.failed + "\n" + jqXHR.status + ": " + jqXHR.statusText);
  });
};

/**
 * parse query result and invoke the callback with search result features
 *
 * [
 *   {
 *     category: <category>, // null to hide
 *     results: [
 *       {
 *         category: <category used for grouping>,
 *         name: <visible name>,
 *         highlight: {
 *           fid: <fid>,
 *           layer: <WMS layer name>,
 *         },
 *         bbox: [<minx>, <miny>, <maxx>, <maxy>]
 *       }
 *     ]
 *   }
 * ]
 */
MapfishSearch.prototype.parseResults = function(data, status, callback) {
  // group by category
  var categories = {};
  for (var i=0; i<data.features.length; i++) {
    var feature = this.parseFeatureCallback(data.features[i]);
    var category = feature.category;
    if (categories[category] === undefined) {
      // add category
      categories[category] = [];
    }
    // add feature to category
    categories[category].push(feature);
  }

  // convert to search results
  var results = $.map(categories, function(features, category) {
    return {
      category: category,
      results: features
    };
  });
  callback(results);
};

/**
 * create and add a highlight layer for the selected search result
 *
 * use Mapfish WMS SELECTION parameters for highlighting
 *
 * highlight = {
 *   fid: <fid>,
 *   layer: <WMS layer name>,
 * }
 * callback(<OL3 layer>): add highlight layer to map
 */
MapfishSearch.prototype.highlight = function(highlight, callback) {
  // create highlight layer
  var layer = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      url: this.highlightWmsUrl,
      params: $.extend({}, Config.map.wmsParams, {
        LAYERS: '',
        'SELECTION[LAYER]': highlight.layer,
        'SELECTION[PROPERTY]': 'fid',
        'SELECTION[VALUES]': highlight.fid,
        TRANSPARENT: true
      }),
      extent: Config.map.extent,
      serverType: Config.map.wmsServerType,
      dpi: Config.map.dpi,
      ratio: 1
    })
  });
  layer.name = 'highlight';

  // add to map
  callback(layer);
};
