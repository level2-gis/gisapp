/**
 *
 * Configuration of simple EQWC plugin which consists of new button in top menu with own icon, tooltip and action.
 * It is independend from other buttons.
 *
 * To use this plugin:
 * 1. Copy /plugins/_template directory to /plugins/simpleaction and make following changes in simpleaction/js/1_gui.js
 * 2. Make sure you are running latest database version (18 or higher)
 * 3. Adjust icon in /img/icon.png
 * 4. Adjust tooltip below
 * 5. Adjust url in newWindow function below
 *
 * You can have more such plugins, each with own icon and action
 * To create new plugin from this template
 * 1. Copy /plugins/_template directory to /plugins/yourpluginname and make following changes in yourpluginname/js/1_gui.js
 * 2. Insert plugin to database with: INSERT INTO plugins(name) VALUES ('yourpluginname');
 * 3. Change Eqwc.plugins["simpleaction"] lines to Eqwc.plugins["yourpluginname"]
 * 4. Change plugin id from id: 'simpleActionBtn' to something unique and reference it in customToolbarLoad
 * 5. Also look at steps 2-5 above
 *
 */

Eqwc.plugins["geoportal_logo"] = {};
Eqwc.plugins["geoportal_logo"].customToolbarLoad = function () {

    var id = 'geoportal_logo';
    var header = Ext.getCmp('GisBrowserPanel');

    header.addTool({
        id: id,
        qtip: 'aplikacijo zagotavlja GEO-PORTAL',
        handler: function (event, toolEl, panel) {
            var url = "https://site.geo-portal.si/index.html";
            window.open(url);
        }
    });

    var cnt = Object.keys(header.tools).length - 1;
    header.tools[id].setRight(20 + (32 * cnt));
};
