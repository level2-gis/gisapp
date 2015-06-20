<?php
/**
    QGIS-WEB-CLIENT - PHP HELPERS

    Get search geometry

    @copyright: 2013-2014 by Alessandro Pasotti -
        ItOpen (http://www.itopen.it) <apasotti@gmail.com>
    @license: GNU AGPL, see COPYING for details.
*/


require_once(dirname(__FILE__). '/config.php');
require_once('../../admin/settings.php');
require_once(dirname(__FILE__). '/helpers.php');


// Params
if(isset($_REQUEST['map'])) {
    $map = $_REQUEST['map'];
}
else {
die('No map');
}

$layername = trim(@$_REQUEST['searchtable']);
$result = "nogeom";

if(isset($_REQUEST['srs'])) {
    $srs = $_REQUEST['srs'];
}
else {
    $srs = null;
}

if ($layername != "null") {
    if(array_key_exists($layername, $searchlayers_config)){
       $layer_config =  $searchlayers_config[$layername];
    } else {
        err500('layer not found or not searchable');
    }


    $searchtext = trim(@$_REQUEST['searchtext']);

    // Get project
    $project = get_project(PROJECT_PATH . $map . '.qgs');



    // Sanitize
    $searchtext = preg_replace('/[^A-z0-9_-]\s/', '', $searchtext);

    // Get layer
    $layer = get_layer($layername, $project);

    $ds_params = get_layer_info($layer, $project);

    $transform = $ds_params['geom_column'];

    if(!empty($srs)) {
        $srs = $_REQUEST['srs'];
        $transform="ST_TRANSFORM($transform,$srs)";
    }


    //TODO TO iskanje ni OK, tu bi moralo povezati na ID


    $sql = "SELECT ST_AsText($transform) AS geom FROM " . $ds_params['table'] . " WHERE ${layer_config['search_column']} = ?";
    $dbh = get_connection($layer, $project, $map);
    $stmt = $dbh->prepare($sql);
    $stmt->bindValue(1, $searchtext, PDO::PARAM_STR);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_NUM);
    if(count($row)){
        $result = $row[0];
    }
}
header('Content-type: application/json');
header('Content-length: ' . strlen($result));
echo $result;
?>
