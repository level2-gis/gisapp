#!/bin/bash

DISTRIBUTION_NAME="eqwc"
VERSION=$(head -c 8 ../version.txt)

echo $DISTRIBUTION_NAME $VERSION

# Minifies JS using Closure Compiler
java -jar closurecompiler.jar \
  --charset 'UTF-8' \
  --jscomp_error=checkDebuggerStatement \
  --jscomp_warning=checkVars \
  --jscomp_warning=deprecated \
  --jscomp_warning=duplicate \
  --jscomp_warning=invalidCasts \
  --compilation_level=SIMPLE_OPTIMIZATIONS \
  --externs externs.js \
  --js 'compat.js' \
  --js '../client_common/eqwc_common.js' \
  --js '../client/site/js/PagingStore.js' \
  --js '../client/site/js/LoadAppProjectData.js' \
  --js '../client/site/js/Customizations.js' \
  --js '../client/site/js/GetUrlParams.js' \
  --js '../client/site/js/TriStateTree.js' \
  --js '../client/site/js/GUI.js' \
  --js '../client/site/js/QGISExtensions.js' \
  --js '../client/site/js/GeocodingSearchCombo.js' \
  --js '../client/site/js/FeatureInfoDisplay.js' \
  --js '../client/site/js/LegendAndMetadataDisplay.js' \
  --js '../client/site/js/LayerActions.js' \
  --js '../client/site/js/WebgisInit_functions.js' \
  --js_output_file $DISTRIBUTION_NAME'.js'

bash Makeheader.sh $DISTRIBUTION_NAME $VERSION > $DISTRIBUTION_NAME"_header"
cat $DISTRIBUTION_NAME"_header" $DISTRIBUTION_NAME".js" >../client/$DISTRIBUTION_NAME".js"
