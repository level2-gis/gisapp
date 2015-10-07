<?php

use GisApp\Helpers;

require_once("admin/class.Helpers.php");

$server_os = php_uname('s');

session_start();

if(isset($_GET['lang'])) {
	$def_lang = strtolower($_GET['lang']);
	if ($def_lang=='sl' || $def_lang=='en' || $def_lang=='de') {
		//OK
	}
	else {
		$def_lang = "en";
	}
	
}
else
	$def_lang = "en";

if (!isset($_SESSION['lang']))  {
	$_SESSION['lang'] = $def_lang;
}

if (Helpers::isValidUserProj(Helpers::getMapFromUrl())) {

	//Setting some global variables
	$user = "".$_SESSION['user_name'];
	$project = "".$_SESSION['project'];
	$data = json_decode($_SESSION['data']);
	$settings = json_decode($_SESSION['settings']);
    $gis_projects = json_decode($_SESSION['gis_projects']);

    if(!property_exists($settings,"search")) {
        $settings->search = null;
    }
    if(!property_exists($settings,"layerSpecifics")) {
        $settings->layerSpecifics = null;
    }
    if(!property_exists($settings,"geoNames")) {
        $settings->geoNames = null;
    }

	//OK open application
	?>

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	<html>
	<head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
		<!--<title></title>-->
		<link rel="stylesheet" type="text/css" href="client/site/libs/ext/resources/css/ext-all-notheme.css"/>
		<link rel="stylesheet" type="text/css" href="client/site/libs/ext/resources/css/xtheme-blue.css"/>
		<link rel="stylesheet" type="text/css" href="client/site/libs/ext/ux/css/ux-all.css" />
		<link rel="stylesheet" type="text/css" href="client/site/css/TriStateTreeAndCheckbox.css" />
		<link rel="stylesheet" type="text/css" href="client/site/css/ThemeSwitcherDataView.css" />
		<link rel="stylesheet" type="text/css" href="client/site/css/popup.css" />
		<link rel="stylesheet" type="text/css" href="client/site/css/layerOrderTab.css" />
		<link rel="stylesheet" type="text/css" href="client/site/css/contextMenu.css" />
		
		<script type="text/javascript">
			
			//get project data from DB
			var projectData = {};
			
			//bind PHP --> JS

			GLOBAL_SERVER_OS = '<?php echo $server_os?>';

            projectData.user = '<?php echo $user?>';
			projectData.client_name = '<?php echo $data->client_name?>';
			projectData.client_display_name = '<?php echo $data->client_display_name?>';

			projectData.search = eval(<?php echo json_encode($settings->search)?>);
            projectData.layerSpecifics = eval(<?php echo json_encode($settings->layerSpecifics)?>);
            projectData.geoNames = eval(<?php echo json_encode($settings->geoNames)?>);
            projectData.gis_projects = eval(<?php echo json_encode($gis_projects)?>);
            projectData.project = '<?php echo $project?>';

            projectData.setBaseLayers = function () {
                var bl = eval(<?php echo json_encode($data->base_layers)?>);
                var baseLayers = [];

                if (bl != null) {
                    for (var k = 0; k < bl.length; k++) {
                        baseLayers.push(eval(bl[k]));
                    }
                }

                if (baseLayers.length > 0) enableBGMaps = true;

                return baseLayers;
            };

            projectData.extraLayers = function() {
                var el = eval(<?php echo json_encode($data->extra_layers)?>);
                var extraLayers = [];

                if(el != null) {
                    for (var k = 0; k < el.length; k++) {
                        extraLayers.push(eval(el[k]));
                    }
                }

                if (extraLayers.length > 0) enableExtraLayers = true;

                return extraLayers;
            };

            projectData.tablesOnStart = function () {
                var t = eval(<?php echo json_encode($data->tables_onstart)?>);
                var tablesOnStart = [];

                if (t != null) {
                    for (var k = 0; k < t.length; k++) {
                        tablesOnStart.push(t[k]);
                    }
                }
                return tablesOnStart;
            };

            projectData.overViewLayer = function() {
                return eval('<?php echo $data->overview_layer[0]?>');
            };

            //TODO use in css!
			var userLogoImg = projectData.gis_projects.path+'admin/resources/images/user_gray.png';

		</script>
	
		<script type="text/javascript" src="admin/languages/<?php echo $def_lang?>.js"></script>
	
		<script src="https://maps.googleapis.com/maps/api/js?v=3&sensor=true"></script>

		<script type="text/javascript" src="client/site/libs/ext/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="client/site/libs/ext/ext-all.js"></script>
		<script type="text/javascript" src="client/site/libs/ext/ux/ux-all.js"></script>
        <script type="text/javascript" src="admin/languages/locale/ext-lang-<?php echo $def_lang?>.js"></script>
        <script type="text/javascript" src="client/site/libs/proj4js/proj4js-compressed.js"></script>
		<script type="text/javascript" src="client/site/libs/openlayers/OpenLayers.js?v=2131"></script>

<!--        <script type="text/javascript" src="../libs/openlayers/lib/OpenLayers/Control/LayerSwitcher.js"></script>-->

        <script type="text/javascript" src="client/site/libs/geoext/script/GeoExt.js"></script>
		<script type="text/javascript" src="client/site/js/Translations.js"></script>
		<script type="text/javascript" src="client/site/js/PagingStore.js"></script>
		<script type="text/javascript" src="client/site/js/LoadAppProjectData.js"></script>
		<script type="text/javascript" src="client/site/js/Customizations.js"></script>
		<script type="text/javascript" src="client/site/js/GetUrlParams.js"></script>
		<script type="text/javascript" src="client/site/js/TriStateTree.js"></script>
		<script type="text/javascript" src="client/site/js/GUI.js"></script>
		<script type="text/javascript" src="client/site/js/QGISExtensions.js"></script>
        <script type="text/javascript" src="client/site/js/GeoNamesSearchCombo.js"></script>
		<script type="text/javascript" src="client/site/js/FeatureInfoDisplay.js"></script>
		<script type="text/javascript" src="client/site/js/LegendAndMetadataDisplay.js"></script>
        <script type="text/javascript" src="client/site/js/LayerActions.js"></script>
        <script type="text/javascript" src="client/site/js/WebgisInit.js"></script>
	<style type="text/css">
	#dpiDetection {
	  height: 1in;
	  left: -100%;
	  position: absolute;
	  top: -100%;
	  width: 1in;
	}

	#panel_header_title {
	  float: left;
	  font-size: 20px;
	}
	#panel_header_link {
	  float: left;
	}
	#panel_header_terms_of_use {
	  float: right;
	  font-weight: normal;
	}
	#panel_header_user {
	  float: right;
	  font-weight: bold;
	}
	</style>
	</head>
	<body>
	<!-- this empty div is used for dpi-detection - do not remove it -->
	<div id="dpiDetection"></div>
	</body>
	</html>
