<?php

use GuzzleHttp\Client;
use GuzzleHttp\Exception;
use GuzzleHttp\Psr7\Request;

require '../vendor/autoload.php';
require_once("settings.php");

//parameters
$query = $_SERVER['QUERY_STRING'];
$query_arr = array();
parse_str($query,$query_arr);

//we have to extend map parameter with path to projects
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

    $request = new Request('GET', QGISSERVERURL);

    //session check
    session_start();

    if (!(isset($_SESSION['user_is_logged_in']))) {
        throw new Exception\ClientException("Session time out or unathorized access!",$request);
    }

    //caching certain requests
    $cache = phpFastCache("files");
    $content = null;
    $contentType = null;
    $cacheKey = null;
    $contentLength = 0;
    switch ($query_arr["REQUEST"]) {
        case "GetProjectSettings":
            $cacheKey = $query_arr["REQUEST"].".".$_SESSION['project'];
            $contentType = "text/xml";
            break;
        case "GetLegendGraphics":
            $cacheKey = $query_arr["REQUEST"].".".$_SESSION['project']. "." . $_REQUEST['LAYERS'];
            $contentType = "image/png";
            break;
        case "GetFeatureInfo":
            //only caching large responses (whole tables)
            $count = $query_arr['FEATURE_COUNT'];
            if(is_numeric($count)) {
                if(intval($count)>100) {
                    $cacheKey=$query_arr["REQUEST"].".".$_SESSION['project']. "." . $_REQUEST['FILTER'];
                }
            }
            break;
    }

    if($cacheKey!=null)
    {
        $content = $cache->get($cacheKey);


        if($content==null){
            $response = QgisServerRequest($client, $request, $query_arr);
            $contentType = $response->getHeaderLine('Content-Type');
            $contentLength = $response->getHeaderLine('Content-Length');
            $content = $response->getBody()->__toString();

            $cache->set($cacheKey,$content);
        }
    }
    else {
        //no caching request
        $response = QgisServerRequest($client, $request, $query_arr);
        $contentType = $response->getHeaderLine('Content-Type');
        $contentLength = $response->getHeaderLine('Content-Length');
        $content = $response->getBody();
    }

    //header("Content-Length: " . $contentLength);
    header("Content-Type: " . $contentType);

    echo $content;

} catch (Exception\RequestException $e) {
    if($e->hasResponse()) {
        header('', true, $e->getResponse()->getStatusCode());
    }
    else {
        header('Unauthorized', true, 401);
    }
    echo $e->getMessage();
}