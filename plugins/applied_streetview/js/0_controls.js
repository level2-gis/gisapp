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

    //remove Google StreetView if loaded
    var gs = document.getElementsByClassName('gm-style')[0];
    if (gs) {
        gs.parentElement.removeChild(gs);
    }

    var panel = Ext.getCmp('RightPanel');
    panel.removeAll();

    if (typeof (AppliedStreetViewControl) == 'undefined') {
        // Flag to prevent initial player location from moving the map
        var isPlayerInitializing = false;
        
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
            }
        });

        window.document.addEventListener('playerUpdated', function (evt) {
            var selected = evt.detail;

            //console.info('playerUpdated', selected);
            
            // Ignore playerUpdated events during initial loading
            if (isPlayerInitializing) {
                console.log('Ignoring playerUpdated during initialization');
                return;
            }

            var point = new OpenLayers.Geometry.Point(selected.lon, selected.lat);
            point.transform('EPSG:4326', authid);

            var pointLonLat = new OpenLayers.LonLat(selected.lon, selected.lat);
            pointLonLat.transform('EPSG:4326', authid);

            //add location to higlightlayer
            var marker = new OpenLayers.Feature.Vector(
                point,
                {},
                appliedStreetViewMarkerStyle
            );
            featureInfoHighlightLayer.removeAllFeatures();
            appliedStreetViewMarkerStyle.rotation = selected.headingHlookat;
            featureInfoHighlightLayer.addFeatures(marker);

            //check if marker is still inside the map, move the map if necessary
            var bounds = geoExtMap.map.calculateBounds();
            var inside = bounds.containsLonLat(pointLonLat);
            if (!inside) {
                geoExtMap.map.moveTo(pointLonLat, geoExtMap.map.getZoom());
            }

        }, false);

        // Create a new map control based on Control Click Event
        AppliedStreetViewControl = new OpenLayers.Control.Click({
            trigger: function (e) {
                var pos = geoExtMap.map.getLonLatFromViewPortPx(e.xy);
                
                // Load iframe on first click if it doesn't exist
                var existingPlayer = document.querySelector('#player');
                if (!existingPlayer) {
                    // Set flag to ignore initial playerUpdated events
                    isPlayerInitializing = true;
                    
                    //add listener to right panel
                    panel.on('beforeadd', function (panel, item) {
                        var center = Ext.getCmp('CenterPanel');
                        var height = center.getHeight();
                        item.setHeight(height - 10);
                    });
                    
                    var player = new Ext.Panel({
                        html: '<iframe id="player" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%" src="../uploads/ko_vdv_b/applied_streetview/player2/"></iframe>'
                    });
                    panel.add(player);
                    
                    // Open the panel on first click
                    panel.setVisible(true);
                    panel.expand();
                    
                    // Small delay to ensure iframe is loaded before sending location
                    setTimeout(function() {
                        openAppliedStreetView(pos.transform(authid, 'EPSG:4326'));
                        // Clear the flag after sending our intended location
                        setTimeout(function() {
                            isPlayerInitializing = false;
                            console.log('Player initialization complete');
                        }, 1000);
                    }, 500);
                } else {
                    openAppliedStreetView(pos.transform(authid, 'EPSG:4326'));
                }
            }
        });

        AppliedStreetViewControl.events.register('activate', this, function (evt) {
            // Don't open panel immediately - wait for first map click
        });

        AppliedStreetViewControl.events.register('deactivate', this, function () {
            panel.removeAll();
            panel.collapse();
        });

        geoExtMap.map.addControl(AppliedStreetViewControl);
    }

    AppliedStreetViewControl.activate();
    mainStatusText.setText(modeStreetViewString[lang]);
    //enableStreetView = true;

    //return true;
}


function openAppliedStreetView(location) {

    var player = document.querySelector('#player');
    if (!player) {
        return;
    }

    // Wait for iframe to be fully loaded before sending event
    if (player.contentDocument && player.contentDocument.readyState === 'complete') {
        var event = new window.CustomEvent('playerLookAt', {detail: location});
        player.contentDocument.dispatchEvent(event);
    } else {
        // If iframe is not ready, wait a bit and try again
        setTimeout(function() {
            openAppliedStreetView(location);
        }, 100);
    }
}




