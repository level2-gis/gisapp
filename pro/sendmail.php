<?php
/**
 * Created by PhpStorm.
 * User: uros
 * Date: 4.1.2015
 * Time: 16:35
 */

require_once("class.Login.php");

if(isset($_REQUEST['user'])) {
    $user = $_REQUEST['user'];
}
else {
    die('No user!');
}

$app = new Login();

$projects = $app->getGisProjectsFromDB($user);

//ne moreš dobiti gesla, zato bi lahko mail uporabil samo da uporabniku pošlješ linke za katere projekte ima pravico
//in link za resetiranje gesla, v tej fazi to ni smiselno
//$pass =

echo($projects);