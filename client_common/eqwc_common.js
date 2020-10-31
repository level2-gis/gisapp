/**
 * EQWC Common functions to use in both clients
 *
 */

//Set projectData from settings if set and if project values are empty
//Way to set up things in general and still be possible to override it with project.json
if(projectData.search === null && Eqwc.settings.search) {
    projectData.search = Eqwc.settings.search;
}
//wsgi and geocode exclude each other
if(projectData.geoCode === null &&  projectData.wsgi === null && Eqwc.settings.geoCode) {
    projectData.geoCode = Eqwc.settings.geoCode;
}
if(projectData.wsgi === null && projectData.geoCode === null && Eqwc.settings.wsgi) {
    projectData.wsgi = Eqwc.settings.wsgi;
}
if(projectData.locationServices === null && Eqwc.settings.locationServices) {
    projectData.locationServices = Eqwc.settings.locationServices;
}
if(projectData.defaultCoordinatesCrsCode === null && Eqwc.settings.defaultCoordinatesCrsCode) {
    projectData.defaultCoordinatesCrsCode = Eqwc.settings.defaultCoordinatesCrsCode;
}

Eqwc.geolocationErrors = {
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3
};

Eqwc.common = {};

Eqwc.common.createHyperlink = function(att, val, pattern) {
    if(att == null || att == '') {
        return att;
    }

    if (val == null) {
        val = att;
    }

    // add hyperlinks for URLs in attribute values
    if (/^((http|https|ftp):\/\/)./i.test(att)) {
        if (!/\<a./i.test(att)) {
            //do not reformat already formated tags
            att = "<a class=\"link\" href=\"" + att + "\" target=\"_blank\">" + val + "</a>";
        }
    } else if(val.indexOf('href=')>-1 && val.indexOf(' target=')==-1) {
        //add target blank if contains href and not target
        att = val.replaceAll('<a ', '<a target="_blank"');
    } else if(val.length>10 && typeof Ext != 'undefined') {
        //create tooltip for longer texts
        att = "<div style='overflow: hidden; text-overflow: ellipsis; white-space: nowrap;' ext:qtip='" + val + "'>" + val + "</div>";
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

Eqwc.common.reverseArray = function(arr) {
    var newArray = [];
    for (var i = arr.length - 1; i >= 0; i--) {
        newArray.push(arr[i]);
    }
    return newArray;
};

Eqwc.common.redirect = function() {
    Eqwc.settings.useGisPortal ? window.location.href = Eqwc.settings.gisPortalRoot + "login?ru="+Eqwc.common.getProjectUrl() : window.location.href = "./admin/login.php?action=logout&map="+projectData.project;
};

Eqwc.common.addMapFilter = function(layer, field, value, operator) {
    var layerId = Eqwc.common.getLayerId(layer);
    if(!layerId) {
        return;
    }

    if(operator == null){
        operator = '=';
    }

    var filter = {};
    filter['FILTER'] = layerId+':"'+field+'" ' + operator + ' ' + value;

    //mobile
    if(Map.hasOwnProperty('mergeWmsParams')) {
        Map.mergeWmsParams(filter);
        $('#panelLayer').panel('close');
    }
};

Eqwc.common.clearMapFilters = function() {

    //mobile
    if(Map.hasOwnProperty('mergeWmsParams')) {
        Map.mergeWmsParams({'FILTER': ''});
        $('#panelLayer').panel('close');
    }
};

Eqwc.common.promptForMapFilterValue = function(layer,field, msg, onlyNumbers, minNumber, maxNumber) {
    var value;
    if(onlyNumbers) {
        do{
            value = prompt(msg, "");
            //cancel
            if (value == null || value == "") {
                break;
            }
        }
        while(isNaN(value) || parseInt(value) > maxNumber || parseInt(value) < minNumber);
    } else {
        value = prompt(msg, "");
    }
    if (!(value == null || value == "")) {
        Eqwc.common.addMapFilter(layer,field,value);
    }
};

Eqwc.common.compareQgisVersionWithInteger= function(num) {
    var version = Eqwc.settings.qgisVersion;
    if (isNaN(parseFloat(version))) {
        return 'error';
    }

    var major = parseInt(version) * 100;
    var minor = parseInt(version.split('.')[1]);
    if (major + minor > num) {
        return 'higher';
    } else if (major + minor == num) {
        return 'equal';
    } else if (major + minor < num) {
        return 'lower';
    }
};

Eqwc.common.findParentRelation = function(name) {
    var main,res;
    var cnt = Object.keys(projectData.relations).length;
    if(projectData.relations.hasOwnProperty("hideJoinField")) {
        cnt--;
    }
    for (var i = 0; i < cnt; i++) {
        main = Object.keys(projectData.relations)[i];
        res = projectData.relations[main].filter(function(item) {
            return item.relate_layer == name;
        })[0];
        if(res) {
            return main;
        }
    }
    return false;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};