## OL3 Mobile Viewer

OL3 Mobile Viewer is a basic map viewer based on OpenLayers 3 and jQuery Mobile.

Features:

* Topic and layer selection
* Search
* Feature info requests
* Map follows current location
* Manual and compass controlled map orientation

## Customization

* src/config.js
* src/custom.css

## Runtime configuration

* topics.json
* layers.json

### URL parameters

* tiledWms=1|0 : force tiled/untiled WMS
* topic=TOPIC_NAME : initial topic
* background=BACKGROUND_TOPIC_NAME : initial background topic
* overlays=COMMA_SEPARATED_OVERLAY_TOPIC_NAMES : initial overlay topics
* extent=MINX,MINY,MAXX,MAXY : initial map extent
* center=X,Y : initial map center
* scale=SCALE : initial map scale
* zoom=ZOOM_LEVEL : initial map zoom level
* activeLayers=COMMA_SEPARATED_LAYER_NAMES : initially visible layers in that order
* inactiveLayers=COMMA_SEPARATED_LAYER_NAMES : initially invisible layers
* opacities={LAYER_NAME:OPACITY[255..0]} as JSON : initial layer opacities
    e.g. opacities={"Pixelkarte 25":192,"BBFlaechen_farbig":128}

Parameter precedence:

* extent before center, scale, zoom
* scale before zoom
* activeLayers before inactiveLayers

## Screencast

[![OL3 Mobile Viewer Screencast](http://img.youtube.com/vi/htphVHMkCOo/0.jpg)](http://youtu.be/htphVHMkCOo)

## Contributions

Fork this repository and send us a pull request.

## License

OL3 Mobile viewer is released under the [MIT License](http://www.opensource.org/licenses/MIT).

