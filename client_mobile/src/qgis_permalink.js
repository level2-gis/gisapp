/**
 * Extended QGIS Web-Client permalink
 *
 * startExtent=<minx>,<miny>,<maxx>,<maxy>
 * visibleLayers=<comma separated layer names>
 * visibleBackGroundLayer=name
 */

function QgisPermalink() {
}

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
QgisPermalink.prototype.read = function (urlParams, callback) {
    // default permalink parameters (base class now handles short parameters)
    Permalink.prototype.read.call(this, urlParams);

    if (urlParams.visibleBackgroundLayer > '') {
        this.initialBackgroundTopic = urlParams.visibleBackgroundLayer;
    }

    // init viewer
    callback();
};

QgisPermalink.prototype.create = function () {
    var permalinkParams = {
        e: Map.map.getView().calculateExtent(),  // startExtent -> e
        v: Map.visibleLayers(),          // visibleLayers -> v
    };

    var params = new URLSearchParams(permalinkParams).toString();
    var permalink = UrlParams.baseUrl + '?' + params;

    return permalink;
};