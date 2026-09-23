/**
 * GPLineProfile - reusable, dependency-free line elevation profile chart.
 *
 * No jQuery / OpenLayers / ExtJS dependency so it can be shared between the
 * CodeIgniter "plan3d" module (Bootstrap + OL) and other clients such as the
 * ExtJS 3.4 "gisapp" viewer. Only plain DOM APIs are used.
 *
 * Expected backend response shape (Level2 "geometry/drape" endpoint):
 * {
 *   geometry: "LINESTRING Z (x y z, x y z, ...)",
 *   distances: [0, 12.3, ...],
 *   segment_slopes_percent: [3.2, -1.1, ...],
 *   stats: {...}
 * }
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GPLineProfile = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var MAX_PROFILE_LENGTH_M = 10000;

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function isFiniteNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }

    function isProfileLengthAllowed(length) {
        return isFiniteNumber(length) && length >= 0 && length <= MAX_PROFILE_LENGTH_M;
    }

    function forEach(list, callback) {
        if (!list) {
            return;
        }
        for (var i = 0; i < list.length; i += 1) {
            if (callback(list[i], i) === false) {
                break;
            }
        }
    }

    function parseLineStringZCoordinates(geometryWkt) {
        if (typeof geometryWkt !== 'string') {
            return [];
        }

        var match = geometryWkt.match(/LINESTRING\s+Z\s*\((.*)\)/i);
        if (!match || !match[1]) {
            return [];
        }

        var coordinates = [];
        forEach(match[1].split(','), function (part) {
            var values = part.replace(/^\s+|\s+$/g, '').split(/\s+/);
            if (values.length < 3) {
                return;
            }

            var x = parseFloat(values[0]);
            var y = parseFloat(values[1]);
            var z = parseFloat(values[2]);
            if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
                return;
            }

            coordinates.push({x: x, y: y, z: z});
        });

        return coordinates;
    }

    function ensureDistanceSeries(distances) {
        var parsedDistances = [];
        forEach(distances, function (value) {
            var parsed = parseFloat(value);
            if (isFinite(parsed)) {
                parsedDistances.push(parsed);
            }
        });

        return parsedDistances;
    }

    function normalizeSlopeSeries(slopes, maxSegments) {
        var parsed = [];
        forEach(slopes, function (value, index) {
            if (index >= maxSegments) {
                return false;
            }

            var slope = parseFloat(value);
            parsed.push(isFinite(slope) ? slope : null);
            return true;
        });

        while (parsed.length < maxSegments) {
            parsed.push(null);
        }

        return parsed;
    }

    function slopeColor(slope) {
        if (!isFinite(slope)) {
            return '#8c93a1';
        }

        if (slope >= 0) {
            var upStrength = clamp(slope / 60, 0, 1);
            var upGreen = Math.round(190 - (130 * upStrength));
            var upBlue = Math.round(80 - (65 * upStrength));
            return 'rgb(214,' + upGreen + ',' + upBlue + ')';
        }

        var downStrength = clamp(Math.abs(slope) / 60, 0, 1);
        var downRed = Math.round(84 - (28 * downStrength));
        var downGreen = Math.round(171 - (66 * downStrength));
        return 'rgb(' + downRed + ',' + downGreen + ',214)';
    }

    function verticalExaggeration(points, opts) {
        opts = opts || {};
        var referenceWidthPx = opts.referenceWidthPx || 900;
        var referenceHeightPx = opts.referenceHeightPx || 210;
        var targetHeightRatio = opts.targetHeightRatio || 0.7;
        var minExaggeration = typeof opts.min === 'number' ? opts.min : 1;
        var maxExaggeration = typeof opts.max === 'number' ? opts.max : 10;

        if (!points || points.length < 2) {
            return minExaggeration;
        }

        var first = points[0];
        var last = points[points.length - 1];
        var length = Math.max(last.distance - first.distance, 0);
        if (length <= 0) {
            return minExaggeration;
        }

        var zMin = points[0].z;
        var zMax = points[0].z;
        forEach(points, function (point) {
            if (point.z < zMin) {
                zMin = point.z;
            }
            if (point.z > zMax) {
                zMax = point.z;
            }
        });

        var zRange = zMax - zMin;
        if (zRange <= 0) {
            return minExaggeration;
        }

        var exag = (targetHeightRatio * referenceHeightPx * length) / (zRange * referenceWidthPx);
        return Math.round(clamp(exag, minExaggeration, maxExaggeration));
    }

    /**
     * Builds a normalized profile state from a raw endpoint response.
     * Returns null when the response does not contain a usable profile.
     */
    function stateFromResponse(data, opts) {
        var coordinates = parseLineStringZCoordinates(data && data.geometry);
        if (coordinates.length < 2) {
            return null;
        }

        var distances = ensureDistanceSeries(data && data.distances);
        if (distances.length !== coordinates.length || distances.length < 2) {
            return null;
        }

        var size = coordinates.length;
        var points = [];
        for (var index = 0; index < size; index += 1) {
            points.push({
                x: coordinates[index].x,
                y: coordinates[index].y,
                z: coordinates[index].z,
                distance: distances[index]
            });
        }

        var slopes = normalizeSlopeSeries(data && data.segment_slopes_percent, size - 1);
        return {
            points: points,
            slopes: slopes,
            verticalExaggeration: verticalExaggeration(points, opts)
        };
    }

    function nearestPointIndex(distances, distanceValue) {
        if (!distances || !distances.length) {
            return -1;
        }

        if (distanceValue <= distances[0]) {
            return 0;
        }

        var lastIndex = distances.length - 1;
        if (distanceValue >= distances[lastIndex]) {
            return lastIndex;
        }

        var left = 0;
        var right = lastIndex;
        while (left <= right) {
            var middle = Math.floor((left + right) / 2);
            var current = distances[middle];
            if (current === distanceValue) {
                return middle;
            }

            if (current < distanceValue) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }

        if (left <= 0) {
            return 0;
        }

        if (left >= distances.length) {
            return distances.length - 1;
        }

        var previousDistance = distances[left - 1];
        var nextDistance = distances[left];
        return Math.abs(distanceValue - previousDistance) <= Math.abs(nextDistance - distanceValue) ? left - 1 : left;
    }

    function formatNumber(value, decimals, locale, naText) {
        var parsed = parseFloat(value);
        if (!isFinite(parsed)) {
            return naText || 'n/a';
        }

        return parsed.toLocaleString(locale || 'sl-SI', {
            minimumFractionDigits: 0,
            maximumFractionDigits: typeof decimals === 'number' ? decimals : 2
        });
    }

    function formatWithUnit(value, decimals, unit, locale, naText) {
        var formatted = formatNumber(value, decimals, locale, naText);
        if (formatted === (naText || 'n/a')) {
            return formatted;
        }

        return formatted + (unit ? ' ' + unit : '');
    }

    /**
     * Builds the SVG markup and pixel layout for a profile state.
     * `idPrefix` should be unique per chart instance on the page.
     */
    function buildChart(state, opts) {
        opts = opts || {};
        var idPrefix = opts.idPrefix || 'gp-line-profile';
        var width = opts.width || 920;
        var height = opts.height || 230;
        var margin = opts.margin || {top: 14, right: 16, bottom: 28, left: 46};
        var plotWidth = width - margin.left - margin.right;
        var plotHeight = height - margin.top - margin.bottom;
        var points = state.points;
        var slopes = state.slopes;
        var firstDistance = points[0].distance;
        var lastDistance = points[points.length - 1].distance;
        var distanceRange = Math.max(lastDistance - firstDistance, 1e-9);
        var xScale = plotWidth / distanceRange;
        var exag = state.verticalExaggeration;

        var zMin = points[0].z;
        var zMax = points[0].z;
        forEach(points, function (point) {
            if (point.z < zMin) {
                zMin = point.z;
            }
            if (point.z > zMax) {
                zMax = point.z;
            }
        });

        var zRange = Math.max(zMax - zMin, 0);
        var yScale = xScale;
        if (zRange > 0) {
            var exaggeratedHeightPx = zRange * exag * yScale;
            if (exaggeratedHeightPx > plotHeight) {
                yScale = plotHeight / (zRange * exag);
            }
        }

        var finalHeightPx = zRange * exag * yScale;
        var yOffset = margin.top + (plotHeight - finalHeightPx) / 2;

        var projected = [];
        forEach(points, function (point) {
            var x = margin.left + ((point.distance - firstDistance) * xScale);
            var y = yOffset + ((zMax - point.z) * exag * yScale);
            projected.push({x: x, y: y});
        });

        var guideId = idPrefix + '-hover-guide';
        var pointId = idPrefix + '-hover-point';
        var hitId = idPrefix + '-hover-hit';

        var svgParts = [];
        svgParts.push('<svg class="terrain-line-profile-svg" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none" aria-label="' + (opts.ariaLabel || 'Height profile') + '">');
        svgParts.push('<line x1="' + margin.left + '" y1="' + (height - margin.bottom) + '" x2="' + (width - margin.right) + '" y2="' + (height - margin.bottom) + '" stroke="#9aa3b3" stroke-width="1"/>');
        svgParts.push('<line x1="' + margin.left + '" y1="' + margin.top + '" x2="' + margin.left + '" y2="' + (height - margin.bottom) + '" stroke="#9aa3b3" stroke-width="1"/>');

        for (var i = 0; i < projected.length - 1; i += 1) {
            svgParts.push('<line x1="' + projected[i].x.toFixed(2) + '" y1="' + projected[i].y.toFixed(2) + '" x2="' + projected[i + 1].x.toFixed(2) + '" y2="' + projected[i + 1].y.toFixed(2) + '" stroke="' + slopeColor(slopes[i]) + '" stroke-width="3" stroke-linecap="round"/>');
        }

        svgParts.push('<line id="' + guideId + '" x1="' + margin.left + '" y1="' + margin.top + '" x2="' + margin.left + '" y2="' + (height - margin.bottom) + '" stroke="#364154" stroke-width="1" stroke-dasharray="4 4" style="display:none;"/>');
        svgParts.push('<circle id="' + pointId + '" cx="' + margin.left + '" cy="' + (height - margin.bottom) + '" r="5" fill="#1f2937" stroke="#fff" stroke-width="2" style="display:none;"/>');
        svgParts.push('<rect id="' + hitId + '" x="' + margin.left + '" y="' + margin.top + '" width="' + plotWidth + '" height="' + plotHeight + '" fill="transparent"/>');
        svgParts.push('</svg>');

        return {
            svg: svgParts.join(''),
            layout: {
                idPrefix: idPrefix,
                guideId: guideId,
                pointId: pointId,
                hitId: hitId,
                width: width,
                height: height,
                margin: margin,
                plotWidth: plotWidth,
                plotHeight: plotHeight,
                firstDistance: firstDistance,
                distanceRange: distanceRange,
                rightEdge: width - margin.right,
                projected: projected
            }
        };
    }

    /**
     * Binds hover interaction to a chart previously built with buildChart().
     * `container` must be the DOM element the chart SVG was inserted into.
     * Returns a detach() function to remove the listeners.
     */
    function attachHover(container, state, layout, callbacks) {
        callbacks = callbacks || {};
        var hoverGuide = container.querySelector('#' + layout.guideId);
        var hoverPoint = container.querySelector('#' + layout.pointId);
        var hoverHit = container.querySelector('#' + layout.hitId);
        if (!hoverHit) {
            return function () {};
        }

        var distances = [];
        forEach(state.points, function (point) {
            distances.push(point.distance);
        });

        function onMouseMove(event) {
            var rect = hoverHit.getBoundingClientRect();
            var hitWidth = rect.width || layout.plotWidth;
            var ratio = clamp((event.clientX - rect.left) / hitWidth, 0, 1);
            var distance = layout.firstDistance + (ratio * layout.distanceRange);
            var nearestIndex = nearestPointIndex(distances, distance);
            if (nearestIndex < 0) {
                return;
            }

            var projectedPoint = layout.projected[nearestIndex];
            var profilePoint = state.points[nearestIndex];
            var slopeValue = null;
            if (nearestIndex < state.slopes.length) {
                slopeValue = state.slopes[nearestIndex];
            } else if (nearestIndex > 0) {
                slopeValue = state.slopes[nearestIndex - 1];
            }

            if (hoverGuide) {
                hoverGuide.setAttribute('x1', projectedPoint.x);
                hoverGuide.setAttribute('x2', projectedPoint.x);
                hoverGuide.style.display = '';
            }
            if (hoverPoint) {
                hoverPoint.setAttribute('cx', projectedPoint.x);
                hoverPoint.setAttribute('cy', projectedPoint.y);
                hoverPoint.style.display = '';
            }

            if (typeof callbacks.onHover === 'function') {
                callbacks.onHover(profilePoint, slopeValue, projectedPoint);
            }
        }

        function onMouseLeave() {
            if (hoverGuide) {
                hoverGuide.style.display = 'none';
            }
            if (hoverPoint) {
                hoverPoint.style.display = 'none';
            }

            if (typeof callbacks.onLeave === 'function') {
                callbacks.onLeave();
            }
        }

        hoverHit.addEventListener('mousemove', onMouseMove);
        hoverHit.addEventListener('mouseleave', onMouseLeave);

        return function detach() {
            hoverHit.removeEventListener('mousemove', onMouseMove);
            hoverHit.removeEventListener('mouseleave', onMouseLeave);
        };
    }

    return {
        maxProfileLengthM: MAX_PROFILE_LENGTH_M,
        clamp: clamp,
        isFiniteNumber: isFiniteNumber,
        isProfileLengthAllowed: isProfileLengthAllowed,
        parseLineStringZCoordinates: parseLineStringZCoordinates,
        ensureDistanceSeries: ensureDistanceSeries,
        normalizeSlopeSeries: normalizeSlopeSeries,
        slopeColor: slopeColor,
        verticalExaggeration: verticalExaggeration,
        stateFromResponse: stateFromResponse,
        nearestPointIndex: nearestPointIndex,
        formatNumber: formatNumber,
        formatWithUnit: formatWithUnit,
        buildChart: buildChart,
        attachHover: attachHover
    };
}));
