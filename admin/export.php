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
 * @param $destinationFormat
 * @return string
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
    $project = Helpers::getQgsProject($map);
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

    $use_geom = true;
    if($lay_info["message"]['type'] == "No geometry") {
        $use_geom = false;
    }

    $sourceProvider = $lay_info["message"]['provider'];
    $table = $lay_info["message"]['table'];
    $sql = '';
    switch ($sourceProvider) {
        case 'ogr':
            $conn = $layer["message"]->datasource;
            $source = ' "' . $conn . '"';

            break;

        case 'postgres':
            //other option to get it from layer_info
            //$conn = str_replace(array('\'', '"'), '', $layer["message"]->datasource);
            //$conn = $layer["message"]->datasource;
            //removing text sslmode and all after that
            //$conn = "PG:" . rtrim(substr($conn, 0, strpos($conn, 'sslmode')));
            $conn = "PG:dbname='" . $lay_info['message']['dbname'] . "' host=" . $lay_info['message']['host'] . " port=" . $lay_info['message']['port'] . " user='" . $lay_info['message']['user'] . "' password='" . $lay_info['message']['password'] . "'";

            $sql = $lay_info["message"]['sql'];

            $source = ' "' . $conn . '" ' . $table;

            break;

        case 'spatialite':
            $conn = $lay_info["message"]['dbname'];
            $sql = $lay_info["message"]['sql'];

            $source = ' ' . $conn . ' ' . $table;

            break;

        default:
            throw new Exception ('Unknown provider: '.$sourceProvider);
    }


    $source_srid = (string)$layer["message"]->srs->spatialrefsys->srid;

    $srid = substr(strrchr($query_arr['SRS'], ':'), 1);
    $options = " ";
    $filter = html_entity_decode($query_arr['filter'], ENT_QUOTES);
    $options .= "-preserve_fid ";

    //only check export if mask_wkt is empty
    if (empty(Helpers::getMaskWktFromSession())) {
        //export only selection inside bounding box if provided
        //we have to transform extent to layers CRS on client side
        //if using gdal 2.0 this will not be necessary, just use -spat_srs
        if ($query_arr['layer_extent'] != '') {
            $extent = explode(",", $query_arr['layer_extent']);
            $xmin = $extent[0];
            $ymin = $extent[1];
            $xmax = $extent[2];
            $ymax = $extent[3];
            $options .= '-spat ' . $xmin . ' ' . $ymin . ' ' . $xmax . ' ' . $ymax . ' ';
        }
    } else {
        $options .= '-clipsrc "' . Helpers::getMaskWktFromSession() . '" ';
    }

    //field set
    if ($query_arr['fields'] != '') {
        //primary key if exists must be removed from fields, otherwise we get ogr2ogr error
        $key = null;
        if ($sourceProvider == 'postgres') {
            $key = str_replace("'", '', $lay_info["message"]['key']);
        }
        $fields = array_diff(explode(',', $query_arr['fields']), [$key]);
        $options .= '-select "' . implode(',',$fields) . '" ';

        //sql filter from qgis project layer properties combine with table filter from request
        if ($sql>'') {
            $options = " -where \"".$sql."\" ";
        } elseif ($filter!='') {
            $options = " -where \"".$filter."\" ";
        }

    } else {
        //we cannot mix where and sql parameters, so where must pa part of sql
        if(!empty($table)) {
            $options .= '-sql "SELECT * FROM ' . str_replace('"','\"',$table);

            if ($sql>'') {
                $options .= ' WHERE ('. $sql . ')';
                if ($filter!='') {
                    $options .= ' AND '. $filter .  '" ';
                } else {
                    $options .= '" ';
                }
            } elseif ($filter!='') {
                $options .= ' WHERE '. $filter .  '" ';
            } else {
                $options .= '" ';
            }
        }
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
            $makeZip = false;
            $fileExt = 'dxf';
            break;
        case 'CSV':
            $format_name = $destinationFormat;
            $options .= "-lco SEPARATOR=SEMICOLON -lco LINEFORMAT=CRLF ";
            //$options .= "-lco GEOMETRY=AS_XYZ ";    //this will return results only for single point geometries (other option is WKT for all types)
            $makeZip = false;
            $fileExt = 'csv';
            break;
        case 'TSV':
            $format_name = "CSV";
            $destinationFormat = "CSV";
            $options .= "-lco SEPARATOR=TAB -lco LINEFORMAT=CRLF ";
            //$options .= "-lco GEOMETRY=AS_XYZ ";    //this will return results only for single point geometries (other option is WKT for all types)
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
            $makeZip = false;
            $fileExt = 'kml';
            break;
        case 'GeoJSON':
            $format_name = $destinationFormat;
            $options .= "-lco WRITE_NAME=NO ";
            $makeZip = false;
            $fileExt = 'geojson';
            break;
        default:
            throw new Exception('Format not supported');
    }

    //putenv('CPL_LOG_ERRORS=ON');
    //putenv('CPL_LOG=/var/tmp/ogr_errors.log');

    if($use_geom) {
        $geom_sql = '-s_srs EPSG:' . $source_srid . ' -t_srs EPSG:' . $srid;
    } else {
        $geom_sql = '';
    }

    //$mycmd = OGR2OGR . ' -f "' . $format_name . '" "' . $fileName . '.' . strtolower($destinationFormat) . '" ' . $options . ' "' . $conn . '" -sql "SELECT * FROM ' . $table . ' WHERE ' . $geom . ' && ST_Transform(ST_MakeEnvelope(' . $xmin . ', ' . $ymin . ', ' . $xmax . ', ' . $ymax . ', ' . $srid . '),' . $source_srid . ')" -progress';
    $mycmd = OGR2OGR . ' -skipfailures ' . $geom_sql . $options . '-f "' . $format_name . '" "' . $fileName . '.' . strtolower($destinationFormat) . '"' .$source . ' -progress';

    chdir(dirname($map));
    $output = exec($mycmd);

    //output receives 0...10...20...30...40...50...60...70...80...90...100 - done.
    //looks like not in all cases so this must be turned off
    //if (strpos($output,"done") === FALSE) {
    //    error_log("EQWC Data Export Failed: ".$mycmd);
    //    throw new Exception("Export failed: ".$output."</br>Details in Apache error log!");
    //}

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
    if (!(Helpers::isValidUserProj($map))) {
        throw new Exception("Session time out or unathorized access!");
    }

    //if user is limited means export restriction
    if (isset($_SESSION["role"])) {
        $role = $_SESSION["role"];
        if ($role == 'user-limit') {
            throw new Exception("No permission!");
        }
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

