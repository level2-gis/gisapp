/**
 * This file holds specific projection parameters like extent and axis orientation
 * Both clients use this file
 *
 * Just add desired projections to the array, do not remove them!
 *
 * Extent (left, bottom, right, top) in map units must exist.
 * You can get it from https://epsg.io (copy projected bounds) or from baselayer definition.
 *
 */

var CustomProj = [];

CustomProj['EPSG:2177'] = {extent: [], units: 'm', yx: true};
CustomProj['EPSG:2180'] = {extent: [116649.52,118322.29,806302.07,845151.24], units: 'm', yx: true};            //Poland
CustomProj['EPSG:3006'] = {extent: [-1200000,4305696,2994304,8500000], units: 'm', yx: true};                   //Sweden
CustomProj['EPSG:31254']= {extent: [-61758.89,140394.51,499917.82,453931.14], units: 'm', yx: true};            //Austria GK
CustomProj['EPSG:31259']= {extent: [226942.84, 162621.12, 811288.27, 431698.18], units: 'm', yx: true};            //Austria GK
CustomProj['EPSG:32633']= {extent: [166021.44, 0.00, 534994.66, 9329005.18], units: 'm', yx: false};
CustomProj['EPSG:32635']= {extent: [-760000, 6580000, 657000, 8990000], units: 'm', yx: false};                 //Norway
CustomProj['EPSG:3794'] = {extent: [373217.65,32395.09,622710.74,194645.86], units: 'm', yx: false};            //Slovenia new
CustomProj['EPSG:3857'] = {extent: [-20026376.39,-20048966.10,20026376.39,20048966.10], units: 'm', yx: false};
CustomProj['EPSG:3909'] = {extent: [6857660.55,4550994.70,7655918.26,5194896.94], units: 'm', yx: true};        //Balkan Zone 7
CustomProj['EPSG:3912'] = {extent: [363774.72,-475760.46,1113039.95,224384.21], units: 'm', yx: false};         //Slovenia old
