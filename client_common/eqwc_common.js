/**
 * EQWC Common functions to use in both clients
 *
 */

Eqwc.common = {};

Eqwc.common.createHyperlink = function(att, val, pattern) {
    if (val == null) {
        val = att;
    }

    // add hyperlinks for URLs in attribute values
    if (att != '' && /^((http|https|ftp):\/\/).+\..+/i.test(att)) {
        if (!/\<a./i.test(att)) {
            //do not reformat already formated tags
            att = "<a class=\"link\" href=\"" + att + "\" target=\"_blank\">" + val + "</a>";
        }
    }
    // add hyperlinks for URLs containing mediaurl pattern
    if (pattern > '') {
        var mediapattern = new RegExp(pattern, 'i');
        if (mediapattern.test(att)) {
            att = "<a href=\"/" + att + "\" target=\"_blank\">" + val + "</a>";
        }
    }

    return att;
};

Eqwc.common.manageFile = function(fn, handleImages) {

    //check if image
    var img = false;
    if (handleImages) {
        var ext = (fn.split('.')[1]).toLowerCase();
        if (ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'png') {
            img = true;
        }
    }

    //does not work on IE
    //var url = new URL(projectData.uploadDir, window.location.origin).href;
    var url = window.location.origin;
    if (projectData.uploadDir.split('.').length==1) {
        url += projectData.uploadDir;
    } else {
        url += projectData.uploadDir.split('.')[1];
    }

    if (img) {
        return "<a target='_blank' href='"+url+fn+"'><img src='"+url+"thumb/"+fn+"'></a>";
    } else {
        return Eqwc.common.createHyperlink(url+fn, fn, null);
    }
};

Eqwc.common.getRasterFieldName = function(layer, name) {
    if (!(Eqwc.settings.overWriteRasterFieldName && Eqwc.settings.overWriteRasterFieldName[layer])) {
        return name;
    }
    if (Eqwc.settings.overWriteRasterFieldName[layer][0] == name) {
        return Eqwc.settings.overWriteRasterFieldName[layer][1];
    } else {
        return name;
    }
};

//TODO does not work in mobile (wmsLoader)
//need attributes info in mobile part
Eqwc.common.layerFieldNameExists = function (layerId, field) {
    var layer = wmsLoader.layerProperties[layerId];
    for (var i = 0; i < layer.attributes.length; i++) {
        if (layer.attributes[i].name == field) {
            return true;
        }
    }
    return false;
};

Eqwc.common.lookup = function(array, prop, value) {
    for (var i = 0, len = array.length; i < len; i++)
        if (array[i] && array[i][prop] === value) return array[i];
};

Eqwc.common.getIdentifyLayerName = function(layerId) {

    var layer = projectData.layers[layerId];

    if(typeof(layer) == "undefined") {
        return layerId;
    }

    if(layer.identifyname) {
        return layer.identifyname;
    }

    var ret = layer.layername;

    if (Eqwc.settings.replaceIdentifyLayerWithView) {
        if (Eqwc.settings.replaceIdentifyLayerWithView.indexOf(ret) > -1) {
            if(Eqwc.common.getLayerId(ret + "_view")) {
                ret += "_view";
            }
        }
    }

    projectData.layers[layerId].identifyname = ret;
    return ret;
};

Eqwc.common.getIdentifyLayerNameRevert = function(name) {

    var newName = name;
    if (newName.indexOf("_view")>-1) {
        newName = name.split("_view")[0];
        if (Eqwc.settings.replaceIdentifyLayerWithView) {
            if (Eqwc.settings.replaceIdentifyLayerWithView.indexOf(newName) > -1) {
                return newName;
            }
        }
    }
    return name;
};

Eqwc.common.getHiddenLayersFromSettings = function() {

    var ret = [Eqwc.settings.QgisUsersPrintName];
    var arr = Eqwc.settings.replaceIdentifyLayerWithView;
    if(arr) {
        for (var i = 0; i < arr.length; i++) {
            var id = Eqwc.common.getLayerId(arr[i]);
            if(id) {
                var n = Eqwc.common.getIdentifyLayerName(id);
                if(arr[i] != n) {
                    ret.push(n);
                }
            }
        }
    }
    return ret;
};

Eqwc.common.getProjectUrl = function() {
  return projectData.gis_projects.path + projectData.project;
};

Eqwc.common.getLayerId = function (name) {
    for (var lay in projectData.layers) {
        if (projectData.layers[lay].layername === name)
            return projectData.layers[lay].id; // Return as soon as the object is found
    }
    return false; // The object was not found
};

Eqwc.common.parseInputTextToCoord = function(input) {

    var coord = [];
    var arr = [];

    //check for separator
    if(input.indexOf(',')>-1) {
        arr = input.split(',');
    } else if (input.indexOf(';')>-1) {
        arr = input.split(';');
    } else if (input.indexOf(' ')>-1) {
        arr = input.split(' ');
    }

    if(arr.length == 0) {
        return false;
    }

    for (var el in arr) {
        if(!isNaN(parseFloat(arr[el]))) {
            coord.push(parseFloat(arr[el]));
        }
    }

    if(coord.length == 0) {
        return false;
    }

    return coord;
};