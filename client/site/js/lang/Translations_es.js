/* 
 * 
 * Translations_cfg.js -- part of Quantum GIS Web Client 
 * 
 * Copyright (2010-2012), The QGIS Project All rights reserved. 
 * Quantum GIS Web Client is released under a BSD license. Please see 
 * https://github.com/qgis/qgis-web-client/blob/master/README 
 * for the full text of the license and the list of contributors. 
 * 
 */ 

var availableHelpLanguages = Array("en","es","de","hu","it","pl","fr","ro","sk");
var availableLanguages = [];
availableLanguages["en"] = {names:[], translator:"Andreas Neumann"}; //a (dot) neumann (at) carto (dot) net
availableLanguages["es"] = {names:[], translator:"Samuel Mesa, Diana Galindo, Germán Carrillo, Ignacio Serrano Ayllón"}; // samuelmesa (at) gmail (dot) com , drgalindog (at) linuxmail (dot) org
availableLanguages["de"] = {names:[], translator:"Andreas Neumann"}; //a(dot)neumann(at)carto(dot)net
availableLanguages["fr"] = {names:[], translator:"Mayeul Kauffmann, Amandine Schloupt (Aguram)"}; //mayeul (dot) kauffmann (at) free (dot) fr, aschloupt (at) aguram (dot) org
availableLanguages["it"] = {names:[], translator:"Paolo Cavallini (Faunalia), Giovanni Allegri (Gis3W), Alessandro Pasotti (ItOpen)"}; //cavallini (at) faunalia (dot) it
availableLanguages["pt_PT"] = {names:[], translator:"Nelson Silva, Giovanni Manghi (Faunalia)"}; //nelson (dot) jgs (at) gmail (dot) com>, giovanni (dot) manghi (at) faunalia (dot) pt
availableLanguages["uk"] = {names:[], translator:"Pavlo Taranov"}; //taranov (dot) pavel (at) gmail (dot) com>
availableLanguages["hu"] = {names:[], translator:"Szilárd Lajcsik"}; //szilajinfo (at) gmail (dot) com>
availableLanguages["ro"] = {names:[], translator:"Tudor Bărăscu"}; //tudorbarascu (at) gmail (dot) com>
availableLanguages["ru"] = {names:[], translator:"Nikolay Zhigalov"}; //jederlacht1 (at) gmail (dot) com>
availableLanguages["sl"] = {names:[], translator:"Uroš Preložnik"};	//uros00 (at) gmail (dot) com
availableLanguages["nl"] = {names:[], translator:"Carl Defevere"}; //carl (dot) defevere (at) gmail (dot) com>
availableLanguages["pl"] = {names:[], translator:"Sławomir Bienias"}; //slawomir (dot) bienias (at) gmail (dot) com>
availableLanguages["sk"] = {names:[], translator:"Mrtin Baloga"}; //slawomir (dot) bienias (at) gmail (dot) com>
var mapAppLoadingString = [];
mapAppLoadingString["es"] = "Cargando la aplicación del mapa...";
var mapLoadingString = [];
mapLoadingString["es"] = "Cargando mapa...";
var modeNavigationString = [];
modeNavigationString["es"] = "Modo: navegación. Shift/rectángulo o rueda del ratón para hacer zoom.";
var modeZoomRectangle = [];
modeZoomRectangle["es"] = "Modo: zoom con rectángulo. Dibujar el rectángulo sobre la región que desea acercar.";
var modeObjectIdentificationString = [];
modeObjectIdentificationString["es"] = "Modo: Identificación de objeto. Mueva el cursor sobre un objeto para identificarlo, haga click sobre él para ver sus atributos.";
var modeMapTipsString = [];
modeMapTipsString["es"] = "Modo: MapTips. Despliega textos emergentes con el cursor del ratón.";
var modeMeasureDistanceString = [];
modeMeasureDistanceString["es"] = "Modo: medir distancia. Finalizar con doble click.";
var modeMeasureAreaString = [];
modeMeasureAreaString["es"] = "Modo: medir área. Finalizar con doble click.";
var modeStreetViewString = [];
modeStreetViewString["es"] = "Modo: GoogleStreetView. Pulsar sobre una carretera."; 
var modePrintingString = [];
modePrintingString["es"] = "Modo: imprimir. Mueva o rote la extensión del mapa. Imprima con el botón 'imprimir'.";
var printLoadingString = [];
printLoadingString["es"] = "Impresión inicializada, por favor espere...";
var leftPanelTitleString = [];
leftPanelTitleString["es"] = "Información y herramientas";
var searchPanelTitleString = [];
searchPanelTitleString["es"] = "Buscar";
var mapThemeButtonTitleString = [];
mapThemeButtonTitleString["es"] = "Temas de mapas";
var themeSwitcherWindowTitleString = [];
themeSwitcherWindowTitleString["es"] = "Elección de tema de mapa";
var themeSwitcherFilterLabelString = [];
themeSwitcherFilterLabelString["es"] = "Filtrar por título de mapa: ";
var themeSwitcherAllThemesListViewString = [];
themeSwitcherAllThemesListViewString["es"] = "Todos los temas de mapas";
var themeSwitcherTooltipResponsibleString = [];
themeSwitcherTooltipResponsibleString["es"] = "Responsable: ";
var themeSwitcherTooltipTagString = [];
themeSwitcherTooltipTagString["es"] = "Etiquetas: ";
var themeSwitcherTooltipMapThemeString = [];
themeSwitcherTooltipMapThemeString["es"] = "Tema de mapa: ";
var themeSwitcherTooltipUpdateString = [];
themeSwitcherTooltipUpdateString["es"] = "Intervalo de actualización: ";
var themeSwitcherTooltipLastUpdateString = [];
themeSwitcherTooltipLastUpdateString["es"] = "Última actualización: ";
var themeSwitcherTooltipPwProtectedString = [];
themeSwitcherTooltipPwProtectedString["es"] = "protegido por contraseña";
var emptyThemeSearchFieldString = [];
emptyThemeSearchFieldString["es"] = "Inserte el texto para filtrar";
var resetThemeSearchFieldTooltipString = [];
resetThemeSearchFieldTooltipString["es"] = "Borrar el filtro de búsqueda de temas de mapa";
var mapPanelTitleString = [];
mapPanelTitleString["es"] = "Mapa";
var layerTreeTitleString = [];
layerTreeTitleString["es"] = "Capas";
var backgroundLayerTitleString = [];
backgroundLayerTitleString["es"] = "Capas de fondo";
var externalLayerTitleString = [];
externalLayerTitleString["es"] = "Capas externas "; 
var layerOrderPanelTitleString = [];
layerOrderPanelTitleString["es"] = "Orden de capa"; 
var layerOrderPanelLayerSettingsTooltipString = [];
layerOrderPanelLayerSettingsTooltipString["es"] = "Ajustes"; 
var layerOrderPanelVisibilityChangeTooltipString = [];
layerOrderPanelVisibilityChangeTooltipString["es"] = "Cambiar visibilidad de la capa";
var layerOrderPanelMoveLayerTextString = [];
layerOrderPanelMoveLayerTextString["es"] = "Mover capa"; 
var layerOrderPanelTransparencyTooltipString = [];
layerOrderPanelTransparencyTooltipString["es"] = "Transparencia {0}%"; 
var legendTabTitleString = [];
legendTabTitleString["es"] = "Leyenda";
var legendTabLoadingString = [];
legendTabLoadingString["es"] = "Cargando leyenda, por favor espere"; 
var metadataTabTitleString = [];
metadataTabTitleString["es"] = "Metadatos";
var helpWindowTitleString = [];
helpWindowTitleString["es"] = "Ayuda";
var legendMetadataWindowTitleString = [];
legendMetadataWindowTitleString["es"] = "Información de Metadatos y Leyenda de la capa"; 
var metadataSectionTitleString = [];
metadataSectionTitleString["es"] = "Metadatos de la capa"; 
var abstractString = [];
abstractString["es"] = "Resumen:"; 
var layerQueryable = [];
layerQueryable["es"] = "Esta capa se puede consultar: "; 
var yesString = [];
yesString["es"] = "sí"; //FIXME
var noString = [];
noString["es"] = "no"; 
var layerGroupString = [];
layerGroupString["es"] = "Grupo de capas"; 
var displayFieldString = [];
displayFieldString["es"] = "Mostrar campo"; 
var coordinateSystemsString = [];
coordinateSystemsString["es"] = "Sistemas de coordenadas disponibles"; 
var geographicExtentString = [];
geographicExtentString["es"] = "Extensión geográfica"; 
var westString = [];
westString["es"] = "Oeste"; 
var eastString = [];
eastString["es"] = "Este"; 
var northString = [];
northString["es"] = "Norte"; 
var southString = [];
southString["es"] = "Sur"; 
var attributesString = [];
attributesString["es"] = "Atributos";
var attributeNameString = [];
attributeNameString["es"] = "Nombre del atributo";
var attributeTypeString = [];
attributeTypeString["es"] = "Tipo";
var attributeCommentString = [];
attributeCommentString["es"] = "Comentario";
var attributeLengthString = [];
attributeLengthString["es"] = "Longitud";
var attributePrecisionString = [];
attributePrecisionString["es"] = "Precisión";
var objectIdentificationTextLabel = [];
objectIdentificationTextLabel["es"] = "Identificación de objetos: ";
var coordinateTextLabel = [];
coordinateTextLabel["es"] = "Coordenadas:";
var searchFieldDefaultTextString = [];
searchFieldDefaultTextString["es"] = "Buscar (direcciones, registros, nombres, etc.)";
var searchButtonString = [];
searchButtonString["es"] = "Buscar";
var resetButtonString = [];
resetButtonString["es"] = "Limpiar";
var pleaseWaitString = [];
pleaseWaitString["es"] = "Por favor espere";
var searchResultString = [];
searchResultString["es"] = "Resultado de la búsqueda";
var networkErrorString = [];
networkErrorString["es"] = "Error de red";
var missingOrInvalidSearchParams = [];
missingOrInvalidSearchParams["es"] = "Valores inválidos o faltantes en el formulario de búsqueda";
var searchErrorString = [];
searchErrorString["es"] = "Error en la búsqueda";
var searchNoRecordsFoundString = [];
searchNoRecordsFoundString["es"] = "Búsqueda sin resultados"; 
var printSettingsToolbarTitleString = [];
printSettingsToolbarTitleString["es"] = "Configuración de impresión";
var printSettingsRotationTextlabelString = [];
printSettingsRotationTextlabelString["es"] = "Rotación: ";
var printButtonTextString = [];
printButtonTextString["es"] = "Imprimir";
var printCancelButtonTextString = [];
printCancelButtonTextString["es"] = "Cancelar";
var objectIdentificationModeString = [];
objectIdentificationModeString["topMostHit"] = [];
objectIdentificationModeString["topMostHit"]["es"] = "Capa superior";
objectIdentificationModeString["allLayers"] = [];
objectIdentificationModeString["allLayers"]["es"] = "Todas las capas";
objectIdentificationModeString["activeLayers"] = [];
objectIdentificationModeString["activeLayers"]["es"] = "Capa activa";
var measureDistanceResultPrefixString = [];
measureDistanceResultPrefixString["es"] = "Distancia";
var measureAreaResultPrefixString = [];
measureAreaResultPrefixString["es"] = "Área";
var zoomRectangleTooltipString = [];
zoomRectangleTooltipString["es"] = "Zoom con rectángulo";
var zoomFullViewTooltipString = [];
zoomFullViewTooltipString["es"] = "Zoom a la extensión máxima ";
var navigationHistoryBackwardTooltipString = [];
navigationHistoryBackwardTooltipString["es"] = "Ir a la vista anterior";
var navigationHistoryForwardTooltipString = [];
navigationHistoryForwardTooltipString["es"] = "Ir a la siguiente vista";
var zoomInTooltipString = [];
zoomInTooltipString["es"] = "Acercar (un nivel)";
var zoomOutTooltipString = [];
zoomOutTooltipString["es"] = "Alejar (un nivel)";
var objIdentificationTooltipString = [];
objIdentificationTooltipString["es"] = "Indentificación de objetos (atributos)";
var mapTipsTooltipString = [];
mapTipsTooltipString["es"] = "Desplegar textos emergentes (atributos)";
var measureDistanceTooltipString = [];
measureDistanceTooltipString["es"] = "Medir distancia";
var measureAreaTooltipString = [];
measureAreaTooltipString["es"] = "Medir área";
var printMapTooltipString = [];
printMapTooltipString["es"] = "Imprimir mapa";
var printMapDisabledTooltipString = [];
printMapDisabledTooltipString["es"] = "Imprimir deshabilitado, no hay formato definido en el proyecto de QGIS";
var sendPermalinkTooltipString = [];
sendPermalinkTooltipString["es"] = "Crear permalink al mapa actual"; 
var sendPermalinkLinkFromString = [];
sendPermalinkLinkFromString["es"] = "Enlace al mapa actual"; 
var showHelpTooltipString = [];
showHelpTooltipString["es"] = "Mostrar ayuda";
var showLocationTooltipString = [];
showLocationTooltipString["es"] = "Mostrar localización"; 
var geonamesLoadingString = [];
geonamesLoadingString["es"] = "Buscar...";
var geonamesEmptyString = [];
geonamesEmptyString["es"] = "Buscar lugar";
var resetSearchFieldTooltipString = [];
resetSearchFieldTooltipString["es"] = "Limpiar campo de búsqueda";
var printWindowTitleString = [];
printWindowTitleString["es"] = "El servidor está generando un archivo PDF. Para corregir la escala de impresión desactive la opción 'Ajustar a la página'!";
var printingObjectDataAlternativeString1 = [];
printingObjectDataAlternativeString1["es"] = 'Su navegador no puede abrir archivos PDF directamente. No es problema - usted puede <a href="';
var printingObjectDataAlternativeString2 = [];
printingObjectDataAlternativeString2["es"] = '">descargar el archivo PDF aquí.</a>.</p></object>';
var printButtonTooltipString = [];
printButtonTooltipString["es"] = "Imprimir (Generar PDF)";
var printCancelButtonTooltipString = [];
printCancelButtonTooltipString["es"] = "Cancelar impresión (Cerrar)";
var mapThemeButtonTooltipString = [];
mapThemeButtonTooltipString["es"] = "Haga click para escoger un nuevo tema de mapa";
var tooltipLayerTreeLayerOutsideScale = [];
tooltipLayerTreeLayerOutsideScale["es"] = "Visible a las escalas"; 
var clickPopupTitleString = [];
clickPopupTitleString["es"] = "Resultados"; //FIXME
var contextZoomLayerExtent = [];
contextZoomLayerExtent["es"] = "Zoom a la extensión de la capa"; 
var contextOpenTable = [];
contextOpenTable["es"] = "Abrir tabla de atributos"; 
var contextDataExport = [];
contextDataExport["es"] = "Exportar capa a..."; 
var contextUseExtent = [];
contextUseExtent["es"] = "Usar extensión del mapa actual"; 
var errMessageStartupMapParamString = [];
errMessageStartupMapParamString["es"] = "Falta el parámetro de inicio 'map'!";
var errMessageStartupNotAllParamsFoundString = [];
errMessageStartupNotAllParamsFoundString["es"] = "Faltan algunos parámetros obligatorios";
var errMessageExtentParamWrongPart1 = [];
errMessageExtentParamWrongPart1["es"] = "Parámetro de inicialización '";
var errMessageExtentParamWrongPart2 = [];
errMessageExtentParamWrongPart2["es"] = "' debe estar en formato OpenLayers.Bounds: 'left,bottom,right,top'.";
var errMessageInvalidLanguageCodeString1 = [];
errMessageInvalidLanguageCodeString1["es"] = "El código de idioma es inválido: ";
var errMessageInvalidLanguageCodeString2 = [];
errMessageInvalidLanguageCodeString2["es"] = "Restableciendo el idioma por defecto ";
var errMessageSearchComboNetworkRequestFailureTitleString = [];
errMessageSearchComboNetworkRequestFailureTitleString["es"] = "Falló la solicitud de red";
var errMessageSearchComboNetworkRequestFailureString = [];
errMessageSearchComboNetworkRequestFailureString["es"] = "Falló la solicitud de red para la geometría del resultado de la búsqueda:\n";