//GetProject (code from GetUrlParam)

/* global GLOBAL_SERVER_OS */
/* global GLOBAL_LANG */
/* global Ext */
/* global TR */

var urlString = "";
var map = "";
var urlParams = {};
var guest = false;
var langsel = GLOBAL_LANG; //default
var startParams = "";

if (document.documentURI) {
    //all browsers except older IE
    urlString = document.documentURI;
} else {
    //older IEs do not know document.documentURI
    urlString = window.location.href;
}
urlString = urlString.replace(/\+/g, ' ');

if (GLOBAL_SERVER_OS == 'Windows NT') {
    var fullPath = Ext.urlDecode(window.location.search.substring(1)).map;
    map = fullPath.substr(fullPath.lastIndexOf('/') + 1, fullPath.length);
    if (map.indexOf('.qgs') > -1) {
        map = map.slice(0, map.length - 4);
    }
}
else {
    var urlArray = urlString.split('?');

    if (urlArray.length > 1) {
        urlParams = Ext.urlDecode(urlArray[1]);
        if (urlParams.public == 'on') {
            guest = true;
        }
    }

    var urlBaseArray = urlArray[0].split('/');
    map = urlBaseArray.slice(4).join('/');
}

Ext.BLANK_IMAGE_URL = 'client/site/libs/ext/resources/images/default/s.gif';

Ext.onReady(function () {

    if (map == '') {

        Ext.Msg.alert(TR.noProject, TR.noProjectText);

    }
    else {

        //guest access, direct call to login.php
        if (guest) {
            Ext.Ajax.request({
                url: 'admin/login.php',
                params: {
                    user_name: "guest",
                    user_password: "guest",
                    project: map
                },
                method: 'POST',
                success: function (response) {

                    var result = Ext.util.JSON.decode(response.responseText);

                    if (result.success) {

                        urlParams.lang = langsel;
                        startParams = Ext.urlEncode(urlParams);

                        if (GLOBAL_SERVER_OS == 'Windows NT') {
                            window.location.href = "index.php?map=" + fullPath + "&" + startParams;
                        }
                        else {
                            window.location.href = map + "?" + startParams;
                        }
                    }
                    else {
                        Ext.Msg.alert("Error", eval(result.message));
                    }
                }
            });
        }
        else {
            Ext.QuickTips.init(true);

            var loginDialog = new Ext.ux.form.LoginDialog({
                url: 'admin/login.php',
                modal: true,
                //forgotPasswordLink : '',
                cancelButton: null,
                basePath: 'admin/logindialog/img/icons',
                encrypt: false,
                usernameField: 'user_name',
                passwordField: 'user_password',
                extraParamField: 'project',
                extraParamValue: map,
                enableVirtualKeyboard: true,
                language: langsel,
                languageStore: gisAppLanguages,
                onSuccess: function (form, action) {
                    if (this.fireEvent('success', this, action)) {
                        // enable buttons
                        Ext.getCmp(this._loginButtonId).enable();
                        if (Ext.getCmp(this._cancelButtonId)) {
                            Ext.getCmp(this._cancelButtonId).enable();
                        }

                        //TODO fix this, bad practice
                        langsel = form.items.items[2].value;
                        urlParams.lang = langsel;
                        startParams = Ext.urlEncode(urlParams);

                        if (GLOBAL_SERVER_OS == 'Windows NT') {
                            window.location.href = "index.php?map=" + fullPath + "&" + startParams;
                        }
                        else {
                            window.location.href = map + "?" + startParams;
                        }
                        this.hide();
                    }
                },
                //text strings, leave this, look language files
                title: TR.loginTitle,
                message: TR.loginMessage,
                failMessage: TR.loginFailMessage,
                waitMessage: TR.loginWaitMessage,
                loginButton: TR.loginButton,
                guestButton: TR.guestButton,
                usernameLabel: TR.loginUsernameLabel,
                passwordLabel: TR.loginPasswordLabel,
                languageLabel: TR.loginLanguageLabel,
                rememberMeLabel: TR.loginRememberMeLabel,
                forgotPasswordLabel: TR.loginForgotPasswordLabel
            });

            loginDialog.show();

        }

    }
});

