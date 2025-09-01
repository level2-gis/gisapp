function Geocode(types, country, limit, provider, lang) {

    this.types = types;
    this.country = country;
    this.limit = limit;
    this.provider = provider;
    this.language = lang;

    this.emptyText = I18n.search.placeholder;
    
    // Autocomplete settings
    this.autocompleteSettings = {
        minLength: 2,
        delay: 300,
        maxResults: 20
    };
}

// inherit from Search
Geocode.prototype = new Search();

/**
 * Initialize jQuery Mobile autocomplete on a listview element
 */
Geocode.prototype.initAutocomplete = function(inputSelector, listviewSelector, options) {
    var self = this;
    var $input = $(inputSelector);
    var $listview = $(listviewSelector);
    var settings = $.extend({}, this.autocompleteSettings, options || {});
    
    var searchTimeout;
    var currentRequest;
    
    console.log('Initializing Geocode autocomplete for:', inputSelector, listviewSelector);
    console.log('Input element found:', $input.length > 0);
    console.log('Listview element found:', $listview.length > 0);
    
    // If listview doesn't exist, create it
    if ($listview.length === 0) {
        console.log('Creating listview element:', listviewSelector);
        var listviewId = listviewSelector.replace('#', '');
        var $newListview = $('<ul id="' + listviewId + '" data-role="listview" data-inset="true" data-filter="false"></ul>');
        
        // Insert after the search input's form
        $input.closest('form').after($newListview);
        $listview = $newListview;
        
        console.log('Listview created, length:', $listview.length);
        
        // Initialize jQuery Mobile listview
        try {
            $listview.listview();
        } catch (e) {
            console.log('Error initializing new listview:', e);
        }
    }
    
    // Set up input event handler
    $input.on('input keyup', function(e) {
        var query = $(this).val().trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Cancel previous request
        if (currentRequest) {
            currentRequest.abort();
            currentRequest = null;
        }
        
        if (query.length >= settings.minLength) {
            searchTimeout = setTimeout(function() {
                console.log('Geocode search triggered for:', query);
                currentRequest = self.submitAutocomplete(query, $listview, settings);
            }, settings.delay);
        } else {
            self.populateResults($listview, []);
        }
    });
    
    // Handle result selection
    $listview.on('click', 'li a', function(e) {
        e.preventDefault();
        var $li = $(this).closest('li');
        var selectedResult = $li.data('result');
        
        if (selectedResult) {
            console.log('Geocode result selected:', selectedResult);
            self.handleSelection(selectedResult);
        } else {
            console.error('No Geocode result data found on clicked item');
        }
    });
    
    // Clear results when input is cleared
    $input.on('input', function() {
        if ($(this).val().trim() === '') {
            $listview.empty();
            try {
                if ($listview.hasClass('ui-listview')) {
                    $listview.listview('refresh');
                }
            } catch (e) {
                console.log('Error refreshing cleared listview:', e);
            }
        }
    });
    
    console.log('Geocode autocomplete initialized successfully');
};

/**
 * Submit autocomplete search and populate results
 */
Geocode.prototype.submitAutocomplete = function(query, $listview, settings) {
    var self = this;
    
    console.log('Submitting Geocode autocomplete search:', query);
    
    return this.submit(query, function(results) {
        console.log('Geocode autocomplete results received:', results);
        
        // Limit results based on settings
        var limitedResults = [];
        var totalCount = 0;
        
        results.forEach(function(categoryResults) {
            if (totalCount >= settings.maxResults) return;
            
            var categoryLimited = {
                category: categoryResults.category,
                results: categoryResults.results.slice(0, settings.maxResults - totalCount),
                total: categoryResults.total
            };
            
            limitedResults.push(categoryLimited);
            totalCount += categoryLimited.results.length;
        });
        
        self.populateResults($listview, limitedResults);
    });
};

/**
 * Populate autocomplete listview with results
 */
