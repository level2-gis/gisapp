/**
 * Load layers
 */

var Layers = {};

// prefix to mark layers without group
Layers.markerPrefix = "____";

/**
 * get layers as JSON and return the layers grouped by groupname and the layer tree structure
 *
 * {
 *   groups: [
 *     {
 *       title: <group>,
 *       layers: [
 *         <layer data from wmslayers>
 *       ]
 *     }
 *   ],
 *   layertree: [ // layer hierarchy from optional layertree or generated from groups
 *     name: <group/layername>,
 *     layers: [
 *        <group layers or empty>
 *      ]
 *   ]
 * }
 */
Layers.loadLayers = function(url, callback) {

    var wmslayers = projectData.layers;

        // sort by reverse toc_sort
        //var wmslayers = data.wmslayers.sort(function(a, b) {
        //    return b.toc_sort - a.toc_sort;
        //});

        // group by groupname
        groups = {};
        for (var i=0;i<wmslayers.length; i++) {
            var layer = wmslayers[i];

            if (layer.groupname === null) {
                // mark layers without group
                layer.groupname = Layers.markerPrefix + layer.layername;
            }
            if (groups[layer.groupname] === undefined) {
                groups[layer.groupname] = [];
            }
            groups[layer.groupname].push(layer);
        }

        var sortedGroups = [];
        for (var key in groups) {
            if (groups.hasOwnProperty(key)) {
                sortedGroups.push({
                    title: key,
                    layers: groups[key]
                });
            }
        }

        // generate layertree if not in JSON
        // var layertree = data.layertree;
        //if (layertree === undefined) {
            var layertree = [];

            var markerPrefix = new RegExp(Layers.markerPrefix);

            for (var i=0;i<sortedGroups.length; i++) {
                var group = sortedGroups[i];

                var layers = null;
                if (group.title.match(markerPrefix)) {
                    // layer without group
                    layers = layertree;
                }
                else {
                    // add group
                    var subtree = {
                        name: group.title,
                        layers: []
                    };
                    layertree.push(subtree);

                    layers = subtree.layers;
                }

                // add layers
                for (var j=0;j<group.layers.length; j++) {
                    layers.push({
                        name: group.layers[j].layername,
                        layers: []
                    });
                }
            }
        //}

        callback({
            groups: sortedGroups,
            layertree: layertree
        });

};
//Layers.loadLayers = function(url, callback) {
//  $.getJSON(url, function(data) {
//    // sort by reverse toc_sort
//    var wmslayers = data.wmslayers.sort(function(a, b) {
//      return b.toc_sort - a.toc_sort;
//    });
//
//    // group by groupname
//    groups = {};
//    for (var i=0;i<wmslayers.length; i++) {
//      var layer = wmslayers[i];
//
//      if (layer.groupname === null) {
//        // mark layers without group
//        layer.groupname = Layers.markerPrefix + layer.layername;
//      }
//      if (groups[layer.groupname] === undefined) {
//        groups[layer.groupname] = [];
//      }
//      groups[layer.groupname].push(layer);
//    }
//
//    var sortedGroups = [];
//    for (var key in groups) {
//      if (groups.hasOwnProperty(key)) {
//        sortedGroups.push({
//          title: key,
//          layers: groups[key]
//        });
//      }
//    }
//
//    // generate layertree if not in JSON
//    var layertree = data.layertree;
//    if (layertree === undefined) {
//      layertree = [];
//
//      var markerPrefix = new RegExp(Layers.markerPrefix);
//
//      for (var i=0;i<sortedGroups.length; i++) {
//        var group = sortedGroups[i];
//
//        var layers = null;
//        if (group.title.match(markerPrefix)) {
//          // layer without group
//          layers = layertree;
//        }
//        else {
//          // add group
//          var subtree = {
//            name: group.title,
//            layers: []
//          };
//          layertree.push(subtree);
//
//          layers = subtree.layers;
//        }
//
//        // add layers
//        for (var j=0;j<group.layers.length; j++) {
//          layers.push({
//            name: group.layers[j].layername,
//            layers: []
//          });
//        }
//      }
//    }
//
//    callback({
//      groups: sortedGroups,
//      layertree: layertree
//    });
//  });
//};
