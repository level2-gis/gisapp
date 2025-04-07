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
    $response = $client->send($new_request, [
        'query' => $query_arr,
        'http_errors' => true,
        'verify' => false
    ]);
    $contentType = $response->getHeaderLine('Content-Type');
    $content = $response->getBody()->__toString();

    // generate etag and check client headers
    $client_headers = apache_request_headers();
    $new_etag = md5($content);
    if (isset($client_headers['If-None-Match']) && strcmp($new_etag, $client_headers['If-None-Match']) == 0) {
        header($http_ver . " 304 Not Modified");
        header("Cache-control: max-age=0");
        header("Etag: " . $new_etag);
    } else {
        header("Content-Type: " . $contentType);
        header("Cache-control: max-age=0");
        header("Etag: " . $new_etag);
        echo $content;
    }
}

try {
    // Sanitize and validate GET parameters
    $query_arr = filter_input_array(INPUT_GET, [
        'provider'  => FILTER_SANITIZE_STRING,
        'query'     => FILTER_SANITIZE_STRING,
        'country'   => FILTER_SANITIZE_STRING,
        'limit'     => FILTER_VALIDATE_INT,
        'types'     => FILTER_SANITIZE_STRING,
        'language'  => FILTER_SANITIZE_STRING,
        'proximity' => FILTER_SANITIZE_STRING,
    ]);

    // Validate country parameter further if necessary (e.g., only letters and commas)
    if (isset($query_arr['country']) && !preg_match('/^[a-zA-Z,]+$/', $query_arr['country'])) {
        unset($query_arr['country']); // or handle it as needed
    }

    $request_method = $_SERVER['REQUEST_METHOD'];
    $http_ver = $_SERVER["SERVER_PROTOCOL"];

    if (empty($query_arr["provider"])) {
        throw new Exception('Provider missing!');
    }

    switch ($query_arr["provider"]) {
        case "mapbox":
            if (!defined('MAPBOX_KEY')) {
                throw new Exception('Mapbox access token missing!');
            }
            $url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' . urlencode($query_arr["query"]) . '.json';
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
    header("Content-Type: text/html");
    echo $e->getMessage();
}