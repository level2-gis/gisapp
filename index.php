<?php

use GisApp\Helpers;
use GisApp\Login;

require 'vendor/autoload.php';
require_once("admin/class.Helpers.php");
require_once("admin/class.Login.php");
require_once("admin/settings.php");

function goMobile($lang, $scanner) {
 ?><!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <!--        <title>Mobile Viewer</title>-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
        <!--<link rel="apple-touch-icon" href="client_mobile/img/app_icon.png"/>-->

        <script type="text/javascript" src="client_common/load.php"></script>

        <!-- jQuery -->
        <script src="client_mobile/lib/jquery/jquery-1.9.1.min.js"></script>

        <!-- jQuery UI for reorder layers -->
        <script src="client_mobile/lib/jquery/jquery-ui-1.9.2.custom.min.js"></script>
        <!-- Download jQuery UI Touch Punch Plugin from http://touchpunch.furf.com -->
        <!-- is used for sortable Lists like the one for Reorder layers -->
        <script src="client_mobile/lib/jquery/jquery.ui.touch-punch.min.js"></script>

        <!-- jQuery Mobile -->
        <script src="client_mobile/lib/jquery/jquery.mobile-1.3.2.min.js"></script>
        <script src="client_mobile/src/jquery.mobile.collapsible.groupcheckbox.js"></script>
        <link rel="stylesheet" href="client_mobile/lib/jquery/jquery.mobile-1.3.2.min.css" />
        <link rel="stylesheet" href="client_mobile/lib/jquery/jquery-mobile-red-buttons.css" />

        <!-- Proj4js -->
        <script type="text/javascript" src="client_mobile/lib/proj4js/proj4.js"></script>
        <script type="text/javascript">
            Proj4js = {defs: {}};
        </script>

        <?php
        if($scanner) {
            echo '<script src="plugins/editing_code_scanner/libs/instascan.min.js?v=1.0.0"></script>';
        }
        ?>

        <!-- OpenLayers 3 -->
        <script src="client_mobile/lib/ol3/ol.js?v=4.6.5a"></script>
        <!--        <script src="client_mobile/lib/ol3/ol-debug.js?v=4.6.5a"></script>-->
        <link rel="stylesheet" href="client_mobile/lib/ol3/ol.css?v=4.6.5"/>

        <script type="text/javascript" src="client_mobile/eqwc_mobile_load.php"></script>

        <!--                DEBUG remove editor.js before-->
        <!--        <script type="text/javascript" src="plugins/editing/editor_mobile_debug.js"></script>-->

        <link rel="stylesheet" type="text/css" href="client_mobile/src/viewer.css?v=20210824"/>
        <link rel="stylesheet" type="text/css" href="client_mobile/src/custom.css?v=20181026"/>
    </head>
    <body>
    <div data-role="page" id="mappage" data-theme="c">

        <div data-role="content">
            <div id="map">
                <a href="#" style="display:none" id="btnCompass" data-role="button" data-inline="true"
                   data-icon="compass" data-iconpos="notext" class="mapicon"></a>
                <a href="#" id="btnLocation" data-role="button" data-inline="true" data-icon="location_off"
                   data-iconpos="notext" class="mapicon"></a>
                <a href="#panelSearch" id="btnSearching" data-role="button" data-inline="true" data-icon="searching"
                   data-iconpos="notext" class="mapicon"></a>
                <a href="#panelLayer" id="btnLayers" data-role="button" data-inline="true" data-icon="layers" data-iconpos="notext" class="mapicon"></a>
                <a href="#panelProperties" id="btnProperties" data-role="button" data-inline="true" data-icon="properties" data-iconpos="notext" class="mapicon"></a>
                <a href="#" id="btnInfo" data-role="button" data-icon="loc_info" data-iconpos="notext" class="mapicon"></a>
                <a href="#" style="display:none" id="btnAlert" data-role="button" data-icon="alert2" data-iconpos="notext" class="mapicon"></a>
                <a href="#" style="display:none" id="btnAdd" data-role="button" data-icon="add" data-iconpos="notext" data-rel="dialog" class="ui-disabled mapicon"></a>
                <a href="#" style="display:none" id="btnRemove" data-role="button" data-icon="remove" data-iconpos="notext" data-rel="dialog" class="mapicon"></a>
                <a href="#" style="display:none" id="btnRecord" data-role="button" data-icon="record" data-iconpos="notext" data-rel="dialog" class="mapicon"></a>
                <a href="#" style="display:none" id="btnRecordStop" data-role="button" data-icon="record_stop" data-iconpos="notext" data-rel="dialog" class="mapicon"></a>
                <a href="#" style="display:none" id="btnEnd" data-role="button" data-icon="save" data-iconpos="notext" data-rel="dialog" class="mapicon"></a>
                <a href="#" style="display:none" id="btnGotoPage" data-role="button" data-icon="goto_more" data-iconpos="notext" data-rel="dialog" data-theme="e" class="mapicon"></a>
                <a href="#" style="display:none" id="btnGotoStop" data-role="button" data-icon="goto_stop" data-iconpos="notext" data-rel="dialog" data-theme="e" class="mapicon"></a>
            </div>
            <div id="locationPanel" class="ui-popup-container">LocationPanel</div>
            <div id="gotoPanel" class="ui-popup-container">GotoPanel</div>
            <div id="editPanel" class="ui-popup-container">EditPanel</div>
            <div id="recordPanel" class="ui-popup-container">RecordPanel</div>
        </div>

        <div data-role="panel" id="panelProperties" data-position="right" data-display="overlay">
            <div class="panel-content">
                <div data-role="navbar">
                    <ul>
                        <li><a id="buttonPropertiesMap" href="#panelPropertiesMap">Map</a></li>
                        <li><a id="buttonPropertiesEditor" style="display:none" href="#panelPropertiesEditor">Editor</a></li>
                    </ul>
                </div>
                <div id="panelPropertiesMap" class="scrollable">
                    <div id="properties">
                        <div data-role="fieldcontain">
                            <label for="switchOrientation">Kartenausrichtung</label>
                            <select id="switchOrientation" name="switchOrientation" data-role="slider" disabled="disabled">
                                <option value="off">Aus</option>
                                <option value="on">Ein</option>
                            </select>
                        </div>
                        <div data-role="fieldcontain">
                            <label for="switchScale">Massstabsbalken</label>
                            <select id="switchScale" name="switchScale" data-role="slider">
                                <option value="off">Aus</option>
                                <option value="on">Ein</option>
                            </select>
                        </div>
                        <div>
                            <select name="mapCrs" id="mapCrs" data-mini="false"></select>
                        </div>
                    </div>
                </div>
                <div id="panelPropertiesEditor" class="scrollable"></div>
            </div>
            <a href="#mappage" class="backbutton" data-rel="close" data-role="button" data_mini="true"
               data-iconpos="notext" data-icon="arrow-l" data-inline="true">Back</a>
        </div>

        <div data-role="panel" id="panelLayer" data-position="right" data-display="overlay">
            <div class="panel-content">
                <div data-role="navbar">
                    <ul>
                        <li><a id="buttonLayerAll" href="#panelLayerAll">Ebenen1</a></li>
                        <li><a id="buttonLayerOrder" href="#panelLayerOrder">Reihenfolge1</a></li>
                        <li><a id="buttonTopics" href="#panelTopics">Project</a></li>
                    </ul>
                </div>
                <div id="panelTopics" class="scrollable">
                    <div id="topicMain"></div>
                    <div>
                        <a href="#" id="buttonSignOut" data-role="button" data-inline="true">Logout</a>
                    </div>
                </div>
                <div id="panelLayerAll" class="scrollable"></div>
                <div id="panelLayerOrder" class="scrollable">
                    <div data-role="controlgroup">
                        <ul id="listOrder" data-role="listview" data-inset="true"></ul>
                    </div>
                    <label for="sliderTransparency">Transparenz</label>
                    <input type="range" name="sliderTransparency" id="sliderTransparency" value="0" min="0" max="100"
                           data-highlight="true">
                </div>
            </div>
            <a href="#mappage" class="backbutton" data-rel="close" data-role="button" data_mini="true"
               data-iconpos="notext" data-icon="arrow-l" data-inline="true">Back</a>
        </div>

        <div data-role="panel" id="panelFeatureInfo" data-position="right" data-display="overlay">
            <div class="panel-content">
                <b>Informationen</b>
                <div id="featureInfoResults" class="scrollable"></div>
            </div>
            <a href="#mappage" class="backbutton" data-rel="close" data-role="button" data_mini="true"
               data-iconpos="notext" data-icon="arrow-l" data-inline="true">Back</a>
        </div>

        <div data-role="panel" id="panelSearch" data-position="right" data-display="overlay">
            <div class="panel-content">
                <b>Adresssuche</b>
                <form id="searchForm" action=".">
                    <input id="searchInput" type="search" name="search" value="">
                </form>
                <div id="searchResults" hidden>
                    <b>Suchresultat</b>
                    <ul id="searchResultsList" data-role="listview" class="scrollable"></ul>
                </div>
            </div>
            <a href="#mappage" class="backbutton" data-rel="close" data-role="button" data_mini="true"
               data-iconpos="notext" data-icon="arrow-l" data-inline="true">Back</a>
        </div>

    </div>

    </body>
</html>


<?php
}

