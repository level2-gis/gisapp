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
    // default permalink parameters
    Permalink.prototype.read.call(this, urlParams);

    // Support single character parameter 'e' for startExtent, fallback to full name
    var startExtentParam = urlParams.e || urlParams.startExtent;
    if (startExtentParam > '') {
        this.startExtent = $.map(startExtentParam.split(','), function (value, index) {
            return parseFloat(value);
        });
    }

    // Support single character parameter 'v' for visibleLayers, fallback to full name
    var visibleLayersParam = urlParams.v || urlParams.visibleLayers;
    if (visibleLayersParam > '') {
        this.activeLayers = visibleLayersParam.split(',');
    }

    if (urlParams.visibleBackgroundLayer > '') {
        this.initialBackgroundTopic = urlParams.visibleBackgroundLayer;
    }

    // init viewer
    callback();
};

QgisPermalink.prototype.create = function () {
    var permalinkParams = {
        e: Map.map.getView().calculateExtent(),  // startExtent -> e
        //TODO, not working in read: v: Map.visibleLayers(),          // visibleLayers -> v
    };

    var params = new URLSearchParams(permalinkParams).toString();
    var permalink = UrlParams.baseUrl + '?' + params;

    return permalink;
};