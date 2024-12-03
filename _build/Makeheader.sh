#!/bin/bash

now="$(date)"
year=$(date +"%Y")

echo "/*"
echo " *"
echo " * $1.js -- build of Extended QGIS Web Client"
echo " *"
echo " * version: $2"
echo " * buildDate: $now"
echo " *"
echo " * Copyright (2014-$year), Level2, All rights reserved."
echo " * More information at https://level2.si"
echo " *"
echo " */"
