/**
 * Search base class
 */

function Search() {}

Search.prototype = {
    /**
     * submit search query and invoke the callback with search result features:
     *
     * [
     *   {
     *     category: <category>, // null to hide
     *     results: [
     *       {
     *         name: <visible name>,
     *         highlight: <data for highlighting>,
     *         bbox: [<minx>, <miny>, <maxx>, <maxy>]
     *       }
     *     ]
     *   }
     * ]
     */
    submit: function(searchParams, callback) {},

    /**
     * create and add a highlight layer for the selected search result
     *
     * highlight: data for highlighting
     * callback(<OL3 layer>): add highlight layer to map
     */
    highlight: function(highlight, callback) {}
};
