/*
 *
 * Translations.js -- part of Quantum GIS Web Client
 *
 * Copyright (2010-2012), The QGIS Project All rights reserved.
 * Quantum GIS Web Client is released under a BSD license. Please see
 * https://github.com/qgis/qgis-web-client/blob/master/README
 * for the full text of the license and the list of contributors.
 *
*/

//indicating which of the help files have been translated already
var availableHelpLanguages = Array("en","es","de","hu","it","pl","fr","ro","sk");

// list of available languages
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

// translations of languages
// first language index is fixed, second variable
// The string is the name of the first language translated in the second language.

//English;
availableLanguages["en"].names["en"] = "English";
availableLanguages["en"].names["de"] = "Englisch";
availableLanguages["en"].names["es"] = "Inglés";
availableLanguages["en"].names["fr"] = "Anglais";
availableLanguages["en"].names["it"] = "Inglese";
availableLanguages["en"].names["pt_PT"] = "Inglês";
availableLanguages["en"].names["uk"] = "Англійська";
availableLanguages["en"].names["hu"] = "Angol";
availableLanguages["en"].names["ro"] = "Engleză";
availableLanguages["en"].names["ru"] = "Ангийский";
availableLanguages["en"].names["sl"] = "angleščina";
availableLanguages["en"].names["nl"] = "Engels";
availableLanguages["en"].names["pl"] = "Angielski";
availableLanguages["en"].names["sk"] = "Anglicky";

//German
availableLanguages["de"].names["en"] = "German";
availableLanguages["de"].names["de"] = "Deutsch";
availableLanguages["de"].names["es"] = "Alemán";
availableLanguages["de"].names["fr"] = "Allemand";
availableLanguages["de"].names["it"] = "Tedesco";
availableLanguages["de"].names["pt_PT"] = "Alemão";
availableLanguages["de"].names["uk"] = "Німецька";
availableLanguages["de"].names["hu"] = "Német";
availableLanguages["de"].names["ro"] = "Germană";
availableLanguages["de"].names["ru"] = "Немецкий";
availableLanguages["de"].names["sl"] = "nemščina";
availableLanguages["de"].names["nl"] = "Duits";
availableLanguages["de"].names["pl"] = "Niemiecki";
availableLanguages["de"].names["sk"] = "Nemecky";

//French
availableLanguages["fr"].names["en"] = "French";
availableLanguages["fr"].names["de"] = "Französisch";
availableLanguages["fr"].names["es"] = "Francés";
availableLanguages["fr"].names["fr"] = "Français";
availableLanguages["fr"].names["it"] = "Francese";
availableLanguages["fr"].names["pt_PT"] = "Francês";
availableLanguages["fr"].names["uk"] = "Французька";
availableLanguages["fr"].names["hu"] = "Francia";
availableLanguages["fr"].names["ro"] = "Franceză";
availableLanguages["fr"].names["ru"] = "Францкузский";
availableLanguages["fr"].names["sl"] = "francoščina";
availableLanguages["fr"].names["nl"] = "Frans";
availableLanguages["fr"].names["pl"] = "Francuski";
availableLanguages["fr"].names["sk"] = "Francúzsky";

//Italian
availableLanguages["it"].names["en"] = "Italian";
availableLanguages["it"].names["de"] = "Italienisch";
availableLanguages["it"].names["es"] = "Italiano";
availableLanguages["it"].names["fr"] = "Italien";
availableLanguages["it"].names["it"] = "Italiano";
availableLanguages["it"].names["pt_PT"] = "Italiano";
availableLanguages["it"].names["uk"] = "Італійська";
availableLanguages["it"].names["hu"] = "Olasz";
availableLanguages["it"].names["ro"] = "Italiană";
availableLanguages["it"].names["ru"] = "Итальянский";
availableLanguages["it"].names["sl"] = "italijanščina";
availableLanguages["it"].names["nl"] = "Italiaans";
availableLanguages["it"].names["pl"] = "Włoski";
availableLanguages["it"].names["sk"] = "Taliansky";

//Portuguese
availableLanguages["pt_PT"].names["en"] = "Portuguese";
availableLanguages["pt_PT"].names["de"] = "Portugiesisch";
availableLanguages["pt_PT"].names["es"] = "Portugués";
availableLanguages["pt_PT"].names["fr"] = "Portugais";
availableLanguages["pt_PT"].names["it"] = "Portoghese";
availableLanguages["pt_PT"].names["pt_PT"] = "Português";
availableLanguages["pt_PT"].names["uk"] = "Португальська";
availableLanguages["pt_PT"].names["hu"] = "Portugál";
availableLanguages["pt_PT"].names["ro"] = "Portugheză";
availableLanguages["pt_PT"].names["ru"] = "Португальский";
availableLanguages["pt_PT"].names["sl"] = "portugalščina";
availableLanguages["pt_PT"].names["nl"] = "Portugees";
availableLanguages["pt_PT"].names["pl"] = "Portugalski";
availableLanguages["pt_PT"].names["sk"] = "Portugalsky";

//Ukrainian
availableLanguages["uk"].names["en"] = "Ukrainian";
availableLanguages["uk"].names["de"] = "Ukrainisch";
availableLanguages["uk"].names["es"] = "Ucraniano";
availableLanguages["uk"].names["fr"] = "Ukrainien";
availableLanguages["uk"].names["it"] = "Ucraino";
availableLanguages["uk"].names["pt_PT"] = "Ucraniano";
availableLanguages["uk"].names["uk"] = "Українська";
availableLanguages["uk"].names["hu"] = "Ukrán";
availableLanguages["uk"].names["ro"] = "Ucraineană";
availableLanguages["uk"].names["ru"] = "Украинский";
availableLanguages["uk"].names["sl"] = "ukrajinščina";
availableLanguages["uk"].names["nl"] = "Oekraiëns";
availableLanguages["uk"].names["pl"] = "Ukraiński";
availableLanguages["uk"].names["sk"] = "Ukrainsky";

//Hungarian
availableLanguages["hu"].names["en"] = "Hungarian";
availableLanguages["hu"].names["de"] = "Ungarisch";
availableLanguages["hu"].names["es"] = "Húngaro";
availableLanguages["hu"].names["fr"] = "Hongrois";
availableLanguages["hu"].names["it"] = "Ungherese";
availableLanguages["hu"].names["pt_PT"] = "Húngaro";
availableLanguages["hu"].names["uk"] = "Угорська";
availableLanguages["hu"].names["hu"] = "Magyar";
availableLanguages["hu"].names["ro"] = "Maghiară";
availableLanguages["hu"].names["ru"] = "Венгерский";
availableLanguages["hu"].names["sl"] = "madžarščina";
availableLanguages["hu"].names["nl"] = "Hongaars";
availableLanguages["hu"].names["pl"] = "Węgierski";
availableLanguages["hu"].names["sk"] = "Maďarsky";

//Romanian
availableLanguages["ro"].names["en"] = "Romanian";
availableLanguages["ro"].names["de"] = "Rumänisch";
availableLanguages["ro"].names["es"] = "Rumano";
availableLanguages["ro"].names["fr"] = "Roumain";
availableLanguages["ro"].names["it"] = "Rumeno";
availableLanguages["ro"].names["pt_PT"] = "Romeno";
availableLanguages["ro"].names["uk"] = "Румунська";
availableLanguages["ro"].names["hu"] = "Román";
availableLanguages["ro"].names["ro"] = "Română";
availableLanguages["ro"].names["ru"] = "Румынский";
availableLanguages["ro"].names["sl"] = "romunščina";
availableLanguages["ro"].names["nl"] = "Roemeens";
availableLanguages["ro"].names["pl"] = "Rumuński";
availableLanguages["ro"].names["sk"] = "Rumunsky";

//Russian
availableLanguages["ru"].names["en"] = "Russian";
availableLanguages["ru"].names["de"] = "Russish";
availableLanguages["ru"].names["es"] = "Ruso";
availableLanguages["ru"].names["fr"] = "Russe";
availableLanguages["ru"].names["it"] = "Russa";
availableLanguages["ru"].names["pt_PT"] = "Russa";
availableLanguages["ru"].names["uk"] = "Російська";
availableLanguages["ru"].names["hu"] = "Orosz";
availableLanguages["ru"].names["ro"] = "Rusă";
availableLanguages["ru"].names["ru"] = "Русский";
availableLanguages["ru"].names["sl"] = "ruščina";
availableLanguages["ru"].names["nl"] = "Russisch";
availableLanguages["ru"].names["pl"] = "Rosyjski";
availableLanguages["ru"].names["sk"] = "Rusky";

//Slovenian
availableLanguages["sl"].names["en"] = "Slovenian";
availableLanguages["sl"].names["de"] = "Slowenisch";
availableLanguages["sl"].names["es"] = "esloveno";
availableLanguages["sl"].names["fr"] = "slovène";
availableLanguages["sl"].names["it"] = "sloveno";
availableLanguages["sl"].names["pt_PT"] = "esloveno";
availableLanguages["sl"].names["uk"] = "Словенська";
availableLanguages["sl"].names["hu"] = "szlovén";
availableLanguages["sl"].names["ro"] = "sloven";
availableLanguages["sl"].names["ru"] = "словенский";
availableLanguages["sl"].names["sl"] = "slovenščina";
availableLanguages["sl"].names["nl"] = "Sloveens";
availableLanguages["sl"].names["pl"] = "Słoweński";
availableLanguages["sl"].names["sk"] = "Slovinsky";

//Dutch; 
availableLanguages["nl"].names["en"] = "Dutch";
availableLanguages["nl"].names["de"] = "Niederlandisch";
availableLanguages["nl"].names["es"] = "Holandés";
availableLanguages["nl"].names["fr"] = "Néerlandais";
availableLanguages["nl"].names["it"] = "Olandese";
availableLanguages["nl"].names["pt_PT"] = "Holandês";
availableLanguages["nl"].names["uk"] = "Голандський";
availableLanguages["nl"].names["hu"] = "Holland";
availableLanguages["nl"].names["ro"] = "Olandez";
availableLanguages["nl"].names["sl"] = "Nizozemski";
availableLanguages["nl"].names["nl"] = "Nederlands";
availableLanguages["nl"].names["pl"] = "Holenderski";
availableLanguages["nl"].names["sk"] = "Holandsky";

//Polish; 
availableLanguages["pl"].names["en"] = "Polish";
availableLanguages["pl"].names["de"] = "Polish"; //FIXME
availableLanguages["pl"].names["es"] = "Polaco"; //FIXed
availableLanguages["pl"].names["fr"] = "Polonais";
availableLanguages["pl"].names["it"] = "Polacco";
availableLanguages["pl"].names["pt_PT"] = "Polish"; //FIXME
availableLanguages["pl"].names["uk"] = "Polish"; //FIXME
availableLanguages["pl"].names["hu"] = "Polish"; //FIXME
availableLanguages["pl"].names["ro"] = "Polish"; //FIXME
availableLanguages["pl"].names["sl"] = "Polish"; //FIXME
availableLanguages["pl"].names["nl"] = "Polish"; //FIXME
availableLanguages["pl"].names["pl"] = "Polski";
availableLanguages["pl"].names["sk"] = "Poľsky";


//Slovak; 
availableLanguages["sk"].names["en"] = "Slovak";
availableLanguages["sk"].names["de"] = "Slovak"; //FIXME
availableLanguages["sk"].names["es"] = "Eslovaco"; //fixed
availableLanguages["sk"].names["fr"] = "Slovak";
availableLanguages["sk"].names["it"] = "Slovak";
availableLanguages["sk"].names["pt_PT"] = "Slovak"; //FIXME
availableLanguages["sk"].names["uk"] = "Slovak"; //FIXME
availableLanguages["sk"].names["hu"] = "Slovak"; //FIXME
availableLanguages["sk"].names["ro"] = "Slovak"; //FIXME
availableLanguages["sk"].names["sl"] = "Slovak"; //FIXME
availableLanguages["sk"].names["nl"] = "Slovak"; //FIXME
availableLanguages["sk"].names["pl"] = "Slovak";
availableLanguages["sk"].names["sk"] = "Slovensky";

/***********************
Status messages
***********************/

//map loading string displayed when starting the map application
var mapAppLoadingString = [];
mapAppLoadingString["en"] = "Loading map application...";
mapAppLoadingString["es"] = "Cargando la aplicación del mapa...";
mapAppLoadingString["de"] = "Kartenapplikation wird geladen...";
mapAppLoadingString["fr"] = "Chargement de l'application cartographique...";
mapAppLoadingString["it"] = "Caricamento dell'applicazione cartografica...";
mapAppLoadingString["pt_PT"] = "Carregando a aplicação do mapa...";
mapAppLoadingString["uk"] = "Завантаження додатку...";
mapAppLoadingString["hu"] = "Térkép kliens betöltése";
mapAppLoadingString["ro"] = "Aplicația se încarcă...";
mapAppLoadingString["ru"] = "Загрузка приложения...";
mapAppLoadingString["sl"] = "Nalaganje aplikacije...";
mapAppLoadingString["nl"] = "Kaartapplicatie laden...";
mapAppLoadingString["pl"] = "Ładowanie aplikacji mapy...";
mapAppLoadingString["sk"] = "Vytváram mapovú aplikáciu...";

//indicating that map app was loaded and we are now loading the map
var mapLoadingString = [];
mapLoadingString["en"] = "Loading Map...";
mapLoadingString["es"] = "Cargando mapa...";
mapLoadingString["de"] = "Karte wird geladen...";
mapLoadingString["fr"] = "Chargement de la carte...";
mapLoadingString["it"] = "Caricamento della mappa...";
mapLoadingString["pt_PT"] = "Carregando o mapa...";
mapLoadingString["uk"] = "Завантаження мапи...";
mapLoadingString["hu"] = "Térkép betöltése folyamatban...";
mapLoadingString["ro"] = "Harta se încarcă...";
mapLoadingString["ru"] = "Загрузка карты...";
mapLoadingString["sl"] = "Nalaganje karte...";
mapLoadingString["nl"] = "Kaart laden...";
mapLoadingString["pl"] = "Ładowanie mapy...";
mapLoadingString["sk"] = "Načítavam mapu...";

//mode string for navigation
var modeNavigationString = [];
modeNavigationString["en"] = "Mode: navigation. Shift/rectangle or mouse wheel for zooming.";
modeNavigationString["es"] = "Modo: navegación. Shift/rectángulo o rueda del ratón para hacer zoom.";
modeNavigationString["de"] = "Modus: Navigation. Shift/Rechteck aufziehen oder Mausrad zum zoomen.";
modeNavigationString["fr"] = "Mode: navigation. Majuscule+tracer un rectangle ou roulette de la souris pour zoomer.";
modeNavigationString["it"] = "Modalità: navigazione. Shift+rettangolo o rotella del mouse per zoomare.";
modeNavigationString["pt_PT"] = "Modo: navegação. Shift+rectângulo ou roda do rato para efectuar zoom.";
modeNavigationString["uk"] = "Режим: навігація. Shift/прямокутне виділення або колесо миші для зміни масштабу.";
modeNavigationString["hu"] = "Mód: navigáció. Shift / téglalappal vagy egér görgővel lehet nagyítani.";
modeNavigationString["ro"] =  "Mod: navigare. Shift+desenează un dreptunghi; folosește rotița mouse-ului pentru zoom.";
modeNavigationString["ru"] =  "Режим:навигация. Shift+выделение прямоугольника или колесо мыши для изменения масштаба.";
modeNavigationString["sl"] =  "Način: navigacija. Miška (lev gumb premik, kolešček povečava), Tipkovnica (smerne tipke in +-).";
modeNavigationString["nl"] = "Mode: navigatie. Shift/rechthoek of muiswiel om te zoomen.";
modeNavigationString["pl"] = "Tryb: nawigacja. Shift+zaznacz obszar lub użyj kółka myszy, aby przybliżyć.";
modeNavigationString["sk"] = "Mód: Navigácia. Shift/obdlžnik alebo koliesko myši pre približovanie";

//mode string for rectangle zoom
var modeZoomRectangle = [];
modeZoomRectangle["en"] = "Mode: zoom with rectangle. Draw rectangle over region you wish to zoom in.";
modeZoomRectangle["es"] = "Modo: zoom con rectángulo. Dibujar el rectángulo sobre la región que desea acercar.";
modeZoomRectangle["de"] = "Modus: Zoom mit Rechteck. Ziehen Sie die gewünschte Region auf.";
modeZoomRectangle["fr"] = "Mode: zoom rectangle. Dessiner un rectangle pour zoomer sur la zone souhaitée.";
modeZoomRectangle["it"] = "Modalità: zoom con rettangolo. Disegnare un rettangolo sulla zona da ingrandire.";
modeZoomRectangle["pt_PT"] = "Modo: zoom com rectângulo. Desenhar um rectângulo sobre a zona que deseja aproximar.";
modeZoomRectangle["uk"] = "Режим: збільшення прямокутником. Виділіть прямокутником регіон який Ви бажаєте збільшити.";
modeZoomRectangle["hu"] = "Mód: nagyítás kijelöléssel. Rajzolj egy téglalapot a nagyítani kívánt területre.";
modeZoomRectangle["ro"] = "Mod: zoom cu dreptunghi. Se desenează un dreptunghi deasupra regiunii dorite.";
modeZoomRectangle["ru"] = "Режим: масштаб прямоугольником. Выделите прямоугольником регион чтобы увеличить его.";
modeZoomRectangle["sl"] = "Način: povečava z pravokotnikom. Nariši pravokotnik na območju željene povečave.";
modeZoomRectangle["nl"] = "Mode: zoomen met rechthoek. Teken een rechthoek over de regio waar je wenst te zoomen.";
modeZoomRectangle["pl"] = "Tryb: przybliż zaznaczeniem. Narysuj prostokąt obejmujący obszar, który chcesz zbliżyć.";
modeZoomRectangle["sk"] = "Mód: približovanie obdĺžnikom. Nakresli odbĺžnik nad oblasťou, ktorú chceš priblížiť";

