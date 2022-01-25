/**
 * Created by uros on 5/1/17.
 */

function streetViewBtnHandler(btn, evt) {

    if(btn.id == 'streetViewBtn') {
        if (btn.pressed) {
            prepareStreetView();
        }
        else
        {
            StreetViewControl.deactivate();
            featureInfoHighlightLayer.removeAllFeatures();
            mainStatusText.setText(modeNavigationString[lang]);
        }
    }

}

function prepareStreetView() {

    if(typeof(StreetViewControl) == 'undefined') {
        // I create a new control click event class
        OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
            defaultHandlerOptions: {
                'single': true,
                'double': false,
                'pixelTolerance': 0,
                'stopSingle': false,
                'stopDouble': false
            },
            initialize: function(options) {
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

        // Create a new map control based on Control Click Event
        StreetViewControl = new OpenLayers.Control.Click( {
            trigger: function(e) {
                openStreetView(geoExtMap.map.getLonLatFromViewPortPx(e.xy));
            }
        });

        geoExtMap.map.addControl(StreetViewControl);
    }

    StreetViewControl.activate();
    mainStatusText.setText(modeStreetViewString[lang]);
    //enableStreetView = true;

    //return true;
}


function openStreetView (location) {

    //TODO have to check if google is avaliable

    var panel = Ext.getCmp('RightPanel');
    panel.removeAll();
    panel.setVisible(true);

    var x = location.lon;
    var y = location.lat;

    //alert(location);

    var locWgs = location.transform(
        authid,
        new OpenLayers.Projection("EPSG:4326"));

    //add location to higlightlayer
    var marker = new OpenLayers.Feature.Vector(
        new OpenLayers.Geometry.Point(x,y),
        {},
        streetViewMarkerStyle
    );
    featureInfoHighlightLayer.removeAllFeatures();
    streetViewMarkerStyle.rotation = 0;
    featureInfoHighlightLayer.addFeatures(marker);

    // Configure panorama and associate methods and parameters to it
    var options = {
        position: new google.maps.LatLng(locWgs.lat, locWgs.lon),
        pov: {
            heading: 0,
            pitch: 0,
            zoom: 1
        }
    };

    //panorama = new gxp.GoogleStreetViewPanel({
    //    location: location
    //})

    var panorama = new google.maps.StreetViewPanorama(
        panel.body.dom, options
    );

    panel.add(panorama);
    panel.on('resize', function() {
        google.maps.event.trigger(panorama, 'resize');
    });
    panel.expand();

    //alert(sw.getStatus());


    google.maps.event.addListener(panorama, 'position_changed', function() {
        var newLoc = panorama.getPosition();
        var x2 = new OpenLayers.LonLat(newLoc.lng(),newLoc.lat());
        x2.transform(
            new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection(authid)
        );
        marker.move(x2);

        //check if marker is still inside the map, move the map if necessary
        var bounds = geoExtMap.map.calculateBounds();
        var inside = bounds.containsLonLat(x2);
        if(!inside) {
            geoExtMap.map.moveTo(x2,geoExtMap.map.getZoom());
        }

    });

    google.maps.event.addListener(panorama, 'pov_changed', function() {
        //panorama.getPov().heading;
        //panorama.getPov().pitch;

        streetViewMarkerStyle.rotation = panorama.getPov().heading;
        featureInfoHighlightLayer.removeAllFeatures();
        featureInfoHighlightLayer.addFeatures(marker);

    });
}




