<?php

/**
 * geoportal_feed_proxy.php -- RSS feed proxy for GEO-PORTAL support plugin
 *
 * Copyright (2025), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header("HTTP/1.1 405 Method Not Allowed");
    exit;
}

// Check if GuzzleHttp is available
if (!file_exists('../../../vendor/autoload.php')) {
    header("HTTP/1.1 500 Internal Server Error");
    header("Content-Type: text/plain");
    echo "Error: Composer dependencies not found";
    exit;
}

require '../../../vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

// Set headers for AJAX requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/xml; charset=utf-8');

try {
    $client = new Client();
    $response = $client->get('https://site.geo-portal.si/feed.xml', [
        'verify' => false,
        'timeout' => 30,
        'headers' => [
            'User-Agent' => 'EQWC-GeoPortal-Plugin/1.0'
        ]
    ]);
    
    $content = $response->getBody()->__toString();
    
    // Validate that we got XML content
    if (empty($content) || strpos($content, '<?xml') === false) {
        throw new Exception('Invalid XML response');
    }
    
    // Set cache headers
    $etag = md5($content);
    $client_headers = function_exists('apache_request_headers') ? apache_request_headers() : array();
    
    if (isset($client_headers['If-None-Match']) && strcmp($etag, $client_headers['If-None-Match']) == 0) {
        header($_SERVER["SERVER_PROTOCOL"] . " 304 Not Modified");
        header("Cache-control: max-age=3600"); // 60 minutes cache
        header("Etag: " . $etag);
    } else {
        header("Cache-control: max-age=3600"); // 60 minutes cache
        header("Etag: " . $etag);
        echo $content;
    }

} catch (RequestException $e) {
    header("HTTP/1.1 502 Bad Gateway");
    header("Content-Type: text/plain");
    echo "Error connecting to RSS feed: " . $e->getMessage();
} catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    header("Content-Type: text/plain");
    echo "Error fetching RSS feed: " . $e->getMessage();
}

?>
