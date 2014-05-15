/**
 * Ext.ux.form.IconComboBox Extension Class for Ext 2.x Library
 *
 * @author  Ing. Jozef Sakalos
 * @version $Id: Ext.ux.form.IconComboBox.js 49 2008-03-08 23:13:29Z jozo $
 *
 * @license Ext.ux.form.IconComboBox is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

/**
 * @class Ext.ux.form.IconComboBox
 * @extends Ext.form.ComboBox
 */

Ext.namespace('Ext.ux.form');

Ext.ux.form.IconCombo = Ext.extend(Ext.form.ComboBox, {
    initComponent:function() {
        var css = '.ux-icon-combo-icon {background-repeat: no-repeat;background-position: 0 50%;width: 18px;height: 14px;}'
        + '.ux-icon-combo-input {padding-left: 25px;}'
        + '.x-form-field-wrap .ux-icon-combo-icon {top: 4px;left: 5px;}'
        + '.ux-icon-combo-item {background-repeat: no-repeat ! important;background-position: 3px 50% ! important;padding-left: 24px ! important;}';

        Ext.util.CSS.createStyleSheet(css, this._cssId);
        
        Ext.apply(this, {
            tpl:  '<tpl for=".">'
                + '<div class="x-combo-list-item ux-icon-combo-item '
                + '{' + this.iconClsField + '}">'
                + '{' + this.displayField + '}'
                + '</div></tpl>'
        });

        // call parent initComponent
        Ext.ux.form.IconCombo.superclass.initComponent.apply(this, arguments);

    } // eo function initComponent

    ,onRender:function(ct, position) {
        // call parent onRender
        Ext.ux.form.IconCombo.superclass.onRender.apply(this, arguments);

        // adjust styles
        this.wrap.applyStyles({position:'relative'});
        this.el.addClass('ux-icon-combo-input');

        // add div for icon
        this.icon = Ext.DomHelper.append(this.el.up('div.x-form-field-wrap'), {
            tag: 'div', style:'position:absolute'
        });
    } // eo function onRender

    ,afterRender:function() {
        Ext.ux.form.IconCombo.superclass.afterRender.apply(this, arguments);
        if(undefined !== this.value) {
            this.setValue(this.value);
        }
    } // eo function afterRender
    ,setIconCls:function() {
        var rec = this.store.query(this.valueField, this.getValue()).itemAt(0);
        if(rec && this.icon) {
            this.icon.className = 'ux-icon-combo-icon ' + rec.get(this.iconClsField);
        }
    } // eo function setIconCls

    ,setValue: function(value) {
        Ext.ux.form.IconCombo.superclass.setValue.call(this, value);
        this.setIconCls();
    } // eo function setValue

    ,_cssId : 'ux-IconCombo-css'

});

// register xtype
Ext.reg('iconcombo', Ext.ux.form.IconCombo);