<?php

/**
 * class.Helpers.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 *
 * Portions of code from QGIS-WEB-CLIENT - PHP HELPERS
 *
 * More information at https://github.com/uprel/gisapp
 */

namespace GisApp;

use Exception;
use SimpleXMLElement;
use PDO;

class Helpers
{
    function __construct()
    {
        $this->cache = \phpFastCache("files", array(
            "path" => TEMP_PATH
        ));
    }

    private $cache = null;

    public $qgs_layers = [];

    public static function checkSettings() {
        if (!file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'settings.php')){
            return self::msg(false, "Create and adjust settings.php from template in /admin folder!");
        }

        if (!file_exists(dirname(__FILE__) . DIRECTORY_SEPARATOR . '../client_common/settings.js')){
            return self::msg(false, "Create and adjust settings.js from template in /client_common folder!");
        }

        return self::msg(true,null);
    }

    /**
     * return crs list of all layers as published in project properties OWS Server
     */
    public static function getCrsListFromSession() {
        $list = [];
        if (!isset($_SESSION['qgs'])) {
            return $list;
        }
        try {
            $qgs = json_decode($_SESSION['qgs']);
            return $qgs->crs_list;
        } catch (Exception $e) {
            error_log("EQWC Error: ".$e->getMessage());
            return $list;
        }
    }

    public static function getProjectCrsFromSession() {
        if (!isset($_SESSION['qgs'])) {
            return "EPSG:3857";
        }
        try {
            $qgs = json_decode($_SESSION['qgs']);
            return $qgs->crs;
        } catch (Exception $e) {
            error_log("EQWC Error: ".$e->getMessage());
            return "EPSG:3857";
        }
    }

    public static function getPluginsFromSession() {
        try {
            if (isset($_SESSION['data'])) {
                $data = json_decode($_SESSION['data']);
                return $data->plugins;
            }
            return [];
        } catch (Exception $e) {
            return [];
        }
    }

    public static function getDbVersionFromSession()
    {
        if (isset($_SESSION['db_version'])) {
            return (integer)$_SESSION['db_version'];
        }
        return 0;
    }

    public static function validateExportParams($params)
    {
        if (isset($params['map0_extent']) && $params['map0_extent'] != '') {
            $extent = explode(",", $params['map0_extent']);
            $xmin = $extent[0];
            $ymin = $extent[1];
            $xmax = $extent[2];
            $ymax = $extent[3];

            if (!(is_numeric($xmin) && is_numeric($ymin) && is_numeric($xmax) && is_numeric($xmin) && is_numeric($ymax))) {
                return "SQL injection prevention : bad extent";
            }

        }

        //if (isset($params['SRS'])) {
        //    $srid = substr(strrchr($params['SRS'], ':'), 1);
        
        //    if (!is_numeric($srid)) {
        //        return "SQL injection prevention : bad srid";
        //    }

        //} else {
        //    return "No SRS!";
        //}

        if (!(isset($params['format']))) {
            return "No format";
        }

        if (!(isset($params['layer']))) {
            return "No layer";
        }

        if (!(isset($params['map']))) {
            return "No map";
        }

        if (!(isset($params['cmd']))) {
            return "No cmd parameter";
        } else {
            if ($params["cmd"] == 'prepare' || $params["cmd"] == 'get') {
                //OK
            } else
                return "Unknown cmd parameter";
        }

        return 'OK';
    }

    public static function normalize($string)
    {
        $table = array(
            'š' => 's', 'ď' => 'd', 'đ' => 'dj', 'ž' => 'z', 'č' => 'c', 'ć' => 'c',
            'Þ' => 'b', 'ß' => 's', 'ĺ' => 'l', 'ľ' => 'l',
            'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'a', 'ç' => 'c', 'è' => 'e', 'é' => 'e',
            'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i', 'ð' => 'o', 'ň' => 'n', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o',
            'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ø' => 'o', 'ť' => 't', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ý' => 'y', 'þ' => 'b',
            'ÿ' => 'y', 'ŕ' => 'r', '.' => ''
        );

        return strtr(strtolower($string), $table);
    }

    private function msg($status, $data)
    {
        //TODO Status shuold be renamed to success to be more understadable
        return ["status" => $status, "message" => $data];
    }

    private function getQgsProjectExtent($xml) {
        $ret = (array)($xml->properties->WMSExtent->value);
        if (empty($ret)) {
            $ret = [
                floatval($xml->mapcanvas->extent->xmin),
                floatval($xml->mapcanvas->extent->ymin),
                floatval($xml->mapcanvas->extent->xmax),
                floatval($xml->mapcanvas->extent->ymax)
            ];
        }
        return $ret;
    }

    /**
     *
     * Load .qgs file
     *
     * @param $map
     * @return array
     */
    public static function getQgsProject($map)
    {
        try {
            libxml_clear_errors();
            libxml_use_internal_errors(true);
            if (file_exists($map) && is_readable($map)) {
                $project = simplexml_load_file($map);
                if (!$project) {
                    return self::msg(false, 'Project not valid XML!');
                }
            } else {
                return self::msg(false, 'Project not found or no permission: ' . $map);
            }
            return self::msg(true, $project);
        } catch (Exception $e) {
            return self::msg(false, $e->getMessage());
        }
    }

    public static function getQgsTimeStamp($map) {
        $time = 0;
        if (file_exists($map)) {
            $time = filemtime($map);
        }
        return $time;
    }

    public function getProjectConfigs($file)
    {
        $ext = explode('.',$file)[1];

        if (file_exists($file)) {
            try {
                $filestr = file_get_contents($file, true);
                //check if json is valid string
                if ($ext=='json' && json_decode($filestr) === null) {
                    throw new Exception ("No permission or bad project json configuration!");
                }

                return self::msg(true, $filestr);
            } catch (Exception $e) {
                return self::msg(false, $e->getMessage());
            }
        } else {
            return self::msg(true, json_encode(new \stdClass()));    //empty json object
        }
    }

    public function getQgsFullProjectPath($project, $client, $project_path) {

        //first check for database project_path wih complete filename if exists
        //this overrides default PROJECT_PATH from settings.php
        $error = PROJECT_PATH . $project . '.qgs';
        if ($project_path !== null) {
            $error = $project_path;
        }
        if ((file_exists($project_path) && is_file($project_path))) {
            return self::msg(true, dirname($project_path) . DIRECTORY_SEPARATOR . $project);
        }else if (file_exists(PROJECT_PATH . $project . '.qgs')) {
            return self::msg(true, PROJECT_PATH . $project);
        } else if (file_exists(PROJECT_PATH . $client . DIRECTORY_SEPARATOR . $project . '.qgs')) {
            return self::msg(true, PROJECT_PATH . $client . DIRECTORY_SEPARATOR . $project);
        } else {
            return self::msg(false, $error.' NOT FOUND OR NO PERMISSION!');
        }
    }


    public function getQgsProjectProperties($map)
    {
        $map .= '.qgs';

        $qgs = self::getQgsProject($map);
        $time = self::getQgsTimeStamp($map);
        $prop = new \stdClass();

        if (!($qgs["status"])) {
            //error in XML, using default CRS but continue
            $prop->crs = "EPSG:3857";
            $prop->crs_description = "";
            $prop->proj4 = "";
            $prop->title = "";
            $prop->extent = [];
            $prop->layers = [];
            $prop->use_ids = null;
            $prop->add_geom_to_fi = null;
            $prop->time = $time;
            $prop->version = "";
            $prop->crs_list = [];
            $prop->description = "";
            $prop->bookmarks = [];
            $prop->message = $qgs["message"];
            //return false;
        } else {
            $prop->crs = (string)$qgs["message"]->mapcanvas->destinationsrs->spatialrefsys->authid;
            $prop->crs_description = (string)$qgs["message"]->mapcanvas->destinationsrs->spatialrefsys->description;
            $prop->proj4 = (string)$qgs["message"]->mapcanvas->destinationsrs->spatialrefsys->proj4;
            $prop->title = (string)$qgs["message"]->title == "" ? basename($map, ".qgs") : (string)$qgs["message"]->title;
            $prop->extent = self::getQgsProjectExtent($qgs["message"]);
            $prop->layers = [];
            //parsing boolean values, be careful (bool)"false" = true!!!
            $prop->use_ids = filter_var($qgs["message"]->properties->WMSUseLayerIDs,FILTER_VALIDATE_BOOLEAN);
            $prop->add_geom_to_fi = filter_var($qgs["message"]->properties->WMSAddWktGeometry,FILTER_VALIDATE_BOOLEAN);
            $prop->time = $time;
            $prop->version = (string)$qgs["message"]["version"];
            $prop->crs_list = array_filter((array)($qgs["message"]->properties->WMSCrsList->value));
            $prop->description = (string)$qgs["message"]->properties->WMSServiceAbstract;
            $prop->bookmarks = $this->_readBokmarks($qgs["message"]->Bookmarks, (string)$qgs["message"]["version"]);

            $excluded = (array)$qgs["message"]->properties->WMSRestrictedLayers->value;
            try {

                $this->LayersToClientArray($qgs["message"]->xpath('layer-tree-group')[0],null, null);

                //get wfs layers
                $wfs = (array)($qgs["message"]->properties->WFSLayers->value);
                foreach($this->qgs_layers as $lay) {

                    $lay_object = self::getLayerById($lay->id,$qgs["message"]);
                    if($lay_object["status"]) {
                        $lay_info = self::getLayerInfo($lay_object["message"]);
                        if ($lay_info["status"]) {
                            $lay->provider = (string)$lay_info["message"]["provider"];
                            $lay->geom_type = (string)$lay_info["message"]["type"];
                            $lay->geom_column = (string)$lay_info["message"]["geom_column"];
                            $lay->crs = (string)$lay_info["message"]["crs"];
                            $lay->sql = (string)$lay_info["message"]["sql"];
                            $lay->key = (string)$lay_info["message"]["key"];
                            $lay->identify = (int)$lay_info["message"]["identify"];

                            //set no geometry layers to false
                            if($lay->geom_type == 'No geometry') {
                                $lay->visini = false;
                            }
                        }
                    }

                    //continue if layer is excluded
                    if(in_array($lay->layername, $excluded)) {
                        continue;
                    }

                    //enable wfs just for postgres and spatialite regardless project setting
                    if (in_array($lay->id,$wfs) and (!empty($lay->geom_type))) {
                        if($lay->provider == 'postgres' or $lay->provider == 'spatialite') {
                            $lay->wfs = true;
                            //layer CRS must be included in crs list for client to load projection file
                            if(empty($lay->crs)) {
                                $lay->crs = $prop->crs;
                            }
                            if(!(in_array($lay->crs,$prop->crs_list))) {
                                array_push($prop->crs_list,$lay->crs);
                            }
                            if(strpos(strtolower($lay->geom_type), 'polygon') === false) {
                                $lay->goto = true;
                            }
                        }
                    }

                    $prop->layers[$lay->id] = $lay;
                }

            } catch (\Exception $e) {
                $prop->message = $e->getMessage();
            }


            //$prop->message = $qgs["status"];
        }

        return $prop;
    }

    public function writeToCache($key, $value) {
        $content = $this->cache->get($key);
        if($content != null) {
            $this->cache->delete($key);
        }
        $this->cache->set($key, $value);
    }

    public function readFromCache($key) {
        return $this->cache->get($key);
    }

    /**
     *
     * Load a layer instance from the project
     *
     * @param $layername
     * @param SimpleXMLElement $project
     * @return array
     */
    public static function getLayer($layername, SimpleXMLElement $project)
    {
        // Caching
        static $layers = array();
        if (array_key_exists($layername, $layers)) {
            return self::msg(true, $layers[$layername]);
        }
        $xpath = '//maplayer/layername[.="' . $layername . '"]/parent::*';
        if (!$layer = $project->xpath($xpath)) {
            return self::msg(false, "layer not found");
        }
        $layers[$layername] = $layer[0];
        return self::msg(true, $layer[0]);
    }

    public static function getLayerById($id, SimpleXMLElement $project)
    {
        $xpath = '//maplayer/id[.="' . $id . '"]/parent::*';
        if (!$layer = $project->xpath($xpath)) {
            return self::msg(false, "layer not found");
        }
        return self::msg(true, $layer[0]);
    }

    /**
     *
     * Get layer connection and geom info
     *
     * @param SimpleXMLElement $layer
     * @return array
     */
    public static function getLayerInfo(SimpleXMLElement $layer)
    {
        // Datasource
        $datasource = (string)$layer->datasource;

        // Parse datasource
        $ds_parms = array(
            'provider' => (string)$layer->provider,
            'type' => '',
            'geom_column' => '',
            'crs' => (string)$layer->srs->spatialrefsys->authid,
            'sql' => '',
            'key' => '',
            'identify' =>$layer->flags->Identifiable
        );

        //only for postgres and spatialite layers
        if ((string)$layer->provider == 'postgres' or (string)$layer->provider == 'spatialite') {


            // First extract sql=
            if (preg_match('/sql=(.*)/', $datasource, $matches)) {
                $datasource = str_replace($matches[0], '', $datasource);
                $ds_parms['sql'] = $matches[1];
            }
            //extract table name same way
            if (preg_match('/table=(.*)/', $datasource, $matches)) {
                $datasource = str_replace($matches[0], '', $datasource);

                // parse (geom)
                if (preg_match('/\(([^\)]+)\)/', $matches[0], $match)) {
                    $ds_parms['geom_column'] = $match[1];
                }
                $ds_parms['table'] = trim($matches[1]);
                if (array_key_exists(0,$match)) {
                    $ds_parms['table'] = trim(str_replace($match[0], '', $ds_parms['table']));
                }
            }


            foreach (explode(' ', $datasource) as $token) {
                $kvn = explode('=', $token);
                if (count($kvn) == 2) {
                    $ds_parms[$kvn[0]] = trim($kvn[1],"'");
                } else { // Parse (geom)
                    if (preg_match('/\(([^\)]+)\)/', $kvn[0], $matches)) {
                        $ds_parms['geom_column'] = $matches[1];
                    }
                    // ... maybe other parms ...
                }
            }
        }

        if(empty($ds_parms['type'])) {
            $ds_parms['type'] = (string)$layer['geometry'];
        }

        //read user and pass for authcfg from settings
        if(isset($ds_parms['authcfg']) && defined('AUTHCFG')) {
            $auth = AUTHCFG;
            $cfg = $auth[$ds_parms['authcfg']];
            if(!empty($cfg)) {
                $ds_parms['user'] = $cfg['user'];
                $ds_parms['password'] = $cfg['password'];
            }
        }

        return self::msg(true, $ds_parms);
    }

    /**
     * Get PG connection from layer
     */
    public static function getPGConnection($ds_parms)
    {
        if(empty($ds_parms['host']))
        {
            $ds_parms['host'] = 'localhost';
        }
        if ($ds_parms['provider'] == 'postgres') {
            $PDO_DSN = "pgsql:host=${ds_parms['host']};port=${ds_parms['port']};dbname=${ds_parms['dbname']}";
        } else {
            return self::msg(false, 'provider not supported:'.$ds_parms['provider']);
        }

        try {
            $dbh = new PDO($PDO_DSN, @$ds_parms['user'], @$ds_parms['password']);
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            return self::msg(false, 'db error: ' . $e->getMessage());
        }

        return self::msg(true, $dbh);
    }

    public static function getMapFromUrl()
    {
        $url = filter_input(INPUT_SERVER, "SCRIPT_URL", FILTER_SANITIZE_STRING);
        $ret = null;

        if (strpos($url, "/") !== false) {
            $tmp = explode("/", $url);
            $ret = end($tmp);
        }

        return $ret;

    }

    public function LayersToClientArray($group,$groupname,$parent)
    {
        foreach ($group->children() as $el) {
            $cnt = sizeof($this->qgs_layers);
            $type = $el->getName();
            $lay = new \stdClass();
            if ($type == 'layer-tree-group') {
                $this->LayersToClientArray($el,(string)$el->attributes()["name"],$groupname);

            } else {
                if ($el->attributes()["id"] > '') {
                    $cnt++;
                    $lay->topic = 'Topic';
                    $lay->parent = $parent;
                    $lay->groupname = $groupname;
                    $lay->layername = (string)$el->attributes()["name"];
                    $lay->toclayertitle = (string)$el->attributes()["name"];
                    $lay->visini = (string)$el->attributes()["checked"] == 'Qt::Checked' ? true : false;
                    $lay->id = (string)$el->attributes()["id"];
                    $lay->wms_sort = (900-$cnt);
                    $lay->toc_sort = $cnt;
                    $lay->wfs = false;      //fill later
                    $lay->goto = false;      //fill later
                    $lay->provider = '';    //fill later
                    $lay->geom_type = '';   //fill later
                    $lay->geom_column = ''; //fill later
                    $lay->crs = ''; //fill later

                    array_push($this->qgs_layers, $lay);
                }
            }
        }
    }

    public static function checkModulexist($name)
    {
        try {
            $dir = dirname(dirname(__FILE__)) . "/plugins/";
            if (isset($_SESSION['data'])) {
                $data = json_decode($_SESSION['data']);
                $plugins = $data->plugins;
                if (is_array($plugins) && !(empty($plugins))) {
                    foreach ($plugins as $item) {
                        if (($item == $name) && is_dir($dir . $name)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }


    public static function loadGoogle() {
        if (self::checkModulexist('streetview')) {
            return true;
        }

        $data = $_SESSION['data'];

        if (strpos($data, '"Google"') !== false) {
            return true;
        }

        return false;
    }

    public static function getEqwcVersion() {
        $version = '0';
        if (file_exists('../version.txt')) {
            $version = trim(file_get_contents('../version.txt',null,null,null,9));
        }
        return $version;
    }

    public static function getPluginVersion($name) {
        $version = '0';
        $dir = dirname(dirname(__FILE__)) . "/plugins/";
        if (file_exists($dir . $name . '/changelog.txt')) {
                $version = trim(file_get_contents($dir . $name . '/changelog.txt',null,null,null,5));
        }
        return $version;
    }


    public static function getClientPath() {
        $root = filter_input(INPUT_SERVER,'DOCUMENT_ROOT',FILTER_SANITIZE_STRING);
        if (basename($root)=='gisportal') {
            $root = dirname($root);
        }
        return $root . GISAPPURL;
    }

    public static function hasPortal() {
        $ret = false;
        $root = filter_input(INPUT_SERVER,'DOCUMENT_ROOT',FILTER_SANITIZE_STRING);
        if (basename($root)=='gisportal') {
            $ret = true;
        }
        return $ret;
    }

    public function isValidUserProj($project)
    {
        $valid = isset($_SESSION['user_is_logged_in']);
        $sess = isset($_SESSION['project']) ? $_SESSION['project'] : null;

        if (($valid === true) && ($project === $sess)) {
            return TRUE;
        }

        $sess_map = isset($_SESSION['map']) ? $_SESSION['map'] : null;
        if (($valid === true) && ($project === $sess_map)) {
            return TRUE;
        }

        return FALSE;
    }

    /**
     * Obsolete, not in use!
     * @param $project
     * @return bool
     */
    public function checkReferer($project) {
        //disabling referer check due to some issues
        //should take also port number
        return true;

        if(!isset($_SERVER["HTTP_REFERER"])) {
            return false;
        }
        $ref = $_SERVER["HTTP_REFERER"];
        //$server = $_SERVER["REQUEST_SCHEME"] . "://" . $_SERVER["SERVER_NAME"] . $_SERVER["CONTEXT_PREFIX"] . $project;   //windows problem
        $server = $_SERVER["REQUEST_SCHEME"] . "://" . $_SERVER["SERVER_NAME"] . GISAPPURL . $project;

        $match = strpos($ref,$server);
        if ($match === FALSE) {
            error_log("EQWC Referer error : ".$ref . ': '.$server);
            return FALSE;
        }

        return TRUE;
    }

    public static function hasPluginAccess($plugin) {

        //check only for editing plugin
        if($plugin !== 'editing') {
            return TRUE;
        }

        $role = null;
        if (isset($_SESSION['role'])) {
            $role = $_SESSION['role'];
        }

        switch($role) {
            case null :
                return TRUE;

            case 'admin' :
                return TRUE;

            case 'editor' :
                return TRUE;

            case 'user' :
                return FALSE;

            case 'public' :
                return FALSE;

            default :
                return FALSE;
        }
    }

    private function _readBokmarks($sxe = null, $strVersion = '') {
        if (!$sxe instanceOf SimpleXMLElement)
            return array();

        $extract = array();

        $check = ($this->_majorVersion($strVersion) == 3 && $this->_minorVersion($strVersion) >= 10) ? true : false;

        if($check) {
            foreach ($sxe->children() as $key => $value) {
                $tmp = array(
                    (string)$value->attributes()['name'],
                    (string)$value->attributes()['group'],
                    (string)$value->attributes()['extent'],
                    (string)$value->attributes()['id'],
                    (string)$value->spatialrefsys->authid
                );
                array_push($extract, $tmp);
            }
        }

        return $extract;
    }

    private function _majorVersion($str = '') {
        try {
            return (int)explode(".", explode("-", $str)[0])[0];
        } catch (Exception $e) {
            return 0;
        }
    }
    private function _minorVersion($str = '') {
        try {
            return (int)explode(".", explode("-", $str)[0])[1];
        } catch (Exception $e) {
            return 0;
        }
    }
}
