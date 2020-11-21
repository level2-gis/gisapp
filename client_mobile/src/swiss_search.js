/**
 * Search using GeoAdmin SwissSearch geocoding
 * http://api.geo.admin.ch/main/wsgi/doc/build/services/sdiservices.html
 */

function SwissSearch(services, queryPostfix) {
    // SwissSearch services
    this.services = services;

    // append query postfix to limit search results
    this.queryPostfix = queryPostfix;
}

// inherit from Search
SwissSearch.prototype = new Search();

/**
 * submit search query
 */
SwissSearch.prototype.submit = function (searchParams, callback) {
    var request = $.ajax({
        url: "https://api.geo.admin.ch/swisssearch/geocoding",
        data: this.parseSearchParams(searchParams),
        dataType: 'jsonp',
        jsonp: 'cb',
        context: this
    });

    request.done(function (data, status) {
        this.parseResults(data, status, callback);
    });

    request.fail(function (jqXHR, status) {
        alert(I18n.search.failed + "\n" + jqXHR.status + ": " + jqXHR.statusText);
    });
};

/**
 * parse search parameters and return URL parameters as hash
 */
SwissSearch.prototype.parseSearchParams = function (searchParams) {
    // append query postfix
    var query = $.trim(searchParams) + " " + this.queryPostfix;
    return {
        services: this.services,
        query: query
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
SwissSearch.prototype.parseResults = function (data, status, callback) {
    var results = $.map(data.results, function (value, index) {
        // remove HTML tags and (<canton>)
        var name = value.label.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s\([A-Z]{2}\)/, "");

        return {
            name: name,
            bbox: value.bbox
        };
    });

    callback([{
        category: null,
        results: results
    }]);
};
