<?php

session_start();

//Setting some global variables
$user = "" . $_SESSION['user_name'];
$project = "" . $_SESSION['project'];

$data = json_decode($_SESSION['data']);
$settings = json_decode($_SESSION['settings']);
$gis_projects = json_decode($_SESSION['gis_projects']);
$qgs = json_decode($_SESSION['qgs']);
$lang = $_SESSION['lang'];

if (!property_exists($settings, "search")) {
    $settings->search = null;
}
if (!property_exists($settings, "layerSpecifics")) {
    $settings->layerSpecifics = null;
}
if (!property_exists($settings, "geoCode")) {
    $settings->geoCode = null;
}
if (!property_exists($settings, "locationServices")) {
    $settings->locationServices = null;
}

if (!property_exists($data, "client_url")) {
    $data->client_url = "";
}
if (file_exists($_SERVER["DOCUMENT_ROOT"] . $gis_projects->path . 'admin/resources/images/' . $data->client_name . '.png')) {
    $data->client_logo = $gis_projects->path . 'admin/resources/images/' . $data->client_name . '.png';
} else {
    $data->client_logo = $gis_projects->path . 'admin/resources/images/_temp.png';
}

Header("content-type: application/x-javascript");

?>

//get project data from DB
var projectData = {};

//bind PHP --> JS
projectData.user = '<?php echo $user ?>';
projectData.client_name = '<?php echo $data->client_name ?>';
projectData.client_display_name = '<?php echo $data->client_display_name ?>';
projectData.client_url = '<?php echo $data->client_url ?>';
projectData.client_logo = '<?php echo $data->client_logo ?>';
projectData.lang = '<?php echo $lang ?>';

projectData.search = eval(<?php echo json_encode($settings->search) ?>);
projectData.layerSpecifics = eval(<?php echo json_encode($settings->layerSpecifics) ?>);
projectData.geoCode = eval(<?php echo json_encode($settings->geoCode) ?>);
projectData.locationServices = eval(<?php echo json_encode($settings->locationServices) ?>);
projectData.gis_projects = eval(<?php echo json_encode($gis_projects) ?>);
projectData.project = '<?php echo $project ?>';
projectData.crs = '<?php echo $qgs->crs ?>';
projectData.proj4 = '<?php echo $qgs->proj4 ?>';
projectData.title = '<?php echo $qgs->title ?>';
projectData.extent = '<?php echo implode(',',$qgs->extent) ?>';
projectData.layers = eval(<?php echo json_encode($qgs->layers) ?>);
projectData.use_ids = <?php echo json_encode($qgs->use_ids) ?>;

projectData.baseLayers = function () {
    var bl = eval(<?php echo json_encode($data->base_layers) ?>);
    return bl;
};

projectData.extraLayers = function () {
    var el = eval(<?php echo json_encode($data->extra_layers) ?>);
    return el;
};

projectData.tablesOnStart = function () {
    var t = eval(<?php echo json_encode($data->tables_onstart) ?>);
    var tablesOnStart = [];

    if (t != null) {
        for (var k = 0; k < t.length; k++) {
            tablesOnStart.push(t[k]);
        }
    }
    return tablesOnStart;
};

projectData.overViewLayer = function () {
    var ol = eval(<?php echo json_encode($data->overview_layer) ?>);
    if (ol !== null && ol.constructor === Array) {
        return ol[0];
    }
    else {
        return ol;
    }
};

//TODO use in css!
var userLogoImg = projectData.gis_projects.path + 'admin/resources/images/user_gray.png';