<?php
	
}
else {
	//no session, open login panel
	?>
	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
	<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
		<link rel="stylesheet" type="text/css" href="client/site/libs/ext/resources/css/ext-all.css"/>
		<link rel="stylesheet" type="text/css" href="admin/logindialog/css/overrides.css" />
        <link rel="stylesheet" type="text/css" href="admin/logindialog/css/flags.css" />
        <link rel="stylesheet" type="text/css" href="admin/logindialog/css/virtualkeyboard.css" />
   		
		<script type="text/javascript" src="client/site/libs/ext/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="client/site/libs/ext/ext-all.js"></script>
        
		<script type="text/javascript">
			//bind PHP --> JS
			GLOBAL_LANG = '<?php echo $def_lang?>';
			GLOBAL_SERVER_OS = '<?php echo $server_os?>';
		</script>
		
		<script type="text/javascript" src="admin/languages/<?php echo $def_lang?>.js?v=20150811"></script>
        <script type="text/javascript" src="admin/languages/_lang.js?v=20150819"></script>
		<script type="text/javascript" src="admin/logindialog/js/overrides.js"></script>

        <script type="text/javascript" src="admin/logindialog/js/virtualkeyboard.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/plugins/virtualkeyboard.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/Ext.ux.Crypto.SHA1.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/Ext.ux.form.IconCombo.js"></script>
		<script type="text/javascript" src="admin/logindialog/js/Ext.ux.form.LoginDialog.js?v=20150817"></script>
        <script type="text/javascript" src="admin/logindialog/js/login.js?v=20150819"></script>
				
		</head>
		<body></body>
	</html>
	<?php
}
?>

