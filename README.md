[![Code Climate](https://codeclimate.com/github/uprel/gisapp/badges/gpa.svg)](https://codeclimate.com/github/uprel/gisapp)

Extended QGIS Web Client (EQWC)
===============================

This project turns your QGIS project into Web GIS application with tools to view, navigate, search and print your data. On top of that, there is a simple administration part to manage different projects, users, delegate permissions and set some specific settings not in QGIS project.

* Desktop client is based on original **[QGIS Web client (QWC)](https://github.com/qgis/QGIS-Web-Client)**.
* Mobile client is based on **[OL3 Mobile Viewer](https://github.com/sourcepole/ol3-mobile-viewer)**.

##Modifications and new features regarding QWC:
* user authorization with optional guest access
* server side (database for storing info about projects, base layers, external layers (WMS) and users; user authentication, specific project settings)
* QGIS server proxy (caching and validating requests)
* layer context menu with Zoom to layer extent, Open attribute data, Data Export* (SHP, DXF, CSV)
* geolocation button
* Google StreetView integration
* using external location services for address and elevation
* legend in layer tree
* separating project settings and code
* user Interface changes

**[Longer Description](http://level2.si/2015/06/whats-new-in-extended-qgis-web-client/)**

*Only PostGIS layers

##Documentation
Read **[Wiki](../../wiki)**

##Demo
Visit **<a target="_blank" href="http://test.level2.si/gisapp/eu_demo?public=on">Demo by Level2</a>**

##Contributing

Support this project by donating.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3EV5P3XZQW84J)

You are also welcome to contribute to the project by testing, requesting new features, translating, submitting code, ...
Read this [tutorial about making changes to repositories](https://help.github.com/articles/fork-a-repo/).

Thank you!

##Translations
Available languages:
* English
* German
* Slovenian
* Slovak
* Spanish

New language:
* Read this **[page](../../wiki/6.-Translations)**


##Contact
**Uroš Preložnik**<br>
uros@level2.si

##License
This software is released under a BSD license.

Copyright (2010-2012), The QGIS Project and Level2 team (2014-2016), All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted
provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this list of conditions
  and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions
  and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
THE POSSIBILITY OF SUCH DAMAGE.
