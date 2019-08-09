<?php

/**
 * export.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 *
 * Initial idea taken from export.php from QGIS WEB CLIENT
 *
 * More information at https://github.com/uprel/gisapp
 */

use GisApp\Helpers;

require_once("class.Helpers.php");
require_once("class.Login.php");
require_once("settings.php");

function sendText($type, $layer_name, $project_path, $query, $format)
{
    $now = date("Ymd_His");
    $layerAlias = Helpers::normalize($layer_name);
    $fileName = $layerAlias . '_' . $now.'.'.$format;

    $cmd = $query['cmd'];

    //field set
    if ($query['fields']!='') {
        $fields = explode(',', $query['fields']);
    }

    $srid = substr(strrchr($query['SRS'], ':'), 1);

    // Get project
    $project = Helpers::getQgsProject($project_path . '.qgs');
    if (!($project["status"])) {
        throw new Exception ($project["message"]);
    }

    // Get layer
    $layer = Helpers::getLayer($layer_name, $project["message"]);
    if (!($layer["status"])) {
        throw new Exception ($layer["message"]);
    }

    // Get layer info
    $lay_info = Helpers::getLayerInfo($layer["message"]);
    if (!($lay_info["status"])) {
        throw new Exception ($lay_info["message"]);
    }

    // Get PG connection
    $lay_dsn = Helpers::getPGConnection($lay_info["message"]);
    if (!($lay_dsn["status"])) {
        throw new Exception ($lay_dsn["message"]);
    }

    $z_field = $query['z'];
    $z_sql = $z_field;
    if($z_field=='use_geom') {
        $z_sql = "st_z((st_dump(geom)).geom)";
    }

    $sql = "SELECT *,".$z_sql."::numeric(8,3) AS z,st_y((st_dump(st_transform(geom,".$srid."))).geom)::numeric(15,3) AS y, st_x((st_dump(st_transform(geom,".$srid."))).geom)::numeric(15,3) AS x ";
    $sql.= "FROM ".$lay_info['message']['table'];

    $result = [];

    foreach ($lay_dsn['message']->query($sql) as $row) {
        $specific = ' 05 ';
        $specific.= str_pad($row[$fields[0]],11);
        if(empty($fields[1])) {
            $specific .= str_pad(' ', 9);
        } else {
            $specific .= str_pad($row[$fields[1]], 9);
        }
        $specific.= str_pad($row['y'],12,' ',STR_PAD_LEFT);
        $specific.= str_pad($row['x'],12,' ',STR_PAD_LEFT);
        $specific.= str_pad($row['z'],9,' ',STR_PAD_LEFT);

        array_push($result, $specific);
    }

    if($cmd=='prepare') {
        $data = json_encode(["success" => true, "message" => 'OK']);
    } else {
        $data = implode("\n", $result);
    }

    $fsize = strlen($data);

    header("Pragma: public"); // required
    header("Expires: 0");
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    header("Cache-Control: private", false); // required for certain browsers
    header("Content-Type: " . $type);
    header("Content-Disposition: attachment; filename=\"" . $fileName . "\";");
    header("Content-Transfer-Encoding: binary");
    header("Content-Length: " . $fsize);

    ob_start();

    echo $data;

    ob_end_flush();
}


try {
    //check parameters
    $query_arr = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);

    $layername = $query_arr["layer"];
    $map = $query_arr["map"];
    $format = $query_arr["format"];

    $ctype = "application/zip";

    //TODO FIX this
    if ($format == 'CSV') {
        $ctype = "text/csv";
    }

    if ($format == 'KOF') {
        $ctype = "text/csv";
    }


    if ($format == 'TSV') {
        $ctype = "text/tab-separated-values";
    }

    if ($format == 'XLSX') {
        $ctype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    //check if user is guest
    session_start();
    $user = null;
    if (isset($_SESSION["user_name"])) {
        $user = $_SESSION["user_name"];
    }
    if ($user != null && $user == 'guest') {
        throw new Exception("Guest users are not allowed to export data!");
    }

    //check user session and permissions
    $login_check =new GisApp\Login();
    if (!($login_check->isValidUserProj($map))) {
        throw new Exception("Session time out or unathorized access!");
    }

    //get project path from session
    $projectPath = $_SESSION["project_path"];

    sendText($ctype, $layername, $projectPath, $query_arr, $format);

} catch (Exception $e) {
    //header('Server Error', true, 500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
    exit();
}