/**
 * WSGI search from QGIS Web Client with jQuery Mobile Autocomplete
 */

function WsgiSearch(url, geomUrl, showHighlightLabel, searchTables, filter, connect) {
    // search URL
    this.url = url;
    // geometry URL for highlighting
    this.geomUrl = geomUrl;
    // show highlight label
    this.showHighlightLabel = showHighlightLabel;
    this.searchTables = searchTables;
    this.filter = filter;
    this.connect = connect;
    
    // Autocomplete settings
    this.autocompleteSettings = {
        minLength: 2,
        delay: 300,
        maxResults: 20
    };
}

// inherit from Search
WsgiSearch.prototype = new Search();

/**
 * Initialize jQuery Mobile autocomplete on a listview element
 */
WsgiSearch.prototype.initAutocomplete = function(inputSelector, listviewSelector, options) {
    var self = this;
    var $input = $(inputSelector);
    var $listview = $(listviewSelector);
    var settings = $.extend({}, this.autocompleteSettings, options || {});
    
    var searchTimeout;
    var currentRequest;

    // If listview doesn't exist, create it
    if ($listview.length === 0) {
        var listviewId = listviewSelector.replace('#', '');
        var $newListview = $('<ul id="' + listviewId + '" data-role="listview" data-inset="true" data-filter="false"></ul>');
        
        // Insert after the search input's form
        $input.closest('form').after($newListview);
        $listview = $newListview;
    }
    
    // Ensure listview is properly initialized
    if ($listview.length > 0) {
        try {
            if (!$listview.hasClass('ui-listview')) {
                $listview.listview();
                console.log('Listview initialized');
            } else {
                //console.log('Listview already initialized');
            }
        } catch (e) {
            console.log('Listview initialization error:', e);
        }
    }
    
    // Function to populate autocomplete results
    var populateResults = function(results) {

        if (!$listview || $listview.length === 0) {
            console.error('Listview not available for populating results');
            return;
        }
        
        $listview.empty();
        
        if (!results || results.length === 0) {
            $listview.append('<li data-role="list-divider">'+I18n.search.noResults+'</li>');
            try {
                $listview.listview('refresh');
            } catch (e) {
                console.log('Error refreshing empty listview:', e);
            }
            return;
        }
        
        var totalItems = 0;
        
        for (var i = 0; i < results.length && totalItems < settings.maxResults; i++) {
            var categoryResults = results[i];
            
            // Add category divider
            if (categoryResults.category != null) {
                $listview.append('<li data-role="list-divider">' + categoryResults.category + '</li>');
            }
            
            // Add results
            for (var j = 0; j < categoryResults.results.length && totalItems < settings.maxResults; j++) {
                var result = categoryResults.results[j];
                var $item = $('<li><a href="#">' + result.name + '</a></li>');
                
                // Store result data
                $item.data('result', result);
                
                // Click handler
                $item.find('a').click(function(e) {
                    e.preventDefault();
                    
                    // Get the selected result from the parent li element
                    var $li = $(this).closest('li');
                    var selectedResult = $li.data('result');

                    if (!selectedResult) {
                        console.error('No result data found on clicked item');
                        return;
                    }
                    
                    // Set input value
                    $input.val(selectedResult.name);
                    
                    // Clear autocomplete
                    $listview.empty();
                    try {
                        $listview.listview('refresh');
                    } catch (e) {
                        console.log('Error refreshing listview after selection:', e);
                    }
                    
                    // Hide the input (close virtual keyboard)
                    $input.blur();
                    
                    // Handle selection
                    self.handleSelection(selectedResult);
                });
                
                $listview.append($item);
                totalItems++;
            }
        }
        
        // Refresh listview to apply jQuery Mobile styling
        try {
            $listview.listview('refresh');
        } catch (e) {
            console.log('Error refreshing listview:', e);
            // Try to reinitialize if refresh fails
            try {
                $listview.listview();
                console.log('Listview reinitialized');
            } catch (e2) {
                console.log('Error reinitializing listview:', e2);
            }
        }
    };
    
    // Search function with debouncing
    var performSearch = function(query) {

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        searchTimeout = setTimeout(function() {
            if (currentRequest) {
                currentRequest.abort();
            }
            
            if (query.length >= settings.minLength) {
                currentRequest = self.submitAutocomplete(query, populateResults);
            } else {
                $listview.empty();
                try {
                    $listview.listview('refresh');
                } catch (e) {
                    console.log('Error clearing listview:', e);
                }
            }
        }, settings.delay);
    };
    
    // Bind input events
    $input.on('input keyup', function() {
        var query = $.trim($(this).val());
        performSearch(query);
    });
    
    // Clear results when input is cleared
    $input.on('change', function() {
        if ($(this).val() === '') {
            $listview.empty();
            try {
                $listview.listview('refresh');
            } catch (e) {
                console.log('Error clearing listview on change:', e);
            }
        }
    });
    
    return this;
};

/**
 * Handle autocomplete selection
 */
WsgiSearch.prototype.handleSelection = function(result) {
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
    // if (typeof Map !== 'undefined' && Map.searchMarker) {
    //     Map.searchMarker.setPosition(undefined);
    //     if (result.bbox) {
    //         var centerX = (result.bbox[0] + result.bbox[2]) / 2;
    //         var centerY = (result.bbox[1] + result.bbox[3]) / 2;
    //         Map.searchMarker.setPosition([centerX, centerY]);
    //     }
    // }
};

