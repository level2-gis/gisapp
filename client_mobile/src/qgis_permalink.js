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

    // Support single character parameter 'b' for visibleBackgroundLayer, fallback to full name
    var visibleBackgroundLayerParam = urlParams.hasOwnProperty('b') ? urlParams.b : urlParams.visibleBackgroundLayer;
    if (visibleBackgroundLayerParam !== undefined) {
        if (visibleBackgroundLayerParam > '') {
            this.initialBackgroundTopic = visibleBackgroundLayerParam;
        } else {
            // empty 'b' parameter means no background layer
            this.initialBackgroundTopic = null;
        }
    }

    // init viewer
    callback();
};

QgisPermalink.prototype.create = function () {
    var permalinkParams = {
        e: Map.map.getView().calculateExtent(),  // startExtent -> e
        v: Map.visibleLayers(),          // visibleLayers -> v
    };

    // always include 'b' parameter for background layer
    if (Map.backgroundTopic) {
        permalinkParams.b = Map.backgroundTopic;  // visibleBackgroundLayer -> b
    } else {
        permalinkParams.b = '';  // empty 'b' parameter means no base layer
    }

    var params = new URLSearchParams(permalinkParams).toString();
    var permalink = UrlParams.baseUrl + '?' + params;

    return permalink;
};