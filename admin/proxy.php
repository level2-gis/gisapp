<?php

/**
 * proxy.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2018), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;

require '../vendor/autoload.php';
require_once("settings.php");

function doGetRequest($query_arr, $client, $http_ver, $url)
{
    $new_request = new Request('GET', $url);
    $content = null;
    $contentType = null;
    $cacheKey = null;
    $contentLength = 0;

    $response = $client->send($new_request, [
        'query' => $query_arr,
        'http_errors' => true,
        //request without SSL verification, read this http://docs.guzzlephp.org/en/latest/request-options.html#verify-option
        'verify' => false
    ]);
    $contentType = $response->getHeaderLine('Content-Type');
    $contentLength = $response->getHeaderLine('Content-Length');
    $content = $response->getBody()->__toString();

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

    //parameters
    $query_arr = filter_input_array(INPUT_GET, FILTER_UNSAFE_RAW);
    $request_method = $_SERVER['REQUEST_METHOD'];
    $http_ver = $_SERVER["SERVER_PROTOCOL"];

    //check param
    if (empty($query_arr["provider"])) {
        throw new Exception('Provider missing!');
    }

    switch ($query_arr["provider"]) {
        case "mapbox":
            if(!defined('MAPBOX_KEY')) {
                throw new Exception('Mapbox acces token misssing!');
            }
            $url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'.$query_arr["query"].'.json';
            $query_arr["access_token"] = MAPBOX_KEY;
            $query_arr["autocomplete"] = true;
            break;

        default:
            throw new Exception('Provider not supported!');
    }

    $client = new Client();
    if ($request_method == 'GET') {
        doGetRequest($query_arr, $client, $http_ver, $url);
    } else {
        throw new Exception('Operation not supported!');
    }
} catch (Exception $e) {
    //if ($e->hasResponse()) {
    //    header('', true, $e->getResponse()->getStatusCode());
    //} else {
    //header($http_ver . " 500 Server Error");
    header("Content-Type: text/html");
    //}
    echo $e->getMessage();
}