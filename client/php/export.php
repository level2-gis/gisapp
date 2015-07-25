<?php

/*
 *
 * Sample for exporting from a postgis database to an esri shapefile using gdal ogr2ogr
 * Need to install gdal binaries (apt-get install gdal-bin) and adapt the ogr2ogr command you need.
 * Can be adapted to export/import almost everything (look at http://www.gdal.org/ogr/ogr_formats.html)
 * 
 * Nicolas Liaudat - nliaudat(at)pompiers-chatel(dot)ch
 *
 *
 * export.php -- part of Quantum GIS Web Client
 *
 * Copyright (2014), The QGIS Project All rights reserved.
 * Quantum GIS Web Client is released under a BSD license. Please see
 * https://github.com/qgis/qgis-web-client/blob/master/README
 * for the full text of the license and the list of contributors.
 *
*/
//Modifications: Uros Preloznik

require_once('helpers.php');
require_once('../../admin/settings.php');

if(isset($_REQUEST['map0_extent'])){
    $extent =  explode(",", $_REQUEST['map0_extent']);
    $xmin = $extent[0];
    $ymin = $extent[1];
    $xmax = $extent[2];
    $ymax = $extent[3];

    if (! (is_numeric($xmin) && is_numeric($ymin) && is_numeric($xmax) && is_numeric($xmin) && is_numeric($ymax))){
        die('SQL injection prevention : bad extent');
    }

}else{
    die('You must provide a valid bounding box');
}

if(isset($_REQUEST['SRS'])){
    $srid = substr(strrchr($_REQUEST['SRS'],':'),1);

    if (! is_numeric($srid)){
        die('SQL injection prevention : bad srid');
    }

}

if(isset($_REQUEST['format'])) {
    $format = $_REQUEST['format'];
}
else {
    die('No format');
}

if(isset($_REQUEST['layer'])) {
    $layername = $_REQUEST['layer'];
}
else {
    die('No layer');
}

if(isset($_REQUEST['map'])) {
    $map = $_REQUEST['map'];
}
else {
    die('No map');
}

$now = date("Ymd_His");
$layerAlias = normalize($layername);
$fileName = TEMP_PATH . $layerAlias . '_' . $now;
$fileNameZip = $layerAlias . '_' . $now . '.zip';

$server_os = php_uname('s');

if($server_os=='Windows NT') {
    $fullFileNameZip = $fileNameZip;
}
else {
    $fullFileNameZip = TEMP_PATH.$fileNameZip;
}

$ctype = "application/zip";
$makeZip = true;
$fsize = -1;

// Get project
$project = get_project(PROJECT_PATH . $map . '.qgs');
// Get layer
$layer = get_layer($layername, $project);
// Check layer provider
if((string)$layer->provider != 'postgres' && (string)$layer->provider != 'spatialite'){
    die('only postgis or spatialite layers are supported: ' . (string)$layer->provider);
}
// Get layer info
$li = get_layer_info($layer, $project);

if ((string)$layer->provider=='postgres') {
    //other option to get it from layer_info
    $conn = str_replace(array('\'', '"'), '', $layer->datasource);
    //removing text sslmode and all after that
    $conn = "PG:" . rtrim(substr($conn,0,strpos($conn,'sslmode')));

    $table = $li['table'];
    $geom = $li['geom_column'];
    $source_srid = (string)$layer->srs->spatialrefsys->srid;
    $options = "";

    if($format=='SHP') {
        $format_name = 'ESRI Shapefile';
        $options = "-lco ENCODING=UTF-8";
    }
    else if ($format=='DXF') {
        $format_name = $format;
        //$options = '-select field_list=""';
    }
    else if ($format=='CSV') {
        $format_name = $format;
        $options = "-lco SEPARATOR=SEMICOLON";
        $makeZip = false;
        $fileNameZip = $layerAlias . '_' . $now . '.csv';
        $ctype = "text/csv";
    }
    else {
        die ('Format not supported');
    }

    putenv('CPL_LOG_ERRORS=ON');
    putenv('CPL_LOG=/var/tmp/ogr_errors.log');

    //I removed _a_srs parameter, something not right in QGIS ' -a_srs EPSG:'.$srid.
    $mycmd = OGR2OGR . ' -f "'.$format_name.'" "'.$fileName .'.'.strtolower($format).'" ' . $options . ' "'.$conn.'" -sql "SELECT * FROM '.$table.' WHERE '.$geom.' && ST_Transform(ST_MakeEnvelope(' .$xmin .', ' .$ymin .', ' .$xmax .', ' .$ymax .', ' .$srid .'),'.$source_srid.')" -progress';

    //$mycmd = OGR2OGR . ' -s_srs EPSG:3857 -t_srs EPSG:2170 -f "'.$format_name.'" "'.$fileName .'.'.strtolower($format).'" ' . $options . ' "'.$conn.'" -sql "SELECT * FROM '.$table.' WHERE '.$geom.' && ST_MakeEnvelope(' .$xmin .', ' .$ymin .', ' .$xmax .', ' .$ymax .', ' .$srid .')" -progress';

}
else {
    die ('only postgis layers');
}

try {

    $output = shell_exec($mycmd);

    if($makeZip) {

        $zip = new ZipArchive();

        if ($zip->open($fullFileNameZip, ZipArchive::CREATE)!==TRUE) {
            exit("Cannot write <$fullFileNameZip>\n");
        }

        //$zip->addFile("./" .$filename ,$now ."/" .$filename);

        $zip->addFile($fileName.'.'.strtolower($format), basename($fileName.'.'.strtolower($format)));
        if($format=='SHP') {
            $zip->addFile($fileName.'.shx', basename($fileName.'.shx'));
            $zip->addFile($fileName.'.dbf', basename($fileName.'.dbf'));
            $zip->addFile($fileName.'.prj', basename($fileName.'.prj'));
            $zip->addFile($fileName.'.cpg', basename($fileName.'.cpg'));
        }
        $zip->close();

        //$fsize = filesize('./' .$filename_zip);
        $fsize = filesize($fullFileNameZip);
    }
    else {
        //for formats that are not zipped (CSV...)
        $fsize = filesize($fileName .'.'.strtolower($format));
    }

}
catch(Exception $e) {
    echo 'Error:' , $e->getMessage();
    exit();
}

header("Pragma: public"); // required
header("Expires: 0");
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header("Cache-Control: private",false); // required for certain browsers
header("Content-Type: " . $ctype);
header("Content-Disposition: attachment; filename=\"".$fileNameZip."\";" );
header("Content-Transfer-Encoding: binary");
header("Content-Length: ".$fsize);
ob_clean();
flush();

if ($makeZip) {
    readfile($fullFileNameZip);
}
else {
    readfile($fileName .'.'.strtolower($format));
}

//removing shp
if($format=='SHP') {
    unlink($fileName.'.dbf');
    unlink($fileName.'.shx');
    //unlink($fileName.'.prj');
    unlink($fileName.'.cpg');
}
if (file_exists($fileName . '.' . strtolower($format))) {
    unlink($fileName . '.' . strtolower($format));
}

if (file_exists($fullFileNameZip)) {
    unlink($fullFileNameZip);
}

exit();

