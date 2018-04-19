<?php

/**
 * settings.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

//2 letter language code defining default language if not provided with url paramater lang
//language must be part of translated languages for EQWC
define('DEFAULT_LANG', 'en');

//true loads source javascript files, false loads single minified version for production
define('DEBUG', false);

//database connection
define('DB_CONN_STRING', 'pgsql:host=localhost;port=5432;dbname=gisapp');

//db user
define('DB_USER', 'username');
define('DB_PWD', 'password');

//project location
define('PROJECT_PATH', 'C:/Apache24/apache/www/gisapp/_demo/');

//qgis server, check your port, if you are using default port 80, then simply go: /localhost/cgi-bin...
define('QGISSERVERURL', 'http://localhost:8080/cgi-bin/qgis_mapserv.fcgi.exe');

//GOOGLE MAPS JAVASCRIPT API KEY
//Only set this if you intent to use Google Maps layers or Google StreetView
define('GOOGLE_MAPS_KEY','your_key');

//Main upload directory, copy value from gisportal config.php main_upload_web
define('MAIN_UPLOAD_DIR', './uploads/');

//other settings
define('OGR2OGR', 'C:/OSGeo4W64/bin/ogr2ogr');
define('TEMP_PATH', 'C:/Windows/Temp/');
define('GISAPPURL', '/gisapp/'); //for now this one should not change!
