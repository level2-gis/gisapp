<?php

session_start();

//Setting some global variables
$user = "" . $_SESSION['user_name'];
$project = "" . $_SESSION['project'];
$upload = "" . $_SESSION['upload_dir'];

$data = json_decode($_SESSION['data']);
$settings = json_decode($_SESSION['settings']);
$description = $_SESSION['description'];
$gis_projects = json_decode($_SESSION['gis_projects']);
$qgs = json_decode($_SESSION['qgs']);
$lang = $_SESSION['lang'];
$client_path = $_SESSION['client_path'];

if (!property_exists($settings, "search")) {
    $settings->search = null;
}
if (!property_exists($settings, "layerSpecifics")) {
    $settings->layerSpecifics = null;
}
if (!property_exists($settings, "geoCode")) {
    $settings->geoCode = null;
}
if (!property_exists($settings, "wsgi")) {
    $settings->wsgi = null;
}
if (!property_exists($settings, "relations")) {
    $settings->relations = null;
}
if (!property_exists($settings, "locationServices")) {
    $settings->locationServices = null;
}
if (!property_exists($settings, "defaultCoordinatesCrsCode")) {
    $settings->defaultCoordinatesCrsCode = null;
}
if (!property_exists($settings, "editor")) {
    $settings->editor = null;
}
if (!property_exists($data, "project_id")) {
    $data->project_id = 0;
}

if (!property_exists($data, "client_url")) {
    $data->client_url = "";
}

if (!property_exists($data, "custom1")) {
    $data->custom1 = "";
}

if (!property_exists($data, "custom2")) {
    $data->custom2 = "";
}

if (file_exists($client_path . 'admin/resources/images/' . $data->client_name . '.png')) {
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
projectData.client_id = '<?php echo $data->client_id ?>';
projectData.client_name = '<?php echo $data->client_name ?>';
projectData.client_display_name = '<?php echo $data->client_display_name ?>';
projectData.client_url = '<?php echo $data->client_url ?>';
projectData.client_logo = '<?php echo $data->client_logo ?>';
projectData.custom1 = '<?php echo $data->custom1 ?>';
projectData.custom2 = '<?php echo $data->custom2 ?>';
projectData.lang = '<?php echo $lang ?>';

projectData.search = eval(<?php echo json_encode($settings->search) ?>);
projectData.layerSpecifics = eval(<?php echo json_encode($settings->layerSpecifics) ?>);
projectData.geoCode = eval(<?php echo json_encode($settings->geoCode) ?>);
projectData.wsgi = eval(<?php echo json_encode($settings->wsgi) ?>);
projectData.relations = eval(<?php echo json_encode($settings->relations) ?>);
projectData.locationServices = eval(<?php echo json_encode($settings->locationServices) ?>);
projectData.defaultCoordinatesCrsCode = eval(<?php echo json_encode($settings->defaultCoordinatesCrsCode) ?>);
projectData.editor = eval(<?php echo json_encode($settings->editor) ?>);

projectData.geolocation = <?php echo json_encode($data->geolocation) ?>;
projectData.userFeedback = <?php echo json_encode($data->feedback) ?>;
projectData.userFeedbackMailto = <?php echo json_encode($data->feedback_email) ?>;
projectData.measurements = <?php echo json_encode($data->measurements) ?>;
projectData.restrictToStartExtent = <?php echo json_encode($data->restrict_to_start_extent) ?>;
projectData.print = <?php echo json_encode($data->print) ?>;
projectData.zoom_back_forward = <?php echo json_encode($data->zoom_back_forward) ?>;
projectData.identify_mode = <?php echo json_encode($data->identify_mode) ?>;
projectData.permalink = <?php echo json_encode($data->permalink) ?>;

projectData.gis_projects = eval(<?php echo json_encode($gis_projects) ?>);
projectData.project = '<?php echo $project ?>';
projectData.id = <?php echo $data->project_id ?>;
projectData.description = <?php echo json_encode($description) ?>;
projectData.crs = '<?php echo $qgs->crs ?>';
projectData.crs_description = '<?php echo $qgs->crs_description ?>';
projectData.crs_list = eval(<?php echo json_encode($qgs->crs_list) ?>);
projectData.proj4 = '<?php echo $qgs->proj4 ?>';
projectData.title = '<?php echo $data->project_display_name ?>';
projectData.extent = '<?php echo implode(',',$qgs->extent) ?>';
projectData.layers = eval(<?php echo json_encode($qgs->layers) ?>);
projectData.use_ids = <?php echo json_encode($qgs->use_ids) ?>;
projectData.add_geom = <?php echo json_encode($qgs->add_geom_to_fi) ?>;

projectData.uploadDir = '<?php echo $upload ?>'+projectData.client_name+'/'+projectData.project+'/';

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

//put crs into crs_list if it doesn't exist
if(projectData.crs_list.indexOf(projectData.crs) == -1)
{
    projectData.crs_list.unshift(projectData.crs);
}


//TODO use in css!
var userLogoImg = projectData.gis_projects.path + 'admin/resources/images/user_gray.png';