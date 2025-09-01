/**
 * WSGI search from QGIS Web Client
 */

function WsgiSearch(url, geomUrl, showHighlightLabel, searchTables) {
    // search URL
    this.url = url;
    // geometry URL for highlighting
    this.geomUrl = geomUrl;
    // show highlight label
    this.showHighlightLabel = showHighlightLabel;

    this.searchTables = searchTables;
}

// inherit from Search
WsgiSearch.prototype = new Search();

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
