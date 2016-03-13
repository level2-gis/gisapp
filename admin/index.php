<?php

/**
 * index.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

use GisApp\Login;

require_once("class.Login.php");

$version = "EQWC version: ";
if (file_exists('../version.txt')) {
    $version .= file_get_contents('../version.txt',null,null,null,8);
}
echo $version.'</br>';


$login = new Login();
$login->runApplication();

$login->feedback;
