Extended QGIS Web Client (EQWC)
===============================

This is modified and extended version of official QGIS Web Client I. It turns your QGIS project into Web and Mobile GIS application with tools to view, navigate, search and print your data. On top of that, there is a PostgreSQL management database for storing projects, layers, users and some specific settings not in QGIS project. 

Database administration and project browsing is done with - **[gisportal](https://github.com/uprel/gisportal)**.

* Desktop client is based on official [QGIS Web client I (QWC I)](https://github.com/qgis/QGIS-Web-Client).
* Mobile client is based on [OL3 Mobile Viewer](https://github.com/sourcepole/ol3-mobile-viewer).

## Modifications and new features:
* system for storing and managing clients, projects, external layers (WMS, WMTS, XYZ) and users
* user authorization with different levels (guest, user, administrator)
* easy project configuration
* [**GIS portal**](https://github.com/uprel/gisportal) for browsing projects and complete database administration
* loading Web or Mobile client based on screen size
* PDF printing improved with user title, description and inclusion of base layers 
* using external API services for geocoding, reverse geocoding and getting point elevation data
* [plugins](https://github.com/uprel/gisapp/wiki/8.-Plugins) support, currently available: Google StreetView, SimpleAction and [**Editor**](http://level2.si/product/editor-for-extended-qgis-web-client/)
* layer and group context menu with Zoom to layer extent, Choose layer style, Open attribute data, Data Export and Properties
* layer table synchronized with current map view
* geolocation button (you have to install SSL certificate to use this - [Read more](http://level2.si/2017/07/geolocation-using-chrome/))
* legend in layer tree
* display spatial bookmarks stored in QGS file
* separating project settings and code
* user Interface changes and many other improvements

**[More info](http://level2.si/solutions/gis-clients/)**

## Demo
Visit **<a target="_blank" href="http://test.level2.si">Demo by Level2</a>**

## Services
* Support with installation and usage
* Custom development
* Hosting of projects on our servers

## Documentation
* **[Wiki](../../wiki)**
* **[Client settings](https://test.level2.si/gisapp/docs/Eqwc.settings.html)**

### Identify location reports

Add `locationReport` to the project JSON to enable a report icon in the desktop
Identify location section. The icon is shown only when `enabled` is `true`.

```json
{
  "locationReport": {
    "enabled": true,
    "label": "Location report",
    "query": {
      "layers": ["Parcels", "buildings_7f3a2c1e", "Spatial plan"]
    },
    "maps": [
      {
        "id": "overview",
        "title": "Overview",
        "template": "A4 portrait",
        "layers": ["Parcels", "roads_91bc"],
        "external_layers": ["osm"]
      },
      {
        "id": "plan",
        "title": "Spatial plan",
        "template": "A3 landscape",
        "layers": ["Spatial plan", "Parcels"],
        "external_layers": []
      }
    ]
  }
}
```

Before the request is sent, a dialog lists every configured map (by `title`,
falling back to `id` or `template`) with a checkbox; all maps are checked by
default. Only the selected maps are sent. The query part is always included, so
the report can also be generated with no maps selected. `maps` is optional; when
it is missing or empty, the dialog is skipped and the report is generated directly.

The action sends a form-encoded POST to `documents/location_report` under the
configured GIS portal root. It includes `project`, comma-separated `QUERY_LAYERS`,
the Identify-time `bbox`, `width`, `height`, `i`, `j`, and `crs`, and `address`
as plain text from the displayed Identify address (empty when unavailable).
Each selected map is sent as `maps[n][template]`, `maps[n][layers]`,
`maps[n][external_layers]`, and `maps[n][title]`; layer lists are comma-separated.
When `projectData.use_ids === true`, layer names in `query.layers` and each map's
`layers` are resolved to project layer IDs. Group names, existing IDs, and
external layer names are kept unchanged.
Map IDs are configuration identifiers and are not sent.
Like feature reports, successful XML responses are downloaded using the server
filename when supplied, and request errors are displayed in an alert.

## Contributing

Support this project by [**DONATING**](http://level2.si/product/donation-extended-qgis-web-client/).

You are also welcome to contribute to the project by testing, requesting new features, translating, submitting code, ...
Read this [tutorial about making changes to repositories](https://help.github.com/articles/fork-a-repo/).

Thank you!

## Translations
Available languages:
* English
* German
* Italian
* Norwegian
* Polish
* Romanian
* Russian
* Slovenian
* Slovak
* Spanish
* Swedish

New language:
* Read this **[page](../../wiki/6.-Translations)**


## Contact
**Uroš Preložnik**<br>
http://level2.si

## License
This software is released under a GPL-v3.0 license.

## Copyright 
2010-2014, The QGIS Project for official QGIS Web Client I and

2014-2019 Level2 for Extended QGIS Web Client,

All rights reserved.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License version 3 as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
