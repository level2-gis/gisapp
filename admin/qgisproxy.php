<?php

/**
 * qgisproxy.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

use GuzzleHttp\Client;
use GuzzleHttp\Exception;
use GuzzleHttp\Psr7\Request;
use GisApp\Helpers;

require '../vendor/autoload.php';
require_once("class.Helpers.php");
require_once("class.DbLoader.php");
require_once("settings.php");


function handleGetPrint($data, $project, $user)
{

    if (empty($data["description"])) {
        $data["description"] = "";
    }

    if (empty($data["title"])) {
        $data["title"] = "";
    }

    try {
        $db_version = Helpers::getDbVersionFromSession();

        //connection to database
        $conn = new PDO(DB_CONN_STRING, DB_USER, DB_PWD);
        $db = new \GisApp\DbLoader($user, $project, $conn);

        $db->writeUserPrintData($data["title"], $data["description"], $db_version);

        return true;

    } catch (PDOException $e) {
        error_log("EQWC PRINT: PDO database connection problem: " . $e->getMessage());
    }
}


/**
 * @param $query_arr
 * @param $client
 */
function doPostRequest($query_arr, $client)
{

    $request_params = $_POST;

    if (empty($request_params)) {

        $data = file_get_contents('php://input');

        if (!empty($data)) {

            $request_params = $data;

        } else {
            $request_params = $query_arr;
            $query_arr = null;
        }

    }

    //async request, but calling wait, no difference
//use GuzzleHttp\Exception\RequestException;
//use Psr\Http\Message\ResponseInterface;
//    $promise = $client->requestAsync('POST', QGISSERVERURL, [
//        'query' => $query_arr,
//        'body' => $request_params,
//        'http_errors' => true,
//        //request without SSL verification, read this http://docs.guzzlephp.org/en/latest/request-options.html#verify-option
//        'verify' => false
//    ]);
//
//    $promise->then(
//        function (ResponseInterface $response) {
//            //response
//            $contentType = $response->getHeaderLine('Content-Type');
//            $contentLength = $response->getHeaderLine('Content-Length');
//            $content = $response->getBody();
//
//            header("Content-Length: " . $contentLength);
//            header("Content-Type: " . $contentType);
//            header("Cache-control: max-age=0");
//
//            echo $content;
//        },
//        function (RequestException $e) {
//            //exception
//            $http_ver = $_SERVER["SERVER_PROTOCOL"];
//            header($http_ver . " 500 Error");
//            header("Content-Type: text/html");
//            echo $e->getMessage() . "\n";
//            echo $e->getRequest()->getMethod();
//        }
//    );
//
//    $promise->wait();

    //standard synhrone request
    $new_request = new Request('POST', QGISSERVERURL);

    //in case of mask_wkt we get post request in form of array for WMS GetFeatureInfo
    if (is_array($request_params)) {
        $response = $client->send($new_request, [
            'form_params' => $request_params,
            'http_errors' => true,
            //request without SSL verification, read this http://docs.guzzlephp.org/en/latest/request-options.html#verify-option
            'verify' => false
        ]);
    } else {
        $response = $client->send($new_request, [
            'query' => $query_arr,
            'body' => $request_params,
            'http_errors' => true,
            //request without SSL verification, read this http://docs.guzzlephp.org/en/latest/request-options.html#verify-option
            'verify' => false
        ]);
    }

    $contentType = $response->getHeaderLine('Content-Type');
    $contentLength = $response->getHeaderLine('Content-Length');
    $content = $response->getBody();

    //if ($response->getStatusCode() != 200) {
    //    throw new Exception\ServerException($content, $new_request);
    //}

    header("Content-Length: " . $contentLength);
    header("Content-Type: " . $contentType);
    header("Cache-control: max-age=0");

    echo $content;

}

/**
 * @param $query_arr
 * @param $map
 * @param $client
 * @param $http_ver
 * @param $user
 */
