/**
 * Copyright (c) 2008-2009 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = GeoExt.ux
 *  class = GeocodingSearchCombo
 *  base_link = `Ext.form.ComboBox <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */

Ext.namespace("GeoExt.ux");

GeoExt.ux.GeocodingSearchCombo = Ext.extend(Ext.form.ComboBox, {
    /** api: config[map]
     *  ``OpenLayers.Map or Object``  A configured map or a configuration object
     *  for the map constructor, required only if :attr:`zoom` is set to
     *  value greater than or equal to 0.
     */
    /** private: property[map]
     *  ``OpenLayers.Map``  The map object.
     */
    map: null,

    highlightLayerName: null,
    highlightLayer: null,

    /** api: config[width]
     *  See http://www.dev.sencha.com/deploy/dev/docs/source/BoxComponent.html#cfg-Ext.BoxComponent-width,
     *  default value is 350.
     */
    width: 350,

    /** api: config[listWidth]
     *  See http://www.dev.sencha.com/deploy/dev/docs/source/Combo.html#cfg-Ext.form.ComboBox-listWidth,
     *  default value is 350.
     */
    listWidth: 350,

    /** api: config[zoom]
     *  ``Number`` Zoom level for recentering the map after search, if set to
     *  a negative number the map isn't recentered, defaults to 8.
     */
    /** private: property[zoom]
     *  ``Number``
     */
    zoom: 8,

    /** api: config[minChars]
     *  ``Number`` Minimum number of characters to be typed before
     *  search occurs, defaults to 1.
     */
    minChars: 1,

    /** api: config[queryDelay]
     *  ``Number`` Delay before the search occurs, defaults to 50 ms.
     */
    queryDelay: 50,

    /** api: config[maxRows]
     *  `String` The maximum number of rows in the responses, defaults to 20,
     *  maximum allowed value is 1000.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[maxRows]
     *  ``String``
     */
    maxRows: '20',

    /** api: config[tpl]
     *  ``Ext.XTemplate or String`` Template for presenting the result in the
     *  list (see http://www.dev.sencha.com/deploy/dev/docs/output/Ext.XTemplate.html),
     *  if not set a default value is provided.
     */
    tpl: '<tpl for="."><div class="x-combo-list-item">{' + this.displayField + '}</div></tpl>',

    country: '',

    layers: '',

    /** api: config[charset]
     *  `String` Defines the encoding used for the document returned by
     *  the web service, defaults to 'UTF8'.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[charset]
     *  ``String``
     */
    //charset: 'UTF8',

    /** private: property[hideTrigger]
     *  Hide trigger of the combo.
     */
    hideTrigger: false,

    /** private: property[displayField]
     *  Display field name
     */
    displayField: 'name',

    /** private: property[forceSelection]
     *  Force selection.
     */
    forceSelection: true,

    /** private: property[queryParam]
     *  Query parameter.
     */
    queryParam: 'query',

    /** private: property[url]
     *  Url of service
     */
    url: 'admin/proxy.php',

    provider: '',

    /** private: constructor
     */
    initComponent: function() {

        this.triggerConfig = { // we use a default clear trigger here
            tag: "img", src: Ext.BLANK_IMAGE_URL, cls:'x-form-trigger x-form-clear-trigger'
        };
        this.on("keyUp", this.keyUpHandler);
        this.on("afterrender", this.afterrenderHandler);
        this.on("beforeselect", this.beforeselectHandler);

        GeoExt.ux.GeocodingSearchCombo.superclass.initComponent.apply(this, arguments);

        //reference to highlightLayer
        if (this.highlightLayerName) {
            this.highlightLayer = this.map.getLayersByName(this.highlightLayerName)[0];
        }



        //setup for mapbox params
        var params = {
            country: this.country,
            limit: this.maxRows,
            types: this.layers,
            language: this.lang,
            provider: this.provider
        };

        //optional parameters, only add if they exist in json file
        if (typeof this.countryString !== 'undefined') {
            params["country"] = this.countryString;
        }

        //if (typeof this.sources !== 'undefined') {
        //    params["sources"] = this.sources;
        //}

        this.store = new Ext.data.JsonStore({

            nocache: false,
            autoAbort: true,
            proxy: new Ext.data.HttpProxy({
                url: this.url,
                method: 'GET',
                scope: this,
                listeners: {
                    beforeload: function(store, options){
                        //center map for proximity results
                        var center = geoExtMap.map.getCenter().transform(authid, new OpenLayers.Projection("EPSG:4326"));
                        options.proximity = center.lon+','+center.lat;
                    }
                }
            }),
            baseParams: params,
            root: "features",
            //totalProperty: "totalResultsCount",
            fields: [
                {
                    name: 'id', mapping: "id"
                },
                {
                    name: 'relevance', mapping: "relevance"
                },
                {
                    name: 'lng', mapping: "geometry.coordinates[0]"
                },
                {
                    name: 'lat', mapping: "geometry.coordinates[1]"
                },
                {
                    name: 'place_name', mapping: "place_name"
                },
                {
                    name: 'text', mapping: "text"
                }
                //{
                //    name: 'name2', convert: this.getName2
                //}
            ]
        });

        if(this.zoom > 0) {
            this.on("select", function(combo, record, index) {
                var position = new OpenLayers.LonLat(
                    record.data.lng, record.data.lat
                );
                position.transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    this.map.getProjectionObject()
                );

                //add location to higlightlayer
                var marker = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(position.lon, position.lat),
                    {},
                    Eqwc.settings.symbolizersHighLightLayer.Point
                );
                this.highlightLayer.removeAllFeatures();
                this.highlightLayer.addFeatures(marker);

                this.map.setCenter(position, this.zoom);
            }, this);
        }
    },
    //getName2: function(v, record){
    //    return record.properties.street + ' ' + record.properties.housenumber;
    //},

    // private
    afterrenderHandler: function() {
        this.trigger["hide"]();
    },

    beforeselectHandler: function(combo,record,index) {
        combo.setValue(record.data[this.displayField]);

        if (record.get('selectable') == "1") {
            this.collapse();
        }
    },

    keyUpHandler: function(cmp, e) {
        //reset if user deleted last sign
        this.checkTrigger();
        if (Ext.isEmpty(this.getValue())) {
            this.resetSearch();
        }
        //collapse if less than minChars are left
        if (this.getValue().length < this.minChars) {
            this.collapse();
        }
    },

    checkTrigger: function() {
        // show trigger only if there is any input
        if (this.rendered) {
            this.trigger[!Ext.isEmpty(this.getValue()) ? 'show': 'hide']();
        }
    },

    onTriggerClick: function() {
        // reimplements default onTriggerClick function (which does nothing)
        this.resetSearch();
        this.checkTrigger();
        this.focus();
    },

    resetSearch: function(){
        this.collapse();
        this.clearSearchResult();
    },

    clearSearchResult: function() {
        this.setValue("");
        if (this.highlightLayer) {
            this.highlightLayer.removeAllFeatures();
        }
    }
});

/** api: xtype = gxux_GeocodingSearchCombo */
Ext.reg('gxux_GeocodingSearchCombo', GeoExt.ux.GeocodingSearchCombo);
