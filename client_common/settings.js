/**
 * Eqwc client settings
 *
 * This is proper location for settings, since this file is used by both clients
 * and is always loaded regardless debug variable.
 *
 */

var Eqwc = {};

Eqwc.settings = {};

//template string for client title, will be evaluated later
//example with Application name from translation string
//Eqwc.settings.title = "TR.appName+projectData.title+' '+projectData.client_display_name";
Eqwc.settings.title = "projectData.title+' '+projectData.client_display_name";

//limit number of features to request from server for displaying layer attribute table
Eqwc.settings.limitAttributeFeatures = 2000;

//enable tooltip hoover on features
//many server requests, default disabled
//only regular client
Eqwc.settings.enableHoverPopup = false;

//Set default mode for identify option, possible values are:
// "allLayers", "topMostHit", "activeLayers"
//Note that you control visibility of this combo per specific project in database
Eqwc.settings.defaultIdentificationMode = "allLayers";

//To enable adding own titles and description text to printing you have to add
//users_print_view into QGIS project from gisapp database
//you must add table to print layout, table will always have max 1 row for current user
//If you want you can rename it in QGIS but must provide that name here
//This table is removed from EQWC legend tree
Eqwc.settings.QgisUsersPrintName = "users_print_view";


//use separate gisportal code to browse projects, register users and login
//code available here - https://github.com/uprel/gisportal
Eqwc.settings.useGisPortal = false;

//setup gisportal first
Eqwc.settings.gisPortalRoot = '/gisportal/';
Eqwc.settings.mailServiceUrl = Eqwc.settings.gisPortalRoot + 'index.php/mail/send';
Eqwc.settings.gisPortalProfile = Eqwc.settings.gisPortalRoot + 'index.php/profile';





