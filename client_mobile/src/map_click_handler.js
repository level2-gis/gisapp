/**
 * Map click handler base class
 */

function MapClickHandler() {
    this.active = false;
}

MapClickHandler.prototype = {
    /**
     * activate or deactivate handler
     *
     * active: <boolean>
     */
    toggle: function (active) {
        this.active = active;
    },

    /**
     * return active status
     */
    isActive: function () {
        return this.active;
    },

    /**
     * handle map click event
     *
     * e: <ol.MapBrowserEvent>
     */
    handleEvent: function (e) {
    }
};


/**
 * Create subclasses for additional custom click handlers
 */
/*
function CustomClickHandler() {}

// inherit from MapClickHandler
CustomClickHandler.prototype = new MapClickHandler();

CustomClickHandler.prototype.handleEvent = function(e) {
  // custom map click handling
};
*/

/**
 * Setup custom handler e.g. in Config.customInitViewer()
 */
/*
// register handler
var handler = new CustomClickHandler();
Map.registerClickHandler("customHandler", handler);

// activate handler (only one handler is active at a time)
Map.activateClickHandler("customHandler");

// unregister handler
Map.unregisterClickHandler("customHandler");
*/
