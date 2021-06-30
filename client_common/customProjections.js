/**
 * This file holds specific projection parameters like extent and axis orientation
 * Both clients use this file
 *
 * Just add desired projections to the array, do not remove them!
 *
 * Extent (left, bottom, right, top) in map units must exist.
 * You can get it from https://epsg.io (copy projected bounds) or from baselayer definition.
 *
 * yx: false means first coordinate is EAST:left/right, second NORTH: bottom/top
 *
 */

var CustomProj = [];

CustomProj['EPSG:2177'] = {extent: [3236256.79,4207696.11,6745499.32,9397976.34], units: 'm', yx: true};
CustomProj['EPSG:2180'] = {extent: [116649.52,118322.29,806302.07,845151.24], units: 'm', yx: true};            //Poland
CustomProj['EPSG:3006'] = {extent: [-1200000,4305696,2994304,8500000], units: 'm', yx: true};                   //Sweden
CustomProj['EPSG:31254']= {extent: [-61758.89,140394.51,499917.82,453931.14], units: 'm', yx: true};            //Austria GK West
CustomProj['EPSG:31255']= {extent: [-292428.21,147114.52,280657.59,438461.34], units: 'm', yx: true};            //Austria
CustomProj['EPSG:31256']= {extent: [-523057.16,162621.12,61288.27,431698.18], units: 'm', yx: true};            //Austria GK East
CustomProj['EPSG:31259']= {extent: [226942.84, 162621.12, 811288.27, 431698.18], units: 'm', yx: true};            //Austria GK
CustomProj['EPSG:32632']= {extent: [166021.44, 0.00, 534994.66, 9329005.18], units: 'm', yx: false, northAxis: 'N', eastAxis: 'E'};
CustomProj['EPSG:32633']= {extent: [166021.44, 0.00, 534994.66, 9329005.18], units: 'm', yx: false, northAxis: 'N', eastAxis: 'E'};
CustomProj['EPSG:32634']= {extent: [166021.44, 0.00, 534994.66, 9329005.18], units: 'm', yx: false, northAxis: 'N', eastAxis: 'E'};
CustomProj['EPSG:32635']= {extent: [166021.44, 0.00, 534994.66, 9329005.18], units: 'm', yx: false, northAxis: 'N', eastAxis: 'E'};
CustomProj['EPSG:3794'] = {extent: [373217.65,32395.09,622710.74,194645.86], units: 'm', yx: false};            //Slovenia new
CustomProj['EPSG:3857'] = {extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34], units: 'm', yx: false};
CustomProj['EPSG:3909'] = {extent: [6857660.55,4550994.70,7655918.26,5194896.94], units: 'm', yx: true};        //Balkan Zone 7
CustomProj['EPSG:3912'] = {extent: [363774.72,-475760.46,1113039.95,224384.21], units: 'm', yx: false};         //Slovenia old
CustomProj['EPSG:25830'] = {extent: [-729785.76, 3715125.82, 945351.10, 9522561.39], units: 'm', yx: false};
