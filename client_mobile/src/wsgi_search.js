/**
 * WSGI search from QGIS Web Client with Typeahead functionality
 */

function WsgiSearch(url, geomUrl, showHighlightLabel, searchTables, typeaheadOptions) {
    // search URL
    this.url = url;
    // geometry URL for highlighting
    this.geomUrl = geomUrl;
    // show highlight label
    this.showHighlightLabel = showHighlightLabel;

    this.searchTables = searchTables;
    
    // Typeahead configuration
    this.typeaheadOptions = $.extend({
        minLength: 2,           // Minimum characters before starting search
        delay: 300,             // Delay in ms after user stops typing
        maxResults: 10,         // Maximum number of suggestions to show
        showCategories: true,   // Whether to show category headers
        autoSelect: false,      // Auto-select first result
        cache: true,           // Cache results for performance
        cacheTimeout: 300000   // Cache timeout in ms (5 minutes)
    }, typeaheadOptions || {});
    
    // Internal state
    this._searchTimeout = null;
    this._currentRequest = null;
    this._cache = {};
    this._isTypeaheadActive = false;
}

// inherit from Search
WsgiSearch.prototype = new Search();

/**
 * Initialize typeahead functionality on a jQuery input element
 */
WsgiSearch.prototype.initTypeahead = function(inputElement, options) {
    var self = this;
    var $input = $(inputElement);
    var $container = null;
    
    var settings = $.extend({}, this.typeaheadOptions, options || {});
    
    // Create typeahead container
    var createContainer = function() {
        if ($container) return $container;
        
        $container = $('<div class="typeahead-container"></div>');
        $container.css({
            'position': 'absolute',
            'top': $input.offset().top + $input.outerHeight(),
            'left': $input.offset().left,
            'width': $input.outerWidth(),
            'max-height': '300px',
            'overflow-y': 'auto',
            'background': 'white',
            'border': '1px solid #ccc',
            'border-top': 'none',
            'z-index': 9999,
            'display': 'none'
        });
        
        $('body').append($container);
        return $container;
    };
    
    // Show typeahead suggestions
    var showSuggestions = function(results) {
        var $container = createContainer();
        $container.empty();
        
        if (!results || results.length === 0) {
            $container.hide();
            return;
        }
        
        var $list = $('<ul class="typeahead-list"></ul>');
        $list.css({
            'list-style': 'none',
            'margin': '0',
            'padding': '0'
        });
        
        var totalResults = 0;
        
        for (var i = 0; i < results.length && totalResults < settings.maxResults; i++) {
            var categoryResults = results[i];
            
            // Add category header if enabled
            if (settings.showCategories && categoryResults.category != null) {
                var $categoryHeader = $('<li class="typeahead-category"></li>');
                $categoryHeader.css({
                    'padding': '8px 12px',
                    'font-weight': 'bold',
                    'background-color': '#f5f5f5',
                    'border-bottom': '1px solid #ddd',
                    'color': '#666'
                });
                $categoryHeader.text(categoryResults.category);
                $list.append($categoryHeader);
            }
            
            // Add results
            for (var j = 0; j < categoryResults.results.length && totalResults < settings.maxResults; j++) {
                var result = categoryResults.results[j];
                var $item = $('<li class="typeahead-item"></li>');
                
                $item.css({
                    'padding': '10px 12px',
                    'cursor': 'pointer',
                    'border-bottom': '1px solid #eee'
                });
                
                $item.hover(
                    function() { $(this).css('background-color', '#e6f3ff'); },
                    function() { $(this).css('background-color', 'white'); }
                );
                
                $item.text(result.name);
                $item.data('result', result);
                
                // Click handler for selection
                $item.click(function() {
                    var selectedResult = $(this).data('result');
                    $input.val(selectedResult.name);
                    $container.hide();
                    self._isTypeaheadActive = false;
                    
                    // Trigger selection event
                    $input.trigger('typeahead:select', [selectedResult]);
                    
                    // Auto-highlight if bbox is available
                    if (selectedResult.bbox) {
                        self._jumpToResult(selectedResult);
                    }
                    
                    // Auto-highlight geometry if available
                    if (selectedResult.highlight) {
                        self.highlight(selectedResult.highlight, function(layer) {
                            // Handle highlight layer (implementation depends on your map framework)
                            if (typeof Map !== 'undefined' && Map.setHighlightLayer) {
                                Map.setHighlightLayer(layer);
                            }
                        });
                    }
                });
                
                $list.append($item);
                totalResults++;
            }
        }
        
        $container.append($list);
        
        // Position container correctly
        $container.css({
            'top': $input.offset().top + $input.outerHeight(),
            'left': $input.offset().left,
            'width': $input.outerWidth()
        });
        
        $container.show();
        self._isTypeaheadActive = true;
    };
    
    // Hide suggestions
    var hideSuggestions = function() {
        if ($container) {
            $container.hide();
        }
        self._isTypeaheadActive = false;
    };
    
    // Debounced search function
    var performSearch = function(query) {
        if (self._searchTimeout) {
            clearTimeout(self._searchTimeout);
        }
        
        self._searchTimeout = setTimeout(function() {
            // Check cache first
            if (settings.cache && self._cache[query]) {
                var cached = self._cache[query];
                if (Date.now() - cached.timestamp < settings.cacheTimeout) {
                    showSuggestions(cached.results);
                    return;
                }
            }
            
            // Cancel previous request
            if (self._currentRequest) {
                self._currentRequest.abort();
            }
            
            // Perform search
            self._currentRequest = self.submitTypeahead(query, function(results) {
                // Cache results
                if (settings.cache) {
                    self._cache[query] = {
                        results: results,
                        timestamp: Date.now()
                    };
                }
                
                showSuggestions(results);
                self._currentRequest = null;
            });
        }, settings.delay);
    };
    
    // Bind events
    $input.on('input keyup', function(e) {
        var query = $.trim($(this).val());
        
        // Handle special keys
        if (e.keyCode === 27) { // Escape
            hideSuggestions();
            return;
        }
        
        if (query.length >= settings.minLength) {
            performSearch(query);
        } else {
            hideSuggestions();
        }
    });
    
    // Hide suggestions when clicking outside
    $(document).on('click', function(e) {
        if (!$input.is(e.target) && (!$container || !$container.is(e.target) && $container.has(e.target).length === 0)) {
            hideSuggestions();
        }
    });
    
    // Handle window resize to reposition container
    $(window).on('resize', function() {
        if ($container && $container.is(':visible')) {
            $container.css({
                'top': $input.offset().top + $input.outerHeight(),
                'left': $input.offset().left,
                'width': $input.outerWidth()
            });
        }
    });
    
    // Cleanup function
    $input.data('typeahead-destroy', function() {
        if ($container) {
            $container.remove();
        }
        $(document).off('click');
        $(window).off('resize');
        $input.off('input keyup');
    });
    
    return this;
};

