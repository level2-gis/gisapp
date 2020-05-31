<?php

require_once("../admin/class.Helpers.php");
require_once("../admin/settings.php");

session_start();

$version = \GisApp\Helpers::getEqwcVersion();
$lang = [];
$plugins = [];

$crs_list =  \GisApp\Helpers::getCrsListFromSession();
$crs_project = \GisApp\Helpers::getProjectCrsFromSession();
$plugin_list = \GisApp\Helpers::getPluginsFromSession();
$crs_files = [];

foreach ($crs_list as $crs) {
    if ($crs != $crs_project && $crs != "EPSG:4326") {
        array_push($crs_files, "client/site/libs/proj4js/defs/" . str_replace(":","",$crs)  . ".js");
    }
}

$eqwc_debug = [
    "client_common/eqwc_common.js?v=".$version,
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
    "client_mobile/src/wsgi_search.js?v=".$version,
    "client_mobile/src/config.js?v=".$version,
    "client_mobile/src/map.js?v=".$version,
    "client_mobile/src/map_click_handler.js?v=".$version,
    "client_mobile/src/feature_info.js?v=".$version,
    "client_mobile/src/topics.js?v=".$version,
    "client_mobile/src/layers.js?v=".$version,
    "client_mobile/src/gui.js?v=".$version
    //"client_mobile/src/high_resolution_printing.js"
    ];
$eqwc_mini = "client_mobile/eqwc_mobile.js?v=".$version;
$dir = dirname(dirname(__FILE__)) . "/plugins/";
$scan = array_slice(scandir($dir), 2);
$def_lang = $_SESSION['lang'];

$debug = defined('DEBUG') ? DEBUG : false;

//eqwc language files
array_push($lang, "admin/languages/". $def_lang .".js?v=".rand());

//add into array all js files in plugins/xxx/js_mobile subfolder
if (!(empty($plugin_list))) {
    foreach ($plugin_list as $item) {
        if (is_dir($dir . $item) && \GisApp\Helpers::hasPluginAccess($item)) {
            $plugin_path = $dir . $item;

            //plugin language file
            $lang_fn = $dir . basename($plugin_path) . "/lang_mobile/" . $def_lang . ".js";
            if (file_exists($lang_fn)) {
                array_push($plugins, "plugins/" . basename($plugin_path) . "/lang_mobile/" . $def_lang . ".js?v=" . rand());
            } else {
                $lang_en = $dir . basename($plugin_path) . "/lang_mobile/en.js";
                if(file_exists($lang_en)) {
                    array_push($plugins, "plugins/" . basename($plugin_path) . "/lang_mobile/en.js?v=" . rand());
                }
            }

            //add plugin config.js if exists
            if (file_exists($plugin_path . "/js/config.js")) {
                array_push($plugins, "plugins/" . basename($plugin_path) . "/js/config.js?v=" . rand());
            }

            if (is_dir($plugin_path . '/js_mobile/')) {
                $js_arr = array_slice(scandir($plugin_path . '/js_mobile/'), 2);
                foreach ($js_arr as $script) {
                    //only js files
                    if (substr($script, -2) == 'js') {
                        array_push($plugins, "plugins/" . basename($plugin_path) . "/js_mobile/" . $script . "?v=" . rand());
                    }
                }
            }
        }
    }
}

Header("content-type: application/x-javascript");
?>

function getRandomNum() {
    return Math.floor((Math.random() * 100000) + 1);
}

(function () {

    var version = "<?php echo $version ?>";
    var jsFiles = [
        "<?php echo implode('","',$crs_files) ?>",
        "client_common/customProjections.js?n="+getRandomNum(),
        "client_common/settings.js?n="+getRandomNum(),
        "<?php echo implode('","',$lang) ?>",
        "<?php echo $debug ? implode('","',$eqwc_debug) : $eqwc_mini ?>",
        "<?php echo implode('","',$plugins) ?>"
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



