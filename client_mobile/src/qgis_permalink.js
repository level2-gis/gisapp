/**
 * QGIS Web-Client permalink
 *
 * startExtent=<minx>,<miny>,<maxx>,<maxy>
 * visibleLayers=<comma separated layer names>
 */

function QgisPermalink() {}

// inherit from Permalink
QgisPermalink.prototype = new Permalink();

/**
 * read URL parameters to setup map accordingly and invoke the callback to init the viewer
 *
 * urlParams = {
 *   <key>: <value>
 * }
 * callback(): init viewer
 */
QgisPermalink.prototype.read = function(urlParams, callback) {
  // default permalink parameters
  Permalink.prototype.read.call(this, urlParams);

  if (urlParams.startExtent != undefined) {
    this.startExtent = $.map(urlParams.startExtent.split(','), function(value, index) {
      return parseFloat(value);
    });
  }

  if (urlParams.visibleLayers != undefined) {
    this.activeLayers = urlParams.visibleLayers.split(',');
  }

  // init viewer
  callback();
};
