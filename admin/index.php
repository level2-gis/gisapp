<?php

/**
 * index.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

use GisApp\Login;

require_once("class.Login.php");
require_once("class.Helpers.php");

header('Content-type: text/html; charset=utf-8');

$version = "EQWC version: ";
$version .= \GisApp\Helpers::getEqwcVersion();

echo $version.'</br>';


$login = new Login();
$login->runApplication();

$login->feedback;
