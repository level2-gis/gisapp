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

    //srid user wants data in
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

    //get layer filter
    $lay_filt = $lay_info["message"]['sql'];

    $lay_srid = substr(strrchr($lay_info["message"]['crs'], ':'), 1);
    $type = $lay_info["message"]['type'];

    // Get PG connection
    $lay_dsn = Helpers::getPGConnection($lay_info["message"]);
    if (!($lay_dsn["status"])) {
        throw new Exception ($lay_dsn["message"]);
    }

    $result = [];

    //bounding box
    $box = '';
    if ($query['layer_extent']!='') {
        $extent = explode(",", $query['layer_extent']);
        $xmin = $extent[0];
        $ymin = $extent[1];
        $xmax = $extent[2];
        $ymax = $extent[3];
        $box = 'geom && ST_MakeEnvelope('. $xmin . ',' . $ymin . ',' . $xmax . ',' . $ymax . ',' . $lay_srid . ')';
    }

    if(strpos($type,'Point')>-1) {
        $name = isset($fields[0]) ? $fields[0] : 'id';
        $code = isset($fields[1]) ? $fields[1] : null;

        $z_field = $query['z'];
        $z_sql = $z_field;
        if ($z_field == 'use_geom') {
            $z_sql = "st_z((st_dump(geom)).geom)";
        }

        if ($srid == $lay_srid) {
            $sql = "SELECT *," . $z_sql . "::numeric(8,3) AS z, st_y((st_dump(geom)).geom)::numeric(15,3) AS y, st_x((st_dump(geom)).geom)::numeric(15,3) AS x ";
        } else {
            $sql = "SELECT *," . $z_sql . "::numeric(8,3) AS z, st_y((st_dump(st_transform(st_setsrid(geom," . $lay_srid . ")," . $srid . "))).geom)::numeric(15,3) AS y, st_x((st_dump(st_transform(st_setsrid(geom," . $lay_srid . ")," . $srid . "))).geom)::numeric(15,3) AS x ";
        }
        $sql .= "FROM " . $lay_info['message']['table'];
        if(!empty($box)) {
            $sql .= " WHERE " . $box;
            if($lay_filt>'') {
                $sql.=" AND ".$lay_filt;
            }
        } else {
            if($lay_filt>'') {
                $sql.=" WHERE ".$lay_filt;
            }
        }
    } else if(strpos($type,'LineString')>-1) {
        $name = 'index';
        $code = isset($fields[1]) ? $fields[1] : null;

        if ($srid == $lay_srid) {
            $sql = "SELECT *,(p).path[1] as index, st_npoints(geom) AS points, st_z((p).geom)::numeric(15,3) as z, st_y((p).geom)::numeric(15,3) as y, st_x((p).geom)::numeric(15,3) as x ";
        } else {
            $sql = "SELECT *,(p).path[1] as index, st_npoints(geom) AS points, st_z((p).geom)::numeric(15,3) as z, st_y(st_transform(st_setsrid((p).geom," . $lay_srid . ")," . $srid ."))::numeric(15,3) as y, st_x(st_transform(st_setsrid((p).geom," . $lay_srid . ")," . $srid . "))::numeric(15,3) as x ";
        }
        $sql.= "FROM " . $lay_info['message']['table'] . " l, (SELECT id, st_dumppoints((st_dump(geom)).geom) AS p FROM " . $lay_info['message']['table'] . ") v ";
        $sql.= "WHERE l.id = v.id";
        if(!empty($box)) {
            $sql .= " AND " . $box;
        }
        if($lay_filt>'') {
            $sql.=" AND ".$lay_filt;
        }
        $sql.= " ORDER by l.id,index;";

    }  else if(strpos($type,'Polygon')>-1) {
        $name = 'index';
        $code = isset($fields[1]) ? $fields[1] : null;

        if ($srid == $lay_srid) {
            $sql = "SELECT *,(p).path[2] as index, st_npoints(geom) AS points, st_z((p).geom)::numeric(15,3) as z, st_y((p).geom)::numeric(15,3) as y, st_x((p).geom)::numeric(15,3) as x ";
        } else {
            $sql = "SELECT *,(p).path[2] as index, st_npoints(geom) AS points, st_z((p).geom)::numeric(15,3) as z, st_y(st_transform(st_setsrid((p).geom," . $lay_srid . ")," . $srid ."))::numeric(15,3) as y, st_x(st_transform(st_setsrid((p).geom," . $lay_srid . ")," . $srid . "))::numeric(15,3) as x ";
        }
        $sql.= "FROM " . $lay_info['message']['table'] . " l, (SELECT id, st_dumppoints((st_dump(geom)).geom) AS p FROM " . $lay_info['message']['table'] . ") v ";
        $sql.= "WHERE l.id = v.id";
        if(!empty($box)) {
            $sql .= " AND " . $box;
        }
        if($lay_filt>'') {
            $sql.=" AND ".$lay_filt;
        }
        $sql.= " ORDER by l.id,index;";
    } else {
        throw new Exception ('Type not supported: '.$type);
    }

    foreach ($lay_dsn['message']->query($sql) as $row) {

        if((strpos($type,'LineString')>-1) && ($row['index'] == 1)) {
            array_push($result, ' 09 91');
        }
        if((strpos($type,'Polygon')>-1) && ($row['index'] == 1)) {
            array_push($result, ' 09 91');
        }

        $specific = ' 05 ';
        $specific.= str_pad(substr($row[$name],0,11),11);
        if(empty($code)) {
            $specific .= str_pad(' ', 9);
        } else {
            $specific .= str_pad(substr($row[$code],0,9), 9);
        }
        $specific.= str_pad($row['y'],12,' ',STR_PAD_LEFT);
        $specific.= str_pad($row['x'],12,' ',STR_PAD_LEFT);
        $specific.= str_pad($row['z'],9,' ',STR_PAD_LEFT);

        array_push($result, $specific);

        if((strpos($type,'LineString')>-1) && ($row['index'] == $row['points'])) {
            array_push($result, ' 09 99');
        }
        if((strpos($type,'Polygon')>-1) && ($row['index'] == $row['points'])) {
            array_push($result, ' 09 96');
        }
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