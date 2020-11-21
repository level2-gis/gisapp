/**
 * Permalink base class
 *
 * tiledWms=<1|0>: force tiled/untiled WMS
 * topic=<topic name>
 * background=<background topic name>
 * overlays=<comma separated overlay topic names>
 * extent=<minx>,<miny>,<maxx>,<maxy>
 * center=<x>,<y>
 * scale=<scale>
 * zoom=<zoom>
 * activeLayers=<comma separated layer names>
 * inactiveLayers=<comma separated layer names>
 * opacities=<JSON of {<layer name>:<opacity[255..0]>}>
 *
 * openLogin=<boolean>: open login dialog after redirect when using SSL
 *
 * Parameter precedence:
 *   extent before center, scale, zoom
 *   scale before zoom
 *   activeLayers before inactiveLayers
 */

function Permalink() {
    // <boolean>
    this.useTiledWMS = null;
    // <topic name>
    this.initialTopic = null;
    // <background topic name>
    this.initialBackgroundTopic = null;
    // [<overlay topic name>]
    this.initialOverlayTopics = null;
    // [<minx>, <miny>, <maxx>, <maxy>]
    this.startExtent = null;
    // [<x>, <y>]
    this.startCenter = null;
    // <scale>
    this.startScale = null;
    // <zoom>
    this.startZoom = null;
    // [<layer name>]
    this.activeLayers = null;
    // [<layer name>]
    this.inactiveLayers = null;
    // {<layer name>:<opacity[255..0]>}
    this.opacities = null;
    // <boolean>
    this.openLogin = null;
}

Permalink.prototype = {
    /**
     * read URL parameters to setup map accordingly and invoke the callback to init the viewer
     *
     * urlParams = {
     *   <key>: <value>
     * }
     * callback(): init viewer
     */
    read: function (urlParams, callback) {
        if (urlParams.tiledWms != undefined) {
            this.useTiledWMS = (urlParams.tiledWms == 1);
        }
        if (urlParams.openLogin != undefined) {
            this.openLogin = (urlParams.openLogin == 'true');
        }

        if (urlParams.topic != undefined) {
            this.initialTopic = urlParams.topic;
        }
        if (urlParams.background != undefined) {
            this.initialBackgroundTopic = urlParams.background;
        }
        if (urlParams.overlays != undefined) {
            this.initialOverlayTopics = urlParams.overlays.split(',');
        }

        // map extent
        if (urlParams.extent != undefined) {
            this.startExtent = $.map(urlParams.extent.split(','), function (value, index) {
                return parseFloat(value);
            });
        }
        if (urlParams.center != undefined) {
            this.startCenter = $.map(urlParams.center.split(','), function (value, index) {
                return parseFloat(value);
            });
        }
        if (urlParams.scale != undefined) {
            this.startScale = parseFloat(urlParams.scale);
        }
        if (urlParams.zoom != undefined) {
            this.startZoom = parseFloat(urlParams.zoom);
        }

        // layers
        if (urlParams.activeLayers != undefined) {
            this.activeLayers = urlParams.activeLayers.split(',');
        }
        if (urlParams.inactiveLayers != undefined) {
            this.inactiveLayers = urlParams.inactiveLayers.split(',');
        }
        if (urlParams.opacities != undefined) {
            try {
                this.opacities = $.parseJSON(urlParams.opacities);
            } catch (e) {
                alert("opacities:\n" + e);
            }
        }

        if (callback != undefined) {
            // init viewer
            callback();
        }
    },

    /**
     * add any selection or redlining layers after loading topic layers
     *
     * selectionCallback(<OL3 layer>): add selection layer to map
     * redliningCallback(<OL3 layer>): add redlining layer to map
     */
    addOverlays: function (selectionCallback, redliningCallback) {
    }
};

/**
 * Create a subclass for custom permalink parameters
 */
/*
function CustomPermalink() {};

// inherit from Permalink
CustomPermalink.prototype = new Permalink();

CustomPermalink.prototype.read = function(urlParams, callback) {
  // default permalink parameters
  Permalink.prototype.read.call(this, urlParams);

  // custom permalink handling

  // init viewer
  callback();
};

CustomPermalink.prototype.addOverlays = function(selectionCallback, redliningCallback) {};
*/