//mode string for attribute data detailed
var modeObjectIdentificationString = [];
modeObjectIdentificationString["en"] = "Mode: object identification. Move the mouse over an object to identify it, click it to view its attribute data.";
modeObjectIdentificationString["es"] = "Modo: Identificación de objeto. Mueva el cursor sobre un objeto para identificarlo, haga click sobre él para ver sus atributos.";
modeObjectIdentificationString["de"] = "Modus: Objektidentifikation. Bewegen Sie die Maus über das Objekt, um es zu identifizeren, klicken Sie es an, um seine Attributdaten anzuzeigen.";
modeObjectIdentificationString["fr"] = "Mode: identification d'objets. Déplacez la souris sur un objet pour l'identifier, cliquez dessus pour afficher les attributs.";
modeObjectIdentificationString["it"] = "Modalità: identificazione di elementi. Identificare un elemento tramite il click.";
modeObjectIdentificationString["pt_PT"] = "Modo: identificação do elemento. Ver atributos dos dados por meio de um clique do rato.";
modeObjectIdentificationString["uk"] = "Режим: вибір об'єкта. Клацніть лівою кнопкою щоб побачити атрибути об'єкта.";
modeObjectIdentificationString["hu"] = "Mód: térképi elem azonosítás. Mozgasd az egeret a kívánt térképi elem fölé, klikkelj rá.";
modeObjectIdentificationString["ro"] = "Mod: identificare obiect. Pentru aceasta se pune mouse-ul pe el; se poate da click pentru vizualizare atribute";
modeObjectIdentificationString["ru"] = "Режим: идентификация объекта. Наведите указатель мыши на объект чтобы идентифицировать его. Кликните чтобы просмотреть атрибуты";
modeObjectIdentificationString["sl"] = "Način: poizvedba. Premakni miško na objekt zanimanja za identifikacijo ali klikni na objektu za prikaz opisnih podatkov.";
modeObjectIdentificationString["nl"] = "Mode: object identificieren. Beweeg de muis over een object om het te identificieren, klik om de attribuutdata te bekijken.";
modeObjectIdentificationString["pl"] = "Tryb: identyfikacja obiektów. Najedź kursorem na obiekt, aby go zidentyfikować; kliknij na obiekt, aby zobaczyć wszystkie atrybuty";
modeObjectIdentificationString["sk"] = "Mód: idenfikáca objektu. Posuň myš nad objekt pre identifikáciu klikni pre zobrazenie atribútov";

//mode string for map tips (display main attribute with tooltips)
var modeMapTipsString = [];
modeMapTipsString["en"] = "Mode: MapTips. Display on mouse over with Tooltips.";
modeMapTipsString["es"] = "Modo: MapTips. Despliega textos emergentes con el cursor del ratón.";
modeMapTipsString["de"] = "Modus: MapTips. Anzeige mit Mouseover über tooltips.";
modeMapTipsString["fr"] = "Mode: infobulles. Afficher les infobulles au survol du curseur de la souris.";
modeMapTipsString["it"] = "Modalità: suggerimenti. Mostrare i suggerimenti con il cursore del mouse.";
modeMapTipsString["pt_PT"] = "Modo: MapTips. Mostra dicas de atributos do mapa.";
modeMapTipsString["uk"] = "Режим: випливаючі підказки. Наведіть мишою на об'єкт аби побачити підказку.";
modeMapTipsString["hu"] = "Mód: Térkép tipp. Megjelenik az egér fölött a buborék információ."; //FIXME
modeMapTipsString["ro"] = "Mod: Indicii hartă. Se afișează cand mouse-u este deasupra.";
modeMapTipsString["ru"] = "Режим: всплывающие подсказки. Показывать подсказки при наведении мыши.";
modeMapTipsString["sl"] = "Mode: MapTips. Display on mouse over with Tooltips.";	//FIXME
modeMapTipsString["nl"] = "Mode: MapTips. Weergeven tooltips tijdens mouse-over.";
modeMapTipsString["pl"] = "Mode: podpowiedzi. Wyświetl podpowiedź po najechaniu kursorem na obiekt.";
modeMapTipsString["sk"] = "Mód: Malé pomôcky. Zobrazíš ponechaním kurzoru nad objektom";

//mode measure distance
var modeMeasureDistanceString = [];
modeMeasureDistanceString["en"] = "Mode: measure distance. Finish with double click.";
modeMeasureDistanceString["es"] = "Modo: medir distancia. Finalizar con doble click.";
modeMeasureDistanceString["de"] = "Modus: Distanzmessung. Beenden mit Doppelklick.";
modeMeasureDistanceString["fr"] = "Mode: mesure de distance. Terminer avec un double-clic.";
modeMeasureDistanceString["it"] = "Modalità: misura delle distanze. Interrompere con un doppio clic.";
modeMeasureDistanceString["pt_PT"] = "Modo: medir distância. Para terminar, efectuar duplo clique.";
modeMeasureDistanceString["uk"] = "Режим: вимірювання відстаней. Подвійне клацання щоб завершити.";
modeMeasureDistanceString["hu"] = "Mód: távolság mérés. Befejezés dupla kattintással.";
modeMeasureDistanceString["ro"] = "Mod: masoară distanța. Se face dublu click pentru a termina.";
modeMeasureDistanceString["ru"] = "Режим: измерение дистанции. Двойной клик чтобы завершить.";
modeMeasureDistanceString["sl"] = "Način: merjenje razdalje. Zaključi z dvoklikom.";
modeMeasureDistanceString["nl"] = "Mode: afstand meten. Beëindig door te dubbelklikken.";
modeMeasureDistanceString["pl"] = "Tryb: pomiar odległości. Kliknij dwukrotnie, aby zakończyć pomiar.";
modeMeasureDistanceString["sk"] = "Mód: meranie. Ukončíš dvojklikom.";

//mode measure area
var modeMeasureAreaString = [];
modeMeasureAreaString["en"] = "Mode: measure area. Finish with double click.";
modeMeasureAreaString["es"] = "Modo: medir área. Finalizar con doble click.";
modeMeasureAreaString["de"] = "Modus: Flächenmessung. Beenden mit Doppelklick.";
modeMeasureAreaString["fr"] = "Mode: mesure de surface. Terminer avec un double-clic.";
modeMeasureAreaString["it"] = "Modalità: misura delle superifici. Interrompere con un doppio clic.";
modeMeasureAreaString["pt_PT"] = "Modo: medir área. Para terminar, efectuar duplo clique.";
modeMeasureAreaString["uk"] = "Режим: вимірювання площі. Подвійне клацання щоб завершити.";
modeMeasureAreaString["hu"] = "Mód: terület mérés. Befejezés dupla kattintással.";
modeMeasureAreaString["ro"] = "Mod: masoară aria. Se face dublu click pentru a termina";
modeMeasureAreaString["ru"] = "Режим: измерение площади. Двойной клик чтобы завершить.";
modeMeasureAreaString["sl"] = "Način: merjenje površine. Zaključi z dvoklikom.";
modeMeasureAreaString["nl"] = "Mode: oppervlakte berekenen. Beëindig door te dubbelklikken.";
modeMeasureAreaString["pl"] = "Tryb: pomiar powierzchni. Kliknij dwukrotnie, aby zakończyć pomiar.";
modeMeasureAreaString["sk"] = "Mód: meranie plochy. Ukončite dvojklikom,";