$server_os = php_uname('s');
$def_lang = strtolower(filter_input(INPUT_GET, 'lang', FILTER_SANITIZE_STRING));
$mobile = strtolower(filter_input(INPUT_GET, 'mobile', FILTER_SANITIZE_STRING));
$public = strtolower(filter_input(INPUT_GET, 'public', FILTER_SANITIZE_STRING));

$helpers = new Helpers();

//for embedding gisapp into iframe
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');
session_start();

$client_path = $helpers->getClientPath();
$has_portal = $helpers->hasPortal();

if ($def_lang > '') {
    $lang_fn = $client_path . 'admin/languages/' . $def_lang . '.js';
    if (!(file_exists($lang_fn))) {
        $def_lang = defined('DEFAULT_LANG') ? DEFAULT_LANG : 'en';
    }
}
else {
    if (isset($_SESSION['lang'])){
        $def_lang = $_SESSION['lang'];
    }
    else {
        $def_lang = defined('DEFAULT_LANG') ? DEFAULT_LANG : 'en';
    }
}

$_SESSION['lang'] = $def_lang;
$_SESSION['client_path'] = $client_path;

$detect = new Mobile_Detect;

if($detect->isMobile()){
    $mobile='on';
}

$login_check = new Login();

if ($login_check->setUserProj($helpers->getMapFromUrl())) {

    $edit = $helpers->checkModulexist("editing") && $helpers->hasPluginAccess("editing");
    $scanner = FALSE;
    $editVer = 0;
    if($edit) {
        $editVer = $helpers->getPluginVersion("editing");
        $scanner = $helpers->checkModulexist("editing_code_scanner");
    }
    $google = $helpers->loadGoogle();

	//OK open application
    if($mobile=='on') {
        goMobile($def_lang, $scanner);
    }
    else {
            ?><!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'>
    <meta name="apple-mobile-web-app-capable" content="yes">

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <title></title>
    <link rel="stylesheet" type="text/css" href="client/site/libs/ext/resources/css/ext-all-notheme.css"/>
    <link rel="stylesheet" type="text/css" href="client/site/libs/ext/resources/css/xtheme-gray.css"/>
    <link rel="stylesheet" type="text/css" href="client/site/libs/ext/ux/css/ux-all.css?v=20180219"/>
    <link rel="stylesheet" type="text/css" href="client/site/css/TriStateTreeAndCheckbox.css?v=20211109"/>
    <link rel="stylesheet" type="text/css" href="client/site/css/ThemeSwitcherDataView.css"/>
    <link rel="stylesheet" type="text/css" href="client/site/css/popup.css?v=20200228"/>
    <link rel="stylesheet" type="text/css" href="client/site/css/layerOrderTab.css?v=20200405"/>
    <link rel="stylesheet" type="text/css" href="client/site/css/contextMenu.css?v=20191222"/>
    <link rel="stylesheet" type="text/css" href="client/site/css/style-gray.css?v=20220930"/>

    <?php if ($edit) {
                    echo '<link rel="stylesheet" type="text/css" href="plugins/editing/theme/geosilk/geosilk.css?v='.$editVer.'"/>';
                }?>

                <script type="text/javascript" src="client_common/load.php"></script>

                <?php if ($google) {
                    $key = (defined('GOOGLE_MAPS_KEY') && GOOGLE_MAPS_KEY != 'your_key') ? '&key='.GOOGLE_MAPS_KEY : null;
                    echo '<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3'.$key.'"></script>';
                }?>

                <script type="text/javascript" src="client/site/libs/ext/adapter/ext/ext-base.js"></script>
                <script type="text/javascript" src="client/site/libs/ext/ext-all.js"></script>
                <script type="text/javascript" src="client/site/libs/ext/ux/ux-all.js?v=20180215"></script>

                <script type="text/javascript" src="client/site/libs/proj4js/proj4js-1.1.0-compressed.js"></script>
                <script type="text/javascript" src="client/site/libs/openlayers/OpenLayers.js?v=20210307"></script>

                <!--                FOR DEBUGGING-->
    <!--                <script type="text/javascript" src="client/site/libs/openlayers/OpenLayers_debug.js"></script>-->
    <!--                <script type="text/javascript" src="../ol2/lib/OpenLayers/Control/LayerSwitcher.js"></script>-->


    <script type="text/javascript" src="client/site/libs/geoext/script/GeoExt.js?v=20160303"></script>
    <!--                DEBUG-->
    <!--                <script type="text/javascript" src="../geoext/lib/GeoExt.js"></script>-->

    <script type="text/javascript" src="client/eqwc_load.php"></script>

<!--                DEBUG remove editor.js before-->
<!--                <script type="text/javascript" src="plugins/editing/editor_debug.js"></script>-->

</head>
<body>
<!-- this empty div is used for dpi-detection - do not remove it -->
<div id="dpiDetection"></div>
</body>
</html>
<?php
        }
}

