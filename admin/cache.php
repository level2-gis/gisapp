<?php

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

$script = filter_input(INPUT_SERVER,"SCRIPT_NAME",FILTER_SANITIZE_STRING);
$clear = filter_input(INPUT_GET,"CLEAR",FILTER_SANITIZE_STRING);

//$test = $cache->fallback;

if ($clear != null) {
    if ($clear == 'all') {
        $cache->clean();
    }
    else {
        $cache->delete($clear);
    }
    header("Location:" . $script);
} else {
    echo '<a href="' . $script . '?clear=all">Clear all cache</a>';
}

//TODO
//if (isset($_GET["view"])) {
//    $view = $_GET["view"];
//}

// Stats
echo "<pre>";
$stats = $cache->stats();
$path = $cache->getPath();

print("Cache size in bytes: ".$stats["size"]); //size of cached objects in bytes
print("\nPath to store files: ".$path);
print("\nCache content (key, size, write time):");

foreach ($stats["data"] as $key => $el) {
    $cmd_clear = '<a href="' . $script . '?clear='.$key.'">clear </a>';
    //$cmd_view = '<a href="' . $script . '?view='.$key.'">view </a>';
    print('</br>'.$cmd_clear.'<b>'.$key.'</b>,'.$el['size'].','.date('c',$el['write_time']));
}

//TODO bug, doesn't work on files
//print_r($cache->systemInfo());

echo "</pre>";
