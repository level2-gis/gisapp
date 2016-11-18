<?php

use GisApp\Helpers;

require_once("admin/class.Helpers.php");
require_once("admin/settings.php");
require 'vendor/autoload.php';


function goMobile($lang) {
 ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <!--        <title>Mobile Viewer</title>-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>

        <link rel="apple-touch-icon" href="client_mobile/img/app_icon.png"/>
        <link rel="icon" href="favicon.ico" />

        <script type="text/javascript" src="load.php"></script>

        <!-- jQuery -->
        <script src="client_mobile/lib/jquery/jquery-1.9.1.min.js"></script>

        <!-- jQuery UI for reorder layers -->
        <script src="client_mobile/lib/jquery/jquery-ui-1.9.2.custom.min.js"></script>
        <!-- Download jQuery UI Touch Punch Plugin from http://touchpunch.furf.com -->
        <!-- is used for sortable Lists like the one for Reorder layers -->
        <script src="client_mobile/lib/jquery/jquery.ui.touch-punch.min.js"></script>

        <!-- jQuery Mobile -->
        <script src="client_mobile/lib/jquery/jquery.mobile-1.3.1.min.js"></script>
        <script src="client_mobile/src/jquery.mobile.collapsible.groupcheckbox.js"></script>
        <link rel="stylesheet" href="client_mobile/lib/jquery/jquery.mobile-1.3.1.min.css" />

        <!-- Proj4js -->
        <script type="text/javascript" src="client/site/libs/proj4js/proj4js-compressed.js"></script>

        <!-- OpenLayers 3 -->
        <script src="client_mobile/lib/ol3/ol.js?v=3.19.1"></script>
        <link rel="stylesheet" href="client_mobile/lib/ol3/ol.css" />

        <script type="text/javascript" src="admin/languages/<?php echo $lang ?>.js?v=1.1.3"></script>

        <script src="client_mobile/src/url_params.js"></script>
        <script src="client_mobile/src/permalink.js"></script>
        <script src="client_mobile/src/login.js"></script>
        <script src="client_mobile/src/search.js"></script>
        <script src="client_mobile/src/geocode.js"></script>

        <!-- NOTE: remove unused classes -->
<!--        <script src="client_mobile/src/mapfish_permalink.js"></script>-->
        <script src="client_mobile/src/qgis_permalink.js"></script>
<!--        <script src="client_mobile/src/mapfish_login.js"></script>-->
<!--        <script src="client_mobile/src/mapfish_search.js"></script>-->
<!--        <script src="client_mobile/src/swiss_search.js"></script>-->
<!--        <script src="client_mobile/src/wsgi_search.js"></script>-->

        <script src="client_mobile/src/config.js"></script>
        <script src="client_mobile/src/map.js"></script>
        <script src="client_mobile/src/map_click_handler.js"></script>
        <script src="client_mobile/src/feature_info.js"></script>
        <script src="client_mobile/src/topics.js"></script>
        <script src="client_mobile/src/layers.js"></script>
        <script src="client_mobile/src/gui.js"></script>
<!--        <script src="client_mobile/src/high_resolution_printing.js"></script>-->
        <link rel="stylesheet" type="text/css" href="client_mobile/src/viewer.css" />
        <link rel="stylesheet" type="text/css" href="client_mobile/src/custom.css" />
    </head>
    <body>
    <div data-role="page" id="mappage" data-theme="c">

        <div data-role="content">
            <div id="map">
                <a href="#" id="btnCompass" data-role="button" data-inline="true" data-icon="compass" data-iconpos="notext"></a>
                <a href="#" id="btnLocation" data-role="button" data-inline="true" data-icon="location_off" data-iconpos="notext"></a>
                <a href="#panelSearch" id="btnSearching" data-role="button" data-inline="true" data-icon="searching" data-iconpos="notext"></a>
                <a href="#panelLayer" id="btnLayers" data-role="button" data-inline="true" data-icon="layers" data-iconpos="notext"></a>
                <a href="#panelProperties" id="btnProperties" data-role="button" data-inline="true" data-icon="properties" data-iconpos="notext"></a>
            </div>
        </div>

        <div data-role="panel" id="panelProperties" data-position="right" data-display="overlay">
            <div class="panel-content">
                <b>Einstellungen</b>
                <div id="properties" class="scrollable">
                    <div data-role="fieldcontain">
                        <label for="switchFollow">Kartennachf&uuml;hrung</label>
                        <select id="switchFollow" name="switchFollow" data-role="slider">
                            <option value="off">Aus</option>
                            <option value="on">Ein</option>
                        </select>
                    </div>
                    <div data-role="fieldcontain">
                        <label for="switchOrientation">Kartenausrichtung</label>
                        <select id="switchOrientation" name="switchOrientation" data-role="slider">
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
<!--                    <a href="#dlgAbout" id="buttonLogo" class="btn-icon-text" data-rel="popup" data-position-to="window" data-role="button" data-inline="true" data-icon="logo">Impressum</a>-->

                    <div data-role="popup" id="dlgAbout" class="ui-corner-all" data-theme="c" data-overlay-theme="a">
                        <div data-role="header" data-theme="c" class="ui-corner-top">
                            <h1>Impressum</h1>
                        </div>
                        <div id="aboutContent" data-role="content" data-theme="c" class="ui-corner-bottom ui-content"></div>
                    </div>

                    <div>
                        <a href="#" id="buttonShare" data-role="button" data-inline="true">Share</a>
                    </div>
                    <div>
                        <a href="#dlgLogin" id="buttonLogin" data-rel="popup" data-position-to="window" data-role="button" data-inline="true">Login</a>
                        <a href="#" target="_self" id="buttonLoginSSL" data-rel="external" data-role="button" data-inline="true">Login</a>
                        <a href="#" id="buttonSignOut"  data-role="button" data-inline="true">Logout</a>
                    </div>

                    <div data-role="popup" id="dlgLogin" class="ui-corner-all" data-theme="c" data-overlay-theme="a">
                        <div data-role="header" data-theme="c" class="ui-corner-top">
                            <h1>Login</h1>
                        </div>
                        <div id="loginContent" data-role="content" data-theme="c" class="ui-corner-bottom ui-content">
                            <label for="user">Benutzer:</label>
                            <input type="text" name="user" id="user" value="">
                            <label for="password">Passwort:</label>
                            <input type="password" name="password" id="password" value="">
                            <a href="#" id="buttonSignIn" data-role="button" data-theme="b" data-inline="true">Anmelden</a>
                            <a href="#" id="buttonLoginCancel" data-role="button" data-inline="true">Abbrechen</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div data-role="panel" id="panelLayer" data-position="left" data-display="overlay">
            <div class="panel-content">
                <div data-role="navbar">
                    <ul>
                        <li><a id="buttonTopics" href="#panelTopics">Themen1</a></li>
                        <li><a id="buttonLayerAll" href="#panelLayerAll">Ebenen1</a></li>
                        <li><a id="buttonLayerOrder" href="#panelLayerOrder">Reihenfolge1</a></li>
                    </ul>
                </div>
                <div id="layerPanelContent">
                    <div id="panelTopics">
                        <ul id="topicList" data-role="listview" class="scrollable"></ul>
                    </div>
                    <div id="panelLayerAll" class="scrollable"></div>
                    <div id="panelLayerOrder">
                        <div data-role="controlgroup" class="scrollable">
                            <ul id="listOrder" data-role="listview" data-inset="true"></ul>
                        </div>
                        <label for="sliderTransparency">Transparenz</label>
                        <input type="range" name="sliderTransparency" id="sliderTransparency" value="0" min="0" max="100" data-highlight="true">
                    </div>
                </div>
            </div>
        </div>

        <div data-role="panel" id="panelFeatureInfo" data-position="left" data-display="overlay">
            <div class="panel-content">
                <b>Informationen</b>
                <div id="featureInfoResults" class="scrollable"></div>
            </div>
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
        </div>

    </div>

    </body>
    </html>


<?php
}

