// new buttons for the toolbar
customButtons.push(
    // Add a separator and a button
    {
        xtype: 'button',
        enableToggle: true,
        allowDepress: true,
        toggleGroup: 'mapTools',
        scale: 'medium',
        icon: iconDirectory+'mActionStreetView.svg',
        tooltipType: 'qtip',
        tooltip: 'GoogleStreetView',
        id: 'streetViewBtn'
    }//,{
     //   xtype: 'tbseparator'
    //}
);


Eqwc.plugins["streetview"] = {};
Eqwc.plugins["streetview"].customToolbarLoad = function() {

    var btn = Ext.getCmp('streetViewBtn');
    btn.toggleHandler = streetViewBtnHandler;

    // var panel = Ext.getCmp('RightPanel');
    // panel.setVisible(true);
};

var streetViewMarkerStyle = {
    graphicName: "arrow",
    strokeColor: '#333333',
    fillColor: '#FF9900',
    strokeWidth: 2,
    pointRadius: 8,
    rotation: 0
};