//mode StreetView
var modeStreetViewString = [];
modeStreetViewString["en"] = "Mode: GoogleStreetView. Click on the road.";
modeStreetViewString["es"] = "Modo: GoogleStreetView. Pulsar sobre una carretera."; 
modeStreetViewString["de"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["fr"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["it"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["pt_PT"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["uk"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["hu"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["ro"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["ru"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["sl"] = "Način: GoogleStreetView. Klikni na cesto.";
modeStreetViewString["nl"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["pl"] = "Mode: GoogleStreetView. Click on the road."; //FIXME
modeStreetViewString["sk"] = "Mód: GoogleStreetView. Klikni na cestu"; //FIXME


//mode printing
var modePrintingString = [];
modePrintingString["en"] = "Mode: printing. Move or rotate the map extent. Print with the 'Print'-Button.";
modePrintingString["es"] = "Modo: imprimir. Mueva o rote la extensión del mapa. Imprima con el botón 'imprimir'.";
modePrintingString["de"] = "Modus: Drucken. Verschieben oder Rotieren Sie den Kartenausschnitt. Drucken mit 'Drucken'-Knopf.";
modePrintingString["fr"] = "Mode: impression. Déplacer ou faire pivoter la zone d'impression. Imprimer avec le bouton 'Imprimer'.";
modePrintingString["it"] = "Modalità: stampa. Spostare o ruotare la zona di stampa. Stampare con il pulsante 'Stampa'.";
modePrintingString["pt_PT"] = "Modo: impressão. Mover ou girar a extensão do mapa. Imprimir com o botão 'Imprimir'.";
modePrintingString["uk"] = "Режим: друк. Обаріть ділянку мапи. Роздрукуйте кнопкою 'Друк'.";
modePrintingString["hu"] = "Mód: nyomtatás. Mozgatható, forgatható a nyomtatási terület.";
modePrintingString["ro"] =  "Mod: tipărire/print. Suprafața hărtii se poate mișca sau roti. Când ești gata apasă butonul 'Print'";
modePrintingString["ru"] =  "Режим:печать. Двигайте и поворачивайте прямоугольник чтобы выбрать участок карты. Для печати нажмите кнопку 'Печать'.";
modePrintingString["sl"] =  "Način: tiskanje. Premakni ali zasuči območje tiska. Nadaljuj z gumbom 'Tiskanje'.";
modePrintingString["nl"] = "Mode: afdrukken. Verplaats of roteer de kaartextent. Druk af met de 'Afdrukken'-knop.";
modePrintingString["pl"] = "Tryb: drukowanie. Przesuń lub obróć zasięg mapy. Wydrukuj widok klikając przycisk 'Drukuj'.";
modePrintingString["sk"] = "Mód: Tlač. Posuňte, alebo otočte  rozsah mapy. Vytlačte stalčením tlačidla 'Tlač'.";

//indicating is waiting for print
var printLoadingString = [];
printLoadingString["en"] = "Printing initialised. Please wait...";
printLoadingString["es"] = "Impresión inicializada, por favor espere...";
printLoadingString["de"] = "Der Druckauftrag ist erfolgt. Bitte haben sie etwas Geduld...";
printLoadingString["fr"] = "Impression en cours. Veuillez patienter...";
printLoadingString["it"] = "Avviata la stampa, attendere prego...";
printLoadingString["pt_PT"] = "Printing initialised. Please wait..."; //FIXME
printLoadingString["uk"] = "Printing initialised. Please wait..."; //FIXME
printLoadingString["hu"] = "Printing initialised. Please wait..."; //FIXME
printLoadingString["ro"] = "Tipărire inițializată. Te rog așteaptă...";
printLoadingString["ru"] = "Печать инициализирована . Пожалуйста, подождите...";
printLoadingString["sl"] = "Tiskanje se pripravlja. Prosimo počakajte...";
printLoadingString["nl"] = "Afdrukken geinitialiseerd. Gelieve te wachten...";
printLoadingString["pl"] = "Rozpoczynianie drukowania. Proszę czekać...";
printLoadingString["sk"] = "Tlačím, chvílenku strpenia...";

/***********************
GUI stuff
***********************/

//title of panel on the left
var leftPanelTitleString = [];
leftPanelTitleString["en"] = "Info and Tools";
leftPanelTitleString["es"] = "Información y herramientas";
leftPanelTitleString["de"] = "Infos und Werkzeuge";
leftPanelTitleString["fr"] = "Infos et outils";
leftPanelTitleString["it"] = "Info e strumenti";
leftPanelTitleString["pt_PT"] = "Informação e Ferramentas";
leftPanelTitleString["uk"] = "Дані та інструменти";
leftPanelTitleString["hu"] = "Információk és Eszközök";
leftPanelTitleString["ro"] = "Informații și unelte";
leftPanelTitleString["ru"] = "Информация и инструменты";
leftPanelTitleString["sl"] = "Informacije in orodja";
leftPanelTitleString["nl"] = "Info en Gereedschap";
leftPanelTitleString["pl"] = "Informacje i narzędzia";
leftPanelTitleString["sk"] = "Info a nástroje";

//title of search panel
var searchPanelTitleString = [];
searchPanelTitleString["en"] = "Search";
searchPanelTitleString["es"] = "Buscar";
searchPanelTitleString["de"] = "Suche";
searchPanelTitleString["fr"] = "Chercher";
searchPanelTitleString["it"] = "Cerca";
searchPanelTitleString["pt_PT"] = "Pesquisar";
searchPanelTitleString["uk"] = "Пошук";
searchPanelTitleString["hu"] = "Keres";
searchPanelTitleString["ro"] = "Căutare";
searchPanelTitleString["ru"] = "Поиск";
searchPanelTitleString["sl"] = "Iskanje";
searchPanelTitleString["nl"] = "Zoeken";
searchPanelTitleString["pl"] = "Szukaj";
searchPanelTitleString["sk"] = "Vyhľadávanie";

//text of theme Switcher button
var mapThemeButtonTitleString = [];
mapThemeButtonTitleString["en"] = "Map themes";
mapThemeButtonTitleString["es"] = "Temas de mapas";
mapThemeButtonTitleString["de"] = "Kartenthemen";
mapThemeButtonTitleString["fr"] = "Modèles de carte";
mapThemeButtonTitleString["it"] = "Temi della mappa";
mapThemeButtonTitleString["pt_PT"] = "Pesquisar";
mapThemeButtonTitleString["uk"] = "Теми";
mapThemeButtonTitleString["hu"] = "Tematikus térképek";
mapThemeButtonTitleString["ro"] = "Tematici hărți";
mapThemeButtonTitleString["ru"] = "Темы";
mapThemeButtonTitleString["sl"] = "Tematske vsebine";
mapThemeButtonTitleString["nl"] = "Kaartthema's";
mapThemeButtonTitleString["pl"] = "Tematy map";
mapThemeButtonTitleString["sk"] = "Témy";

//theme switcher window title
var themeSwitcherWindowTitleString = [];
themeSwitcherWindowTitleString["en"] = "Map theme choice";
themeSwitcherWindowTitleString["es"] = "Elección de tema de mapa";
themeSwitcherWindowTitleString["de"] = "Kartenthemenwechsel";
themeSwitcherWindowTitleString["fr"] = "Choix des modèles de carte";
themeSwitcherWindowTitleString["it"] = "Scelta del tema della mappa";
themeSwitcherWindowTitleString["pt_PT"] = "Escolha temas de mapa";
themeSwitcherWindowTitleString["uk"] = "Вибір теми";
themeSwitcherWindowTitleString["hu"] = "Tematikus térkép választó";
themeSwitcherWindowTitleString["ro"] = "Alegere tematică hartă";
themeSwitcherWindowTitleString["ru"] = "Выбор темы";
themeSwitcherWindowTitleString["sl"] = "Izbira vsebine";
themeSwitcherWindowTitleString["nl"] = "Kaartthema keuze";
themeSwitcherWindowTitleString["pl"] = "Wybór tematu mapy";
themeSwitcherWindowTitleString["sk"] = "Výber témy";

//theme switcher filter label string
var themeSwitcherFilterLabelString = [];
themeSwitcherFilterLabelString["en"] = "Filter by map title: ";
themeSwitcherFilterLabelString["es"] = "Filtrar por título de mapa: ";
themeSwitcherFilterLabelString["de"] = "Filterung nach Kartentitel: ";
themeSwitcherFilterLabelString["fr"] = "Filtrer par titre de carte: ";
themeSwitcherFilterLabelString["it"] = "Filtra sul titolo della mappa: ";
themeSwitcherFilterLabelString["pt_PT"] = "Filtrar pelo titulo do mapa: ";
themeSwitcherFilterLabelString["uk"] = "Фільтр за назвою мапи: ";
themeSwitcherFilterLabelString["hu"] = "Szűrés térkép cím alapján:";
themeSwitcherFilterLabelString["ro"] = "Filtrează harta după titlu: ";
themeSwitcherFilterLabelString["ru"] = "Фильтр тем по названию: ";
themeSwitcherFilterLabelString["sl"] = "Filter po naslovu vsebine: ";
themeSwitcherFilterLabelString["nl"] = "Filter op kaarttitel: ";
themeSwitcherFilterLabelString["pl"] = "Filtruj po tytule mapy: ";
themeSwitcherFilterLabelString["sk"] = "Filter podľa názvu mapy: ";

//theme switcher all themes string in list view
var themeSwitcherAllThemesListViewString = [];
themeSwitcherAllThemesListViewString["en"] = "All map themes";
themeSwitcherAllThemesListViewString["es"] = "Todos los temas de mapas";
themeSwitcherAllThemesListViewString["de"] = "Alle Kartenthemen";
themeSwitcherAllThemesListViewString["fr"] = "Tous les modèles de carte";
themeSwitcherAllThemesListViewString["it"] = "Tutti i temi della mappa";
themeSwitcherAllThemesListViewString["pt_PT"] = "Todos os temas de mapa";
themeSwitcherAllThemesListViewString["uk"] = "Усі теми мап";
themeSwitcherAllThemesListViewString["hu"] = "Összes tematikus térkép";
themeSwitcherAllThemesListViewString["ro"] = "Toate tematicile hărților";
themeSwitcherAllThemesListViewString["ru"] = "Все темы";
themeSwitcherAllThemesListViewString["sl"] = "Vse vsebine";
themeSwitcherAllThemesListViewString["nl"] = "Alle kaartthema's";
themeSwitcherAllThemesListViewString["pl"] = "Wszystkie tematy map";
themeSwitcherAllThemesListViewString["sk"] = "Všetky témy máp:";

var themeSwitcherTooltipResponsibleString = [];
themeSwitcherTooltipResponsibleString["en"] = "Responsible: ";
themeSwitcherTooltipResponsibleString["es"] = "Responsable: ";
themeSwitcherTooltipResponsibleString["de"] = "Verantwortlich: ";
themeSwitcherTooltipResponsibleString["fr"] = "Responsable: ";
themeSwitcherTooltipResponsibleString["it"] = "Responsabile: ";
themeSwitcherTooltipResponsibleString["pt_PT"] = "Responsavel: ";
themeSwitcherTooltipResponsibleString["uk"] = "Відповідальний: ";
themeSwitcherTooltipResponsibleString["hu"] = "Felelős: ";
themeSwitcherTooltipResponsibleString["ro"] = "Responsabil: ";
themeSwitcherTooltipResponsibleString["ru"] = "Ответственный: ";
themeSwitcherTooltipResponsibleString["sl"] = "Odgovornost: ";
themeSwitcherTooltipResponsibleString["nl"] = "Verantwoordelijke: ";
themeSwitcherTooltipResponsibleString["pl"] = "Odpowiedzialność: ";
themeSwitcherTooltipResponsibleString["sk"] = "Zodpovedný: ";

//either tags or keywords
var themeSwitcherTooltipTagString = [];
themeSwitcherTooltipTagString["en"] = "Tags: ";
themeSwitcherTooltipTagString["es"] = "Etiquetas: ";
themeSwitcherTooltipTagString["de"] = "Stichwörter: ";
themeSwitcherTooltipTagString["fr"] = "Etiquettes: ";
themeSwitcherTooltipTagString["it"] = "Etichette: ";
themeSwitcherTooltipTagString["pt_PT"] = "Etiquetas: ";
themeSwitcherTooltipTagString["uk"] = "Теги: ";
themeSwitcherTooltipTagString["hu"] = "Címkék: ";
themeSwitcherTooltipTagString["ro"] = "Etichete: ";
themeSwitcherTooltipTagString["ru"] = "Тэги: ";
themeSwitcherTooltipTagString["sl"] = "Oznake: ";
themeSwitcherTooltipTagString["nl"] = "Labels: ";
themeSwitcherTooltipTagString["pl"] = "Tagi: ";
themeSwitcherTooltipTagString["sk"] = "Označenia: ";

var themeSwitcherTooltipMapThemeString = [];
themeSwitcherTooltipMapThemeString["en"] = "Map theme: ";
themeSwitcherTooltipMapThemeString["es"] = "Tema de mapa: ";
themeSwitcherTooltipMapThemeString["de"] = "Kartenthema: ";
themeSwitcherTooltipMapThemeString["fr"] = "Modèle de carte: ";
themeSwitcherTooltipMapThemeString["it"] = "Tema delle mappa: ";
themeSwitcherTooltipMapThemeString["pt_PT"] = "Tema de mapa: ";
themeSwitcherTooltipMapThemeString["uk"] = "Тема мапи: ";
themeSwitcherTooltipMapThemeString["hu"] = "Tematikus térkép: ";
themeSwitcherTooltipMapThemeString["ro"] = "Tematica hărții: ";
themeSwitcherTooltipMapThemeString["ru"] = "Тема карты: ";
themeSwitcherTooltipMapThemeString["sl"] = "Vsebina: ";
themeSwitcherTooltipMapThemeString["nl"] = "Kaartthema: ";
themeSwitcherTooltipMapThemeString["pl"] = "Temat mapy: ";
themeSwitcherTooltipMapThemeString["sk"] = "Téma mapy: ";

var themeSwitcherTooltipUpdateString = [];
themeSwitcherTooltipUpdateString["en"] = "Update interval: ";
themeSwitcherTooltipUpdateString["es"] = "Intervalo de actualización: ";
themeSwitcherTooltipUpdateString["de"] = "Aktualisierung: ";
themeSwitcherTooltipUpdateString["fr"] = "Intervalle de mise à jour: ";
themeSwitcherTooltipUpdateString["it"] = "Intervallo di aggiornamento: ";
themeSwitcherTooltipUpdateString["pt_PT"] = "Intervalo de atualização: ";
themeSwitcherTooltipUpdateString["uk"] = "Час оновлення: ";
themeSwitcherTooltipUpdateString["hu"] = "Frissítés intervalluma: ";
themeSwitcherTooltipUpdateString["ro"] = "Intervalul de actualizare: ";
themeSwitcherTooltipUpdateString["ru"] = "Интервал обновления: ";
themeSwitcherTooltipUpdateString["sl"] = "Osvežitveni interval: ";
themeSwitcherTooltipUpdateString["nl"] = "Update-interval: ";
themeSwitcherTooltipUpdateString["pl"] = "Częstość aktualizacji: ";
themeSwitcherTooltipUpdateString["sk"] = "Interval aktualizácie: "; 

var themeSwitcherTooltipLastUpdateString = [];
themeSwitcherTooltipLastUpdateString["en"] = "Last update: ";
themeSwitcherTooltipLastUpdateString["es"] = "Última actualización: ";
themeSwitcherTooltipLastUpdateString["de"] = "Letze Aktualisierung: ";
themeSwitcherTooltipLastUpdateString["fr"] = "Dernière mise à jour ";
themeSwitcherTooltipLastUpdateString["it"] = "Utimo aggiornamento: ";
themeSwitcherTooltipLastUpdateString["pt_PT"] = "Última atualização: ";
themeSwitcherTooltipLastUpdateString["uk"] = "Останнє оновлення: ";
themeSwitcherTooltipLastUpdateString["hu"] = "Utolsó frissítés: ";
themeSwitcherTooltipLastUpdateString["ro"] = "Ultima actualizare: ";
themeSwitcherTooltipLastUpdateString["ru"] = "Последнее обновление: ";
themeSwitcherTooltipLastUpdateString["sl"] = "Zadnja sprememba: ";
themeSwitcherTooltipLastUpdateString["nl"] = "Laatste update: ";
themeSwitcherTooltipLastUpdateString["pl"] = "Ostatnia aktualizacja: ";
themeSwitcherTooltipLastUpdateString["sk"] = "Posledná aktualizácia: ";

var themeSwitcherTooltipPwProtectedString = [];
themeSwitcherTooltipPwProtectedString["en"] = "password protected";
themeSwitcherTooltipPwProtectedString["es"] = "protegido por contraseña";
themeSwitcherTooltipPwProtectedString["de"] = "passwortgeschützt";
themeSwitcherTooltipPwProtectedString["fr"] = "protégé par mot de passe";
themeSwitcherTooltipPwProtectedString["it"] = "protetto tramite password";
themeSwitcherTooltipPwProtectedString["pt_PT"] = "protegido por palavra passe";
themeSwitcherTooltipPwProtectedString["uk"] = "захищено паролем";
themeSwitcherTooltipPwProtectedString["hu"] = "jelszóval védett";
themeSwitcherTooltipPwProtectedString["ro"] = "protejat cu parolă";
themeSwitcherTooltipPwProtectedString["ru"] = "защищено паролем";
themeSwitcherTooltipPwProtectedString["sl"] = "zaščiteno z geslom";
themeSwitcherTooltipPwProtectedString["nl"] = "Wachtwoord-beveiligd";
themeSwitcherTooltipPwProtectedString["pl"] = "chronione hasłem";
themeSwitcherTooltipPwProtectedString["sk"] = "Chránené heslom";

var emptyThemeSearchFieldString = [];
emptyThemeSearchFieldString["en"] = "Insert filter string";
emptyThemeSearchFieldString["es"] = "Inserte el texto para filtrar";
emptyThemeSearchFieldString["de"] = "Filtertext eingeben";
emptyThemeSearchFieldString["fr"] = "Entrer le texte pour filtrer";
emptyThemeSearchFieldString["it"] = "Inserire stringa di filtro";
emptyThemeSearchFieldString["pt_PT"] = "Inserir texto do filtro";
emptyThemeSearchFieldString["uk"] = "Ведіть текст для фільтрації";
emptyThemeSearchFieldString["hu"] = "Szűrő feltétel helye";
emptyThemeSearchFieldString["ro"] = "Introduceți textul de filtrare";
emptyThemeSearchFieldString["ru"] = "Введите строку для фильтрации";
emptyThemeSearchFieldString["sl"] = "Vnesi besedilo za filter";
emptyThemeSearchFieldString["nl"] = "Filtertekst ingeven";
emptyThemeSearchFieldString["pl"] = "Wpisz tekst, by filtrować";
emptyThemeSearchFieldString["sk"] = "Vložte text filtra";

var resetThemeSearchFieldTooltipString = [];
resetThemeSearchFieldTooltipString["en"] = "Reset map theme search filter";
resetThemeSearchFieldTooltipString["es"] = "Borrar el filtro de búsqueda de temas de mapa";
resetThemeSearchFieldTooltipString["de"] = "Kartenthemenfilter zurücksetzen";
resetThemeSearchFieldTooltipString["fr"] = "Réinitialiser le filtre de recherche pour le modèle de carte";
resetThemeSearchFieldTooltipString["it"] = "Resetta il filtro per la ricerca del tema della mappa";
resetThemeSearchFieldTooltipString["pt_PT"] = "Apagar o filtro de pesquisa do tema de mapa";
resetThemeSearchFieldTooltipString["uk"] = "Скинути фільтр пошуку тем мапи";
resetThemeSearchFieldTooltipString["hu"] = "Szűrő mező törlése";
resetThemeSearchFieldTooltipString["ro"] = "Resetează filtrul de căutare a tematicii de hartă";
resetThemeSearchFieldTooltipString["ru"] = "Сбросить фильтр поиска темы";
resetThemeSearchFieldTooltipString["sl"] = "Ponastavi iskalni filter";
resetThemeSearchFieldTooltipString["nl"] = "Kaartthemafilter terugplaatsen";
resetThemeSearchFieldTooltipString["pl"] = "Zresetuj filtr tematu mapy";
resetThemeSearchFieldTooltipString["sk"] = "Reset vyhľadávacieho filtra pre tému mapy";

//title of map panel
var mapPanelTitleString = [];
mapPanelTitleString["en"] = "Map";
mapPanelTitleString["es"] = "Mapa";
mapPanelTitleString["de"] = "Karte";
mapPanelTitleString["fr"] = "Carte";
mapPanelTitleString["it"] = "Mappa";
mapPanelTitleString["pt_PT"] = "Mapa";
mapPanelTitleString["uk"] = "Мапа";
mapPanelTitleString["hu"] = "Térkép";
mapPanelTitleString["ro"] = "Harta";
mapPanelTitleString["ru"] = "Карта";
mapPanelTitleString["sl"] = "Karta";
mapPanelTitleString["nl"] = "Kaart";
mapPanelTitleString["pl"] = "Mapa";
mapPanelTitleString["sk"] = "Маpa";

//title of map layer tree
var layerTreeTitleString = [];
layerTreeTitleString["en"] = "Map Layers";
layerTreeTitleString["es"] = "Capas";
layerTreeTitleString["de"] = "Kartenebenen";
layerTreeTitleString["fr"] = "Couches";
layerTreeTitleString["it"] = "Layer";
layerTreeTitleString["pt_PT"] = "Temas";
layerTreeTitleString["uk"] = "Шари мапи";
layerTreeTitleString["hu"] = "Térkép rétegei";
layerTreeTitleString["ro"] = "Straturi hartă";
layerTreeTitleString["ru"] = "Слои карты";
layerTreeTitleString["sl"] = "Sloji";
layerTreeTitleString["nl"] = "Kaartlagen";
layerTreeTitleString["pl"] = "Zawartość mapy";
layerTreeTitleString["sk"] = "Vrstvy";

//title of background layers
var backgroundLayerTitleString = [];
backgroundLayerTitleString["en"] = "Background Layers";
backgroundLayerTitleString["es"] = "Capas de fondo";
backgroundLayerTitleString["de"] = "Hintergrundebenen";
backgroundLayerTitleString["fr"] = "Couches d'arrière-plan";
backgroundLayerTitleString["it"] = "Background Layers";
backgroundLayerTitleString["pt_PT"] = "Background Layers";
backgroundLayerTitleString["uk"] = "Background Layers";
backgroundLayerTitleString["hu"] = "Background Layers";
backgroundLayerTitleString["ro"] = "Straturi de Background ";
backgroundLayerTitleString["ru"] = "Background Layers";
backgroundLayerTitleString["sl"] = "PODLAGE";
backgroundLayerTitleString["nl"] = "Achtergrondlagen";
backgroundLayerTitleString["pl"] = "Warstwy podkładowe";
backgroundLayerTitleString["sk"] = "Podkladové vrstvy";

//title of external layers
var externalLayerTitleString = [];
externalLayerTitleString["en"] = "External Layers";
externalLayerTitleString["es"] = "Capas externas "; 
externalLayerTitleString["de"] = "External Layers"; //FIXME
externalLayerTitleString["fr"] = "External Layers"; //FIXME
externalLayerTitleString["it"] = "External Layers"; //FIXME
externalLayerTitleString["pt_PT"] = "External Layers"; //FIXME
externalLayerTitleString["uk"] = "External Layers"; //FIXME
externalLayerTitleString["hu"] = "External Layers"; //FIXME
externalLayerTitleString["ro"] = "External Layers"; //FIXME
externalLayerTitleString["ru"] = "External Layers"; //FIXME
externalLayerTitleString["sl"] = "ZUNANJI SLOJI";
externalLayerTitleString["nl"] = "External Layers"; //FIXME
externalLayerTitleString["pl"] = "External Layers"; //FIXME
externalLayerTitleString["sk"] = "Externé vrstvy"; //FIXME

//title of layer order panel
var layerOrderPanelTitleString = [];
layerOrderPanelTitleString["en"] = "Layer order";
layerOrderPanelTitleString["es"] = "Orden de capa"; 
layerOrderPanelTitleString["de"] = "Ebenenreihenfolge";
layerOrderPanelTitleString["fr"] = "Ordre des couches";
layerOrderPanelTitleString["it"] = "Ordine dei layer";
layerOrderPanelTitleString["pt_PT"] = "Ordem e transparência camadas";
layerOrderPanelTitleString["uk"] = "Layer order"; //FIXME
layerOrderPanelTitleString["hu"] = "Réteg sorrend";
layerOrderPanelTitleString["ro"] = "Ordinea straturilor";
layerOrderPanelTitleString["ru"] = "Порядок слоев";
layerOrderPanelTitleString["sl"] = "Nastavitve slojev";
layerOrderPanelTitleString["nl"] = "Laagvolgorde";
layerOrderPanelTitleString["pl"] = "Kolejność warstw";
layerOrderPanelTitleString["sk"] = "Poradie vrstiev";

//tooltip of layer settings button in layer order panel
var layerOrderPanelLayerSettingsTooltipString = [];
layerOrderPanelLayerSettingsTooltipString["en"] = "Settings";
layerOrderPanelLayerSettingsTooltipString["es"] = "Ajustes"; 
layerOrderPanelLayerSettingsTooltipString["de"] = "Einstellungen";
layerOrderPanelLayerSettingsTooltipString["fr"] = "Réglages";
layerOrderPanelLayerSettingsTooltipString["it"] = "Impostazioni";
layerOrderPanelLayerSettingsTooltipString["pt_PT"] = "Configurações";
layerOrderPanelLayerSettingsTooltipString["uk"] = "Settings"; //FIXME
layerOrderPanelLayerSettingsTooltipString["hu"] = "Beállítások";
layerOrderPanelLayerSettingsTooltipString["ro"] = "Setări";
layerOrderPanelLayerSettingsTooltipString["ru"] = "Настройки";
layerOrderPanelLayerSettingsTooltipString["sl"] = "Nastavitve";
layerOrderPanelLayerSettingsTooltipString["nl"] = "Instellingen";
layerOrderPanelLayerSettingsTooltipString["pl"] = "Ustawienia";
layerOrderPanelLayerSettingsTooltipString["sk"] = "Nastavenie";

//tooltip of remove layer button in layer order panel
var layerOrderPanelVisibilityChangeTooltipString = [];
layerOrderPanelVisibilityChangeTooltipString["en"] = "Change Layer Visibility";
layerOrderPanelVisibilityChangeTooltipString["es"] = "Cambiar visibilidad de la capa";
layerOrderPanelVisibilityChangeTooltipString["de"] = "Ebenensichtbarkeit ändern";
layerOrderPanelVisibilityChangeTooltipString["fr"] = "Changer la visibilité de la couche";
layerOrderPanelVisibilityChangeTooltipString["it"] = "Cambia la visilità del layer";
layerOrderPanelVisibilityChangeTooltipString["pt_PT"] = "Mudar visibilidade da camada";
layerOrderPanelVisibilityChangeTooltipString["uk"] = "Change Layer Visibility"; //FIXME
layerOrderPanelVisibilityChangeTooltipString["hu"] = "Réteg ki/be kapcsolása";
layerOrderPanelVisibilityChangeTooltipString["ro"] = "Schimbă vizibilitatea stratului";
layerOrderPanelVisibilityChangeTooltipString["ru"] = "Изменить видимость слоя";
layerOrderPanelVisibilityChangeTooltipString["sl"] = "Spremeni vidnost sloja";
layerOrderPanelVisibilityChangeTooltipString["nl"] = "Wijzig laagvisibiliteit";
layerOrderPanelVisibilityChangeTooltipString["pl"] = "Zmień przezroczystość warstwy";
layerOrderPanelVisibilityChangeTooltipString["sk"] = "Zmeniť viditeľnosť vrstiev";

//text when dragging layer in layer order panel
var layerOrderPanelMoveLayerTextString = [];
layerOrderPanelMoveLayerTextString["en"] = "Move layer";
layerOrderPanelMoveLayerTextString["es"] = "Mover capa"; 
layerOrderPanelMoveLayerTextString["de"] = "Ebene verschieben";
layerOrderPanelMoveLayerTextString["fr"] = "Supprimer la couche";
layerOrderPanelMoveLayerTextString["it"] = "Sposta layer";
layerOrderPanelMoveLayerTextString["pt_PT"] = "Deslocar camada";
layerOrderPanelMoveLayerTextString["uk"] = "Move layer"; //FIXME
layerOrderPanelMoveLayerTextString["hu"] = "Réteg mozgatása";
layerOrderPanelMoveLayerTextString["ro"] = "Mută stratul";
layerOrderPanelMoveLayerTextString["ru"] = "Переместить слой";
layerOrderPanelMoveLayerTextString["sl"] = "Premakni sloj";
layerOrderPanelMoveLayerTextString["nl"] = "Verplaats laag";
layerOrderPanelMoveLayerTextString["pl"] = "Przenieś warstwę";
layerOrderPanelMoveLayerTextString["sk"] = "Posunúť vrstvu";

//tooltip of transparency sliders in layer order panel
var layerOrderPanelTransparencyTooltipString = [];
layerOrderPanelTransparencyTooltipString["en"] = "Transparency {0}%";
layerOrderPanelTransparencyTooltipString["es"] = "Transparencia {0}%"; 
layerOrderPanelTransparencyTooltipString["de"] = "Transparenz {0}%";
layerOrderPanelTransparencyTooltipString["fr"] = "Transparence {0}%";
layerOrderPanelTransparencyTooltipString["it"] = "Trasparenza {0}%";
layerOrderPanelTransparencyTooltipString["pt_PT"] = "Transparência {0}%";
layerOrderPanelTransparencyTooltipString["uk"] = "Transparency {0}%"; //FIXME
layerOrderPanelTransparencyTooltipString["hu"] = "Átlászóság {0}%";
layerOrderPanelTransparencyTooltipString["ro"] = "Transparență {0}%";
layerOrderPanelTransparencyTooltipString["ru"] = "Прозрачность {0}%";
layerOrderPanelTransparencyTooltipString["sl"] = "Prosojnost {0}%";
layerOrderPanelTransparencyTooltipString["nl"] = "Transparantie {0}%";
layerOrderPanelTransparencyTooltipString["pl"] = "Przezroczystość {0}%";
layerOrderPanelTransparencyTooltipString["sk"] = "Priesvitnosť {0}%";

//title of legend tab
var legendTabTitleString = [];
legendTabTitleString["en"] = "Legend";
legendTabTitleString["es"] = "Leyenda";
legendTabTitleString["de"] = "Legende";
legendTabTitleString["fr"] = "Légende";
legendTabTitleString["it"] = "Legenda";
legendTabTitleString["pt_PT"] = "Legenda";
legendTabTitleString["uk"] = "Легенда";
legendTabTitleString["hu"] = "Jelkulcs";
legendTabTitleString["ro"] = "Legendă";
legendTabTitleString["ru"] = "Легенда";
legendTabTitleString["sl"] = "Legenda";
legendTabTitleString["nl"] = "Legende";
legendTabTitleString["pl"] = "Legenda";
legendTabTitleString["sk"] = "Legenda";

//legend loading message in legend tab
var legendTabLoadingString = [];
legendTabLoadingString["en"] = "Loading legend, please wait...";
legendTabLoadingString["es"] = "Cargando leyenda, por favor espere"; 
legendTabLoadingString["de"] = "Legende"; //FIXME
legendTabLoadingString["fr"] = "Légende"; //FIXME
legendTabLoadingString["it"] = "Legenda in caricamento, attendere prego...";
legendTabLoadingString["pt_PT"] = "Legenda"; //FIXME
legendTabLoadingString["uk"] = "Легенда"; //FIXME 
legendTabLoadingString["hu"] = "Jelkulcs"; //FIXME
legendTabLoadingString["ro"] = "Legenda se încarcă. Te rog așteaptă...";
legendTabLoadingString["ru"] = "Загрузка легенды. Пожалуйста, подождите"; 
legendTabLoadingString["sl"] = "Nalaganje legende, prosimo počakajte...";
legendTabLoadingString["ru"] = "Legende laden, gelieve te wachten..."; 
legendTabLoadingString["pl"] = "Ładowanie legendy, proszę czekać...";
legendTabLoadingString["sk"] = "Načítavam legendu, strpenie...";


//title of metadata tab
var metadataTabTitleString = [];
metadataTabTitleString["en"] = "Metadata";
metadataTabTitleString["es"] = "Metadatos";
metadataTabTitleString["de"] = "Metadaten";
metadataTabTitleString["fr"] = "Métadonnées";
metadataTabTitleString["it"] = "Metadati";
metadataTabTitleString["pt_PT"] = "Metadados";
metadataTabTitleString["uk"] = "Метадані";
metadataTabTitleString["hu"] = "Metaadat";
metadataTabTitleString["ro"] = "Metadate";
metadataTabTitleString["ru"] = "Метаданные";
metadataTabTitleString["sl"] = "Metapodatki";
metadataTabTitleString["nl"] = "Metadata";
metadataTabTitleString["pl"] = "Metadane";
metadataTabTitleString["sk"] = "Metadata";

//title of help window
var helpWindowTitleString = [];
helpWindowTitleString["en"] = "Help";
helpWindowTitleString["es"] = "Ayuda";
helpWindowTitleString["de"] = "Hilfe";
helpWindowTitleString["fr"] = "Aide";
helpWindowTitleString["it"] = "Aiuto";
helpWindowTitleString["pt_PT"] = "Ajuda";
helpWindowTitleString["uk"] = "Довідка";
helpWindowTitleString["hu"] = "Segítség";
helpWindowTitleString["ro"] = "Ajutor";
helpWindowTitleString["ru"] = "Помощь";
helpWindowTitleString["sl"] = "Pomoč";
helpWindowTitleString["nl"] = "Help";
helpWindowTitleString["pl"] = "Pomoc";
helpWindowTitleString["sk"] = "Pomoc";

//title of legend and per layer metadata window
var legendMetadataWindowTitleString = [];
legendMetadataWindowTitleString["en"] = "Legend and metadata information of layer";
legendMetadataWindowTitleString["es"] = "Información de Metadatos y Leyenda de la capa"; 
legendMetadataWindowTitleString["de"] = "Legende und Metadaten der Ebene";
legendMetadataWindowTitleString["fr"] = "Légende et métadonnée de la couche";
legendMetadataWindowTitleString["it"] = "Legenda e metadati del layer";
legendMetadataWindowTitleString["pt_PT"] = "Legenda e metadados da camada";
legendMetadataWindowTitleString["uk"] = "Legend and metadata information of layer"; //FIXME
legendMetadataWindowTitleString["hu"] = "Jelkulcs és metaadat információ a következő rétegről: ";
legendMetadataWindowTitleString["ro"] = "Legenda și informațiile tip metadate ale stratului";
legendMetadataWindowTitleString["ru"] = "Легенда и метаданные слоя";
legendMetadataWindowTitleString["sl"] = "Legenda in metapodatki za sloj";
legendMetadataWindowTitleString["nl"] = "Legende en metadata laaginformatie";
legendMetadataWindowTitleString["pl"] = "Legenda i metadane warstwy";
legendMetadataWindowTitleString["sk"] = "Legenda a metadata vrstvy";

//title of metadata section
var metadataSectionTitleString = [];
metadataSectionTitleString["en"] = "Metadata of layer";
metadataSectionTitleString["es"] = "Metadatos de la capa"; 
metadataSectionTitleString["de"] = "Metadaten der Ebene";
metadataSectionTitleString["fr"] = "Métadonnée de la couche";
metadataSectionTitleString["it"] = "Metadati del layer";
metadataSectionTitleString["pt_PT"] = "Metadados da camada";
metadataSectionTitleString["uk"] = "Metadata of layer"; //FIXME
metadataSectionTitleString["hu"] = "Réteg neve:";
metadataSectionTitleString["ro"] = "Metadatele stratului";
metadataSectionTitleString["ru"] = "Метаданные слоя";
metadataSectionTitleString["sl"] = "Metapodatki za sloj";
metadataSectionTitleString["nl"] = "Metadata van laag ";
metadataSectionTitleString["pl"] = "Metadane warstwy";
metadataSectionTitleString["sk"] = "Metadata vrstvy";

//Abstract
var abstractString = [];
abstractString["en"] = "Abstract:";
abstractString["es"] = "Resumen:"; 
abstractString["de"] = "Zusammenfassung:";
abstractString["fr"] = "Résumé:";
abstractString["it"] = "Riassunto:";
abstractString["pt_PT"] = "Resumo:";
abstractString["uk"] = "Abstract:"; //FIXME
abstractString["hu"] = "Absztrakt:";
abstractString["ro"] = "Abstract:";
abstractString["ru"] = "Абстрактные:";
abstractString["sl"] = "Opis:";
abstractString["nl"] = "Abstract:";
abstractString["pl"] = "Opis:";
abstractString["sk"] = "Abstrakt";

//title of legend and per layer metadata window
var layerQueryable = [];
layerQueryable["en"] = "This layer is queryable: ";
layerQueryable["es"] = "Esta capa se puede consultar: "; 
layerQueryable["de"] = "Diese Ebene ist abfragbar: ";
layerQueryable["fr"] = "Cette couche est interrogeable: ";
layerQueryable["it"] = "Questo layer è interrogabile: ";
layerQueryable["pt_PT"] = "A camada pode-se pesquisar: ";
layerQueryable["uk"] = "This layer is queryable: "; //FIXME
layerQueryable["hu"] = "Ez a réteg lekérdezhető: ";
layerQueryable["ro"] = "Acest strat este interogabil: ";
layerQueryable["ru"] = "Возможны запросы к слою: ";
layerQueryable["sl"] = "Sloj omogoča poizvedovanje: ";
layerQueryable["nl"] = "Deze laag is bevraagbaar: ";
layerQueryable["pl"] = "Ta warstwa ma możliwość wykonania zapytania: ";
layerQueryable["sk"] = "V tejto vrstve je možné vyhľadávať: ";

//in case we need a yes
var yesString = [];
yesString["en"] = "yes";
yesString["es"] = "sí"; //FIXME
yesString["de"] = "ja";
yesString["fr"] = "oui";
yesString["it"] = "sl";
yesString["pt_PT"] = "sim";
yesString["uk"] = "yes"; //FIXME
yesString["hu"] = "igen";
yesString["ro"] = "da";
yesString["ru"] = "да";
yesString["sl"] = "da";
yesString["nl"] = "ja";
yesString["pl"] = "tak";
yesString["sk"] = "áno";

//in case we need a no
var noString = [];
noString["en"] = "no";
noString["es"] = "no"; 
noString["de"] = "nein";
noString["fr"] = "non";
noString["it"] = "no";
noString["pt_PT"] = "não";
noString["uk"] = "no"; //FIXME
noString["hu"] = "nem";
noString["ro"] = "nu";
noString["ru"] = "нет";
noString["sl"] = "ne";
noString["nl"] = "nee";
noString["pl"] = "nie";
noString["sk"] = "nie";

//metadata: layer group
var layerGroupString = [];
layerGroupString["en"] = "Layer group";
layerGroupString["es"] = "Grupo de capas"; 
layerGroupString["de"] = "Ebenengruppe";
layerGroupString["fr"] = "Groupe de couches";
layerGroupString["it"] = "Gruppo dei layer";
layerGroupString["pt_PT"] = "Layer group"; //FIXME
layerGroupString["uk"] = "Layer group"; //FIXME
layerGroupString["hu"] = "Layer group"; //FIXME
layerGroupString["ro"] = "Grup straturi";
layerGroupString["ru"] = "Группа слоев"; //FIXME
layerGroupString["sl"] = "Skupina slojev";
layerGroupString["nl"] = "Laaggroep";
layerGroupString["pl"] = "Grupa warstw";
layerGroupString["sk"] = "Skupina vrstiev";

//metadata: display field (for tooltips)
var displayFieldString = [];
displayFieldString["en"] = "Display-Field";
displayFieldString["es"] = "Mostrar campo"; 
displayFieldString["de"] = "Anzeigefeld";
displayFieldString["fr"] = "Affichage";
displayFieldString["it"] = "Campo visualizzato";
displayFieldString["pt_PT"] = "Atributo que será visualizado";
displayFieldString["uk"] = "Display-Field"; //FIXME
displayFieldString["hu"] = "Megjelenő-Mező";
displayFieldString["ro"] = "Afișaj";
displayFieldString["ru"] = "Display-Field"; //FIXME
displayFieldString["sl"] = "Polje za prikaz";
displayFieldString["nl"] = "Display-veld";
displayFieldString["pl"] = "Pole do wyświetlenia etykiety";
displayFieldString["sk"] = "Zobrazované pole";

//metadata: coordinate systems
var coordinateSystemsString = [];
coordinateSystemsString["en"] = "Available Coordinate Systems";
coordinateSystemsString["es"] = "Sistemas de coordenadas disponibles"; 
coordinateSystemsString["de"] = "Verfügbare Koordinatensysteme";
coordinateSystemsString["fr"] = "Système de coordonnées disponible";
coordinateSystemsString["it"] = "Sistemi di coordinate disponibili";
coordinateSystemsString["pt_PT"] = "Sistemas de coordenadas disponíveis";
coordinateSystemsString["uk"] = "Available Coordinate Systems"; //FIXME
coordinateSystemsString["hu"] = "Elérhető koordináta rendszerek";
coordinateSystemsString["ro"] = "Sisteme de coordonate disponibile";
coordinateSystemsString["ru"] = "Доступные системы координат";
coordinateSystemsString["sl"] = "Razpoložljivi koordinatni sistemi";
coordinateSystemsString["nl"] = "Beschikbare coördinatensystemen";
coordinateSystemsString["pl"] = "Dostępne układy odniesienia";
coordinateSystemsString["sk"] = "Dostupné koordinačné systémy";

//metadata: geographic extent
var geographicExtentString = [];
geographicExtentString["en"] = "Geographic Extent";
geographicExtentString["es"] = "Extensión geográfica"; 
geographicExtentString["de"] = "Geographischer Ausschnitt";
geographicExtentString["fr"] = "Etendue géographique";
geographicExtentString["it"] = "Estensione geografica";
geographicExtentString["pt_PT"] = "Extensão geográfica";
geographicExtentString["uk"] = "Geographic Extent"; //FIXME
geographicExtentString["hu"] = "Földrajzi kiterjedés";
geographicExtentString["ro"] = "Întinderea geografică";
geographicExtentString["ru"] = "Географический экстент";
geographicExtentString["sl"] = "Območje";
geographicExtentString["nl"] = "Geografische extent";
geographicExtentString["pl"] = "Zasięg geograficzny";
geographicExtentString["sk"] = "Rozsah";

//metadata: geographic extent
var westString = [];
westString["en"] = "west";
westString["es"] = "Oeste"; 
westString["de"] = "Westen";
westString["fr"] = "ouest";
westString["it"] = "ovest";
westString["pt_PT"] = "oeste";
westString["uk"] = "west"; //FIXME
westString["hu"] = "nyugat";
westString["ro"] = "Vest";
westString["ru"] = "запад";
westString["sl"] = "zahod";
westString["nl"] = "west";
westString["pl"] = "zachód";
westString["sk"] = "západ";

//metadata: geographic extent
var eastString = [];
eastString["en"] = "east";
eastString["es"] = "Este"; 
eastString["de"] = "Osten";
eastString["fr"] = "est";
eastString["it"] = "est";
eastString["pt_PT"] = "leste";
eastString["uk"] = "east"; //FIXME
eastString["hu"] = "kelet";
eastString["ro"] = "Est";
eastString["ru"] = "восток";
eastString["sl"] = "vzhod";
eastString["nl"] = "oost";
eastString["pl"] = "wschód";
eastString["sk"] = "východ";

//metadata: geographic extent
var northString = [];
northString["en"] = "north";
northString["es"] = "Norte"; 
northString["de"] = "Norden";
northString["fr"] = "nord";
northString["it"] = "nord";
northString["pt_PT"] = "norte";
northString["uk"] = "north"; //FIXME
northString["hu"] = "észak";
northString["ro"] = "Nord";
northString["ru"] = "север";
northString["sl"] = "sever";
northString["nl"] = "noord";
northString["pl"] = "północ";
northString["sk"] = "sever";

//metadata: geographic extent
var southString = [];
southString["en"] = "south";
southString["es"] = "Sur"; 
southString["de"] = "Süden";
southString["fr"] = "sud";
southString["it"] = "sud";
southString["pt_PT"] = "sul";
southString["uk"] = "south"; //FIXME
southString["hu"] = "dél";
southString["ro"] = "Sud";
southString["ru"] = "юг";
southString["sl"] = "jug";
southString["nl"] = "zuid";
southString["pl"] = "południe";
southString["sk"] = "juh";

//attributes / fields
var attributesString = [];
attributesString["en"] = "Attributes / Fields";
attributesString["es"] = "Atributos";
attributesString["de"] = "Attribute / Felder";
attributesString["fr"] = "Attributs / Champs";
attributesString["it"] = "Attributi";
attributesString["pt_PT"] = "Atributos";
attributesString["uk"] = "Атрибути";
attributesString["hu"] = "Attribútumok / Mezők";
attributesString["ro"] = "Atribute / Câmpuri";
attributesString["ru"] = "Атрибуты / Поля";
attributesString["sl"] = "Opisni podatki / polja";
attributesString["nl"] = "Attributen / Velden";
attributesString["pl"] = "Atrybuty / Pola";
attributesString["sk"] = "Attribúty / Polia";

//attribute name string
var attributeNameString = [];
attributeNameString["en"] = "Attribute name";
attributeNameString["es"] = "Nombre del atributo";
attributeNameString["de"] = "Attributname";
attributeNameString["fr"] = "Nom des attributs";
attributeNameString["it"] = "Attribute name";
attributeNameString["pt_PT"] = "Attribute name";
attributeNameString["uk"] = "Attribute name";
attributeNameString["hu"] = "Attribútum név";
attributeNameString["ro"] = "Nume atribute";
attributeNameString["ru"] = "Название атрибута";
attributeNameString["sl"] = "ime";
attributeNameString["nl"] = "Attribuutnaam";
attributeNameString["pl"] = "Nazwa atrybutu";
attributeNameString["sk"] = "Názov atribútu";

//attribute type string
var attributeTypeString = [];
attributeTypeString["en"] = "Type";
attributeTypeString["es"] = "Tipo";
attributeTypeString["de"] = "Typ";
attributeTypeString["fr"] = "Type";
attributeTypeString["it"] = "Type";
attributeTypeString["pt_PT"] = "Type";
attributeTypeString["uk"] = "Type";
attributeTypeString["hu"] = "Típus";
attributeTypeString["ro"] = "Tip";
attributeTypeString["ru"] = "Тип";
attributeTypeString["sl"] = "tip";
attributeTypeString["nl"] = "Type";
attributeTypeString["pl"] = "Typ";
attributeTypeString["sk"] = "Typ";

//attribute comment string
var attributeCommentString = [];
attributeCommentString["en"] = "Comment";
attributeCommentString["es"] = "Comentario";
attributeCommentString["de"] = "Kommentar";
attributeCommentString["fr"] = "Commentaire";
attributeCommentString["it"] = "Comment";
attributeCommentString["pt_PT"] = "Comment";
attributeCommentString["uk"] = "Comment";
attributeCommentString["hu"] = "Megjegyzés";
attributeCommentString["ro"] = "Comentariu";
attributeCommentString["ru"] = "Комментарий";
attributeCommentString["sl"] = "komentar";
attributeCommentString["nl"] = "Commentaar";
attributeCommentString["pl"] = "Komentarz";
attributeCommentString["sk"] = "Poznámka";

//attribute length string
var attributeLengthString = [];
attributeLengthString["en"] = "Length";
attributeLengthString["es"] = "Longitud";
attributeLengthString["de"] = "Länge";
attributeLengthString["fr"] = "Longueur";
attributeLengthString["it"] = "Length";
attributeLengthString["pt_PT"] = "Length";
attributeLengthString["uk"] = "Length";
attributeLengthString["hu"] = "Hossz";
attributeLengthString["ro"] = "Lungime";
attributeLengthString["ru"] = "Длина";
attributeLengthString["sl"] = "dolžina";
attributeLengthString["nl"] = "Lengte";
attributeLengthString["pl"] = "Długość";
attributeLengthString["sk"] = "Dĺžka";

//attribute length string
var attributePrecisionString = [];
attributePrecisionString["en"] = "Precision";
attributePrecisionString["es"] = "Precisión";
attributePrecisionString["de"] = "Präzision";
attributePrecisionString["fr"] = "Précision";
attributePrecisionString["it"] = "Precision";
attributePrecisionString["pt_PT"] = "Precision";
attributePrecisionString["uk"] = "Precision";
attributePrecisionString["hu"] = "Pontosság";
attributePrecisionString["ro"] = "Precizie";
attributePrecisionString["ru"] = "Точность";
attributePrecisionString["sl"] = "natančnost";
attributePrecisionString["nl"] = "Precisie";
attributePrecisionString["pl"] = "Dokładność";
attributePrecisionString["sk"] = "Presnosť";

//label in main toolbar for object identification
var objectIdentificationTextLabel = [];
objectIdentificationTextLabel["en"] = "Object identification: ";
objectIdentificationTextLabel["es"] = "Identificación de objetos: ";
objectIdentificationTextLabel["de"] = "Objektidentifikation: ";
objectIdentificationTextLabel["fr"] = "Identification d'entité: ";
objectIdentificationTextLabel["it"] = "Identificazione oggetti: ";
objectIdentificationTextLabel["pt_PT"] = "Identificação de objectos: ";
objectIdentificationTextLabel["uk"] = "Вибір об'єкту: ";
objectIdentificationTextLabel["hu"] = "Elem azonosítás: ";
objectIdentificationTextLabel["ro"] = "Identificare obiect: ";
objectIdentificationTextLabel["ru"] = "Идентификация объекта: ";
objectIdentificationTextLabel["sl"] = "poizvedba na: ";
objectIdentificationTextLabel["nl"] = "Objectidentificatie: ";
objectIdentificationTextLabel["pl"] = "Identyfikacja obiektu: ";
objectIdentificationTextLabel["sk"] = "Informácie o objekte: ";

//Coordinate text label (coordinate display in bottom toolbar of main map window)
var coordinateTextLabel = [];
coordinateTextLabel["en"] = "Coordinate:";
coordinateTextLabel["es"] = "Coordenadas:";
coordinateTextLabel["de"] = "Koordinate:";
coordinateTextLabel["fr"] = "Coordonnées:";
coordinateTextLabel["it"] = "Coordinate:";
coordinateTextLabel["pt_PT"] = "Coordenadas:";
coordinateTextLabel["uk"] = "Координати:";
coordinateTextLabel["hu"] = "Koordináta:";
coordinateTextLabel["ro"] = "Coordonate:";
coordinateTextLabel["ru"] = "Координаты:";
coordinateTextLabel["sl"] = "koordinate:";
coordinateTextLabel["nl"] = "Coördinaten:";
coordinateTextLabel["pl"] = "Współrzędne:";
coordinateTextLabel["sk"] = "Súradnice:";

//search
var searchFieldDefaultTextString = [];
searchFieldDefaultTextString["en"] = "Search (addresses, parcel-nrs, names, etc.)";
searchFieldDefaultTextString["es"] = "Buscar (direcciones, registros, nombres, etc.)";
searchFieldDefaultTextString["de"] = "Suche (Adressen, Parzellenr, Flurnamen, etc.)";
searchFieldDefaultTextString["fr"] = "Chercher (adresses, n° de parcelles, noms, etc.)";
searchFieldDefaultTextString["it"] = "Ricerca (indirizzi, n° delle particelle, nomi, ecc.)";
searchFieldDefaultTextString["pt_PT"] = "Pesquisar (morada, parcelas, nomes, etc.)";
searchFieldDefaultTextString["uk"] = "Шукати (адреси, назви, тощо.)";
searchFieldDefaultTextString["hu"] = "Keres (cím, név, stb.)";
searchFieldDefaultTextString["ro"] = "Caută (adrese, nr. parcele, nume, etc.)";
searchFieldDefaultTextString["ru"] = "Поиск (адрес, индекс, название и др.)";
searchFieldDefaultTextString["sl"] = "Iskanje (naslovi, parcele, imena...)";
searchFieldDefaultTextString["nl"] = "Zoeken (adres, perceelnummers, namen, etc.)";
searchFieldDefaultTextString["pl"] = "Szukaj (adresy, numery działek, nazwy, itp.)";
searchFieldDefaultTextString["sk"] = "Hľadaj...";

//search button
var searchButtonString = [];
searchButtonString["en"] = "Search";
searchButtonString["es"] = "Buscar";
searchButtonString["de"] = "Suchen";
searchButtonString["fr"] = "Recherche";
searchButtonString["it"] = "Cerca";
searchButtonString["pt_PT"] = "Pesquisar";
searchButtonString["uk"] = "Пошук";
searchButtonString["hu"] = "Keres";
searchButtonString["ro"] = "Caută";
searchButtonString["ru"] = "Поиск";
searchButtonString["sl"] = "Išči";
searchButtonString["nl"] = "Zoeken";
searchButtonString["pl"] = "Szukaj";
searchButtonString["sk"] = "Hľadaj!";

//reset button
var resetButtonString = [];
resetButtonString["en"] = "Clear";
resetButtonString["es"] = "Limpiar";
resetButtonString["de"] = "Zurücksetzen";
resetButtonString["fr"] = "Effacer";
resetButtonString["it"] = "Annulla";
resetButtonString["pt_PT"] = "Apagar";
resetButtonString["uk"] = "Очистити";
resetButtonString["hu"] = "Törlés";
resetButtonString["ro"] = "Șterge";
resetButtonString["ru"] = "Очистить";
resetButtonString["sl"] = "Pobriši";
resetButtonString["nl"] = "Wissen";
resetButtonString["pl"] = "Wyczyść";
resetButtonString["sk"] = "Vyčisti";

//please wait
var pleaseWaitString = [];
pleaseWaitString["en"] = "Please wait";
pleaseWaitString["es"] = "Por favor espere";
pleaseWaitString["de"] = "Bitte warten";
pleaseWaitString["fr"] = "Attendez s'il vous plait";
pleaseWaitString["it"] = "Attendere prego";
pleaseWaitString["pt_PT"] = "Por favor espere";
pleaseWaitString["uk"] = "Зачекайте";
pleaseWaitString["hu"] = "Kérem várjon";
pleaseWaitString["ro"] = "Așteaptă te rog";
pleaseWaitString["ru"] = "Пожалуйста, подождите";
pleaseWaitString["sl"] = "Prosimo počakajte";
pleaseWaitString["nl"] = "Gelieve te wachten";
pleaseWaitString["pl"] = "Proszę czekać";
pleaseWaitString["sk"] = "Prosím čakajte";

//search result
var searchResultString = [];
searchResultString["en"] = "Search result";
searchResultString["es"] = "Resultado de la búsqueda";
searchResultString["de"] = "Suchresultat";
searchResultString["fr"] = "Résultat de recherche";
searchResultString["it"] = "Risultati ricerca";
searchResultString["pt_PT"] = "Resultado de pesquisa";
searchResultString["uk"] = "Результати пошуку";
searchResultString["hu"] = "Keresés eredménye";
searchResultString["ro"] = "Rezultatul căutării";
searchResultString["ru"] = "Результаты поиска";
searchResultString["sl"] = "Rezultati iskanja";
searchResultString["nl"] = "Zoekresultaat";
searchResultString["pl"] = "Wyniki wyszukiwania";
searchResultString["sk"] = "Výsledky hľadania";


//network error
var networkErrorString = [];
networkErrorString["en"] = "Network error";
networkErrorString["es"] = "Error de red";
networkErrorString["de"] = "Netzwerkfehler";
networkErrorString["fr"] = "Erreur reseau";
networkErrorString["it"] = "Errore di rete";
networkErrorString["pt_PT"] = "Erro de rede";
networkErrorString["uk"] = "Помилка мережі";
networkErrorString["hu"] = "Hálózati hiba";
networkErrorString["ro"] = "Eroare de rețea";
networkErrorString["ru"] = "Сетевая ошибка";
networkErrorString["sl"] = "Težava z omrežjem";
networkErrorString["nl"] = "Netwerkfout";
networkErrorString["pl"] = "Błąd sieci";
networkErrorString["sk"] = "Chyba siete";

// missing or invalid search params
var missingOrInvalidSearchParams = [];
missingOrInvalidSearchParams["en"] = "Missing or invalid values in search form";
missingOrInvalidSearchParams["es"] = "Valores inválidos o faltantes en el formulario de búsqueda";
missingOrInvalidSearchParams["de"] = "Fehlende oder ungültige Werte im Suchformular";
missingOrInvalidSearchParams["fr"] = "Valeurs invalides ou manquantes dans la recherche";
missingOrInvalidSearchParams["it"] = "Valori mancanti o in validi nel modulo di ricerca";
missingOrInvalidSearchParams["pt_PT"] = "Valores em falta ou inválidos no formulário de pesquisa";
missingOrInvalidSearchParams["uk"] = "Відсутні або не правильні дані в полі пошуку";
missingOrInvalidSearchParams["hu"] = "Hiányzó vagy érvénytelen értékek a keresési űrlapon";
missingOrInvalidSearchParams["ro"] = "Valori lipsă sau invalide în căutare";
missingOrInvalidSearchParams["ru"] = "Отсутствуют или неправильны данные в форме поиска";
missingOrInvalidSearchParams["sl"] = "Nepopolna ali nepravilna vrednost iskanja";
missingOrInvalidSearchParams["nl"] = "Ontbrekende of niet correcte waarden in zoekveld";
missingOrInvalidSearchParams["pl"] = "Brakujące lub błędne formuły w polu wyszukiwania";
missingOrInvalidSearchParams["sk"] = "Chýbajúce alebo nesprávne zadané hodnoty";

//search error
var searchErrorString = [];
searchErrorString["en"] = "Error during search";
searchErrorString["es"] = "Error en la búsqueda";
searchErrorString["de"] = "Fehler bei Suche";
searchErrorString["fr"] = "Erreur pendant la recherche";
searchErrorString["it"] = "Errore durante la ricerca";
searchErrorString["pt_PT"] = "Erro durante a pesquisa";
searchErrorString["uk"] = "Помилка під час пошуку";
searchErrorString["hu"] = "Hiba a keresés alatt";
searchErrorString["ro"] = "Eroare în timpul căutarii";
searchErrorString["ru"] = "Ошибка поиска";
searchErrorString["sl"] = "Napaka pri iskanju";
searchErrorString["nl"] = "Fout tijdens het zoeken";
searchErrorString["pl"] = "Błąd podczas wyszukiwania";
searchErrorString["sk"] = "Chyba počas hľadania";

//search no records found
var searchNoRecordsFoundString = [];
searchNoRecordsFoundString["en"] = "No records found"; 
searchNoRecordsFoundString["es"] = "Búsqueda sin resultados"; 
searchNoRecordsFoundString["de"] = "Fehler bei Suche"; // FIXME
searchNoRecordsFoundString["fr"] = "Aucun résultat trouvé (la recherche est sensible à la casse)";
searchNoRecordsFoundString["it"] = "Nessun risultato";
searchNoRecordsFoundString["pt_PT"] = "Erro durante a pesquisa"; // FIXME
searchNoRecordsFoundString["uk"] = "Помилка під час пошуку"; // FIXME
searchNoRecordsFoundString["hu"] = "Hiba a keresés alatt"; // FIXME
searchNoRecordsFoundString["ro"] = "Nu am găsit niciun rezultat (căutarea e case-sensitive)";
searchNoRecordsFoundString["ru"] = "Записи не найдены"; 
searchNoRecordsFoundString["sl"] = "ni rezultatov";
searchNoRecordsFoundString["ru"] = "Geen resultaten gevonden";
searchNoRecordsFoundString["pl"] = "Nie znaleziono szukanych atrybutów"; 
searchNoRecordsFoundString["sk"] = "Nič sa nenašlo";

//print settings toolbar title
var printSettingsToolbarTitleString = [];
printSettingsToolbarTitleString["en"] = "Print Settings";
printSettingsToolbarTitleString["es"] = "Configuración de impresión";
printSettingsToolbarTitleString["de"] = "Druckeinstellungen";
printSettingsToolbarTitleString["fr"] = "Configuration de l'impression";
printSettingsToolbarTitleString["it"] = "Configurazione della stampa";
printSettingsToolbarTitleString["pt_PT"] = "Configuração de impressão";
printSettingsToolbarTitleString["uk"] = "Налаштовування друку";
printSettingsToolbarTitleString["hu"] = "Nyomtatás beállításai";
printSettingsToolbarTitleString["ro"] = "Setări tipărire/print";
printSettingsToolbarTitleString["ru"] = "Настройки печати";
printSettingsToolbarTitleString["sl"] = "Nastavitve tiskanja";
printSettingsToolbarTitleString["nl"] = "Afdrukinstellingen";
printSettingsToolbarTitleString["pl"] = "Ustawienia druku";
printSettingsToolbarTitleString["sk"] = "Nastavenia tlače";

//print rotation text label
var printSettingsRotationTextlabelString = [];
printSettingsRotationTextlabelString["en"] = "Rotation: ";
printSettingsRotationTextlabelString["es"] = "Rotación: ";
printSettingsRotationTextlabelString["de"] = "Rotation: ";
printSettingsRotationTextlabelString["fr"] = "Rotation: ";
printSettingsRotationTextlabelString["it"] = "Rotazione: ";
printSettingsRotationTextlabelString["pt_PT"] = "Rotação: ";
printSettingsRotationTextlabelString["uk"] = "Поворот: ";
printSettingsRotationTextlabelString["hu"] = "Forgatás: ";
printSettingsRotationTextlabelString["ro"] = "Rotește: ";
printSettingsRotationTextlabelString["ru"] = "Поворот: ";
printSettingsRotationTextlabelString["sl"] = "rotacija: ";
printSettingsRotationTextlabelString["nl"] = "Rotatie: ";
printSettingsRotationTextlabelString["pl"] = "Obrót: ";
printSettingsRotationTextlabelString["sk"] = "Otočiť: ";

//print button text
var printButtonTextString = [];
printButtonTextString["en"] = "Print";
printButtonTextString["es"] = "Imprimir";
printButtonTextString["de"] = "Drucken";
printButtonTextString["fr"] = "Imprimer";
printButtonTextString["it"] = "Stampa";
printButtonTextString["pt_PT"] = "Impressão";
printButtonTextString["uk"] = "Друк";
printButtonTextString["hu"] = "Nyomtat";
printButtonTextString["ro"] = "Printează";
printButtonTextString["ru"] = "Печать";
printButtonTextString["sl"] = "tiskanje";
printButtonTextString["nl"] = "Afdrukken";
printButtonTextString["pl"] = "Drukuj";
printButtonTextString["sk"] = "Tlač";

//print cancel button text
var printCancelButtonTextString = [];
printCancelButtonTextString["en"] = "Cancel";
printCancelButtonTextString["es"] = "Cancelar";
printCancelButtonTextString["de"] = "Abbrechen";
printCancelButtonTextString["fr"] = "Annuler";
printCancelButtonTextString["it"] = "Annullare";
printCancelButtonTextString["pt_PT"] = "Cancelar";
printCancelButtonTextString["uk"] = "Відмінити";
printCancelButtonTextString["hu"] = "Mégsem";
printCancelButtonTextString["ro"] = "Anulează";
printCancelButtonTextString["ru"] = "Отмена";
printCancelButtonTextString["sl"] = "prekini";
printCancelButtonTextString["nl"] = "Annuleren";
printCancelButtonTextString["pl"] = "Anuluj";
printCancelButtonTextString["sk"] = "Zruš";

//objectIdentificationModeStrings
var objectIdentificationModeString = [];
objectIdentificationModeString["topMostHit"] = [];
objectIdentificationModeString["topMostHit"]["en"] = "Topmost hit";
objectIdentificationModeString["topMostHit"]["es"] = "Capa superior";
objectIdentificationModeString["topMostHit"]["de"] = "Oberster Treffer";
objectIdentificationModeString["topMostHit"]["fr"] = "Couche la plus haute";
objectIdentificationModeString["topMostHit"]["it"] = "Layer in alto";
objectIdentificationModeString["topMostHit"]["pt_PT"] = "Tema superior";
objectIdentificationModeString["topMostHit"]["uk"] = "Верхній шар";
objectIdentificationModeString["topMostHit"]["hu"] = "Legfelső találat";
objectIdentificationModeString["topMostHit"]["ro"] = "Stratul superior";
objectIdentificationModeString["topMostHit"]["ru"] = "Верхний слой";
objectIdentificationModeString["topMostHit"]["sl"] = "zgornji zadetek";
objectIdentificationModeString["topMostHit"]["nl"] = "Bovenste laag";
objectIdentificationModeString["topMostHit"]["pl"] = "Najwyższa warstwa";
objectIdentificationModeString["topMostHit"]["sk"] = "Najvyššia vrstva";

objectIdentificationModeString["allLayers"] = [];
objectIdentificationModeString["allLayers"]["en"] = "All layers";
objectIdentificationModeString["allLayers"]["es"] = "Todas las capas";
objectIdentificationModeString["allLayers"]["de"] = "Alle Ebenen";
objectIdentificationModeString["allLayers"]["fr"] = "Toutes les couches";
objectIdentificationModeString["allLayers"]["it"] = "Tutti i layer";
objectIdentificationModeString["allLayers"]["pt_PT"] = "Todos os temas";
objectIdentificationModeString["allLayers"]["uk"] = "Усі шари";
objectIdentificationModeString["allLayers"]["hu"] = "Minden réteg";
objectIdentificationModeString["allLayers"]["ro"] = "Toate straturile";
objectIdentificationModeString["allLayers"]["ru"] = "Все слои";
objectIdentificationModeString["allLayers"]["sl"] = "vsi sloji";
objectIdentificationModeString["allLayers"]["nl"] = "Alle lagen";
objectIdentificationModeString["allLayers"]["pl"] = "Wszystkie warstwy";
objectIdentificationModeString["allLayers"]["sk"] = "Všetky vrstvy";

objectIdentificationModeString["activeLayers"] = [];
objectIdentificationModeString["activeLayers"]["en"] = "Active Layer";
objectIdentificationModeString["activeLayers"]["es"] = "Capa activa";
objectIdentificationModeString["activeLayers"]["de"] = "Aktive Ebene";
objectIdentificationModeString["activeLayers"]["fr"] = "Couche active";
objectIdentificationModeString["activeLayers"]["it"] = "Layer attivo";
objectIdentificationModeString["activeLayers"]["pt_PT"] = "Tema activo";
objectIdentificationModeString["activeLayers"]["uk"] = "Активний шар";
objectIdentificationModeString["activeLayers"]["hu"] = "Aktív réteg";
objectIdentificationModeString["activeLayers"]["ro"] = "Stratul activ";
objectIdentificationModeString["activeLayers"]["ru"] = "Активный слой";
objectIdentificationModeString["activeLayers"]["sl"] = "aktiven sloj";
objectIdentificationModeString["activeLayers"]["nl"] = "Actieve laag";
objectIdentificationModeString["activeLayers"]["pl"] = "Aktywna warstwa";
objectIdentificationModeString["activeLayers"]["sk"] = "Aktívna vrstva";

//measure distance result prefix
var measureDistanceResultPrefixString = [];
measureDistanceResultPrefixString["en"] = "Distance";
measureDistanceResultPrefixString["es"] = "Distancia";
measureDistanceResultPrefixString["de"] = "Distanz";
measureDistanceResultPrefixString["fr"] = "Distance";
measureDistanceResultPrefixString["it"] = "Distanza";
measureDistanceResultPrefixString["pt_PT"] = "Distância";
measureDistanceResultPrefixString["uk"] = "Відстань";
measureDistanceResultPrefixString["hu"] = "Távolság";
measureDistanceResultPrefixString["ro"] = "Distanța";
measureDistanceResultPrefixString["ru"] = "Дистанция";
measureDistanceResultPrefixString["sl"] = "razdalja";
measureDistanceResultPrefixString["nl"] = "Afstand";
measureDistanceResultPrefixString["pl"] = "Odległość";
measureDistanceResultPrefixString["sk"] = "Vzdialenosť";

//distance prefix for result:
var measureAreaResultPrefixString = [];
measureAreaResultPrefixString["en"] = "Area";
measureAreaResultPrefixString["es"] = "Área";
measureAreaResultPrefixString["de"] = "Fläche";
measureAreaResultPrefixString["fr"] = "Surface";
measureAreaResultPrefixString["it"] = "Area";
measureAreaResultPrefixString["pt_PT"] = "Área";
measureAreaResultPrefixString["uk"] = "Площа";
measureAreaResultPrefixString["hu"] = "Terület";
measureAreaResultPrefixString["ro"] = "Aria";
measureAreaResultPrefixString["ru"] = "Площадь";
measureAreaResultPrefixString["sl"] = "površina";
measureAreaResultPrefixString["nl"] = "Oppervlakte";
measureAreaResultPrefixString["pl"] = "Powierzchnia";
measureAreaResultPrefixString["sk"] = "Plocha";

/***********************
Tooltips
***********************/

//zoom rectangle tooltip
var zoomRectangleTooltipString = [];
zoomRectangleTooltipString["en"] = "Zoom with rectangle";
zoomRectangleTooltipString["es"] = "Zoom con rectángulo";
zoomRectangleTooltipString["de"] = "Zoom Rechteck aufziehen";
zoomRectangleTooltipString["fr"] = "Zoomer sur un rectangle";
zoomRectangleTooltipString["it"] = "Zoom su rettangolo";
zoomRectangleTooltipString["pt_PT"] = "Zoom com rectângulo";
zoomRectangleTooltipString["uk"] = "Масштабувати прямокутником";
zoomRectangleTooltipString["hu"] = "Nagyítás téglalappal";
zoomRectangleTooltipString["ro"] = "Zoom cu dreptunghi";
zoomRectangleTooltipString["ru"] = "Масштаб прямоугольником";
zoomRectangleTooltipString["sl"] = "povečava s pravokotnikom";
zoomRectangleTooltipString["nl"] = "Zoomen met rechthoek";
zoomRectangleTooltipString["pl"] = "Zbliż przez zaznaczenie";
zoomRectangleTooltipString["sk"] = "Priblíž výberom";

//zoom to full view
var zoomFullViewTooltipString = [];
zoomFullViewTooltipString["en"] = "Zoom to the maximum map extent";
zoomFullViewTooltipString["es"] = "Zoom a la extensión máxima ";
zoomFullViewTooltipString["de"] = "Zoom zum maximalen Kartenausschnitt";
zoomFullViewTooltipString["fr"] = "Zoomer sur l'étendue complète de la carte";
zoomFullViewTooltipString["it"] = "Zoom all'estensione massima";
zoomFullViewTooltipString["pt_PT"] = "Zoom à extensão total do mapa";
zoomFullViewTooltipString["uk"] = "Масштаб за розмірами мапи";
zoomFullViewTooltipString["hu"] = "Teljes nézet";
zoomFullViewTooltipString["ro"] = "Zoom la întinderea maximă a hărții";
zoomFullViewTooltipString["ru"] = "Масштаб по размеру карты";
zoomFullViewTooltipString["sl"] = "povečava na celotno območje";
zoomFullViewTooltipString["nl"] = "Zoomen naar maximum kaartextent";
zoomFullViewTooltipString["pl"] = "Wyświetl całą mapę";
zoomFullViewTooltipString["sk"] = "Celá mapa";

//navigation history backward
var navigationHistoryBackwardTooltipString = [];
navigationHistoryBackwardTooltipString["en"] = "Navigation history backward";
navigationHistoryBackwardTooltipString["es"] = "Ir a la vista anterior";
navigationHistoryBackwardTooltipString["de"] = "Navigationshistorie zurück";
navigationHistoryBackwardTooltipString["fr"] = "Zone précédente dans l'historique";
navigationHistoryBackwardTooltipString["it"] = "Inquadramento precedente";
navigationHistoryBackwardTooltipString["pt_PT"] = "Enquadramento anterior";
navigationHistoryBackwardTooltipString["uk"] = "Історія навігіції: назад";
navigationHistoryBackwardTooltipString["hu"] = "Előző nagyítás";
navigationHistoryBackwardTooltipString["ro"] = "Înapoi la ultima zonă";
navigationHistoryBackwardTooltipString["ru"] = "Навигация назад";
navigationHistoryBackwardTooltipString["sl"] = "prejšnji pogled";
navigationHistoryBackwardTooltipString["nl"] = "Navigatiegeschiedenis vorige";
navigationHistoryBackwardTooltipString["pl"] = "Przejdź do poprzedniego widoku";
navigationHistoryBackwardTooltipString["sk"] = "Predchádzajúci pohľad";

//navigation history forward
var navigationHistoryForwardTooltipString = [];
navigationHistoryForwardTooltipString["en"] = "Navigation history forward";
navigationHistoryForwardTooltipString["es"] = "Ir a la siguiente vista";
navigationHistoryForwardTooltipString["de"] = "Navigationshistorie vorwärts";
navigationHistoryForwardTooltipString["fr"] = "Zone suivante dans l'historique";
navigationHistoryForwardTooltipString["it"] = "Inquadramento successivo";
navigationHistoryForwardTooltipString["pt_PT"] = "Enquadramento seguinte";
navigationHistoryForwardTooltipString["uk"] = "Історія навігації: вперед";
navigationHistoryForwardTooltipString["hu"] = "Következő nagyítás";
navigationHistoryForwardTooltipString["ro"] = "La zona de dinainte";
navigationHistoryForwardTooltipString["ru"] = "Навигация вперед";
navigationHistoryForwardTooltipString["sl"] = "naslednji pogled";
navigationHistoryForwardTooltipString["nl"] = "Navigatiegeschiedenis volgende";
navigationHistoryForwardTooltipString["pl"] = "Przejdź do następnego widoku";
navigationHistoryForwardTooltipString["sk"] = "Nasledujúci pohľad";

//discrete zoom in button above zoom slider
var zoomInTooltipString = [];
zoomInTooltipString["en"] = "Zoom in (discrete step)";
zoomInTooltipString["es"] = "Acercar (un nivel)";
zoomInTooltipString["de"] = "Einzoomen (eine Stufe)";
zoomInTooltipString["fr"] = "Zoom avant";
zoomInTooltipString["it"] = "Ingrandisci";
zoomInTooltipString["pt_PT"] = "Ampliar";
zoomInTooltipString["uk"] = "Збільшити";
zoomInTooltipString["hu"] = "Nagyítás (diszkrét lépéssekkel)";
zoomInTooltipString["ro"] = "Zoom înăuntru (un nivel)";
zoomInTooltipString["ru"] = "Увеличить";
zoomInTooltipString["sl"] = "povečava (diskretni način)";
zoomInTooltipString["nl"] = "Inzoomen";
zoomInTooltipString["pl"] = "Zbliż (o jeden poziom)";
zoomInTooltipString["sk"] = "Priblíž jeden krok)";

//discrete zoom in button above zoom slider
var zoomOutTooltipString = [];
zoomOutTooltipString["en"] = "Zoom out (discrete step)";
zoomOutTooltipString["es"] = "Alejar (un nivel)";
zoomOutTooltipString["de"] = "Rauszoomen (eine Stufe)";
zoomOutTooltipString["fr"] = "Zoom arrière";
zoomOutTooltipString["it"] = "Rimpicciolisci";
zoomOutTooltipString["pt_PT"] = "Diminuir";
zoomOutTooltipString["uk"] = "Зменшити";
zoomOutTooltipString["hu"] = "Kicsinyít (diszkrét lépéssekkel)";
zoomOutTooltipString["ro"] = "Zoom în afară (un nivel)";
zoomOutTooltipString["ru"] = "Уменьшить";
zoomOutTooltipString["sl"] = "pomanjšava (diskretni način)";
zoomOutTooltipString["nl"] = "Uitzoomen";
zoomOutTooltipString["pl"] = "Oddal (o jeden poziom)";
zoomOutTooltipString["sk"] = "Oddiaľ jeden krok";

//object identification tooltip
var objIdentificationTooltipString = [];
objIdentificationTooltipString["en"] = "Object identification (attribute data)";
objIdentificationTooltipString["es"] = "Indentificación de objetos (atributos)";
objIdentificationTooltipString["de"] = "Objektidentifizierung (Attributdaten)";
objIdentificationTooltipString["fr"] = "Identification d'entité (attributs)";
objIdentificationTooltipString["it"] = "Identificazione di oggetti (attributi)";
objIdentificationTooltipString["pt_PT"] = "Identificação de objectos (atributos)";
objIdentificationTooltipString["uk"] = "Вибір об'єкту (атрибути)";
objIdentificationTooltipString["hu"] = "Elem azonosítás (attribútum adatok)";
objIdentificationTooltipString["ro"] = "Identificare obiect (date atribut)";
objIdentificationTooltipString["ru"] = "Идентификация объектов (атрибуты)";
objIdentificationTooltipString["sl"] = "poizvedba (opisni podatki) na lokaciji";
objIdentificationTooltipString["nl"] = "Objectidentificatie (attribuutdata)";
objIdentificationTooltipString["pl"] = "Identyfikacja obiektu (atrybuty)";
objIdentificationTooltipString["sk"] = "Identifikácia objektu (atribúty)";

//MapTips tooltip
var mapTipsTooltipString = [];
mapTipsTooltipString["en"] = "Display MapTips (attribute data)";
mapTipsTooltipString["es"] = "Desplegar textos emergentes (atributos)";
mapTipsTooltipString["de"] = "MapTips anzeigen (Attributdaten)";
mapTipsTooltipString["fr"] = "Afficher les infobulles (attributs)";
mapTipsTooltipString["it"] = "Mostra le informazioni (attributi)";
mapTipsTooltipString["pt_PT"] = "Mostrar MapTips (atributos)";
mapTipsTooltipString["uk"] = "Показівати виринаючі підказки (атрибути)";
mapTipsTooltipString["hu"] = "Megjeleníti térkép szövegbuborákait (attribútum adatok)";
mapTipsTooltipString["ro"] = "Afișează indicii hartă (date atribut)";
mapTipsTooltipString["ru"] = "Показывать подсказки (атрибуты)";
mapTipsTooltipString["sl"] = "Display MapTips (attribute data)"; //FIXME
mapTipsTooltipString["nl"] = "MapTips weergeven (attribuutdata)";
mapTipsTooltipString["pl"] = "Wyświetlanie podpowiedzi (atrybutów)";
mapTipsTooltipString["sk"] = "Zobraz MapTips";

//Measure Distance
var measureDistanceTooltipString = [];
measureDistanceTooltipString["en"] = "Measure distance";
measureDistanceTooltipString["es"] = "Medir distancia";
measureDistanceTooltipString["de"] = "Distanz messen";
measureDistanceTooltipString["fr"] = "Mesurer une distance";
measureDistanceTooltipString["it"] = "Misura distanza";
measureDistanceTooltipString["pt_PT"] = "Medir distância";
measureDistanceTooltipString["uk"] = "Вимірювання відстані";
measureDistanceTooltipString["hu"] = "Távolság mérés";
measureDistanceTooltipString["ro"] = "Măsoară distanța";
measureDistanceTooltipString["ru"] = "Измерение дистанции";
measureDistanceTooltipString["sl"] = "merjenje razdalje";
measureDistanceTooltipString["nl"] = "Afstand meten";
measureDistanceTooltipString["pl"] = "Zmierz odległość";
measureDistanceTooltipString["sk"] = "Odmeraj vzdialenosť";

//Measure Area
var measureAreaTooltipString = [];
measureAreaTooltipString["en"] = "Measure area";
measureAreaTooltipString["es"] = "Medir área";
measureAreaTooltipString["de"] = "Fläche messen";
measureAreaTooltipString["fr"] = "Mesurer une surface";
measureAreaTooltipString["it"] = "Misura superficie";
measureAreaTooltipString["pt_PT"] = "Medir área";
measureAreaTooltipString["uk"] = "Вимірювання площі";
measureAreaTooltipString["hu"] = "Terület mérés";
measureAreaTooltipString["ro"] = "Măsoară aria";
measureAreaTooltipString["ru"] = "Измерение площади";
measureAreaTooltipString["sl"] = "merjenje površine";
measureAreaTooltipString["nl"] = "Oppervlakte meten";
measureAreaTooltipString["pl"] = "Zmierz powierzchnię";
measureAreaTooltipString["sk"] = "Odmeraj plochu";

//Print Map
var printMapTooltipString = [];
printMapTooltipString["en"] = "Print Map";
printMapTooltipString["es"] = "Imprimir mapa";
printMapTooltipString["de"] = "Karte drucken";
printMapTooltipString["fr"] = "Imprimer la carte";
printMapTooltipString["it"] = "Stampa la mappa";
printMapTooltipString["pt_PT"] = "Imprimir mapa";
printMapTooltipString["uk"] = "Друкувати мапу";
printMapTooltipString["hu"] = "Térkép nyomtatás";
printMapTooltipString["ro"] = "Tipărește harta";
printMapTooltipString["ru"] = "Печать карты";
printMapTooltipString["sl"] = "tiskanje karte";
printMapTooltipString["nl"] = "Kaart afdrukken";
printMapTooltipString["pl"] = "Drukuj mapę";
printMapTooltipString["sk"] = "Vytlač mapu";

//Print Map disabled
var printMapDisabledTooltipString = [];
printMapDisabledTooltipString["en"] = "Print disabled, no layout is defined in the QGIS project";
printMapDisabledTooltipString["es"] = "Imprimir deshabilitado, no hay formato definido en el proyecto de QGIS";
printMapDisabledTooltipString["de"] = "Drucken nicht möglich, da keine Layouts im QGIS-Projekt definiert wurden";
printMapDisabledTooltipString["fr"] = "Impossible d'imprimer car il n'y a pas de mise en page définie dans le projet QGIS";
printMapDisabledTooltipString["it"] = "Stampa disabilitata: nel progetto QGIS non è definito alcun layout";
printMapDisabledTooltipString["pt_PT"] = "Impressão indisponível: não tem definido nenhum layout no projecto QGIS";
printMapDisabledTooltipString["uk"] = "Друк відключено, не вказано шар в QGIS проекті";
printMapDisabledTooltipString["hu"] = "Nyomtatás letiltva, nincs nyomtatási nézet definiálva a QGIS projektben";
printMapDisabledTooltipString["ro"] = "Tipărirea nu este activă deoarece niciun model de tipărire nu este definit în proiectul QGIS";
printMapDisabledTooltipString["ru"] = "Печать отключена.  Нет макета в проекте QGIS";
printMapDisabledTooltipString["sl"] = "Tiskanje onemogočeno, manjka 'layout' v QGIS projektu";
printMapDisabledTooltipString["nl"] = "Afdrukken uitgeschakeld, er is geen layout gedefinieerd in het QGIS-project";
printMapDisabledTooltipString["pl"] = "Drukowanie zablokowane - żaden szablon nie został zdefiniowany w projekcie QGIS";
printMapDisabledTooltipString["sk"] = "Tlač nie je povolená";

//Send permalink
var sendPermalinkTooltipString = [];
sendPermalinkTooltipString["en"] = "Create permalink to current map";
sendPermalinkTooltipString["es"] = "Crear permalink al mapa actual"; 
sendPermalinkTooltipString["de"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["fr"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["it"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["pt_PT"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["uk"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["hu"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["ro"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["ru"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["sl"] = "povezava na trenutno karto";
sendPermalinkTooltipString["nl"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["pl"] = "Create permalink to current map"; //FIXME
sendPermalinkTooltipString["sk"] = "Vytvor odkaz na mapu"; //FIXME

//Send permalink
var sendPermalinkLinkFromString = [];
sendPermalinkLinkFromString["en"] = "Link to current map";
sendPermalinkLinkFromString["es"] = "Enlace al mapa actual"; 
sendPermalinkLinkFromString["de"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["fr"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["it"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["pt_PT"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["uk"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["hu"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["ro"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["ru"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["sl"] = "Povezava do trenutne karte";
sendPermalinkLinkFromString["nl"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["pl"] = "Link to current map"; //FIXME
sendPermalinkLinkFromString["sk"] = "Odkaz na aktuálnu mapu"; 

//Show Help
var showHelpTooltipString = [];
showHelpTooltipString["en"] = "Show Help";
showHelpTooltipString["es"] = "Mostrar ayuda";
showHelpTooltipString["de"] = "Hilfe öffnen";
showHelpTooltipString["fr"] = "Afficher l'aide";
showHelpTooltipString["it"] = "Mostra l'aiuto";
showHelpTooltipString["pt_PT"] = "Mostrar ajuda";
showHelpTooltipString["uk"] = "Показати довідку";
showHelpTooltipString["hu"] = "Mutasd a súgót";
showHelpTooltipString["ro"] = "Afișează Ajutorul";
showHelpTooltipString["ru"] = "Показать помощь";
showHelpTooltipString["sl"] = "pomoč";
showHelpTooltipString["nl"] = "Toon Help";
showHelpTooltipString["pl"] = "Pokaż pomoc";
showHelpTooltipString["sk"] = "Ukáž pomoc";

//Show location
var showLocationTooltipString = [];
showLocationTooltipString["en"] = "Show Location";
showLocationTooltipString["es"] = "Mostrar localización"; 
showLocationTooltipString["de"] = "Show Location";  //FIXME
showLocationTooltipString["fr"] = "Show Location";  //FIXME
showLocationTooltipString["it"] = "Show Location";  //FIXME
showLocationTooltipString["pt_PT"] = "Show Location";  //FIXME
showLocationTooltipString["uk"] = "Show Location";  //FIXME
showLocationTooltipString["hu"] = "Show Location";  //FIXME
showLocationTooltipString["ro"] = "Show Location";  //FIXME
showLocationTooltipString["ru"] = "Show Location";  //FIXME
showLocationTooltipString["sl"] = "prikaz lokacije";
showLocationTooltipString["nl"] = "Show Location";  //FIXME
showLocationTooltipString["pl"] = "Show Location";  //FIXME
showLocationTooltipString["sk"] = "Ukáž polohu";  

//Geonames loading string
var geonamesLoadingString = [];
geonamesLoadingString["en"] = "Search...";
geonamesLoadingString["es"] = "Buscar...";
geonamesLoadingString["de"] = "Suche...";
geonamesLoadingString["fr"] = "Recherche...";
geonamesLoadingString["it"] = "Ricerca...";
geonamesLoadingString["pt_PT"] = "Pesquisar...";
geonamesLoadingString["uk"] = "Пошук...";
geonamesLoadingString["hu"] = "Keresés...";
geonamesLoadingString["ro"] = "Caută...";
geonamesLoadingString["ru"] = "Поиск...";
geonamesLoadingString["sl"] = "iskanje poteka...";
geonamesLoadingString["nl"] = "Zoek...";
geonamesLoadingString["pl"] = "Szukaj...";
geonamesLoadingString["sk"] = "Hľadám...";

//Geonames empty string
var geonamesEmptyString = [];
geonamesEmptyString["en"] = "Search location";
geonamesEmptyString["es"] = "Buscar lugar";
geonamesEmptyString["de"] = "Suche";
geonamesEmptyString["fr"] = "Rechercher le lieu";
geonamesEmptyString["it"] = "Cerca località";
geonamesEmptyString["pt_PT"] = "Pesquisar localização";
geonamesEmptyString["uk"] = "Пошук місць";
geonamesEmptyString["hu"] = "Keresés";
geonamesEmptyString["ro"] = "Caută locația";
geonamesEmptyString["ru"] = "Поиск местоположения";
geonamesEmptyString["sl"] = "hitro iskanje";
geonamesEmptyString["nl"] = "Zoek locatie";
geonamesEmptyString["pl"] = "Wyszukaj lokację";
geonamesEmptyString["sk"] = "Nájdi";

//Reset Search Field
var resetSearchFieldTooltipString = [];
resetSearchFieldTooltipString["en"] = "Reset/empty Searchfield";
resetSearchFieldTooltipString["es"] = "Limpiar campo de búsqueda";
resetSearchFieldTooltipString["de"] = "Suchfeld zurücksetzen";
resetSearchFieldTooltipString["fr"] = "Réinitialiser la recherche";
resetSearchFieldTooltipString["it"] = "Azzerare il campo di ricerca";
resetSearchFieldTooltipString["pt_PT"] = "Limpar campo de pesquisa";
resetSearchFieldTooltipString["uk"] = "Очистити поле пошуку";
resetSearchFieldTooltipString["hu"] = "Kereső mező törlése";
resetSearchFieldTooltipString["ro"] = "Resetează/golește câmpul de căutare";
resetSearchFieldTooltipString["ru"] = "Очистить поле поиска";
resetSearchFieldTooltipString["sl"] = "Ponastavi/izprazni iskalna polja";
resetSearchFieldTooltipString["nl"] = "Herstel/Wis zoekveld";
resetSearchFieldTooltipString["pl"] = "Wyczyść pole wyszukiwania";
resetSearchFieldTooltipString["sk"] = "Vyčisti pole";

//print window title
var printWindowTitleString = [];
printWindowTitleString["en"] = "The server is generating a PDF file. For correct up to scale printing please deactivate the option 'Fit to Page'!";
printWindowTitleString["es"] = "El servidor está generando un archivo PDF. Para corregir la escala de impresión desactive la opción 'Ajustar a la página'!";
printWindowTitleString["de"] = "PDF wird vom Server generiert. Für massstäbliches Drucken deaktivieren Sie bitte das 'Anpassen der Seitengrösse'!";
printWindowTitleString["fr"] = "Le serveur génère le fichier PDF. Pour conserver l'échelle, ne pas activer l'option 'Ajuster à la page'!"
printWindowTitleString["it"] = "Il server sta generando il file PDF. Per stampare alla scala corretta disattivare l'opzione 'Ridimensiona alla pagina'!"
printWindowTitleString["pt_PT"] = "O servidor está a gerar um ficheiro PDF. Para imprimir na escala correcta, desactivar a opção 'Fit to Page'!";
printWindowTitleString["uk"] = "На сервері створюється PDF файл. Для корректного масштабуваня друку відключіть опцію 'Підігнати до сторінки'!";
printWindowTitleString["hu"] = "A szerver generál egy PDF állományt. A helyes lépték érdekében kérem kapcsolja ki a 'Oldalhoz igazítás' opciót!";
printWindowTitleString["ro"] = "Serverul generează un fișier PDF . Pentru o imprimare la scara corectă deactivați opțiunea 'Fit to Page/Incadrare pe pagină' când dați print la acesta!";
printWindowTitleString["ru"] = "Сервер генерирует PDF файл . Для корректного масштабирования печати отключите опцию 'Подогнать по странице'!";
printWindowTitleString["sl"] = "Priprava PDF dokumenta. Za izris v izbranem merilu je potrebno izklopiti opcijo 'Fit to Page'!";
printWindowTitleString["nl"] = "De server genereert een PDF-bestand. Om correct op schaal af te drukken, gelieve de optie 'Fit to page' uit te schakelen!";
printWindowTitleString["pl"] = "Serwer generuje plik PDF. Dla poprawnego wydruku skali mapy deaktywuj opcję 'Dopasuj do strony'!";
printWindowTitleString["sk"] = "Server vytvára PDF súbor. Pre správne nastavenie mierky prosím odznačte voľbu 'Prispôsobiť - Fit to page'!";


//print object data alternative string in case no pdf plugin is present in browser
//attention: single quotes around string, partially html formatting
var printingObjectDataAlternativeString1 = [];
printingObjectDataAlternativeString1["en"] = 'It looks like your browser cannot open PDF files directly. Not a big problem - you can <a href="';
printingObjectDataAlternativeString1["es"] = 'Su navegador no puede abrir archivos PDF directamente. No es problema - usted puede <a href="';
printingObjectDataAlternativeString1["de"] = 'Es sieht so aus als ob Ihr Browser kein PDF Plugin unterstützt. Kein Problem, Sie können die <a href="';
printingObjectDataAlternativeString1["fr"] = 'Il semble que votre navigateur ne supporte pas le plugin PDF. Pas de problème, vous pouvez <a href="';
printingObjectDataAlternativeString1["it"] = 'Sembra che il vostro browser non possa aprire direttamente i files PDF. Nessun problema -  potete <a href="';
printingObjectDataAlternativeString1["pt_PT"] = 'Parece que o seu navegador não pode abrir ficheiros PDF directamente. Não tem problema - pode <a href="';
printingObjectDataAlternativeString1["uk"] = 'Схоже Ваш оглядач не вміє відкривати PDF файли. Не проблема - скористуйтесь <a href="';
printingObjectDataAlternativeString1["hu"] = 'Böngésző nem tudja megnyítni a PDF állományokat. PDF állomány elérhető <a href="';
printingObjectDataAlternativeString1["ro"] = 'Se pare ca browser-ul tău nu poate deschide direct fișiere PDF. Nu e grav - poți să <a href="';
printingObjectDataAlternativeString1["ru"] = 'Похоже, ваш браузер не может открыть PDF. Нет проблем - <a href="';
printingObjectDataAlternativeString1["sl"] = 'Vaš brskalnik ne omogoča neposrednega prikaza PDF dokumentov, lahko pa - <a href="';
printingObjectDataAlternativeString1["nl"] = 'Het lijkt er op dat je browser het PDF-bestand niet onmiddellijk kan openen. Geen probleem - je kan <a href="';
printingObjectDataAlternativeString1["pl"] = 'Wygląda na to, że Twoja przeglądarka nie może poprawnie otworzyć pliku PDF. To nie jest duży problem - możesz <a href="';
printingObjectDataAlternativeString1["sk"] = 'Vyzerá to tak, že Váš prehlaidač nemá nainštalovaný PDF plugin. Nie je problém, môžete si <a href="';

//the second part of the string after the URL
//attention: single quotes around string, partially html formatting
var printingObjectDataAlternativeString2 = [];
printingObjectDataAlternativeString2["en"] = '">download the PDF file here.</a>.</p></object>';
printingObjectDataAlternativeString2["es"] = '">descargar el archivo PDF aquí.</a>.</p></object>';
printingObjectDataAlternativeString2["de"] = '">PDF-Datei hier herunterladen</a>.</p></object>';
printingObjectDataAlternativeString2["fr"] = '">télécharger le fichier PDF ici</a>.</p></object>';
printingObjectDataAlternativeString2["it"] = '">scaricare il PDF qui.</a>.</p></object>';
printingObjectDataAlternativeString2["pt_PT"] = '">descarregar ficheiro PDF aqui.</a>.</p></object>';
printingObjectDataAlternativeString2["uk"] = '">посиланням</a> аби завантажити PDF файл..</p></object>';
printingObjectDataAlternativeString2["hu"] = '">ezen a linken.</a>.</p></object>';
printingObjectDataAlternativeString2["ro"] = '">descarci fișierul PDF aici.</a>.</p></object>';
printingObjectDataAlternativeString2["ru"] = '">скачайте PDF-файл здесь.</a>.</p></object>';
printingObjectDataAlternativeString2["sl"] = '">prevzamete PDF dokument tukaj.</a>.</p></object>';
printingObjectDataAlternativeString2["nl"] = '">het PDF-bestand hier downloaden.</a>.</p></object>';
printingObjectDataAlternativeString2["pl"] = '">ściągnąć plik PDF tutaj.</a>.</p></object>';
printingObjectDataAlternativeString2["sk"] = '">PDF súbor stiahnuť tu</a>.</p></object>';

//print button tooltip
var printButtonTooltipString = [];
printButtonTooltipString["en"] = "Print (Generate PDF)";
printButtonTooltipString["es"] = "Imprimir (Generar PDF)";
printButtonTooltipString["de"] = "Drucken (PDF generieren)";
printButtonTooltipString["fr"] = "Imprimer (générer un PDF)";
printButtonTooltipString["it"] = "Stampa (generare un PDF)";
printButtonTooltipString["pt_PT"] = "Imprimir (gerar PDF)";
printButtonTooltipString["uk"] = "Друкувати (PDF)";
printButtonTooltipString["hu"] = "Nyomtat (PDF generálása)";
printButtonTooltipString["ro"] = "Print/Tipărește (Generează un PDF)";
printButtonTooltipString["ru"] = "Печать (Генерация PDF)";
printButtonTooltipString["sl"] = "Tiskanje (PDF)";
printButtonTooltipString["nl"] = "Afdrukken (Genereer PDF)";
printButtonTooltipString["pl"] = "Drukuj (generuj PDF)";
printButtonTooltipString["sk"] = "Tlačiť ( Vytvoriť PDF)";

//print cancel button tooltip
var printCancelButtonTooltipString = [];
printCancelButtonTooltipString["en"] = "Cancel Print (Close)";
printCancelButtonTooltipString["es"] = "Cancelar impresión (Cerrar)";
printCancelButtonTooltipString["de"] = "Druck abbrechen (Schliesen)";
printCancelButtonTooltipString["fr"] = "Annuler l'impression (fermer)";
printCancelButtonTooltipString["it"] = "Annulla la stampa (chiudi)";
printCancelButtonTooltipString["pt_PT"] = "Cancelar impressão (Fechar)";
printCancelButtonTooltipString["uk"] = "Скасувати друк (Закрити)";
printCancelButtonTooltipString["hu"] = "Mégsem nyomtat (bezár)";
printCancelButtonTooltipString["en"] = "Cancel Print (Close)";
printCancelButtonTooltipString["ro"] = "Anulează Tipărirea (Închide)";
printCancelButtonTooltipString["ru"] = "Отмена печати (Закрыть)";
printCancelButtonTooltipString["sl"] = "prekini tisk (zapri)";
printCancelButtonTooltipString["nl"] = "Annuleer afdruk (Sluiten)";
printCancelButtonTooltipString["pl"] = "Anuluj drukowanie (Zamknij)";
printCancelButtonTooltipString["sk"] = "Zrušiť tlač (Zatvoriť)";

//theme switcher button tooltip
var mapThemeButtonTooltipString = [];
mapThemeButtonTooltipString["en"] = "Click to choose a new map theme";
mapThemeButtonTooltipString["es"] = "Haga click para escoger un nuevo tema de mapa";
mapThemeButtonTooltipString["de"] = "Klicken Sie um das Kartenthema zu wechseln";
mapThemeButtonTooltipString["fr"] = "Cliquer pour choisir un nouveau modèle de carte";
mapThemeButtonTooltipString["it"] = "Click per scegliere un nuovo tema di mappa";
mapThemeButtonTooltipString["pt_PT"] = "Clique para escolher um novo tema de mapa";
mapThemeButtonTooltipString["uk"] = "Клацніть щоб обрати нову тему мапи";
mapThemeButtonTooltipString["hu"] = "Klikkeljen ide új tematikus térkép választásához";
mapThemeButtonTooltipString["ro"] = "Click pentru a alege o nouă tematică de hartă";
mapThemeButtonTooltipString["ru"] = "Кликните чтобы выбрать новую тему для карты";
mapThemeButtonTooltipString["sl"] = "izbor vsebine";
mapThemeButtonTooltipString["nl"] = "Klik om een kaartthema te kiezen";
mapThemeButtonTooltipString["pl"] = "Kliknij, aby wybrać nowy temat mapy";
mapThemeButtonTooltipString["sk"] = "Klikni pre výber novej témy"

//comment, if layer is outside scale range
var tooltipLayerTreeLayerOutsideScale = [];
tooltipLayerTreeLayerOutsideScale["en"] = "Visible at scales";
tooltipLayerTreeLayerOutsideScale["es"] = "Visible a las escalas"; 
tooltipLayerTreeLayerOutsideScale["de"] = "Sichtbar in den Massstäben";
tooltipLayerTreeLayerOutsideScale["fr"] = "Visible aux échelles";
tooltipLayerTreeLayerOutsideScale["it"] = "Visibile alle scale";
tooltipLayerTreeLayerOutsideScale["pt_PT"] = "Visible at scales"; //FIXME
tooltipLayerTreeLayerOutsideScale["uk"] = "Visible at scales"; //FIXME
tooltipLayerTreeLayerOutsideScale["hu"] = "Visible at scales"; //FIXME
tooltipLayerTreeLayerOutsideScale["ro"] = "Vizibil la scara";
tooltipLayerTreeLayerOutsideScale["ru"] = "Visible at scales"; //FIXME
tooltipLayerTreeLayerOutsideScale["sl"] = "vidno pri merilih";
tooltipLayerTreeLayerOutsideScale["nl"] = "Zichtbaar op schalen";
tooltipLayerTreeLayerOutsideScale["pl"] = "Widoczne przy skalach";
tooltipLayerTreeLayerOutsideScale["sk"] = "Viditeľné v mierke";

//title in ClickPopup
var clickPopupTitleString = [];
clickPopupTitleString["en"] = "Results"; //FIXME
clickPopupTitleString["es"] = "Resultados"; //FIXME
clickPopupTitleString["de"] = "Results"; //FIXME
clickPopupTitleString["fr"] = "Results"; //FIXME
clickPopupTitleString["it"] = "Results"; //FIXME
clickPopupTitleString["pt_PT"] = "Results"; //FIXME
clickPopupTitleString["uk"] = "Results"; //FIXME
clickPopupTitleString["hu"] = "Results"; //FIXME
clickPopupTitleString["ro"] = "Results"; //FIXME
clickPopupTitleString["ru"] = "Results"; //FIXME
clickPopupTitleString["sl"] = "Rezultati poizvedbe";
clickPopupTitleString["sk"] = "Výsledky vyhľadávania";

/***********************
Context menu items
***********************/
//comment, if layer is outside scale range
var contextZoomLayerExtent = [];
contextZoomLayerExtent["en"] = "Zoom to layer extent";
contextZoomLayerExtent["es"] = "Zoom a la extensión de la capa"; 
contextZoomLayerExtent["de"] = "Zoom to layer extent"; //FIXME
contextZoomLayerExtent["fr"] = "Zoom to layer extent"; //FIXME
contextZoomLayerExtent["it"] = "Zoom all'estensione del layer";
contextZoomLayerExtent["pt_PT"] = "Zoom to layer extent"; //FIXME
contextZoomLayerExtent["uk"] = "Zoom to layer extent"; //FIXME
contextZoomLayerExtent["hu"] = "Zoom to layer extent"; //FIXME
contextZoomLayerExtent["ro"] = "Zoom to layer extent"; //FIXME
contextZoomLayerExtent["ru"] = "Zoom to layer extent"; //FIXME
contextZoomLayerExtent["sl"] = "Povečava na območje sloja"; //FIXME
contextZoomLayerExtent["nl"] = "Zoom to layer extent"; //FIXME
contextZoomLayerExtent["pl"] = "Zoom to layer extent"; //FIXME
contextZoomLayerExtent["sk"] = "Priblíž na veľkosť vrstvy"; 

var contextOpenTable = [];
contextOpenTable["en"] = "Open attribute table";
contextOpenTable["es"] = "Abrir tabla de atributos"; 
contextOpenTable["de"] = "Open attribute table"; //FIXME
contextOpenTable["fr"] = "Open attribute table"; //FIXME
contextOpenTable["it"] = "Open attribute table";
contextOpenTable["pt_PT"] = "Open attribute table"; //FIXME
contextOpenTable["uk"] = "Open attribute table"; //FIXME
contextOpenTable["hu"] = "Open attribute table"; //FIXME
contextOpenTable["ro"] = "Open attribute table"; //FIXME
contextOpenTable["ru"] = "Open attribute table"; //FIXME
contextOpenTable["sl"] = "Prikaz opisnih podatkov sloja";
contextOpenTable["nl"] = "Open attribute table"; //FIXME
contextOpenTable["pl"] = "Open attribute table"; //FIXME
contextOpenTable["sk"] = "Otvor atribútovú tabuľku"; 

var contextDataExport = [];
contextDataExport["en"] = "Export layer to...";
contextDataExport["es"] = "Exportar capa a..."; 
contextDataExport["de"] = "Export layer to..."; //FIXME
contextDataExport["fr"] = "Export layer to..."; //FIXME
contextDataExport["it"] = "Export layer to...";
contextDataExport["pt_PT"] = "Export layer to..."; //FIXME
contextDataExport["uk"] = "Export layer to..."; //FIXME
contextDataExport["hu"] = "Export layer to..."; //FIXME
contextDataExport["ro"] = "Export layer to..."; //FIXME
contextDataExport["ru"] = "Export layer to..."; //FIXME
contextDataExport["sl"] = "Izvoz sloja v...";
contextDataExport["nl"] = "Export layer to..."; //FIXME
contextDataExport["pl"] = "Export layer to..."; //FIXME
contextDataExport["sk"] = "Exportuj vrstvu ako..."; 

var contextUseExtent = [];
contextUseExtent["en"] = "Use current map extent";
contextUseExtent["es"] = "Usar extensión del mapa actual"; 
contextUseExtent["de"] = "Use current map extent"; //FIXME
contextUseExtent["fr"] = "Use current map extent"; //FIXME
contextUseExtent["it"] = "Use current map extent";
contextUseExtent["pt_PT"] = "Use current map extent"; //FIXME
contextUseExtent["uk"] = "Use current map extent"; //FIXME
contextUseExtent["hu"] = "Use current map extent"; //FIXME
contextUseExtent["ro"] = "Use current map extent"; //FIXME
contextUseExtent["ru"] = "Use current map extent"; //FIXME
contextUseExtent["sl"] = "Uporabi trenutno območje";
contextUseExtent["nl"] = "Use current map extent"; //FIXME
contextUseExtent["pl"] = "Use current map extent"; //FIXME
contextUseExtent["sk"] = "Použi aktuálny rozsah mapy"; 
/***********************
Error Messages
***********************/

//error messages on startup
var errMessageStartupMapParamString = [];
errMessageStartupMapParamString["en"] = "Startup-Parameter 'map' missing!";
errMessageStartupMapParamString["es"] = "Falta el parámetro de inicio 'map'!";
errMessageStartupMapParamString["de"] = "Start-Parameter 'map' fehlt!";
errMessageStartupMapParamString["fr"] = "Le paramètre de démarrage 'map' est manquant!";
errMessageStartupMapParamString["it"] = "Il parametro di inizializzazione manca!";
errMessageStartupMapParamString["pt_PT"] = "Parâmetro de inicialização em falta!";
errMessageStartupMapParamString["uk"] = "Параметр 'map' відсутній!";
errMessageStartupMapParamString["hu"] = "Indulási-Paraméter 'map' hiányzik!";
errMessageStartupMapParamString["ro"] = "Lipsește parametrul de pornire 'map'!";
errMessageStartupMapParamString["ru"] = "Параметр 'map' отсутствует!";
errMessageStartupMapParamString["sl"] = "Začetni parameter 'map' manjka!";
errMessageStartupMapParamString["nl"] = "Startparameter 'map' ontbreekt!";
errMessageStartupMapParamString["pl"] = "Brak początkowego parametru 'map'!";
errMessageStartupMapParamString["sk"] = "Chýba inicilaizačný parameter: 'map'!";

//additional startup error message
var errMessageStartupNotAllParamsFoundString = [];
errMessageStartupNotAllParamsFoundString["en"] = "Some mandatory startup paramaters are missing or an optional startup parameter is invalid.";
errMessageStartupNotAllParamsFoundString["es"] = "Faltan algunos parámetros obligatorios";
errMessageStartupNotAllParamsFoundString["de"] = "Es wurden nicht alle notwendigen Web-GIS-Parameter gefunden oder ein optionaler Start-Parameter ist falsch.";
errMessageStartupNotAllParamsFoundString["fr"] = "Certains paramètres indispensables manquent.";
errMessageStartupNotAllParamsFoundString["it"] = "Alcuni parametri necessari mancano.";
errMessageStartupNotAllParamsFoundString["pt_PT"] = "Faltam alguns parâmetros necessários.";
errMessageStartupNotAllParamsFoundString["uk"] = "Відсутні обов'язкові параметри, або деякі параметри мають невірне значення.";
errMessageStartupNotAllParamsFoundString["hu"] = "Néhány kötelező indítási paramétert hiányzik, vagy egy opcionális indítási paraméter érvénytelen.";
errMessageStartupNotAllParamsFoundString["ro"] = "Lipsesc niște parametri obligatorii sau un parametru opțional de start este invalid.";
errMessageStartupNotAllParamsFoundString["ru"] = "Отсутствуют обязательные параметры или необязательный параметр неверен.";
errMessageStartupNotAllParamsFoundString["sl"] = "Obvezni začetni parametri manjkajo ali pa je podan nepravilni parameter.";
errMessageStartupNotAllParamsFoundString["nl"] = "Enkele verplichte startparameters ontbreken of een optionele parameter is niet correct.";
errMessageStartupNotAllParamsFoundString["pl"] = "Brakuje niektórych parametrów startowych lub niektóre parametry są błędne.";
errMessageStartupNotAllParamsFoundString["sk"] = "Niektoré povinné parametre chýbajú alebo voliteľný parameter nie je správny.";

//error message if optional startExtent parameter is wrong
var errMessageExtentParamWrongPart1 = [];
errMessageExtentParamWrongPart1["en"] = "Start-parameter '";
errMessageExtentParamWrongPart1["es"] = "Parámetro de inicialización '";
errMessageExtentParamWrongPart1["de"] = "Start-Parameter '";
errMessageExtentParamWrongPart1["fr"] = "Paramètre d'initialisation '";
errMessageExtentParamWrongPart1["it"] = "Parametro di inizializzazione '";
errMessageExtentParamWrongPart1["pt_PT"] = "Parâmetro de inicialização '";
errMessageExtentParamWrongPart1["uk"] = "Параметр '";
errMessageExtentParamWrongPart1["hu"] = "Indulási-paraméter '";
errMessageExtentParamWrongPart1["ro"] = "Parametrul de start '";
errMessageExtentParamWrongPart1["ru"] = "Параметр запуска '";
errMessageExtentParamWrongPart1["sl"] = "Začetni parameter '";
errMessageExtentParamWrongPart1["nl"] = "Startparameter '";
errMessageExtentParamWrongPart1["pl"] = "Parametr startowy '";
errMessageExtentParamWrongPart1["sk"] = "Parameter '";

//error message if optional startExtent parameter is wrong
var errMessageExtentParamWrongPart2 = [];
errMessageExtentParamWrongPart2["en"] = "' needs to be in OpenLayers.Bounds format: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["es"] = "' debe estar en formato OpenLayers.Bounds: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["de"] = "' muss im OpenLayers.Bounds format sein: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["fr"] = "' devrait être dans le format OpenLayers.Bounds: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["it"] = "' deve essere nel formato di OpenLayers.Bounds: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["pt_PT"] = "' precisa de estar em OpenLayers.Bounds formato: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["uk"] = "' має бути в форматі OpenLayers.Bounds: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["hu"] = "' következő formátum szükséges OpenLayers.Bounds: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["ro"] = "' trebuie sa fie in format OpenLayers.Bounds: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["ru"] = "' должен быть в формате OpenLayers.Bounds: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["sl"] = "' mora biti v 'OpenLayers.Bounds' formatu: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["nl"] = "' moet in OpenLayers.Bounds-formaat opgesteld zijn: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["pl"] = "' musi być w formacie OpenLayers.Bounds: 'left,bottom,right,top'.";
errMessageExtentParamWrongPart2["sk"] = "'musí byť vo formáte OpenLayers.Bounds: 'left,bottom,right,top'.";

//error message invalid language code, part 1
var errMessageInvalidLanguageCodeString1 = [];
errMessageInvalidLanguageCodeString1["en"] = "Invalid language code provided: ";
errMessageInvalidLanguageCodeString1["es"] = "El código de idioma es inválido: ";
errMessageInvalidLanguageCodeString1["de"] = "Falscher Sprachparameter übergeben: ";
errMessageInvalidLanguageCodeString1["fr"] = "Identifiant de langue incorrect: ";
errMessageInvalidLanguageCodeString1["it"] = "Identificativo della lingua non corretto: ";
errMessageInvalidLanguageCodeString1["pt_PT"] = "Identificação do idioma incorrecto: ";
errMessageInvalidLanguageCodeString1["uk"] = "Вказано невірний код мови: ";
errMessageInvalidLanguageCodeString1["hu"] = "Érvénytelen nyelvi kód: ";
errMessageInvalidLanguageCodeString1["ro"] = "Codul de limbă este invalid: ";
errMessageInvalidLanguageCodeString1["ru"] = "Неверный код языка: ";
errMessageInvalidLanguageCodeString1["sl"] = "Podana nepravilna koda jezika: ";
errMessageInvalidLanguageCodeString1["nl"] = "Incorrecte taalcode: ";
errMessageInvalidLanguageCodeString1["pl"] = "Wprowadzono niepoprawny kod języka: ";
errMessageInvalidLanguageCodeString1["sk"] = "Nesprávny kód jazyka: ";

//error message invalid language code, part 2
var errMessageInvalidLanguageCodeString2 = [];
errMessageInvalidLanguageCodeString2["en"] = "Switching back to default language ";
errMessageInvalidLanguageCodeString2["es"] = "Restableciendo el idioma por defecto ";
errMessageInvalidLanguageCodeString2["de"] = "Wechsle zurück zur Standardsprache ";
errMessageInvalidLanguageCodeString2["fr"] = "La langue par défaut sera utilisée ";
errMessageInvalidLanguageCodeString2["it"] = "Si utilizza la lingua di default ";
errMessageInvalidLanguageCodeString2["pt_PT"] = "Mudar para idioma padrão  ";
errMessageInvalidLanguageCodeString2["uk"] = "Переключаюсь на мову за замовчуванням ";
errMessageInvalidLanguageCodeString2["hu"] = "Visszatér az alapértelmezett nyelvhez ";
errMessageInvalidLanguageCodeString2["ro"] = "Trec pe limba implicită ";
errMessageInvalidLanguageCodeString2["ru"] = "Возвращение к языку по умолчанию ";
errMessageInvalidLanguageCodeString2["sl"] = "Preklop na privzeti jezik ";
errMessageInvalidLanguageCodeString2["nl"] = "Terugschakelen naar de standaardtaal ";
errMessageInvalidLanguageCodeString2["pl"] = "Zmiana języka na domyślny ";
errMessageInvalidLanguageCodeString2["sk"] = "Prepínam späť na predvolený jazyk ";

//error message of search combo network request title
var errMessageSearchComboNetworkRequestFailureTitleString = [];
errMessageSearchComboNetworkRequestFailureTitleString["en"] = "Network request failed";
errMessageSearchComboNetworkRequestFailureTitleString["es"] = "Falló la solicitud de red";
errMessageSearchComboNetworkRequestFailureTitleString["de"] = "Netzwerk-Request fehlgeschlagen";
errMessageSearchComboNetworkRequestFailureTitleString["fr"] = "La requête réseau a échoué";
errMessageSearchComboNetworkRequestFailureTitleString["it"] = "La richiesta di rete è fallita";
errMessageSearchComboNetworkRequestFailureTitleString["pt_PT"] = "Pedido de rede falhou";
errMessageSearchComboNetworkRequestFailureTitleString["uk"] = "Помилка мережевого запиту";
errMessageSearchComboNetworkRequestFailureTitleString["hu"] = "Hálózati kérés sikertelen";
errMessageSearchComboNetworkRequestFailureTitleString["ro"] = "Cererea de rețea a eșuat";
errMessageSearchComboNetworkRequestFailureTitleString["ru"] = "Ошибка сетевого запроса";
errMessageSearchComboNetworkRequestFailureTitleString["sl"] = "Omrežni zahtevek ni uspel";
errMessageSearchComboNetworkRequestFailureTitleString["nl"] = "Netwerkrequest mislukt";
errMessageSearchComboNetworkRequestFailureTitleString["pl"] = "Zapytanie sieci nie powiodło się";
errMessageSearchComboNetworkRequestFailureTitleString["sk"] = "Sieťová požiadavka zlyhala";

//error message of search combo network request detailed message - do not forget the \n at the end of the string!
var errMessageSearchComboNetworkRequestFailureString = [];
errMessageSearchComboNetworkRequestFailureString["en"] = "The network request for the geometry of the search result failed:\n";
errMessageSearchComboNetworkRequestFailureString["es"] = "Falló la solicitud de red para la geometría del resultado de la búsqueda:\n";
errMessageSearchComboNetworkRequestFailureString["de"] = "Netzwerk-Request für Geometrie des gesuchten Objekts fehlgeschlagen:\n";
errMessageSearchComboNetworkRequestFailureString["fr"] = "La requête réseau pour la géométrie du résultat de la recherche a échoué:\n";
errMessageSearchComboNetworkRequestFailureString["it"] = "La richiesta di rete è fallita per la geometria del risultato di ricerca:\n";
errMessageSearchComboNetworkRequestFailureString["pt_PT"] = "O pedido de rede para a geometria do resultado de pesquisa falhou:\n";
errMessageSearchComboNetworkRequestFailureString["uk"] = "Не вдалося виконати запит геометрії для результатів пошуку:\n";
errMessageSearchComboNetworkRequestFailureString["hu"] = "Hálozati kérés a keresett geometriára sikertelen:\n";
errMessageSearchComboNetworkRequestFailureString["ro"] = "Cererea de rețea pentru geometria rezultatului căutarii a eșuat:\n";
errMessageSearchComboNetworkRequestFailureString["ru"] = "не удалось выполнить запрос геометрии для результатов поиска:\n";
errMessageSearchComboNetworkRequestFailureString["sl"] = "Omrežni zahtevek za geometrijo iskalnega rezultata ni uspel:\n";
errMessageSearchComboNetworkRequestFailureString["nl"] = "Netwerkrequest voor de geometrie van het zoekresultaat is mislukt:\n";
errMessageSearchComboNetworkRequestFailureString["en"] = "Zapytanie sieci o geometrię wyszukiwania nie powiodło się:\n";
errMessageSearchComboNetworkRequestFailureString["sk"] = "Sieťová požiadavka  pre geometriu vo výsledku hľadania zlyhala:\n";
