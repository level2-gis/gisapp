/**
 * Created by uros on 5/1/17.
 */

function appliedStreetViewBtnHandler(btn, evt) {

    if (btn.id == 'appliedStreetViewBtn') {
        if (btn.pressed) {
            prepareAppliedStreetView();
        } else {
            AppliedStreetViewControl.deactivate();
            featureInfoHighlightLayer.removeAllFeatures();
            mainStatusText.setText(modeNavigationString[lang]);
        }
    }

}

function prepareAppliedStreetView() {

    if (typeof (AppliedStreetViewControl) == 'undefined') {
        // I create a new control click event class
        OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
            defaultHandlerOptions: {
                'single': true,
                'double': false,
                'pixelTolerance': 0,
                'stopSingle': false,
                'stopDouble': false
            },
            initialize: function (options) {
                this.handlerOptions = OpenLayers.Util.extend(
                    {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                );
                this.handler = new OpenLayers.Handler.Click(
                    this, {
                        'click': this.trigger
                    }, this.handlerOptions
                );

                //load iframe
                var panel = Ext.getCmp('RightPanel');
                panel.removeAll();

                //add listener to right panel
                panel.on('beforeadd', function (panel, item) {
                    var center = Ext.getCmp('CenterPanel');
                    var height = center.getHeight();
                    item.setHeight(height - 10);
                });

                var player = new Ext.Panel({
                    html: '<iframe id="player" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%" src="../player-test/player2/"></iframe>'
                });
                panel.add(player);
            }
        });

        // Create a new map control based on Control Click Event
        AppliedStreetViewControl = new OpenLayers.Control.Click({
            trigger: function (e) {
                var pos = geoExtMap.map.getLonLatFromViewPortPx(e.xy);
                openAppliedStreetView(pos.transform(authid, 'EPSG:4326'));
            }
        });

        geoExtMap.map.addControl(AppliedStreetViewControl);
    }

    AppliedStreetViewControl.activate();
    mainStatusText.setText(modeStreetViewString[lang]);
    //enableStreetView = true;

    //return true;
}


function openAppliedStreetView(location) {

    var panel = Ext.getCmp('RightPanel');
    //panel.removeAll();
    panel.setVisible(true);

    panel.expand();

    var player = document.querySelector('#player');
    if (!player) {
        return;
    }

    var event = new window.CustomEvent('playerLookAt', {detail: location});

    player.contentDocument.dispatchEvent(event);
}




