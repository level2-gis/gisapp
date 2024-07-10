Build with eqwc configuration with latest developers version Open Layers

Modified files:
- Events: buttonclick.js (This commit is reverted - https://github.com/openlayers/ol2/commit/9a4f5d17626583a332099aa1a8a93e01467546bb ,due to this bug - https://github.com/openlayers/ol2/issues/1495)
- Format: WFSDescribeFeatureType.js (modifications, needed for Editor plugin)
- Format: WKT.js (read 3D or 4D geometries as 2D)