function doGetRequest($query_arr, $map, $client, $http_ver, $user)
{
    $useCache = false;
    if(defined('QGISSERVERCACHE')) {
        $useCache = QGISSERVERCACHE;
    }

    $new_request = new Request('GET', QGISSERVERURL);

    //caching certain requests
    $config = array(
        "path" => TEMP_PATH
    );
    $cache = phpFastCache("files", $config);
    $content = null;
    $contentType = null;
    $cacheKey = null;
    $contentLength = 0;
    $sep = "_x_"; //separator for key generating

    if ($query_arr["REQUEST"] != null) {
        switch ($query_arr["REQUEST"]) {
            case "GetMap":
                if (!empty(Helpers::getMaskLayerIdFromSession())) {
                    $query_arr["LAYERS"] = $query_arr["LAYERS"] . "," . Helpers::getMaskLayerIdFromSession();
                    $query_arr["FILTER"] = empty($query_arr["FILTER"]) ? Helpers::getMaskLayerIdFromSession() . ":" . Helpers::getMaskFilterFromSession() : $query_arr["FILTER"] . ';' . Helpers::getMaskLayerIdFromSession() . ":" . Helpers::getMaskFilterFromSession();
                }
                break;

            case "GetProjectSettings":
                $cacheKey = $map . $sep . "XML" . $sep . $query_arr["REQUEST"];
                $contentType = "text/xml";
                break;
            case "GetLegendGraphics":
                if (empty($query_arr['STYLES'])) {
                    $cacheKey = $map . $sep . "PNG" . $sep . $query_arr["REQUEST"] . $sep . Helpers::normalize($query_arr['LAYERS']);
                } else {
                    $cacheKey = $map . $sep . "PNG" . $sep . $query_arr["REQUEST"] . $sep . Helpers::normalize($query_arr['LAYERS'] . $sep . Helpers::normalize($query_arr['STYLES']));
                }
                $contentType = "image/png";
                break;
            case "DescribeFeatureType":
                $layer = $query_arr["TYPENAME"];
                //first check if XML is in project subfolder of _data_definitions
                if (is_readable(PROJECT_PATH . '_data_definitions' . DIRECTORY_SEPARATOR . $map . DIRECTORY_SEPARATOR . $layer . '.xml')) {
                    $content = file_get_contents(PROJECT_PATH . '_data_definitions' . DIRECTORY_SEPARATOR . $map . DIRECTORY_SEPARATOR . $layer . '.xml');
                } elseif (is_readable(PROJECT_PATH . '_data_definitions' . DIRECTORY_SEPARATOR . $layer . '.xml')) {
                    $content = file_get_contents(PROJECT_PATH . '_data_definitions' . DIRECTORY_SEPARATOR . $layer . '.xml');
                }
                $contentType = "text/xml";
                break;
            case "GetPrint":
                handleGetPrint($query_arr, $map, $user);

                if (!empty(Helpers::getMaskLayerIdFromSession())) {
                    $query_arr["LAYERS"] = $query_arr["LAYERS"] . "," . Helpers::getMaskLayerIdFromSession();
                    $query_arr["FILTER"] = empty($query_arr["FILTER"]) ? Helpers::getMaskLayerIdFromSession() . ":" . Helpers::getMaskFilterFromSession() : $query_arr["FILTER"] . ';' . Helpers::getMaskLayerIdFromSession() . ":" . Helpers::getMaskFilterFromSession();
                }
                break;
//            case "GetFeatureInfo":
//                //skip for now
//                if (array_key_exists("QUERY_LAYERS", $query_arr)) {
//                    if($_SESSION->qgs->layers[$query_arr['QUERY_LAYERS']]->wfs===false) {
//                            $cacheKey = $map . $sep . "XML" . $sep . $query_arr["REQUEST"] . $sep . Helpers::normalize($query_arr['FILTER']);
//                    }
//                }
//                break;
        }
    }

    if (!empty($cacheKey) && $useCache === TRUE) {
        $qgsTime = $cache->get($map . $sep . "QGS_TIME"); //json_decode($_SESSION['qgs'])->time;

        $content = $cache->get($cacheKey);

        if($content != null) {
            $writeTime = $cache->getInfo($cacheKey)['write_time'];
            if ($qgsTime>$writeTime) {
                $cache->delete($cacheKey);
                $content = null;
            }
        }

    }

    if ($content == null) {
        $response = $client->send($new_request, [
            'query' => $query_arr,
            'http_errors' => true,
            //request without SSL verification, read this http://docs.guzzlephp.org/en/latest/request-options.html#verify-option
            'verify' => false
        ]);
        $contentType = $response->getHeaderLine('Content-Type');
        $contentLength = $response->getHeaderLine('Content-Length');
        $content = $response->getBody()->__toString();
        $code = $response->getStatusCode();

        if($code == 200) {
        //check GetProjectSettings XML
        if ($query_arr["REQUEST"] == "GetProjectSettings") {
                $contentXml = simplexml_load_string($content);
                if ($contentXml !== false) {
                    if ($contentXml->getName() !== 'WMS_Capabilities') {
                        $m = "Unknown error";
                        if ($contentXml->ServiceException !== null) {
                            $m = (string)$contentXml->ServiceException;
                        }
                        throw new Exception\ServerException($m, $new_request);
                    }
                } else {
                    throw new Exception\ServerException($content, $new_request);
                }
            }
        } else {
            throw new Exception\ServerException($content, $new_request);
        }

        if($useCache === TRUE) {
            $cache->set($cacheKey, $content);
        }
    }

    //get client headers
    $client_headers = apache_request_headers();

    //generate etag
    $new_etag = md5($content);

    //check if client send etag and compare it
    if (isset($client_headers['If-None-Match']) && strcmp($new_etag, $client_headers['If-None-Match']) == 0) {
        //return code 304 not modified without content
        header($http_ver . " 304 Not Modified");
        header("Cache-control: max-age=0");
        header("Etag: " . $new_etag);
    } else {
        //header("Content-Length: " . $contentLength);
        header("Content-Type: " . $contentType);
        header("Cache-control: max-age=0");
        header("Etag: " . $new_etag);

        echo $content;
    }
}

