<?php

$plugins = [];
$dir = dirname(dirname(__FILE__)) . "/plugins/";
$scan = array_slice(scandir($dir), 2);

//add into array all js files in plugins/xxx/js subfolder
foreach ($scan as $item) {
    if (is_dir($dir . $item)) {
        $plugin_path = $dir . $item;
        $js_arr = array_slice(scandir($plugin_path . '/js/'), 2);
        foreach ($js_arr  as $script) {
            array_push($plugins, "plugins/" . basename($plugin_path) . "/js/" . $script);
        }
    }
}

Header("content-type: application/x-javascript");
?>

(function () {

    var jsFiles = [
        "client/site/js/Translations.js",
        "client/site/js/PagingStore.js",
        "client/site/js/LoadAppProjectData.js",
        "client/site/js/Customizations.js",
        "client/site/js/GetUrlParams.js",
        "client/site/js/TriStateTree.js",
        "client/site/js/GUI.js",
        "client/site/js/QGISExtensions.js",
        "client/site/js/GeocodingSearchCombo.js",
        "client/site/js/FeatureInfoDisplay.js",
        "client/site/js/LegendAndMetadataDisplay.js",
        "client/site/js/LayerActions.js",
        "<?php echo implode('","',$plugins) ?>",
        "client/site/js/WebgisInit.js"
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