/**
 * Jump to search result
 */
WsgiSearch.prototype.jumpToResult = function(result) {
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
 * Submit autocomplete search query (optimized for autocomplete)
 */
WsgiSearch.prototype.submitAutocomplete = function(searchParams, callback) {

    var data = {
        query: $.trim(searchParams),
        searchtables: this.searchTables,
        srs: projectData.crs.split(':')[1]
    };
    if (this.filter) {
        data.filter = this.filter;
    }
    if (this.connect) {
        data.connect = this.connect;
    }

    var request = $.ajax({
        url: this.url,
        data: data,
        dataType: 'json',
        context: this,
        timeout: 8000
    });

    request.done(function(data, status) {
        this.parseResults(data, status, callback);
    });

    request.fail(function(jqXHR, status) {
        console.error('AJAX request failed:', jqXHR.status, jqXHR.statusText, status);
        if (status !== 'abort') {
            console.warn('Autocomplete search failed:', jqXHR.status, jqXHR.statusText);
        }
        callback([]);
    });
    
    return request;
};

/**
 * submit search query
 */
WsgiSearch.prototype.submit = function (searchParams, callback) {
    var request = $.ajax({
        url: this.url,
        data: {
            query: $.trim(searchParams),
            searchtables: this.searchTables,
            srs: projectData.crs.split(':')[1]
        },
        dataType: 'json',
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
 * parse query result and invoke the callback with search result features
 *
 * [
 *   {
 *     category: <category>, // null to hide
 *     results: [
 *       {
 *         name: <visible name>,
 *         highlight: {
 *           searchtable: <search table>,
 *           displaytext: <string for search>,
 *         },
 *         bbox: [<minx>, <miny>, <maxx>, <maxy>]
 *       }
 *     ]
 *   }
 * ]
 */
WsgiSearch.prototype.parseResults = function (data, status, callback) {
    // group by category
    var categories = {};
    var category = null;
    for (var i = 0; i < data.results.length; i++) {
        var result = data.results[i];
        if (result.bbox == null) {
            // add category
            category = result.displaytext;
            if (categories[category] === undefined) {
                categories[category] = [];
            }
        } else {
            // add result to current category
            categories[category].push({
                name: result.displaytext,
                highlight: {
                    searchtable: result.searchtable,
                    displaytext: result.displaytext,
                    showlayer: result.showlayer
                },
                bbox: result.bbox
            });
        }
    }

    // convert to search results
    var results = $.map(categories, function (features, category) {
        return {
            category: category,
            results: features
        };
    });
    callback(results);
};

/**
 * create and add a highlight layer for the selected search result
 *
 * request geometry and add vector layer for highlighting
 *
 * highlight = {
 *   searchtable: <search table>,
 *   displaytext: <string for search and optional highlight label>,
 * }
 * callback(<OL3 layer>): add highlight layer to map
 */
WsgiSearch.prototype.highlight = function (highlight, callback) {
    // get geometry
    var request = $.ajax({
        url: this.geomUrl,
        data: {
            searchtable: highlight.searchtable,
            displaytext: highlight.displaytext,
            showlayer: highlight.showlayer,
            srs: projectData.crs.split(':')[1]
        },
        dataType: 'text'
    });

    //switch on layer if needed
    var layer = Eqwc.common.getLayerId(highlight.showlayer);
    if (layer) {
        if (!Map.layers[layer].visible) {
            Map.setLayerVisible(layer, true, true);
        }
    }

    var showHighlightLabel = this.showHighlightLabel;
    request.done(function (data, status) {
        // convert WKT to features
        var format = new ol.format.WKT({splitCollection: true});
        var features = format.readFeatures(data);

        if (showHighlightLabel && highlight.displaytext != null) {
            for (var featureIndex in features) {
                // adjust label text (remove last part in brackets)
                var labelstring = highlight.displaytext.replace(/ \([^\)]+\)$/, '');
                features[featureIndex].set('labelstring', labelstring);
            }
        }

        // feature style
        var style = function (feature, resolution) {
            var stroke = new ol.style.Stroke({
                color: Eqwc.settings.symbolizersHighLightLayer.Line.strokeColor,
                width: Eqwc.settings.symbolizersHighLightLayer.Line.strokeWidth
            });
            var fill = new ol.style.Fill({
                //transparent
                color: 'rgba(255, 140, 0, 0)'
            });

            var text = null;
            if (feature.get('labelstring')) {
                // label (NOTE: every subgeometry of a multigeometry is labeled)
                text = new ol.style.Text({
                    text: feature.get('labelstring'),
                    textAlign: 'center',
                    textBaseline: 'bottom',
                    offsetY: -5,
                    font: 'normal 16px Helvetica,Arial,sans-serif',
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 0, 1.0)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 255, 255, 1.0)',
                        width: 2
                    })
                });
            }

            return [new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 4,
                    fill: fill,
                    stroke: stroke
                }),
                fill: fill,
                stroke: stroke,
                text: text
            })];
        };

        // add highlight layer
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: features
            }),
            style: style
        });
        layer.name = 'highlight';

        //zoomTo
        var extent = features[0].getGeometry().getExtent();
        Map.zoomToExtent(extent, Config.map.minScaleDenom.search);

        callback(layer);
    });
};
