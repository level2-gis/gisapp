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
require_once("settings.php");

/**
 * @param $layername
 * @param $map
 * @param $query_arr
 * @param $format
 * @return array
 * @throws Exception
 */
function prepareFile($layername, $map, $query_arr, $format)
{
    $now = date("Ymd_His");
    $layerAlias = Helpers::normalize($layername);
    $fileName = TEMP_PATH . $layerAlias . '_' . $now;
    $fileExt = "zip";

    $makeZip = true;
    //$fsize = -1;

    // Get project
    $project = Helpers::getQgsProject(PROJECT_PATH . $map . '.qgs');
    if (!($project["status"])) {
        throw new Exception ($project["message"]);
    }

    // Get layer
    $layer = Helpers::getLayer($layername, $project["message"]);
    if (!($layer["status"])) {
        throw new Exception ($layer["message"]);
    }

    // Get layer info
    $lay_info = Helpers::getLayerInfo($layer["message"]);
    if (!($lay_info["status"])) {
        throw new Exception ($lay_info["message"]);
    }

    //other option to get it from layer_info
    $conn = str_replace(array('\'', '"'), '', $layer["message"]->datasource);
    //removing text sslmode and all after that
    $conn = "PG:" . rtrim(substr($conn, 0, strpos($conn, 'sslmode')));

    $table = $lay_info["message"]['table'];
    $geom = $lay_info["message"]['geom_column'];
    $source_srid = (string)$layer["message"]->srs->spatialrefsys->srid;
    $extent = explode(",", $query_arr['map0_extent']);
    $xmin = $extent[0];
    $ymin = $extent[1];
    $xmax = $extent[2];
    $ymax = $extent[3];
    $srid = substr(strrchr($query_arr['SRS'], ':'), 1);
    $options = "";

    switch ($format) {
        case 'SHP':
            $format_name = 'ESRI Shapefile';
            $options = "-lco ENCODING=UTF-8";
            break;
        case 'DXF':
            $format_name = $format;
            //$options = '-select field_list=""';
            break;
        case 'CSV':
            $format_name = $format;
            $options = "-lco SEPARATOR=SEMICOLON";
            $makeZip = false;
            $fileExt = 'csv';
            break;
        default:
            throw new Exception('Format not supported');
    }

    //putenv('CPL_LOG_ERRORS=ON');
    //putenv('CPL_LOG=/var/tmp/ogr_errors.log');

    //I removed _a_srs parameter, something not right in QGIS ' -a_srs EPSG:'.$srid.
    $mycmd = OGR2OGR . ' -f "' . $format_name . '" "' . $fileName . '.' . strtolower($format) . '" ' . $options . ' "' . $conn . '" -sql "SELECT * FROM ' . $table . ' WHERE ' . $geom . ' && ST_Transform(ST_MakeEnvelope(' . $xmin . ', ' . $ymin . ', ' . $xmax . ', ' . $ymax . ', ' . $srid . '),' . $source_srid . ')" -progress';

    //$mycmd = OGR2OGR . ' -s_srs EPSG:3857 -t_srs EPSG:2170 -f "'.$format_name.'" "'.$fileName .'.'.strtolower($format).'" ' . $options . ' "'.$conn.'" -sql "SELECT * FROM '.$table.' WHERE '.$geom.' && ST_MakeEnvelope(' .$xmin .', ' .$ymin .', ' .$xmax .', ' .$ymax .', ' .$srid .')" -progress';


    $output = shell_exec($mycmd);

    $fullFileNameZip = $fileName . "." . $fileExt;

    if ($makeZip) {

        $zip = new ZipArchive();

        if ($zip->open($fullFileNameZip, ZipArchive::CREATE) !== TRUE) {
            throw new Exception("Cannot write " . $fullFileNameZip);
        }

        //$zip->addFile("./" .$filename ,$now ."/" .$filename);

        $zip->addFile($fileName . '.' . strtolower($format), basename($fileName . '.' . strtolower($format)));
        if ($format == 'SHP') {
            $zip->addFile($fileName . '.shx', basename($fileName . '.shx'));
            $zip->addFile($fileName . '.dbf', basename($fileName . '.dbf'));
            $zip->addFile($fileName . '.prj', basename($fileName . '.prj'));
            $zip->addFile($fileName . '.cpg', basename($fileName . '.cpg'));
        }
        $zip->close();

        //removing shp
        if ($format == 'SHP') {
            unlink($fileName . '.dbf');
            unlink($fileName . '.shx');
            //unlink($fileName.'.prj');
            unlink($fileName . '.cpg');
        }
        if (file_exists($fileName . '.' . strtolower($format))) {
            unlink($fileName . '.' . strtolower($format));
        }

        //$fsize = filesize('./' .$filename_zip);
        //$fsize = filesize($fullFileNameZip);
    } else {
        //for formats that are not zipped (CSV...)
        //$fsize = filesize($fileName . '.' . strtolower($format));
    }

    return base64_encode($fullFileNameZip);
}

/**
 * @param $ctype
 * @param $key
 */
function sendFile($ctype, $key)
{
    $fullFileNameZip = base64_decode($key);
    $fileNameZip = basename($fullFileNameZip);
    $fsize = filesize($fullFileNameZip);

    header("Pragma: public"); // required
    header("Expires: 0");
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    header("Cache-Control: private", false); // required for certain browsers
    header("Content-Type: " . $ctype);
    header("Content-Disposition: attachment; filename=\"" . $fileNameZip . "\";");
    header("Content-Transfer-Encoding: binary");
    header("Content-Length: " . $fsize);
    ob_clean();
    flush();

    readfile($fullFileNameZip);

    if (file_exists($fullFileNameZip)) {
        unlink($fullFileNameZip);
    }
}

try {
    //check parameters
    $query_arr = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
    $check = Helpers::validateExportParams($query_arr);
    if ($check != 'OK') {
        throw new Exception($check);
    }

    $layername = $query_arr["layer"];
    $map = $query_arr["map"];
    $format = $query_arr["format"];
    $cmd = $query_arr["cmd"];
    $ctype = "application/zip";

    if ($format == 'CSV') {
        $ctype = "text/csv";
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
    if (!(Helpers::isValidUserProj($map))) {
        throw new Exception("Session time out or unathorized access!");
    }

    //check command
    if ($cmd == 'prepare') {
        echo json_encode(["success" => true, "message" => prepareFile($layername, $map, $query_arr, $format)]);
    } elseif ($cmd == 'get') {
        $key = $query_arr["key"];
        sendFile($ctype, $key);
    }

} catch (Exception $e) {
    //header('Server Error', true, 500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
    exit();
}

