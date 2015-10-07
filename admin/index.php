<?php

/**
 * index.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

use GisApp\Login;

require_once("class.Login.php");

$login = new Login();
$login->runApplication();

$login->feedback;
