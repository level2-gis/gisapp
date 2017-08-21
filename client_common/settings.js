/**
 * Eqwc client settings
 *
 * This is proper location for settings, since this file is used by both clients
 * and is aleways loaded regardless debug variable.
 */

var Eqwc = {};

Eqwc.settings = {};

//template string for client title, will be evaluated later
//example with Application name from translation string
//Eqwc.settings.title = "TR.appName+projectData.title+' '+projectData.client_display_name";
Eqwc.settings.title = "projectData.title+' '+projectData.client_display_name";

//use separate gisportal code to browse projects, register users and login
//code available here - https://github.com/uprel/gisportal
//TODO logout mora iti na portal, url na headerju gre na portal, no project mora iti na portal
Eqwc.settings.useGisPortal = true;

//only relevant if user feedback is enabled
//setup gisportal first
Eqwc.settings.mailServiceUrl = '/gisportal/index.php/mail/send';





