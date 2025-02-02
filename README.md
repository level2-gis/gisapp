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

## Contributing

Support this project by [**DONATING**](https://github.com/sponsors/level2-gis).

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

2014-2025 Level2 for Extended QGIS Web Client,

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