Geocode.prototype.populateResults = function($listview, results) {
    if (!$listview || $listview.length === 0) {
        console.error('Listview not available for populating Geocode results');
        return;
    }
    
    $listview.empty();
    
    if (!results || results.length === 0) {
        $listview.append('<li data-role="list-divider">No results found</li>');
        try {
            $listview.listview('refresh');
        } catch (e) {
            console.log('Error refreshing empty Geocode listview:', e);
        }
        return;
    }
    
    var totalItems = 0;
    
    results.forEach(function(categoryResults) {
        // Add category divider if category is provided
        if (categoryResults.category) {
            $listview.append('<li data-role="list-divider">' + categoryResults.category + '</li>');
        }
        
        // Add results
        categoryResults.results.forEach(function(result) {
            if (totalItems >= 20) return; // Hard limit
            
            var $li = $('<li><a href="#">' + result.name + '</a></li>');
            $li.data('result', result);
            $listview.append($li);
            totalItems++;
        });
    });
    
    // Refresh the listview
    try {
        if ($listview.hasClass('ui-listview')) {
            $listview.listview('refresh');
        } else {
            $listview.listview();
        }
    } catch (e) {
        console.log('Error refreshing Geocode listview:', e);
    }
    
    console.log('Geocode results populated:', totalItems, 'items');
};

/**
 * Handle autocomplete selection
 */
Geocode.prototype.handleSelection = function(result) {
    // Close search overlay and clear input
    $('#searchOverlay').hide();
    $('#searchInputOverlay').val('');
    $('#searchAutocompleteOverlay').empty();
    
    // Jump to result if bbox is available
    if (result.bbox) {
        this.jumpToResult(result);
    }
    
    // Highlight geometry if available
    if (result.highlight) {
        this.highlight(result.highlight, function(layer) {
            if (typeof Map !== 'undefined' && Map.setHighlightLayer) {
                Map.setHighlightLayer(layer);
            }
        });
    }
    
    // Reset search marker and set new position
    if (typeof Map !== 'undefined' && Map.searchMarker) {
        Map.searchMarker.setPosition(undefined);
        if (result.bbox) {
            var centerX = (result.bbox[0] + result.bbox[2]) / 2;
            var centerY = (result.bbox[1] + result.bbox[3]) / 2;
            Map.searchMarker.setPosition([centerX, centerY]);
        }
    }
};

/**
 * Jump to search result
 */
Geocode.prototype.jumpToResult = function(result) {
    if (result.bbox && typeof Map !== 'undefined') {
        var extent = result.bbox;
        if (Map.zoomToExtent) {
            Map.zoomToExtent(extent, Config.map.minScaleDenom.search);
        }
        
        // Disable following if available
        if (Map.toggleFollowing) {
            Map.toggleFollowing(false);
        }
    }
};

/**
 * submit search query
 */
Geocode.prototype.submit = function (searchParams, callback) {
    var request = $.ajax({
        url: "admin/proxy.php",
        data: this.parseSearchParams(searchParams),
        //dataType: 'jsonp',
        //jsonp: 'cb',
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
Geocode.prototype.parseSearchParams = function (searchParams) {
    var query = $.trim(searchParams);
    var view = Map.map.getView();
    var center = ol.proj.toLonLat(view.getCenter(), view.getProjection().getCode());
    return {
        "limit": this.limit,
        "types": this.types,
        "country": this.country,
        "language": this.lang,
        "provider": this.provider,
        "query": query,
        "proximity": center[0] + ',' + center[1]
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
Geocode.prototype.parseResults = function (data, status, callback) {
    var results = $.map(data.features, function (value, index) {

        //value.properties.locality = value.properties.locality==undefined ? '' : ' '+value.properties.locality;

        //var name = value.properties.street +' '+ value.properties.housenumber + '</br>' + value.properties.postalcode + value.properties.locality+', '+value.properties.region;
        var name = value.place_name;
        var loc = new ol.geom.Point([value.geometry.coordinates[0], value.geometry.coordinates[1]]);
        loc.transform("EPSG:4326", Map.map.getView().getProjection());
        var box = loc.getExtent();

        return {
            name: name,
            bbox: box,
            point: loc
        };
    });

    callback([{
        category: null,
        results: results,
        total: results.length
    }]);
};
