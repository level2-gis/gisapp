<?php
/**
 * Created by PhpStorm.
 * User: uros
 * Date: 24.9.2015
 * Time: 22:46
 */

namespace GisApp;

class Helpers
{


    public static function isValidUserProj($project)
    {
        $valid = isset($_SESSION['user_is_logged_in']);

        if (($valid === true) && ($project !== null)) {
            if ($project !== $_SESSION['project']) {
                $valid = false;
                $_SESSION['project'] = $project;
                $_SESSION['user_is_logged_in'] = null;
            }
        }
        return $valid;
    }

    public static function validateExportParams($params)
    {
        if (isset($params['map0_extent'])) {
            $extent = explode(",", $params['map0_extent']);
            $xmin = $extent[0];
            $ymin = $extent[1];
            $xmax = $extent[2];
            $ymax = $extent[3];

            if (!(is_numeric($xmin) && is_numeric($ymin) && is_numeric($xmax) && is_numeric($xmin) && is_numeric($ymax))) {
                return "SQL injection prevention : bad extent";
            }

        } else {
            return "You must provide a valid bounding box";
        }

        if (isset($params['SRS'])) {
            $srid = substr(strrchr($params['SRS'], ':'), 1);

            if (!is_numeric($srid)) {
                return "SQL injection prevention : bad srid";
            }

        } else {
            return "No SRS!";
        }

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
        } else
        {
            if($params["cmd"] == 'prepare' || $params["cmd"] == 'get') {
                //OK
            }
            else
                return "Unknown cmd parameter";
        }

        return 'OK';
    }

    public static function normalize($string)
    {
        $table = array(
            'Š' => 'S', 'š' => 's', 'Đ' => 'Dj', 'đ' => 'dj', 'Ž' => 'Z', 'ž' => 'z', 'Č' => 'C', 'č' => 'c', 'Ć' => 'C', 'ć' => 'c',
            'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'A', 'Ç' => 'C', 'È' => 'E', 'É' => 'E',
            'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O',
            'Õ' => 'O', 'Ö' => 'O', 'Ø' => 'O', 'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ý' => 'Y', 'Þ' => 'B', 'ß' => 'Ss',
            'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'a', 'ç' => 'c', 'è' => 'e', 'é' => 'e',
            'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i', 'ð' => 'o', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o',
            'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ý' => 'y', 'þ' => 'b',
            'ÿ' => 'y', 'Ŕ' => 'R', 'ŕ' => 'r', '.' => ''
        );

        return strtr($string, $table);
    }

    private function msg($status, $data) {
        return ["status" => $status, "message" => $data];
    }

    /**
     * Load .qgs file
     */
    public static function get_project($map){
        if(file_exists($map) && is_readable($map)){
            $project = @simplexml_load_file($map);
            if(!$project){
                return self::msg(false,'project not valid');
            }
        } else {
            return self::msg(false,'project not found');
        }
        return self::msg(true,$project);
    }

    /**
     * Load a layer instance from the project
     *
     */
    public static function get_layer($layername, $project){
        // Caching
        static $layers = array();
        if(array_key_exists($layername, $layers)){
            return self::msg(true, $layers[$layername]);
        }
        $xpath = '//maplayer/layername[.="' . $layername . '"]/parent::*';
        if(!$layer = $project->xpath($xpath)){
            return self::msg(false, "layer not found");
        }
        $layers[$layername] = $layer[0];
        return self::msg(true, $layer[0]);
    }

    /**
     * Get layer connection and geom info
     */
    public static function get_layer_info($layer, $project){
        // Cache
        static $pg_layer_infos = array();

        if((string)$layer->provider != 'postgres' && (string)$layer->provider != 'spatialite'){
            return self::msg(false, 'only postgis or spatialite layers are supported' . (string)$layer->provider);
        }
        // Datasource
        $datasource = (string)$layer->datasource;

        if(array_key_exists($datasource, $pg_layer_infos)){
            return self::msg(true, $pg_layer_infos[$datasource]);
        }

        // Parse datasource
        $ds_parms = array(
            'provider' => (string)$layer->provider
        );
        // First extract sql=
        if(preg_match('/sql=(.*)/', $datasource, $matches)){
            $datasource = str_replace($matches[0], '', $datasource);
            $ds_parms['sql'] = $matches[1];
        }
        foreach(explode(' ', $datasource) as $token){
            $kv = explode('=', $token);
            if(count($kv) == 2){
                $ds_parms[$kv[0]] = $kv[1];
            } else { // Parse (geom)
                if(preg_match('/\(([^\)]+)\)/', $kv[0], $matches)){
                    $ds_parms['geom_column'] = $matches[1];
                }
                // ... maybe other parms ...
            }
        }
        $pg_layer_infos[$datasource] = $ds_parms;
        return self::msg(true, $ds_parms);
    }
}