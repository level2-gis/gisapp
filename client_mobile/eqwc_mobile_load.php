<?php

require_once("../admin/class.Helpers.php");
require_once("../admin/settings.php");

session_start();

$version = \GisApp\Helpers::getEqwcVersion();
$lang = [];
$eqwc_debug = [
    "client_mobile/src/url_params.js?v=".$version,
    "client_mobile/src/permalink.js?v=".$version,
    "client_mobile/src/login.js?v=".$version,
    "client_mobile/src/search.js?v=".$version,
    "client_mobile/src/geocode.js?v=".$version,
    //NOTE: remove unused classes
    //"client_mobile/src/mapfish_permalink.js"
    "client_mobile/src/qgis_permalink.js?v=".$version,
    //"client_mobile/src/mapfish_login.js"
    //"client_mobile/src/mapfish_search.js"
    //"client_mobile/src/swiss_search.js"
    //"client_mobile/src/wsgi_search.js"
    "client_mobile/src/config.js?v=".$version,
    "client_mobile/src/map.js?v=".$version,
    "client_mobile/src/map_click_handler.js?v=".$version,
    "client_mobile/src/feature_info.js?v=".$version,
    "client_mobile/src/topics.js?v=".$version,
    "client_mobile/src/layers.js?v=".$version,
    "client_mobile/src/gui.js?v=".$version
    //"client_mobile/src/high_resolution_printing.js"
    ];

$def_lang = $_SESSION['lang'];

//eqwc language files
array_push($lang, "admin/languages/". $def_lang .".js");

Header("content-type: application/x-javascript");
?>

(function () {

    var jsFiles = [
        "<?php echo implode('","',$lang) ?>",
        "<?php echo implode('","',$eqwc_debug) ?>"
    ];

    // use "parser-inserted scripts" for guaranteed execution order
    var scriptTags = new Array(jsFiles.length);
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        scriptTags[i] = "<script src='" + jsFiles[i] + "'></script>";
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
})();



