[![Code Climate](https://codeclimate.com/github/uprel/gisapp/badges/gpa.svg)](https://codeclimate.com/github/uprel/gisapp)

Extended QGIS Web Client (EQWC)
===============================

This is modified and extended version of original QGIS Web Client I. It turns your QGIS project into Web GIS application with tools to view, navigate, search and print your data. On top of that, there is a simple administration part to manage different projects, users, delegate permissions and set some specific settings not in QGIS project.

* Desktop client is based on original **[QGIS Web client (QWC)](https://github.com/qgis/QGIS-Web-Client)**.
* Mobile client is based on **[OL3 Mobile Viewer](https://github.com/sourcepole/ol3-mobile-viewer)**.

## Modifications and new features regarding QWC:
* user authorization with optional guest access
* server side (database for storing info about projects, base layers, external layers (WMS) and users; user authentication, specific project settings)
* QGIS server proxy (caching and validating requests)
* layer context menu with Zoom to layer extent, Open attribute data, Data Export (SHP, DXF, CSV)
* geolocation button
* Google StreetView integration
* legend in layer tree
* separating project settings and code
* user Interface changes

**[Longer Description](http://level2.si/2015/06/whats-new-in-extended-qgis-web-client/)**

## New features in 2016:
* mobile client
* using external location services for address and elevation
* table filtering also reflects on graphics (layer is filtered as table)
* replace GeoNames Search with more powerful Mapzen Search API
* baselayers refactoring, added support for BING Maps and WMTS layers on both clients

## Demo
Visit **<a target="_blank" href="http://test.level2.si/gisapp/eu_demo?public=on">Demo by Level2</a>**

## Services
* Support with installation and setting up
* Custom development
* Hosting of projects on our servers

## Documentation
Read **[Wiki](../../wiki)**

## Contributing

Support this project by donating.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3EV5P3XZQW84J)

You are also welcome to contribute to the project by testing, requesting new features, translating, submitting code, ...
Read this [tutorial about making changes to repositories](https://help.github.com/articles/fork-a-repo/).

Thank you!

## Translations
Available languages:
* English
* German
* Slovenian
* Slovak
* Spanish

New language:
* Read this **[page](../../wiki/6.-Translations)**


## Contact
**Uroš Preložnik**<br>
info@level2.si

## License
This software is released under a GPL-v3.0 license.

## Copyright 
2010-2012, The QGIS Project and 
2014-2017 Level2 team, 
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
