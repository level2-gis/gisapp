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

// new button for the toolbar
customButtons.push(
    // Add a separator and a button
    {
        xtype: 'tbseparator'
    }, {
        xtype: 'button',
        scale: 'medium',
        icon: 'plugins/help_kataster_grobov/img/icon.png',
        tooltipType: 'qtip',
        tooltip: 'Navodila za urejanje katastra grobov',
        id: 'helpActionBtn'                                   //must be unique ID
    }
);

Eqwc.plugins["help_kataster_grobov"] = {};
Eqwc.plugins["help_kataster_grobov"].customToolbarLoad = function() {

    var btn = Ext.getCmp('helpActionBtn');
    btn.setHandler(newWindow);

    function newWindow() {
        var url = "plugins/help_kataster_grobov/GEO-PORTAL Kataster grobov.pdf?n="+getRandomNum();
        window.open(url);
    }

    //This is just example. It should be developed further to open content in panel.
    //Problem are external URLs
    //function rightPanel() {
    //    var panel = Ext.getCmp('RightPanel');
    //    panel.setVisible(true);
    //    panel.removeAll();
    //
    //    panel.load({url: "docs/index.html"});
    //    panel.expand();
    //}
};
