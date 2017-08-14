/**
 * Eqwc client settings
 *
 * This is proper location for settings, since this file is used by both clients
 * and is aleways loaded regardless debug variable.
 */

var Eqwc = {};

Eqwc.settings = {};

//show measure line and polygon control (regular client)
Eqwc.settings.enableMeasurement = true;

//show geolocation control (both clients)
Eqwc.settings.enableGeolocation = true;

//show user feedback control (regular client)
Eqwc.settings.enableUserFeedback = true;

//use separate gisportal code to browse projects, register users and login
//code available here - https://github.com/uprel/gisportal
//TODO logout mora iti na portal, url na headerju gre na portal, no project mora iti na portal
//Eqwc.settings.useGisPortal = true;

//only relevant if user feedback is enabled
//setup gisportal first
Eqwc.settings.mailServiceUrl = 'http://localhost/gisportal/index.php/mail/send';





