QGIS.Editor = Ext.extend(Ext.form.FormPanel, {
    frame: true,
    autoHeight: true,
    labelAlign: 'right',
    defaultType: 'textfield',
    defaults: {
        anchor: '100%'
    },
    editLayer: '',

    // private A pointer to the currently loaded record
    record : null,

    /**
     * initComponent
     * @protected
     */
    initComponent : function() {
        // build the form-fields.  Always a good idea to defer form-building to a method so that this class can
        // be over-ridden to provide different form-fields
        this.plugins = this.buildForm();

        // build form-buttons
        this.buttons = this.buildUI();

        // add a create event for convenience in our application-code.
        this.addEvents({
            /**
             * @event create
             * Fires when user clicks [create] button
             * @param {FormPanel} this
             * @param {Object} values, the Form's values object
             */
            create : true,

            //it's not really delete it updates delete field to true
            delete : true
        });

        this.plugins[0].attributeStore.load();

        // super
        QGIS.Editor.superclass.initComponent.call(this);
    },

    /**
     * buildform
     * @private
     */
    buildForm : function() {
        return [
            new GeoExt.plugins.AttributeForm({
                attributeStore: new GeoExt.data.AttributeStore({
                    url: wmsURI,
                    baseParams: {
                        "SERVICE": "WFS",
                        "VERSION": "1.1.0",
                        "REQUEST": "DescribeFeatureType",
                        "TYPENAME": this.editLayer
                    }
                }),
                recordToFieldOptions: {
                    mandatoryFieldLabelStyle: 'font-style:normal;',
                    labelTpl: new Ext.XTemplate(
                        '<span ext:qtip="{[this.getTip(values)]}">{name}</span>', {
                            compiled: true,
                            disableFormats: true,
                            getTip: function(v) {
                                if (!v.type) {
                                    return '';
                                }
                                var type = v.type.split(":").pop();
                                return OpenLayers.i18n(type) +
                                    (v.nillable ? '' : ' (required)');
                            }
                        }
                    )
                }

            })
        ];

        //defaults to this.items (I changed to plugins)
        //        return [
        //            {fieldLabel: 'Email', name: 'email', allowBlank: false, vtype: 'email'},
        //            {fieldLabel: 'First', name: 'first', allowBlank: false},
        //            {fieldLabel: 'Last', name: 'last', allowBlank: false}
        //        ];
    },

    /**
     * buildUI
     * @private
     */
    buildUI: function(){
        return [{
            text: TR.editSave,
            iconCls: 'icon-save',
            handler: this.onUpdate,
            scope: this
        }, {
            text: TR.editDelete,
            disabled: true,
            iconCls: 'icon-delete',
            handler: this.onDelete,
            scope: this


//        }, {
//            text: 'Create',
//            iconCls: 'silk-user-add',
//            handler: this.onCreate,
//            scope: this
//        }, {
//            text: 'Reset',
//            handler: function(btn, ev){
//                this.getForm().reset();
//            },
//            scope: this
        }];
    },

    /**
     * loadRecord
     * @param {Record} rec
     */
    loadRecord : function(rec) {
        this.record = rec;
        this.getForm().loadRecord(rec);
    },

    /**
     * onUpdate
     */
    onUpdate : function(btn, ev) {
        if (this.record == null) {
            return;
        }
        if (!this.getForm().isValid()) {
            Ext.Msg.alert("Error", "Form is invalid.");
            return false;
        }
        //this.getForm().updateRecord(this.record);
        //this.record = OpenLayers.Vector
        //TODO FIX THIS
        Ext.Msg.alert("Opozorilo", "Shranjevanje v demo načinu ni omogočeno.");
    },

    /**
     * onCreate
     */
    onCreate : function(btn, ev) {
        alert('bbb');
        if (!this.getForm().isValid()) {
            Ext.Msg.alert("Error", "Form is invalid");
            return false;
        }
        this.fireEvent('create', this, this.getForm().getValues());
        this.getForm().reset();
    },

    onDelete : function(btn, ev) {
        //TODO treba je nastaviti polje delete na true in sprožiti update postopek
        Ext.Msg.alert("Opozorilo", "Brisanje v demo načinu ni omogočeno.");
        this.fireEvent('delete', this, this.getForm().getValues());
        //this.getForm().reset();
    },

    /**
     * onReset
     */
    onReset : function(btn, ev) {
        this.fireEvent('update', this, this.getForm().getValues());
        this.getForm().reset();
    }
});

/** api: xtype = qgis_editor */
Ext.reg('qgis_editor', QGIS.Editor);