try {

    //parameters, always (post also contains at lest map parameter
    $query_arr = filter_input_array(INPUT_GET, FILTER_UNSAFE_RAW);
    $request_method = $_SERVER['REQUEST_METHOD'];
    $http_ver = $_SERVER["SERVER_PROTOCOL"];

    //we have to extend map parameter with path to projects, but first store it into own variable and remove .qgs
    $map = "";
    if (strpos($query_arr["map"], ".") === false) {
        $map = $query_arr["map"];
    } else {
        $map = explode(".", $query_arr["map"])[0];
    }

    $helpers = new Helpers();

    //session check
    session_start();

    if (!($helpers->isValidUserProj($map))) {
        throw new Exception\ClientException("Session time out or unathorized access!", new Request('GET', QGISSERVERURL));
    }

    //get project path from cache or session
    $sep = "_x_";
    $projectPath = $helpers->readFromCache($map . $sep . "PROJECT_PATH");
    if (empty($projectPath)) {
        if (isset($_SESSION["project_path"])) {
            $projectPath = $_SESSION["project_path"];
        }
    }

    $user = null;
    if (isset($_SESSION["user_name"])) {
        $user = $_SESSION["user_name"];
        //add username to apache access log for this request
        apache_note('username',$user);
    }

    $query_arr["map"] = $projectPath;

    $client = new Client();

    if (!empty(Helpers::getMaskWktFromSession()) && array_key_exists('REQUEST', $query_arr) && $query_arr["REQUEST"] == 'GetFeatureInfo') {
        $query_arr["FILTER_GEOM"] = Helpers::getMaskWktFromSession();
        unset($query_arr["FILTER"]);
        doPostRequest($query_arr, $client, $http_ver);
        return;
    }

    if ($request_method == 'GET') {

        doGetRequest($query_arr, $map, $client, $http_ver, $user);

    } elseif ($request_method == 'POST') {

        //check if user is guest
        if ($user != null && $user == 'guest') {
            throw new Exception\ClientException("No permission for guest users!", new Request('GET', QGISSERVERURL));
        }

        doPostRequest($query_arr, $client, $http_ver);
    }

} catch (Exception\ServerException $e) {
    if ($e->hasResponse()) {
        $res = $e->getResponse();
        header($http_ver . '" ' . $res->getStatusCode() . ' ' . $res->getReasonPhrase() . '"');
        
        // Get the original response body from QGIS Server
        $originalContent = $res->getBody()->__toString();
        
        // Check if it's XML content from QGIS Server
        if (strpos($originalContent, '<?xml') === 0 || strpos($originalContent, '<ServerException>') !== false) {
            header("Content-Type: text/xml");
            echo $originalContent;
        } else {
            header("Content-Type: text/html");
            echo $e->getMessage();
        }
    } else {
        header($http_ver . " 500 Server Error");
        header("Content-Type: text/html");
        echo $e->getMessage();
    }

} catch (Exception\ClientException $e) {
    if ($e->hasResponse()) {
        $res = $e->getResponse();
        header($http_ver . '" ' . $res->getStatusCode() . ' ' . $res->getReasonPhrase() . '"');
        
        // Get the original response body from QGIS Server
        $originalContent = $res->getBody()->__toString();
        
        // Check if it's XML content from QGIS Server
        if (strpos($originalContent, '<?xml') === 0 || strpos($originalContent, '<ServerException>') !== false) {
            header("Content-Type: text/xml");
            echo $originalContent;
        } else {
            header("Content-Type: text/html");
            echo $e->getMessage();
        }
    } else {
        header($http_ver . " 401 Unathorized");
        header("Content-Type: text/html");
        echo $e->getMessage();
    }

} catch (Exception\RequestException $e) {
    if ($e->hasResponse()) {
        $res = $e->getResponse();
        header($http_ver . '" ' . $res->getStatusCode() . ' ' . $res->getReasonPhrase() . '"');
        
        // Get the original response body from QGIS Server
        $originalContent = $res->getBody()->__toString();
        
        // Check if it's XML content from QGIS Server
        if (strpos($originalContent, '<?xml') === 0 || strpos($originalContent, '<ServerException>') !== false) {
            header("Content-Type: text/xml");
            echo $originalContent;
        } else {
            header("Content-Type: text/html");
            echo $e->getMessage();
        }
    } else {
        header("Content-Type: text/html");
        echo $e->getMessage();
    }
}