$server_os = php_uname('s');
$def_lang = strtolower(filter_input(INPUT_GET,'lang',FILTER_SANITIZE_STRING));
$mobile = strtolower(filter_input(INPUT_GET,'mobile',FILTER_SANITIZE_STRING));

session_start();

if($def_lang>'') {
    $lang_fn = filter_input(INPUT_SERVER,'DOCUMENT_ROOT',FILTER_SANITIZE_STRING) . GISAPPURL . 'admin/languages/' . $def_lang . '.js';
    if(!(file_exists($lang_fn))) {
        $def_lang = 'en';
    }
}
else {
    $def_lang = "en";
}

$_SESSION['lang'] = $def_lang;

$detect = new Mobile_Detect;
// Exclude tablets.
if( $detect->isMobile() && !$detect->isTablet() ){
    $mobile='on';
}

if (Helpers::isValidUserProj(Helpers::getMapFromUrl())) {

	//OK open application
    if($mobile=='on') {
        goMobile($def_lang);
    }
    else {

            ?>

            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
                "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
            <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                <meta name='viewport'
                      content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'/>
                <!--<title></title>-->
                <link rel="stylesheet" type="text/css" href="client/site/libs/ext/resources/css/ext-all-notheme.css"/>
                <link rel="stylesheet" type="text/css" href="client/site/libs/ext/resources/css/xtheme-blue.css"/>
                <link rel="stylesheet" type="text/css" href="client/site/libs/ext/ux/css/ux-all.css"/>
                <link rel="stylesheet" type="text/css" href="client/site/css/TriStateTreeAndCheckbox.css"/>
                <link rel="stylesheet" type="text/css" href="client/site/css/ThemeSwitcherDataView.css"/>
                <link rel="stylesheet" type="text/css" href="client/site/css/popup.css"/>
                <link rel="stylesheet" type="text/css" href="client/site/css/layerOrderTab.css"/>
                <link rel="stylesheet" type="text/css" href="client/site/css/contextMenu.css"/>

                <script type="text/javascript" src="load.php"></script>

                <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3"></script>

                <script type="text/javascript" src="client/site/libs/ext/adapter/ext/ext-base.js"></script>
                <script type="text/javascript" src="client/site/libs/ext/ext-all.js"></script>
                <script type="text/javascript" src="client/site/libs/ext/ux/ux-all.js"></script>
                <script type="text/javascript"
                        src="admin/languages/locale/ext-lang-<?php echo $def_lang ?>.js?v=1.1.2"></script>
                <script type="text/javascript" src="admin/languages/<?php echo $def_lang ?>.js?v=1.1.3"></script>
                <script type="text/javascript" src="client/site/libs/proj4js/proj4js-compressed.js"></script>
                <script type="text/javascript" src="client/site/libs/openlayers/OpenLayers.js?v=20161114"></script>

                <!--        <script type="text/javascript" src="../libs/openlayers/lib/OpenLayers/Control/LayerSwitcher.js"></script>-->

                <script type="text/javascript" src="client/site/libs/geoext/script/GeoExt.js?v=20160303"></script>
                <script type="text/javascript" src="client/site/js/Translations.js?v=1.3"></script>
                <script type="text/javascript" src="client/site/js/PagingStore.js"></script>
                <script type="text/javascript" src="client/site/js/LoadAppProjectData.js?v=1.3.1"></script>
                <script type="text/javascript" src="client/site/js/Customizations.js"></script>
                <script type="text/javascript" src="client/site/js/GetUrlParams.js"></script>
                <script type="text/javascript" src="client/site/js/TriStateTree.js"></script>
                <script type="text/javascript" src="client/site/js/GUI.js?v=1"></script>
                <script type="text/javascript" src="client/site/js/QGISExtensions.js?v=1.1.2"></script>
                <script type="text/javascript" src="client/site/js/GeocodingSearchCombo.js"></script>
                <script type="text/javascript" src="client/site/js/FeatureInfoDisplay.js?v=1.1.1"></script>
                <script type="text/javascript" src="client/site/js/LegendAndMetadataDisplay.js"></script>
                <script type="text/javascript" src="client/site/js/LayerActions.js?v=1.1.2"></script>
                <script type="text/javascript" src="client/site/js/WebgisInit.js?v=1.3.1"></script>
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

                    .olTileImage.olImageLoadError {
                        display: none !important;
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
		</script>
		
        <script type="text/javascript" src="admin/languages/<?php echo $def_lang?>.js?v=1.1.3"></script>
        <script type="text/javascript" src="admin/languages/_lang.js?v=20150819"></script>
		<script type="text/javascript" src="admin/logindialog/js/overrides.js"></script>

        <script type="text/javascript" src="admin/logindialog/js/virtualkeyboard.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/plugins/virtualkeyboard.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/Ext.ux.Crypto.SHA1.js"></script>
        <script type="text/javascript" src="admin/logindialog/js/Ext.ux.form.IconCombo.js"></script>
		<script type="text/javascript" src="admin/logindialog/js/Ext.ux.form.LoginDialog.js?v=20161107"></script>
        <script type="text/javascript" src="admin/logindialog/js/login.js?v=20150819"></script>
				
		</head>
		<body></body>
	</html>
	<?php
}
?>

