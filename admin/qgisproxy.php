<?php

use GuzzleHttp\Client;
use GuzzleHttp\Exception;
use GuzzleHttp\Psr7\Request;
use GisApp\Helpers;

require '../vendor/autoload.php';
require_once("class.Helpers.php");
require_once("settings.php");

//parameters
//$query = $_SERVER['QUERY_STRING'];
//$query_arr = array();
//parse_str($query,$query_arr);

$query_arr = filter_input_array(INPUT_GET,FILTER_SANITIZE_STRING);

//we have to extend map parameter with path to projects, but first store it into own variable and remove .qgs
$map = "";
if(strpos($query_arr["map"],".") === false) {
    $map = $query_arr["map"];
}
else {
    $map = explode(".",$query_arr["map"])[0];
}
$query_arr["map"] = PROJECT_PATH . $query_arr["map"];

$client = new Client();

/**
 * @param $client
 * @param $request
 * @param $query_arr
 * @return mixed
 */
function QgisServerRequest($client, $request, $query_arr)
{
    $response = $client->send($request, ['query' => $query_arr]);
    //$code = $response->getStatusCode();
    //$reason = $response->getReasonPhrase();

    return $response;
}

try {

    $new_request = new Request('GET', QGISSERVERURL);

    //session check
    session_start();

    if (!(isset($_SESSION['user_is_logged_in']))) {
        throw new Exception\ClientException("Session time out or unathorized access!",$new_request);
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
            $cacheKey = $map.$sep."XML".$sep.$query_arr["REQUEST"];
            $contentType = "text/xml";
            break;
        case "GetLegendGraphics":
            $cacheKey = $map. $sep."PNG".$sep .$query_arr["REQUEST"].$sep. Helpers::normalize($query_arr['LAYERS']);
            $contentType = "image/png";
            break;
        case "GetFeatureInfo":
            //only caching large responses (whole tables)
            $count = $query_arr['FEATURE_COUNT'];
            if(is_numeric($count)) {
                if(intval($count)>100) {
                    $cacheKey= $map. $sep."XML".$sep .$query_arr["REQUEST"].$sep. Helpers::normalize($query_arr['FILTER']);
                }
            }
            break;
    }

    if($cacheKey!=null)
    {
        $content = $cache->get($cacheKey);


        if($content==null){
            $response = QgisServerRequest($client, $new_request, $query_arr);
            $contentType = $response->getHeaderLine('Content-Type');
            $contentLength = $response->getHeaderLine('Content-Length');
            $content = $response->getBody()->__toString();

            if($response->getStatusCode() == 200) {
                $cache->set($cacheKey, $content);
            }
            else {
                throw new Exception\ClientException($content,$new_request);
            }
        }
    }
    else {
        //no caching request
        $response = QgisServerRequest($client, $new_request, $query_arr);
        $contentType = $response->getHeaderLine('Content-Type');
        $contentLength = $response->getHeaderLine('Content-Length');
        $content = $response->getBody();
    }

    //get client headers
    $client_headers = apache_request_headers();

    //generate etag
    $new_etag = md5($content);

    //check if client send etag and compare it
    if (isset($client_headers['If-None-Match']) and strcmp($new_etag, $client_headers['If-None-Match'])==0) {
        //return code 304 not modified without content
        header('HTTP/1.1 304 Not Modified');
        header("Cache-control: max-age=0");
        header("Etag: ".$new_etag);
        exit();
    }
    else {
        //header("Content-Length: " . $contentLength);
        header("Content-Type: " . $contentType);
        header("Cache-control: max-age=0");
        header("Etag: ".$new_etag);

        echo $content;
    }

} catch (Exception\RequestException $e) {
    if($e->hasResponse()) {
        header('', true, $e->getResponse()->getStatusCode());
    }
    else {
        header('Unauthorized', true, 401);
    }
    echo $e->getMessage();
}