else {
	//no session, open login panel or go to portal login page
    //for public=on continue with old way
    if($has_portal && empty($login_check->feedback) && $public != 'on') {
        $ref = filter_input(INPUT_SERVER,'REQUEST_URI',FILTER_SANITIZE_STRING);
        header("Location: /login?ru=" . $ref);
    } else
    {
        ?>
	<!DOCTYPE html>
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
			GLOBAL_LANG = '<?php echo $def_lang ?>';
		</script>
		
        <script type="text/javascript" src="admin/languages/<?php echo $def_lang ?>.js?v=1.1.3"></script>
        <script type="text/javascript" src="admin/languages/_lang.js?v=20150819"></script>
		<script type="text/javascript" src="admin/logindialog/js/overrides.js"></script>

        <script type="text/javascript" src="admin/logindialog/js/virtualkeyboard.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/plugins/virtualkeyboard.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/Ext.ux.Crypto.SHA1.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/Ext.ux.form.IconCombo.js"></script>
		<script type="text/javascript" src="admin/logindialog/js/Ext.ux.form.LoginDialog.js?v=20200128"></script>
		<script type="text/javascript" src="client_common/settings.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/login.js?v=20170313"></script>
				
		</head>
		<body></body>
	</html>
	<?php
    }
}
?>

