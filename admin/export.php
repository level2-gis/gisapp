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

/**
 * @param $layername
 * @param $map
 * @param $query_arr
 * @param $destinationFormat
 * @return array
 * @throws Exception
 */
function prepareFile($layername, $map, $query_arr, $destinationFormat)
{
    $now = date("Ymd_His");
    $layerAlias = Helpers::normalize($layername);
    $fileName = TEMP_PATH . $layerAlias . '_' . $now;
    $fileExt = "zip";

    $makeZip = true;
    //$fsize = -1;

    // Get project
    $project = Helpers::getQgsProject($map . '.qgs');
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

    $sourceProvider = $lay_info["message"]['provider'];
    $sql = '';
    switch ($sourceProvider) {
        case 'ogr':
            $conn = $layer["message"]->datasource;
            $source = ' "' . $conn . '"';

            break;

        case 'postgres':
            //other option to get it from layer_info
            //$conn = str_replace(array('\'', '"'), '', $layer["message"]->datasource);
            $conn = $layer["message"]->datasource;
            //removing text sslmode and all after that
            $conn = "PG:" . rtrim(substr($conn, 0, strpos($conn, 'sslmode')));

            $table = $lay_info["message"]['table'];
            $sql = $lay_info["message"]['sql'];

            $source = ' "' . $conn . '" ' . $table;

            break;

        case 'spatialite':
            $conn = $lay_info["message"]['dbname'];
            $table = $lay_info["message"]['table'];
            $sql = $lay_info["message"]['sql'];

            $source = ' ' . $conn . ' ' . $table;

            break;

        default:
            throw new Exception ('Unknown provider: '.$sourceProvider);
    }


    $source_srid = (string)$layer["message"]->srs->spatialrefsys->srid;

    $srid = substr(strrchr($query_arr['SRS'], ':'), 1);
    $options = " ";

    //sql filter from qgis project layer properties
    if ($sql>'') {
        $options = " -where \"".$sql."\" ";
    }

    $options .= "-preserve_fid ";

    //export only selection inside bounding box if provided
    //we have to transform extent to layers CRS on client side
    //if using gdal 2.0 this will not be necessary, just use -spat_srs
    if ($query_arr['layer_extent']!='') {
        $extent = explode(",", $query_arr['layer_extent']);
        $xmin = $extent[0];
        $ymin = $extent[1];
        $xmax = $extent[2];
        $ymax = $extent[3];
        $options .= '-spat '. $xmin . ' ' . $ymin . ' ' . $xmax . ' ' . $ymax . ' ';
    }

    //field set
    if ($query_arr['fields']!='') {
        //primary key if exists must be removed form fields, otherwise we get ogr2ogr error
        $key = null;
        if ($sourceProvider=='postgres') {
            $key = str_replace("'",'',$lay_info["message"]['key']);
        }
        $fields = array_diff(explode(',',$query_arr['fields']),[$key]);
        $options .= '-select "' . implode(',',$fields) . '" ';
    }

    switch ($destinationFormat) {
        case 'SHP':
            $format_name = 'ESRI Shapefile';
            //$options .= "-lco ENCODING=UTF-8 ";
            break;
        case 'DXF':
            $format_name = $destinationFormat;
            //this should remove hatch, but there is no change
            //$options .= "-lco DXF_WRITE_HATCH=FALSE ";
            break;
        case 'CSV':
            $format_name = $destinationFormat;
            $options .= "-lco SEPARATOR=SEMICOLON ";
            $options .= "-lco GEOMETRY=AS_XYZ ";    //this will return results only for single point geometries (other option is WKT for all types)
            $makeZip = false;
            $fileExt = 'csv';
            break;
        case 'XLSX':
            $format_name = $destinationFormat;
            $makeZip = false;
            $fileExt = 'xlsx';
            break;
        case 'KML':
            $format_name = $destinationFormat;
            $makeZip = true;
            break;
        case 'GeoJSON':
            $format_name = $destinationFormat;
            $makeZip = true;
            break;
        default:
            throw new Exception('Format not supported');
    }

    //putenv('CPL_LOG_ERRORS=ON');
    //putenv('CPL_LOG=/var/tmp/ogr_errors.log');

    //$mycmd = OGR2OGR . ' -f "' . $format_name . '" "' . $fileName . '.' . strtolower($destinationFormat) . '" ' . $options . ' "' . $conn . '" -sql "SELECT * FROM ' . $table . ' WHERE ' . $geom . ' && ST_Transform(ST_MakeEnvelope(' . $xmin . ', ' . $ymin . ', ' . $xmax . ', ' . $ymax . ', ' . $srid . '),' . $source_srid . ')" -progress';
    $mycmd = OGR2OGR . ' -skipfailures -s_srs EPSG:' . $source_srid . ' -t_srs EPSG:' . $srid . $options . '-f "' . $format_name . '" "' . $fileName . '.' . strtolower($destinationFormat) . '"' .$source . ' -progress';

    chdir(dirname($map));
    $output = exec($mycmd);

    //output receives 0...10...20...30...40...50...60...70...80...90...100 - done.
    if (strpos($output,"done") === FALSE) {
        error_log("EQWC Data Export Failed: ".$mycmd);
        throw new Exception("Export failed: ".$output."</br>Details in Apache error log!");
    }

    $fullFileNameZip = $fileName . "." . $fileExt;

    if(!file_exists($fileName . '.' . strtolower($destinationFormat))) {
        error_log("EQWC Data Export Failed: ".$mycmd);
        throw new Exception("Export failed: ".$output."</br>Details in Apache error log!");
    }

    if ($makeZip) {

        $zip = new ZipArchive();

        if ($zip->open($fullFileNameZip, ZipArchive::CREATE) !== TRUE) {
            throw new Exception("Cannot write " . $fullFileNameZip);
        }

        //$zip->addFile("./" .$filename ,$now ."/" .$filename);

        $zip->addFile($fileName . '.' . strtolower($destinationFormat), basename($fileName . '.' . strtolower($destinationFormat)));
        if ($destinationFormat == 'SHP') {
            $zip->addFile($fileName . '.shx', basename($fileName . '.shx'));
            $zip->addFile($fileName . '.dbf', basename($fileName . '.dbf'));
            $zip->addFile($fileName . '.prj', basename($fileName . '.prj'));
            $zip->addFile($fileName . '.cpg', basename($fileName . '.cpg'));
        }
        $zip->close();

        delete($fileName, $destinationFormat);

        //$fsize = filesize('./' .$filename_zip);
        //$fsize = filesize($fullFileNameZip);
    } else {
        //for formats that are not zipped (CSV...)
        //$fsize = filesize($fileName . '.' . strtolower($format));
    }

    return $fullFileNameZip;
}

/**
 * @param $fileName
 * @param $format
 */
function delete($fileName, $format)
{
    //removing shp
    if ($format == 'SHP') {
        if (file_exists($fileName . '.dbf')) unlink($fileName . '.dbf');
        if (file_exists($fileName . '.shx')) unlink($fileName . '.shx');
        if (file_exists($fileName . '.prj')) unlink($fileName . '.prj');
        if (file_exists($fileName . '.cpg')) unlink($fileName . '.cpg');
    }
    if (file_exists($fileName . '.' . strtolower($format))) {
        unlink($fileName . '.' . strtolower($format));
    }
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

    //TODO FIX this
    if ($format == 'CSV') {
        $ctype = "text/csv";
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

    //check command
    if ($cmd == 'prepare') {
        $resultFile = prepareFile($layername, $projectPath, $query_arr, $format);
        echo json_encode(["success" => true, "message" => base64_encode($resultFile)]);
    } elseif ($cmd == 'get') {
        $key = $query_arr["key"];
        sendFile($ctype, $key);
    }

} catch (Exception $e) {
    //header('Server Error', true, 500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
    exit();
}

