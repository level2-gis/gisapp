<?php
	//superuser, has options for registering new users
	define('SUPERUSER','gisadmin');

	//database connection
	define('DB_CONN_STRING','pgsql:host=localhost;port=5433;dbname=app_settings');
	define('DB_USER','pguser');
	define('DB_PWD','pguser14');
	
	//project location, needed for logout on Windows and to read search configuration for project
	$server_os = php_uname('s');
	
	if($server_os=='Windows NT') {
		define('PROJECT_PATH','D:/MAP/projects/');
	}
	else {
		define('PROJECT_PATH','/home/user/GIS/projects/');
	}
?>