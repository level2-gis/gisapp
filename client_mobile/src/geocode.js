
function Geocode(key, layers, countryString) {

    this.key = key;
    this.layers = layers;
    this.countryString = countryString;
}

// inherit from Search
Geocode.prototype = new Search();

/**
 * submit search query
 */
Geocode.prototype.submit = function(searchParams, callback) {
  var request = $.ajax({
    url: "https://search.mapzen.com/v1/search",
    data: this.parseSearchParams(searchParams),
    //dataType: 'jsonp',
    //jsonp: 'cb',
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
 * parse search parameters and return URL parameters as hash
 */
Geocode.prototype.parseSearchParams = function(searchParams) {
  var query = $.trim(searchParams);
  return {
    "api_key": this.key,
    "layers": this.layers,
    "boundary.country": this.countryString,
    "text": query
  };
};

/**
 * parse query result and invoke the callback with search result features
 *
 * [
 *   {
 *     category: <category>, // null to hide
 *     results: [
 *       {
 *         name: <visible name>,
 *         bbox: [<minx>, <miny>, <maxx>, <maxy>]
 *       }
 *     ]
 *   }
 * ]
 */
Geocode.prototype.parseResults = function(data, status, callback) {
  var results = $.map(data.features, function(value, index) {
    // remove HTML tags and (<canton>)
    var name = value.properties.label;   //.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s\([A-Z]{2}\)/, "");
    var loc = new ol.geom.Point([value.geometry.coordinates[0],value.geometry.coordinates[1]]);
    loc.transform("EPSG:4326",Map.map.getView().getProjection());
    var box = loc.getExtent();

    return {
      name: name,
      bbox: box    //properties.bbox
    };
  });

  callback([{
    category: null,
    results: results
  }]);
};
