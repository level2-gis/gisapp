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
        return Eqwc.common.createHyperlink(url+fn, fn);
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

//TODO does not work in mobile (wmlsLoader)
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

