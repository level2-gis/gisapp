<?php

require_once("class.Login.php");

$login = new Login();
$login->runApplication();

$login->feedback;
