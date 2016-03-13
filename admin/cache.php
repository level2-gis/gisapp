<?php

/**
 * cache.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

require '../vendor/autoload.php';
require_once("settings.php");

//TODO custom settings
//$config = array(
//    //"htaccess" => false,
//    //"path" => "/var/tmp", // default path for files
//    //"securityKey" => "", // default will good. It will create a path by PATH/securityKey
//    "fallback"  => "files"
//);
//$cache = phpFastCache("files", $config);
$cache = phpFastCache("files");

$script = filter_input(INPUT_SERVER, "SCRIPT_NAME", FILTER_SANITIZE_STRING);
$clear = filter_input(INPUT_GET, "clear", FILTER_SANITIZE_STRING);
$get = filter_input(INPUT_GET, "get", FILTER_SANITIZE_STRING);

//$test = $cache->fallback;

if ($clear != null) {
    if ($clear == 'all') {
        $cache->clean();
    } else {
        $cache->delete($clear);
    }
    header("Location:" . $script);
} else {
    echo '<a href="' . $script . '?clear=all">Clear all cache</a>';
}

// Stats
echo "<pre>";
$stats = $cache->stats();
$path = $cache->getPath();


print("Cache size in bytes: " . $stats["size"]); //size of cached objects in bytes
print("\nPath to store files: " . $path);
print("\nCache content (key, size, write time):");

foreach ($stats["data"] as $key => $el) {
    $cmd_clear = '<a href="' . $script . '?clear=' . $key . '">clear </a>';
    $cmd_get = "view ";
    if (strpos($key,"_XML_")>-1) {
        $cmd_get = '<a href="' . $script . '?get=' . $key . '">view </a>';
    }
    print('</br>' . $cmd_clear . $cmd_get . '<b>' . $key . '</b>,' . $el['size'] . ',' . date('c', $el['write_time']));
}

//TODO bug, doesn't work on files
//print_r($cache->systemInfo());



if($get != null) {
    echo '</br></br>' . '<b>Contents: '.$get.'</b></br>';
    echo htmlentities($cache->get($get),ENT_COMPAT,"UTF-8");
}

echo "</pre>";