/**
 * Submit typeahead search query (optimized for typeahead usage)
 */
WsgiSearch.prototype.submitTypeahead = function(searchParams, callback) {
    var request = $.ajax({
        url: this.url,
        data: {
            query: $.trim(searchParams),
            searchtables: this.searchTables,
            srs: projectData.crs.split(':')[1],
            limit: this.typeaheadOptions.maxResults * 2 // Request more than needed for filtering
        },
        dataType: 'json',
        context: this,
        timeout: 10000 // 10 second timeout for typeahead
    });

    request.done(function(data, status) {
        this.parseResults(data, status, callback);
    });

    request.fail(function(jqXHR, status) {
        if (status !== 'abort') { // Don't show error for aborted requests
            console.warn('Typeahead search failed:', jqXHR.status, jqXHR.statusText);
        }
        callback([]);
    });
    
    return request;
};

/**
 * Helper method to jump to search result
 */
WsgiSearch.prototype._jumpToResult = function(result) {
    if (result.bbox && typeof Map !== 'undefined') {
        // Jump to bbox
        var extent = result.bbox;
        if (Map.zoomToExtent) {
            Map.zoomToExtent(extent, Config.map.minScaleDenom.search);
        }
        
        // Set search marker if available
        if (Map.searchMarker && result.point) {
            Map.searchMarker.setPosition(result.point.getCoordinates());
        }
    }
};

/**
 * Destroy typeahead functionality
 */
WsgiSearch.prototype.destroyTypeahead = function(inputElement) {
    var $input = $(inputElement);
    var destroyFn = $input.data('typeahead-destroy');
    if (destroyFn) {
        destroyFn();
        $input.removeData('typeahead-destroy');
    }
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
