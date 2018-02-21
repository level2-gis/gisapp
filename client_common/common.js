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
            att = "<a href=\"/" + attValue + "\" target=\"_blank\">" + att + "</a>";
        }
    }

    return att;
};

Eqwc.common.manageFile = function(fn, handleImages) {

    //check if image
    var img = false;
    if (handleImages) {
        ext = fn.split('.')[1];
        if (ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'png') {
            img = true;
        }
    }

    var url = new URL(projectData.uploadDir, window.location.origin).href;

    if (img) {
        return "<a target='_blank' href='"+url+fn+"'><img src='"+url+"/thumb/"+fn+"'></a>";
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

