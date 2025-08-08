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

    // Flag to prevent initial player location from moving the map - declare globally
    if (typeof window.isPlayerInitializing === 'undefined') {
        window.isPlayerInitializing = false;
        window.firstLocationSent = false;
        window.intendedLocation = null;
    }

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
            }
        });

        window.document.addEventListener('playerUpdated', function (evt) {
            var selected = evt.detail;

            console.log('playerUpdated received:', selected);
            
            // Always ignore playerUpdated events during initial loading phase
            if (window.isPlayerInitializing && !window.firstLocationSent) {
                console.log('Ignoring playerUpdated during initialization (before our location sent)');
                return;
            }
            
            // If this is after we sent our location, check if it matches our intended location
            if (window.isPlayerInitializing && window.firstLocationSent && window.intendedLocation) {
                var tolerance = 0.01; // Increased tolerance for better matching
                var latMatch = Math.abs(selected.lat - window.intendedLocation.lat) < tolerance;
                var lonMatch = Math.abs(selected.lon - window.intendedLocation.lon) < tolerance;
                
                console.log('Comparing locations:');
                console.log('  Received:', selected.lat, selected.lon);
                console.log('  Intended:', window.intendedLocation.lat, window.intendedLocation.lon);
                console.log('  Differences:', Math.abs(selected.lat - window.intendedLocation.lat), Math.abs(selected.lon - window.intendedLocation.lon));
                
                if (latMatch && lonMatch) {
                    console.log('Received playerUpdated with our intended location - clearing initialization flag');
                    console.log('Correct location loaded - flash should be minimal');
                    
                    window.isPlayerInitializing = false;
                    window.firstLocationSent = false;
                    window.intendedLocation = null;
                } else {
                    console.log('Ignoring playerUpdated - not our intended location (differences too large)');
                    return;
                }
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
                    // Set flag to ignore initial playerUpdated events BEFORE creating iframe
                    window.isPlayerInitializing = true;
                    
                    //add listener to right panel (but don't show panel yet)
                    panel.on('beforeadd', function (panel, item) {
                        var center = Ext.getCmp('CenterPanel');
                        var height = center.getHeight();
                        item.setHeight(height - 10);
                    });
                    
                    var player = new Ext.Panel({
                        html: '<iframe id="player" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%" src="../uploads/ko_vdv_b/applied_streetview/player2/"></iframe>'
                    });
                    panel.add(player);
                    
                    // Open the panel immediately - the flash will be minimized by our logic
                    panel.setVisible(true);
                    panel.expand();
                    console.log('Panel opened - will minimize flash with correct location handling');
                    
                    // Small delay to ensure iframe is loaded before sending location
                    setTimeout(function() {
                        window.firstLocationSent = true;
                        console.log('Sending intended location to player');
                        var transformedPos = pos.transform(authid, 'EPSG:4326');
                        console.log('Transformed position:', transformedPos);
                        // Store the intended location for comparison
                        window.intendedLocation = {
                            lat: transformedPos.lat,
                            lon: transformedPos.lon
                        };
                        console.log('Stored intended location:', window.intendedLocation);
                        openAppliedStreetView(transformedPos);
                    }, 1000);
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
            // Reset flags when deactivating
            window.isPlayerInitializing = false;
            window.firstLocationSent = false;
            window.intendedLocation = null;
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
        console.log('Player element not found');
        return;
    }

    // Ensure we have a proper location object
    var locationData = {
        lon: location.lon || location.x,
        lat: location.lat || location.y
    };
    
    console.log('Attempting to send location to player:', locationData);

    // Wait for iframe to be fully loaded before sending event
    if (player.contentDocument && player.contentDocument.readyState === 'complete') {
        var event = new window.CustomEvent('playerLookAt', {detail: locationData});
        player.contentDocument.dispatchEvent(event);
        console.log('Location event dispatched to player with data:', locationData);
    } else {
        // If iframe is not ready, wait a bit and try again
        console.log('Player not ready, retrying...');
        setTimeout(function() {
            openAppliedStreetView(location);
        }, 100);
    }
}




