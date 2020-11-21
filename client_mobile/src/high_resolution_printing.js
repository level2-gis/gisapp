/**
 * High resolution printing from browser
 * e.g. when using the viewer inside an iframe
 *
 * enable with Config.print.hires = true
 * set target resolution with Config.print.dpi
 *
 * As the last rendering pass of OL3 WMS layers always happens after 'beforeprint'
 * has finished, so it does not appear in the print, the workaround is to add the
 * WMS layers as static <img> elements and render the overlay vectors and markers
 * using a separate OL3 map on top.
 */

$(document).ready(function () {
    if (!Config.print.hires) {
        // high resolution printing disabled
        return;
    }

    // add <img> for WMS
    var addWmsImage = function (id, width, height, olLayer, wmsParams) {
        if (olLayer != null && olLayer.getVisible()) {
            var params = $.extend({},
                olLayer.getSource().getParams(),
                wmsParams
            );
            if (params.OPACITIES == null) {
                // remove OPACITIES param
                delete params.OPACITIES;
            }
            var url = null;
            if (olLayer instanceof ol.layer.Tile) {
                // ol.layer.Tile
                url = olLayer.getSource().getUrls()[0];
            } else {
                // ol.layer.Image
                url = olLayer.getSource().getUrl();
            }
            url += '?' + $.param(params);

            var html = '<img id="' + id + '" ';
            html += 'class="printWmsImage" ';
            html += 'src="' + url + '" ';
            html += 'width=' + width + ' height=' + height + ' ';
            html += 'style="position: absolute; left: 0; top: 0; ';
            if (params.TRANSPARENT == 'TRUE') {
                html += 'background-color: transparent;';
            }
            html += '">';
            $('#mappage').append(html);
        }
    };

    // add ol.Overlay marker
    var addMarker = function (map, pos, markerEl) {
        // copy style from existing marker element
        var css = markerEl.css(['width', 'height', 'background-image', 'list-style-image']);
        var image = css['background-image'];
        if (image == 'none') {
            // print style already set in Chrome
            image = css['list-style-image'];
        }

        var html = '<div ';
        html += 'style="';
        html += 'width: ' + css.width + '; height: ' + css.height + '; ';
        html += 'display: list-item !important; ';
        html += 'list-style-image: ' + image.replace(/"/g, '&quot;') + '; ';
        html += 'list-style-position: inside; ';
        html += '"></div>';

        map.addOverlay(
            new ol.Overlay({
                element: ($(html))[0],
                positioning: 'center-center',
                position: pos
            })
        );
    };

    // setup high resolution map for printing
    var beforePrint = function () {
        var map = Map.map;
        var width = map.getSize()[0];
        var height = map.getSize()[1];

        var targetDpi = Config.print.dpi;
        var dpiFactor = targetDpi / Config.map.dpi;
        var targetPixelRatio = dpiFactor;
        var targetWidth = Math.round(width * dpiFactor);
        var targetHeight = Math.round(height * dpiFactor);

        var wmsParams = {
            SERVICE: 'WMS',
            VERSION: '1.3',
            REQUEST: 'GetMap',
            WIDTH: targetWidth,
            HEIGHT: targetHeight,
            CRS: Config.map.projection.getCode(),
            BBOX: map.getView().calculateExtent([width, height]).join(',')
        };
        // set target dpi according to server type
        switch (Config.map.wmsServerType) {
            case 'geoserver':
                wmsParams.FORMAT_OPTIONS = 'dpi:' + targetDpi;
                break;
            case 'mapserver':
                wmsParams.MAP_RESOLUTION = targetDpi;
                break;
            case 'qgis':
            default:
                wmsParams.DPI = targetDpi;
                break;
        }

        // create WMS background layer image
        addWmsImage('printBackgroundLayer', width, height, Map.backgroundLayer, wmsParams);

        // create WMS topic layer image
        addWmsImage('printTopicLayer', width, height, Map.topicLayer, wmsParams);

        // create WMS overlay layer images
        for (var overlayTopic in Map.overlayLayers) {
            addWmsImage('printLayer_' + overlayTopic, width, height, Map.overlayLayers[overlayTopic], wmsParams);
        }

        // create OL3 map for printing vectors, markers and scale line
        var html = '<div id="printMap" ';
        html += 'style="';
        html += 'position: absolute; top: 0; left: 0; background-color: transparent; ';
        html += 'width: ' + width + 'px; height:' + height + 'px;';
        html += '"></div>';
        $('#mappage').append(html);

        var printMap = new ol.Map({
            layers: [],
            target: 'printMap',
            view: new ol.View(Config.map.viewOptions),
            pixelRatio: targetPixelRatio,
            controls: []
        });

        // add scale line
        if (Map.scaleLine != null) {
            printMap.addControl(
                new ol.control.ScaleLine({
                    units: 'metric',
                })
            );
        }
        // add overlay layers
        if (Map.selectionLayer != null) {
            printMap.addLayer(Map.selectionLayer);
        }
        if (Map.redliningLayer != null) {
            printMap.addLayer(Map.redliningLayer);
        }
        if (Map.highlightLayer != null) {
            printMap.addLayer(Map.highlightLayer);
        }
        // add markers
        if (Map.geolocation != null) {
            addMarker(printMap, Map.geolocation.getPosition(), $('#locationMarker'));
        }
        if (Map.clickMarker != null) {
            addMarker(printMap, Map.clickMarker.getPosition(), $('#clickMarker'));
        }

        // copy map extent
        printMap.getView().setCenter(map.getView().getCenter());
        printMap.getView().setZoom(map.getView().getZoom());
        // force render
        printMap.renderSync();

        // hide main OL3 map
        $('#map .ol-viewport').hide();
    };

    // cleanup after printing
    var afterPrint = function () {
        // remove print elements
        $('.printWmsImage').remove();
        $('#printMap').remove();

        // show main OL3 map
        $('#map .ol-viewport').show();
    };

    // detect print requests
    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function (mql) {
            if (mql.matches) {
                beforePrint();
            } else {
                afterPrint();
            }
        });
    }
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
});
