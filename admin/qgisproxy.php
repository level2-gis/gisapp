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
require_once("settings.php");

//parameters
$query_arr = filter_input_array(INPUT_GET, FILTER_UNSAFE_RAW);

//we have to extend map parameter with path to projects, but first store it into own variable and remove .qgs
$map = "";
if (strpos($query_arr["map"], ".") === false) {
    $map = $query_arr["map"];
} else {
    $map = explode(".", $query_arr["map"])[0];
}
$query_arr["map"] = PROJECT_PATH . $query_arr["map"];

$client = new Client();

try {

    $new_request = new Request('GET', QGISSERVERURL);

    //session check
    session_start();

    if (!(Helpers::isValidUserProj($map))) {
        throw new Exception\ClientException("Session time out or unathorized access!", $new_request);
    }

    //caching certain requests
    $cache = phpFastCache("files");
    $content = null;
    $contentType = null;
    $cacheKey = null;
    $contentLength = 0;
    $sep = "_x_"; //separator for key generating
    switch ($query_arr["REQUEST"]) {
        case "GetProjectSettings":
            $cacheKey = $map . $sep . "XML" . $sep . $query_arr["REQUEST"];
            $contentType = "text/xml";
            break;
        case "GetLegendGraphics":
            $cacheKey = $map . $sep . "PNG" . $sep . $query_arr["REQUEST"] . $sep . Helpers::normalize($query_arr['LAYERS']);
            $contentType = "image/png";
            break;
        case "GetFeatureInfo":
            //only caching large responses (whole tables)
            $count = $query_arr['FEATURE_COUNT'];
            if (is_numeric($count)) {
                if (intval($count) > 100) {
                    $cacheKey = $map . $sep . "XML" . $sep . $query_arr["REQUEST"] . $sep . Helpers::normalize($query_arr['FILTER']);
                }
            }
            break;
    }

    if ($cacheKey != null) {
        $content = $cache->get($cacheKey);


        if ($content == null) {
            $response = $client->send($new_request, [
                'query' => $query_arr,
                'http_errors' => true
            ]);
            $contentType = $response->getHeaderLine('Content-Type');
            $contentLength = $response->getHeaderLine('Content-Length');
            $content = $response->getBody()->__toString();

            //check GetProjectSettings XML
            if ($query_arr["REQUEST"] == "GetProjectSettings") {
                $contentXml = simplexml_load_string($content);
                if ($contentXml !== false) {
                    if ($contentXml->getName() !== 'WMS_Capabilities') {
                        $m = "Unknown GetCapabilities error";
                        if($contentXml->ServiceException !== null) {
                            $m = (string)$contentXml->ServiceException;
                        }
                        throw new Exception\ServerException($m, $new_request);
                    }
                } else {
                    throw new Exception\ServerException($content, $new_request);
                }
            }
            if ($response->getStatusCode() == 200) {
                $cache->set($cacheKey, $content);
            } else {
                throw new Exception\ServerException($content, $new_request);
            }
        }
    } else {
        //no caching request
        $response = $client->send($new_request, ['query' => $query_arr]);
        $contentType = $response->getHeaderLine('Content-Type');
        $contentLength = $response->getHeaderLine('Content-Length');
        $content = $response->getBody();
    }

    //get client headers
    $client_headers = apache_request_headers();

    //generate etag
    $new_etag = md5($content);

    //check if client send etag and compare it
    if (isset($client_headers['If-None-Match']) && strcmp($new_etag, $client_headers['If-None-Match']) == 0) {
        //return code 304 not modified without content
        header('HTTP/1.1 304 Not Modified');
        header("Cache-control: max-age=0");
        header("Etag: " . $new_etag);
    } else {
        //header("Content-Length: " . $contentLength);
        header("Content-Type: " . $contentType);
        header("Cache-control: max-age=0");
        header("Etag: " . $new_etag);

        echo $content;
    }

} catch (Exception\ServerException $e) {
    //if ($e->hasResponse()) {
    //    header('', true, $e->getResponse()->getStatusCode());
    //} else {
        header('Server Error', true, 500);
    //}
    echo $e->getMessage();

} catch (Exception\ClientException $e) {
    header('Unauthorized', true, 401);
    echo $e->getMessage();
}
