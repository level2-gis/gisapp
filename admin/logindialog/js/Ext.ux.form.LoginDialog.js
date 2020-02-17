/**
 * Free and simple to use loginDialog for ExtJS 3.x
 *
 * @author  Albert Varaksin (ExtJS 2.x)
 * @author  Sumit Madan (ExtJS 3.x)
 * @license LGPLv3 http://www.opensource.org/licenses/lgpl-3.0.html
 * @version 1.0 beta, 07/12/2008 - ExtJS 2.x
 * @version 1.0, 05/03/2009 - ExtJS 3.x
 * @version 1.1, 07/18/2009 - ExtJS 3.x
 *
 * Uros : added extraparam, language value parameter, guest access, changelanguage, languagestore
 */

Ext.namespace('Ext.ux.form');

/**
 * Login dialog constructor
 *
 * @param {Object} config
 * @extends {Ext.util.Observable}
 */
Ext.ux.form.LoginDialog = function (config) {
    Ext.apply(this, config);

    // The CSS needed to style the dialog.
    var css = '.ux-auth-header-icon {background: url("' + this.basePath + '/small/locked.png") 0 4px no-repeat !important;}'
        + '.ux-auth-header {background:transparent url("' + this.basePath + '/large/lock.png") no-repeat center right;padding:10px;padding-right:45px;padding-bottom:1px;font-weight:bold;}'
        + '.ux-auth-login {background-image: url("' + this.basePath + '/medium/key.png") !important;}'
        + '.ux-auth-guest {background-image: url("' + this.basePath + '/medium/guest.png") !important;}'
        + '.ux-auth-close {background-image: url("' + this.basePath + '/medium/close.png") !important;}'
        + '.ux-auth-warning {background:url("' + this.basePath + '/small/warning.png") no-repeat center left; padding: 2px; padding-left:20px; font-weight:bold;}'
        + '.ux-auth-header .error {color:red;}'
        + '.ux-auth-form {padding:10px;}';
    Ext.util.CSS.createStyleSheet(css, this._cssId);

    if (this.forceVirtualKeyboard) {
        this.enableVirtualKeyboard = true;
    }

    // LoginDialog events
    this.addEvents({
        'show': true, // when dialog is visible and rendered
        'cancel': true, // When user cancelled the login
        'success': true, // on succesfful login
        'failure': true, // on failed login
        'submit': true  // about to submit the data
    });
    Ext.ux.form.LoginDialog.superclass.constructor.call(this, config);

    // head info panel
    this._headPanel = new Ext.Panel({
        baseCls: 'x-plain',
        html: this.message,
        cls: 'ux-auth-header',
        region: 'north',
        height: 60
    });

    // store username id to focus on window show event
    this._usernameId = Ext.id();
    this._passwordId = Ext.id();
    this._loginButtonId = Ext.id();
    this._cancelButtonId = Ext.id();
    this._rememberMeId = Ext.id();

    // form panel
    this._formPanel = new Ext.form.FormPanel({
        region: 'center',
        border: false,
        bodyStyle: "padding: 10px;",
        waitMsgTarget: true,
        labelWidth: 75,
        defaults: {width: 250},
        items: [{
            xtype: 'textfield',
            id: this._usernameId,
            name: this.usernameField,
            fieldLabel: this.usernameLabel,
            vtype: this.usernameVtype,
            validateOnBlur: false,
            allowBlank: false
        }, {
            xtype: 'textfield',
            inputType: 'password',
            id: this._passwordId,
            name: this.passwordField,
            fieldLabel: this.passwordLabel,
            vtype: this.passwordVtype,
            width: this.enableVirtualKeyboard == true ? 230 : 250,
            validateOnBlur: false,
            allowBlank: false,
            validationEvent: this.forceVirtualKeyboard == true ? 'blur' : 'keyup',
            enableKeyEvents: true,
            keyboardConfig: {
                showIcon: true,
                languageSelection: true
            },
            plugins: this.enableVirtualKeyboard == true ? new Ext.ux.plugins.VirtualKeyboard() : null,
            listeners: {
                render: function () {
                    this.capsWarningTooltip = new Ext.ToolTip({
                        target: this.id,
                        anchor: 'top',
                        width: 305,
                        html: '<div class="ux-auth-warning">Caps Lock is On</div><br />' +
                        '<div>Having Caps Lock on may cause you to enter your password incorrectly.</div><br />' +
                        '<div>You should press Caps Lock to turn it off before entering your password.</div>'
                    });

                    // disable to tooltip from showing on mouseover
                    this.capsWarningTooltip.disable();

                    // When the password field fires the blur event,
                    // the tootip gets enabled automatically (possibly an ExtJS bug).
                    // Disable the tooltip everytime it gets enabled
                    // The tooltip is shown explicitly by calling show()
                    // and enabling/disabling does not affect the show() function.
                    this.capsWarningTooltip.on('enable', function () {
                        this.disable();
                    });
                },

                keypress: {
                    fn: function (field, e) {
                        if (this.forceVirtualKeyboard) {
                            field.plugins.expand();
                            e.stopEvent();
                        }
                        else {
                            var charCode = e.getCharCode();
                            if ((e.shiftKey && charCode >= 97 && charCode <= 122) ||
                                (!e.shiftKey && charCode >= 65 && charCode <= 90)) {

                                field.capsWarningTooltip.show();
                            }
                            else {
                                if (field.capsWarningTooltip.hidden == false) {
                                    field.capsWarningTooltip.hide();
                                }
                            }
                        }
                    },
                    scope: this
                },

                blur: function (field) {
                    if (this.capsWarningTooltip.hidden == false) {
                        this.capsWarningTooltip.hide();
                    }
                }
            }
        }, {
            xtype: 'box',
            autoEl: {
                html: '<div style="text-align: right; width: 330px;">' +
                '<a href="' + this.forgotPasswordLink + '" target="_blank">' +
                this.forgotPasswordLabel + '</a></div>'
            }
        }, {
            xtype: 'box',
            autoEl: 'div',
            height: 10
        }, {
            xtype: 'iconcombo',
            hiddenName: this.languageField,
            fieldLabel: this.languageLabel,
            store: new Ext.data.SimpleStore({
                fields: ['languageCode', 'languageName', 'countryFlag'],
                data: this.languageStore
            }),
            valueField: 'languageCode',
            value: this.language,
            displayField: 'languageName',
            iconClsField: 'countryFlag',
            triggerAction: 'all',
            editable: false,
            mode: 'local',
            listeners: {
                select: function (combo, record, index) {
                    //TODO fix this, not OK, must be generic look extraparamvalue
                    if (this.value != this.originalValue) {
                        urlParams.lang = this.value;
                        var startParams = Ext.urlEncode(urlParams);

                        window.location.href = map + "?" + startParams;
                    }
                }
            }
        },
        //     {
        //     xtype: 'checkbox',
        //     id: this._rememberMeId,
        //     name: this.rememberMeField,
        //     boxLabel: '&nbsp;' + this.rememberMeLabel,
        //     width: 200,
        //     listeners: {
        //         render: function () {
        //             Ext.get(Ext.DomQuery.select('#x-form-el-' + this._rememberMeId + ' input')).set({
        //                 qtip: 'This is not recommended for shared computers.'
        //             });
        //
        //         },
        //         scope: this
        //     }
        // },
            {
            //extraparameter
            xtype: 'hidden',
            name: this.extraParamField,
            value: this.extraParamValue
        }]
    });

    // Default buttons and keys
    var buttons = [{
        //id          : this._guestButtonId,
        text: this.guestButton,
        iconCls: 'ux-auth-guest',
        width: 90,
        handler: this.guestSubmit,
        scale: 'medium',
        scope: this
    }, {
        id: this._loginButtonId,
        text: this.loginButton,
        iconCls: 'ux-auth-login',
        width: 90,
        handler: this.submit,
        scale: 'medium',
        scope: this
    }];
    var keys = [{
        key: [10, 13],
        handler: this.submit,
        scope: this
    }];

    // if cancel button exists
    if (typeof this.cancelButton == 'string') {
        buttons.push({
            id: this._cancelButtonId,
            text: this.cancelButton,
            iconCls: 'ux-auth-close',
            width: 90,
            handler: this.cancel,
            scale: 'medium',
            scope: this
        });
        keys.push({
            key: [27],
            handler: this.cancel,
            scope: this
        });
    }


    // create the window
    this._window = new Ext.Window({
        width: 370,
        height: 280,
        closable: false,
        resizable: false,
        draggable: true,
        modal: this.modal,
        iconCls: 'ux-auth-header-icon',
        title: this.title,
        layout: 'border',
        bodyStyle: 'padding:5px;',
        buttons: buttons,
        keys: keys,
        items: [this._headPanel, this._formPanel],
        shadow: false
    });

    // when window is visible set focus to the username field
    // and fire "show" event
    this._window.on('show', function () {

        Ext.getCmp(this._usernameId).focus(true, 500);
        Ext.getCmp(this._passwordId).setRawValue('');
        this.fireEvent('show', this);

    }, this);
};


