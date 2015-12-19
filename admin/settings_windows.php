<?php

/**
 * settings.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

//database connection
define('DB_CONN_STRING', 'pgsql:host=localhost;port=5432;dbname=gisapp');

//db user
define('DB_USER', 'username');
define('DB_PWD', 'password');

//project location
define('PROJECT_PATH', 'C:/Apache24/htdocs/gisapp/_projects/');

//superuser, currently irrelevant
define('SUPERUSER', 'gisadmin');

//qgis server
define('QGISSERVERURL', 'http://localhost/cgi-bin/qgis_mapserv.fcgi.exe');

//other settings
define('OGR2OGR', 'C:/OSGeo4W64/bin/ogr2ogr');
define('TEMP_PATH', 'C:/Windows/Temp/');
define('GISAPPURL', '/gisapp/'); //for now this one should not change!
