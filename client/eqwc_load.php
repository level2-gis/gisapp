<?php

require_once("../admin/class.Helpers.php");
require_once("../admin/settings.php");

session_start();

$version = \GisApp\Helpers::getEqwcVersion();
$lang = [];
$plugins = [];

$crs_list =  \GisApp\Helpers::getCrsListFromSession();
$crs_project = \GisApp\Helpers::getProjectCrsFromSession();
$crs_files = [];

foreach ($crs_list as $crs) {
    if ($crs != $crs_project && $crs != "EPSG:4326") {
        array_push($crs_files, "client/site/libs/proj4js/defs/" . str_replace(":","",$crs)  . ".js");
    }
}

$eqwc_debug = [
    "client_common/eqwc_common.js?v=".$version,
    "client/site/js/PagingStore.js?v=".$version,
    "client/site/js/LoadAppProjectData.js?v=".$version,
    "client/site/js/Customizations.js?v=".$version,
    "client/site/js/GetUrlParams.js?v=".$version,
    "client/site/js/TriStateTree.js?v=".$version,
    "client/site/js/GUI.js?v=".$version,
    "client/site/js/QGISExtensions.js?v=".$version,
    "client/site/js/GeocodingSearchCombo.js?v=".$version,
    "client/site/js/FeatureInfoDisplay.js?v=".$version,
    "client/site/js/LegendAndMetadataDisplay.js?v=".$version,
    "client/site/js/LayerActions.js?v=".$version,
    "client/site/js/WebgisInit_functions.js?v=".$version];
$eqwc_mini = "client/eqwc.js?v=".$version;
$dir = dirname(dirname(__FILE__)) . "/plugins/";
$scan = array_slice(scandir($dir), 2);
$def_lang = $_SESSION['lang'];

$debug = defined('DEBUG') ? DEBUG : false;

//eqwc language files
array_push($lang, "admin/languages/locale/ext-lang-". $def_lang .".js?v=".rand());
array_push($lang, "admin/languages/". $def_lang .".js?v=".rand());
array_push($lang, "client/site/js/lang/Translations_". $def_lang .".js?v=".rand());

//add into array all js files in plugins/xxx/js subfolder
foreach ($scan as $item) {
    if (is_dir($dir . $item)) {
        $plugin_path = $dir . $item;

        //plugin language file
        $lang_fn = $dir . basename($plugin_path) . "/lang/" . $def_lang . ".js";
        if (!file_exists($lang_fn)) {
           $def_lang = 'en';
        }
        if (file_exists($lang_fn)) {
            array_push($plugins, "plugins/" . basename($plugin_path) . "/lang/" . $def_lang . ".js?v=".rand());
        }
        $js_arr = array_slice(scandir($plugin_path . '/js/'), 2);
        foreach ($js_arr  as $script) {
            //only js files
            if (substr($script,-2) == 'js') {
                if ($script == 'config.js') {
                    $script .= '?v='.rand();
                }
                array_push($plugins, "plugins/" . basename($plugin_path) . "/js/" . $script);
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
        "<?php echo implode('","',$plugins) ?>",
        "client/site/js/WebgisInit.js?v="+version
    ];

    // use "parser-inserted scripts" for guaranteed execution order
    var scriptTags = new Array(jsFiles.length);
    for (var i = 0, len = jsFiles.length; i < len; i++) {
        if (jsFiles[i].length>0) {
            scriptTags[i] = "<script src='" + jsFiles[i] + "'></script>";
        }
    }
    if (scriptTags.length > 0) {
        document.write(scriptTags.join(""));
    }
})();