// Extend the Observable class
Ext.extend(Ext.ux.form.LoginDialog, Ext.util.Observable, {

    /**
     * LoginDialog window title
     *
     * @type {String}
     */
    title: 'Login',

    /**
     * The message on the LoginDialog
     *
     * @type {String}
     */
    message: 'Access to this location is restricted to authorized users only.' +
    '<br />Please type your username and password.',

    /**
     * When login failed and no server message sent
     *
     * @type {String}
     */
    failMessage: 'Unable to log in',

    /**
     * When submitting the login details
     *
     * @type {String}
     */
    waitMessage: 'Please wait...',

    /**
     * The login button text
     *
     * @type {String}
     */
    loginButton: 'Login',


    guestButton: 'Guest',


    /**
     * Cancel button
     *
     * @type {String}
     */
    cancelButton: null,

    /**
     * Username field label
     *
     * @type {String}
     */
    usernameLabel: 'Username',

    /**
     * Username field name
     *
     * @type {String}
     */
    usernameField: 'username',

    /**
     * Username validation
     *
     * @type {String}
     */
    usernameVtype: 'alphanum',

    /**
     * Password field label
     *
     * @type {String}
     */
    passwordLabel: 'Password',

    /**
     * Password field name
     *
     * @type {String}
     */
    passwordField: 'password',

    /**
     * Password field validation
     *
     * @type {String}
     */
    passwordVtype: 'alphanum',

    /**
     * Language field label
     *
     * @type {String}
     */
    languageLabel: 'Language',

    /**
     * Language field name
     *
     * @type {String}
     */
    languageField: 'lang',


    /**
     * Selected language (2 letter code)
     *
     * @type {String}
     */
    language: 'en',

    /**
     * Available languages
     *
     */
    languageStore: [
        ['en', 'English', 'ux-flag-en']
    ],

    /**
     * RememberMe field label
     *
     * @type {String}
     */
    rememberMeLabel: 'Remember me on this computer',

    /**
     * RememberMe field name
     *
     * @type {String}
     */
    rememberMeField: 'rememberme',

    /**
     * ExtraParam field name
     *
     * @type {String}
     */
    extraParamField: 'extra',

    /**
     * ExtraParam field value
     *
     * @type {String}
     */
    extraParamValue: 'extravalue',

    /**
     * Forgot Password field label
     *
     * @type {String}
     */
    forgotPasswordLabel: 'Forgot Password?',

    /**
     * Enable Virtual Keyboard for password
     *
     * @type {Bool}
     */
    enableVirtualKeyboard: false,

    /**
     * Force Virtual Keyboard for password entry
     * If true, also sets enableVirtualKeyboard property to true
     *
     * @type {Bool}
     */
    forceVirtualKeyboard: false,

    /**
     * encrypt password using SHA1
     *
     * @type {Bool}
     */
    encrypt: false,

    /**
     * Salt prepended to password, before encryption
     * If encrypt property is false, salt is not used
     *
     * @type {String}
     */
    salt: '',

    /**
     * Forgot Password hyperlink
     *
     * @type {String}
     */
    forgotPasswordLink: 'about:blank',

    /**
     * Request url
     *
     * @type {String}
     */
    url: '/auth/login',

    /**
     * Path to images
     *
     * @type {String}
     */
    basePath: '/',

    /**
     * Form submit method
     *
     * @type {String}
     */
    method: 'post',

    /**
     * Open modal window
     *
     * @type {Bool}
     */
    modal: false,

    /**
     * CSS identifier
     *
     * @type {String}
     */
    _cssId: 'ux-LoginDialog-css',

    /**
     * Head info panel
     *
     * @type {Ext.Panel}
     */
    _headPanel: null,

    /**
     * Form panel
     *
     * @type {Ext.form.FormPanel}
     */
    _formPanel: null,

    /**
     * The window object
     *
     * @type {Ext.Window}
     */
    _window: null,

    /**
     * Set the LoginDialog message
     *
     * @param {String} msg
     */
    setMessage: function (msg) {
        this._headPanel.body.update(msg);
    },


    /**
     * Show the LoginDialog
     *
     * @param {Ext.Element} el
     */
    show: function (el) {
        this._window.show(el);
    },


    /**
     * Hide the LoginDialog
     */
    hide: function () {
        this._window.hide()
    },

    /**
     * Hide and cleanup the LoginDialog
     */
    destroy: function () {
        this._window.hide();
        this.purgeListeners();
        Ext.util.CSS.removeStyleSheet(this._cssId);
        var self = this;
        delete self;
    },


    /**
     * Cancel the login (closes the dialog window)
     */
    cancel: function () {
        if (this.fireEvent('cancel', this)) {
            this.hide();
        }
    },

    guestSubmit: function () {
        var form = this._formPanel.getForm();
        form.setValues({
            user_name: "guest",
            user_password: "guest"
        });
        this.submit();
    },

    /**
     * Submit login details to the server
     */
    submit: function () {
        var form = this._formPanel.getForm();

        if (form.isValid()) {
            Ext.getCmp(this._loginButtonId).disable();
            if (Ext.getCmp(this._cancelButtonId)) {
                Ext.getCmp(this._cancelButtonId).disable();
            }
            if (this.encrypt) {
                Ext.getCmp(this._passwordId).setRawValue(
                    Ext.ux.Crypto.SHA1.hash(this.salt + Ext.getCmp(this._passwordId).getValue())
                );
            }

            if (this.fireEvent('submit', this, form.getValues())) {
                this.setMessage(this.message);
                form.submit({
                    url: this.url,
                    method: this.method,
                    waitMsg: this.waitMessage,
                    success: this.onSuccess,
                    failure: this.onFailure,
                    scope: this
                });
            }
        }
    },


    /**
     * On success
     *
     * @param {Ext.form.BasicForm} form
     * @param {Ext.form.Action} action
     */
    onSuccess: function (form, action) {
        if (this.fireEvent('success', this, action)) {
            // enable buttons
            Ext.getCmp(this._loginButtonId).enable();
            if (Ext.getCmp(this._cancelButtonId)) {
                Ext.getCmp(this._cancelButtonId).enable();
            }

            this.hide();
        }
    },


    /**
     * On failures
     *
     * @param {Ext.form.BasicForm} form
     * @param {Ext.form.Action} action
     */
    onFailure: function (form, action) {
        // enable buttons
        Ext.getCmp(this._loginButtonId).enable();
        if (Ext.getCmp(this._cancelButtonId)) {
            Ext.getCmp(this._cancelButtonId).enable();
        }
        if (this.encrypt) {
            Ext.getCmp(this._passwordId).setRawValue('');
        }

        Ext.getCmp(this._passwordId).focus(true);

        var msg = '';
        if (action.result && action.result.message) msg = action.result.message || this.failMessage;
        else msg = this.failMessage;

        try {
            msg = new String(eval(msg));
        } catch (e) {
            //
        }

        this.setMessage(this.message + '<br /><span class="error">' + msg + '</span>');
        this.fireEvent('failure', this, action, msg);
    }

});