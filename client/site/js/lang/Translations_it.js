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
availableLanguages["it"].names["it"] = "Italiano";
var mapAppLoadingString = [];
mapAppLoadingString["it"] = "Caricamento dell'applicazione cartografica...";
var mapLoadingString = [];
mapLoadingString["it"] = "Caricamento della mappa...";
var modeNavigationString = [];
modeNavigationString["it"] = "Modalità: navigazione. Shift+rettangolo o rotella del mouse per zoomare.";
var modeZoomRectangle = [];
modeZoomRectangle["it"] = "Modalità: zoom con rettangolo. Disegnare un rettangolo sulla zona da ingrandire.";
var modeObjectIdentificationString = [];
modeObjectIdentificationString["it"] = "Modalità: identificazione di elementi. Identificare un elemento tramite il click.";
var modeMapTipsString = [];
modeMapTipsString["it"] = "Modalità: suggerimenti. Mostrare i suggerimenti con il cursore del mouse.";
var modeMeasureDistanceString = [];
modeMeasureDistanceString["it"] = "Modalità: misura delle distanze. Interrompere con un doppio clic.";
var modeMeasureAreaString = [];
modeMeasureAreaString["it"] = "Modalità: misura delle superifici. Interrompere con un doppio clic.";
var modeStreetViewString = [];
modeStreetViewString["it"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
var modePrintingString = [];
modePrintingString["it"] = "Modalità: stampa. Spostare o ruotare la zona di stampa. Stampare con il pulsante 'Stampa'.";
var printLoadingString = [];
printLoadingString["it"] = "Avviata la stampa, attendere prego...";
var leftPanelTitleString = [];
leftPanelTitleString["it"] = "Info e strumenti";
var searchPanelTitleString = [];
searchPanelTitleString["it"] = "Cerca";
var mapThemeButtonTitleString = [];
mapThemeButtonTitleString["it"] = "Temi della mappa";
var themeSwitcherWindowTitleString = [];
themeSwitcherWindowTitleString["it"] = "Scelta del tema della mappa";
var themeSwitcherFilterLabelString = [];
themeSwitcherFilterLabelString["it"] = "Filtra sul titolo della mappa: ";
var themeSwitcherAllThemesListViewString = [];
themeSwitcherAllThemesListViewString["it"] = "Tutti i temi della mappa";
var themeSwitcherTooltipResponsibleString = [];
themeSwitcherTooltipResponsibleString["it"] = "Responsabile: ";
var themeSwitcherTooltipTagString = [];
themeSwitcherTooltipTagString["it"] = "Etichette: ";
var themeSwitcherTooltipMapThemeString = [];
themeSwitcherTooltipMapThemeString["it"] = "Tema delle mappa: ";
var themeSwitcherTooltipUpdateString = [];
themeSwitcherTooltipUpdateString["it"] = "Intervallo di aggiornamento: ";
var themeSwitcherTooltipLastUpdateString = [];
themeSwitcherTooltipLastUpdateString["it"] = "Utimo aggiornamento: ";
var themeSwitcherTooltipPwProtectedString = [];
themeSwitcherTooltipPwProtectedString["it"] = "protetto tramite password";
var emptyThemeSearchFieldString = [];
emptyThemeSearchFieldString["it"] = "Inserire stringa di filtro";
var resetThemeSearchFieldTooltipString = [];
resetThemeSearchFieldTooltipString["it"] = "Resetta il filtro per la ricerca del tema della mappa";
var mapPanelTitleString = [];
mapPanelTitleString["it"] = "Mappa";
var layerTreeTitleString = [];
layerTreeTitleString["it"] = "Layer";
var backgroundLayerTitleString = [];
backgroundLayerTitleString["it"] = "Background Layers";
var externalLayerTitleString = [];
externalLayerTitleString["it"] = "External Layers"; //FIXME
var layerOrderPanelTitleString = [];
layerOrderPanelTitleString["it"] = "Ordine dei layer";
var layerOrderPanelLayerSettingsTooltipString = [];
layerOrderPanelLayerSettingsTooltipString["it"] = "Impostazioni";
var layerOrderPanelVisibilityChangeTooltipString = [];
layerOrderPanelVisibilityChangeTooltipString["it"] = "Cambia la visilità del layer";
var layerOrderPanelMoveLayerTextString = [];
layerOrderPanelMoveLayerTextString["it"] = "Sposta layer";
var layerOrderPanelTransparencyTooltipString = [];
layerOrderPanelTransparencyTooltipString["it"] = "Trasparenza {0}%";
var legendTabTitleString = [];
legendTabTitleString["it"] = "Legenda";
var legendTabLoadingString = [];
legendTabLoadingString["it"] = "Legenda in caricamento, attendere prego...";
var metadataTabTitleString = [];
metadataTabTitleString["it"] = "Metadati";
var helpWindowTitleString = [];
helpWindowTitleString["it"] = "Aiuto";
var legendMetadataWindowTitleString = [];
legendMetadataWindowTitleString["it"] = "Legenda e metadati del layer";
var metadataSectionTitleString = [];
metadataSectionTitleString["it"] = "Metadati del layer";
var abstractString = [];
abstractString["it"] = "Riassunto:";
var layerQueryable = [];
layerQueryable["it"] = "Questo layer è interrogabile: ";
var yesString = [];
yesString["it"] = "sl";
var noString = [];
noString["it"] = "no";
var layerGroupString = [];
layerGroupString["it"] = "Gruppo dei layer";
var displayFieldString = [];
displayFieldString["it"] = "Campo visualizzato";
var coordinateSystemsString = [];
coordinateSystemsString["it"] = "Sistemi di coordinate disponibili";
var geographicExtentString = [];
geographicExtentString["it"] = "Estensione geografica";
var westString = [];
westString["it"] = "ovest";
var eastString = [];
eastString["it"] = "est";
var northString = [];
northString["it"] = "nord";
var southString = [];
southString["it"] = "sud";
var attributesString = [];
attributesString["it"] = "Attributi";
var attributeNameString = [];
attributeNameString["it"] = "Attribute name";
var attributeTypeString = [];
attributeTypeString["it"] = "Type";
var attributeCommentString = [];
attributeCommentString["it"] = "Comment";
var attributeLengthString = [];
attributeLengthString["it"] = "Length";
var attributePrecisionString = [];
attributePrecisionString["it"] = "Precision";
var objectIdentificationTextLabel = [];
objectIdentificationTextLabel["it"] = "Identificazione oggetti: ";
var coordinateTextLabel = [];
coordinateTextLabel["it"] = "Coordinate:";
var searchFieldDefaultTextString = [];
searchFieldDefaultTextString["it"] = "Ricerca (indirizzi, n° delle particelle, nomi, ecc.)";
var searchButtonString = [];
searchButtonString["it"] = "Cerca";
var resetButtonString = [];
resetButtonString["it"] = "Annulla";
var pleaseWaitString = [];
pleaseWaitString["it"] = "Attendere prego";
var searchResultString = [];
searchResultString["it"] = "Risultati ricerca";
var networkErrorString = [];
networkErrorString["it"] = "Errore di rete";
var missingOrInvalidSearchParams = [];
missingOrInvalidSearchParams["it"] = "Valori mancanti o in validi nel modulo di ricerca";
var searchErrorString = [];
searchErrorString["it"] = "Errore durante la ricerca";
var searchNoRecordsFoundString = [];
searchNoRecordsFoundString["it"] = "Nessun risultato";
var printSettingsToolbarTitleString = [];
printSettingsToolbarTitleString["it"] = "Configurazione della stampa";
var printSettingsRotationTextlabelString = [];
printSettingsRotationTextlabelString["it"] = "Rotazione: ";
var printButtonTextString = [];
printButtonTextString["it"] = "Stampa";
var printCancelButtonTextString = [];
printCancelButtonTextString["it"] = "Annullare";
var objectIdentificationModeString = [];
objectIdentificationModeString["topMostHit"] = [];
objectIdentificationModeString["topMostHit"]["it"] = "Layer in alto";
objectIdentificationModeString["allLayers"] = [];
objectIdentificationModeString["allLayers"]["it"] = "Tutti i layer";
objectIdentificationModeString["activeLayers"] = [];
objectIdentificationModeString["activeLayers"]["it"] = "Layer attivo";
var measureDistanceResultPrefixString = [];
measureDistanceResultPrefixString["it"] = "Distanza";
var measureAreaResultPrefixString = [];
measureAreaResultPrefixString["it"] = "Area";
var zoomRectangleTooltipString = [];
zoomRectangleTooltipString["it"] = "Zoom su rettangolo";
var zoomFullViewTooltipString = [];
zoomFullViewTooltipString["it"] = "Zoom all'estensione massima";
var navigationHistoryBackwardTooltipString = [];
navigationHistoryBackwardTooltipString["it"] = "Inquadramento precedente";
var navigationHistoryForwardTooltipString = [];
navigationHistoryForwardTooltipString["it"] = "Inquadramento successivo";
var zoomInTooltipString = [];
zoomInTooltipString["it"] = "Ingrandisci";
var zoomOutTooltipString = [];
zoomOutTooltipString["it"] = "Rimpicciolisci";
var objIdentificationTooltipString = [];
objIdentificationTooltipString["it"] = "Identificazione di oggetti (attributi)";
var mapTipsTooltipString = [];
mapTipsTooltipString["it"] = "Mostra le informazioni (attributi)";
var measureDistanceTooltipString = [];
measureDistanceTooltipString["it"] = "Misura distanza";
var measureAreaTooltipString = [];
measureAreaTooltipString["it"] = "Misura superficie";
var printMapTooltipString = [];
printMapTooltipString["it"] = "Stampa la mappa";
var printMapDisabledTooltipString = [];
printMapDisabledTooltipString["it"] = "Stampa disabilitata: nel progetto QGIS non è definito alcun layout";
var sendPermalinkTooltipString = [];
sendPermalinkTooltipString["it"] = "Create permalink to current map"; //FIXME
var sendPermalinkLinkFromString = [];
sendPermalinkLinkFromString["it"] = "Link to current map"; //FIXME
var showHelpTooltipString = [];
showHelpTooltipString["it"] = "Mostra l'aiuto";
var showLocationTooltipString = [];
showLocationTooltipString["it"] = "Show Location";  //FIXME
var geonamesLoadingString = [];
geonamesLoadingString["it"] = "Ricerca...";
var geonamesEmptyString = [];
geonamesEmptyString["it"] = "Cerca località";
var resetSearchFieldTooltipString = [];
resetSearchFieldTooltipString["it"] = "Azzerare il campo di ricerca";
var printWindowTitleString = [];
printWindowTitleString["it"] = "Il server sta generando il file PDF. Per stampare alla scala corretta disattivare l'opzione 'Ridimensiona alla pagina'!"
var printingObjectDataAlternativeString1 = [];
printingObjectDataAlternativeString1["it"] = 'Sembra che il vostro browser non possa aprire direttamente i files PDF. Nessun problema -  potete <a href="';
var printingObjectDataAlternativeString2 = [];
printingObjectDataAlternativeString2["it"] = '">scaricare il PDF qui.</a>.</p></object>';
var printButtonTooltipString = [];
printButtonTooltipString["it"] = "Stampa (generare un PDF)";
var printCancelButtonTooltipString = [];
printCancelButtonTooltipString["it"] = "Annulla la stampa (chiudi)";
var mapThemeButtonTooltipString = [];
mapThemeButtonTooltipString["it"] = "Click per scegliere un nuovo tema di mappa";
var tooltipLayerTreeLayerOutsideScale = [];
tooltipLayerTreeLayerOutsideScale["it"] = "Visibile alle scale";
var clickPopupTitleString = [];
clickPopupTitleString["it"] = "Results"; //FIXME
var contextZoomLayerExtent = [];
contextZoomLayerExtent["it"] = "Zoom all'estensione del layer";
var contextOpenTable = [];
contextOpenTable["it"] = "Open attribute table";
var contextDataExport = [];
contextDataExport["it"] = "Export layer to...";
var contextUseExtent = [];
contextUseExtent["it"] = "Use current map extent";
var errMessageStartupMapParamString = [];
errMessageStartupMapParamString["it"] = "Il parametro di inizializzazione manca!";
var errMessageStartupNotAllParamsFoundString = [];
errMessageStartupNotAllParamsFoundString["it"] = "Alcuni parametri necessari mancano.";
var errMessageExtentParamWrongPart1 = [];
errMessageExtentParamWrongPart1["it"] = "Parametro di inizializzazione '";
var errMessageExtentParamWrongPart2 = [];
errMessageExtentParamWrongPart2["it"] = "' deve essere nel formato di OpenLayers.Bounds: 'left,bottom,right,top'.";
var errMessageInvalidLanguageCodeString1 = [];
errMessageInvalidLanguageCodeString1["it"] = "Identificativo della lingua non corretto: ";
var errMessageInvalidLanguageCodeString2 = [];
errMessageInvalidLanguageCodeString2["it"] = "Si utilizza la lingua di default ";
var errMessageSearchComboNetworkRequestFailureTitleString = [];
errMessageSearchComboNetworkRequestFailureTitleString["it"] = "La richiesta di rete è fallita";
var errMessageSearchComboNetworkRequestFailureString = [];
errMessageSearchComboNetworkRequestFailureString["it"] = "La richiesta di rete è fallita per la geometria del risultato di ricerca:\n";