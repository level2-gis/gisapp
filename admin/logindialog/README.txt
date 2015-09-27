License : LGPLv3 http://www.opensource.org/licenses/lgpl-3.0.html
Author  : Albert Varaksin (ExtJS 2.x)
Author  : Sumit Madan (ExtJS 3.x)
Version : 1.0 beta, 07/12/2008 - ExtJS 2.x
Version : 1.0, 05/03/2009 - ExtJS 3.x
Version : 1.1, 07/18/2009 - ExtJS 3.x

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Changes - Version 1.0 - 1.2 (ExtJS 3.x) Author: Sumit Madan

Version 1.2, 08/08/2009
> Added: Option to SHA1 encrypt password before submit (credits: Chris Veness)
> Added: Option to Enable / Disable virtual keyboard plugin and enable forced password entry through virtual keyboard.


Version 1.1, 07/18/2009
> Added: Caps Lock warning for password field (credits: http://17thdegree.com/)
> Added: Virtual Keyboard password entry plugin (VirtualKeyboard extension/plugin by efattal: https://extjs.com/forum/showthread.php?p=223683)
> Updated: High-resolution PNG images (sorry IE6 folks, please supply your own images)
> Updated: Misc css, code changes, README help corrections.


Version 1.0, 05/03/2009 - Upgraded albeva's original extension for ExtJS 2.x to ExtJS 3.x
> Added: Language Icon Combo (IconCombo extension by Saki)
> Added: Remember Me Checkbox and config option
> Added: Forgot Password Link and config option
> Updated: Login Buttons to ExtJS 3.0 style buttons - medium (24x24 icons)
> Updated: Misc css and code changes

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Comments - Version 1.0 beta (ExtJS 2.x) Author: Albert Varaksin
--------------------------------------------------------------

About LoginDialog
===========================
This is a simple login dialog extension for Ext 2.x library

Some days ago I was looking for a nice login dialog for my web application to avoid spending time on creating one. Maybe I am blind or otherwise unfortunate and missed something - but I didn't find any that would suit my needs.

The only extension I found was Ext.ux.Domino.LoginMenu by galdaka ( http://extjs.com/learn/Extension:Domino_authentication ) but that seemed rather over complicated and not flexible enough for my simple needs. But I did take few ideas and an icon from there. (Thanks Galdaka!)

Anyway this is what I created and hope you will find it useful. It's free and open source. Would be nice if you credit me but that's up to you.

How it works
==============
Simple! You create an instance of it and pass at least 2 config options
a) the server URL where to submit form data and b) the path where the images are
stored (they are sort of optional. Doesn't break the functionality if missing)

The server has to return the response in JSON format:
{
    success : true or false,
    message : 'the message to show if login failed'
}

And that's IT! You can also customize the loginDialog to suit your needs better.
Anyway here is a small example:

    <script type="text/javascript" src="/LoginDialog.js"></script>
    <script type="text/javascript">
        Ext.onReady (function () {
            var loginDlg = new Ext.ux.albeva.LoginDialog({
                url : '/auth/login', // where the request is submitted to
                basePath : "/img/icons" // do not add trailing slash!
            });
        });
    </script>

Of course you need to load ExtJS library as well. The dialog has some more 
useful config options, some methods and callback events.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Config options
==============
title : String
    The title of the LoginDialog window
    Default: Login

message : String
    The message to show on the dialog window
    Default: Access to this location is restricted to authorized users only. Please type your username and password.

failMessage : String
    Default error message shown when login fails.
    Server may return a custom message. If so then
    server message is displayed instead
    Default : Unable to log in

waitMessage : String
    Message shown when request is sent to the server (Action.waitMsg)
    Default : Please wait ...
    
loginButton : String
    Text on the login button
    Default : Login
    
cancelButton : String
    If set then a secondary button will be shown with text provided. For example "Cancel"
    Default : Null

usernameLabel : String
    Field title for username
    Default : Username

usernameField : String
    Username field name

usernameVtype : String
    Username field validation
    Default : alphanum

passwordLabel : String
    Field title for password
    Default : Password

passwordField : String
    Password field name

passwordVtype : String
    Password field validation
    Default : alphanum

languageField: String
    Language field name

languageLabel: String
    Field title for language
    Default: Language

rememberMeField: String
    Remember Me field name

rememberMeLabel: String
    Field title for Remember Me
    Default: Remember me on this computer

forgotPasswordLabel: String
    Display text for Forgot Password
    Default: Forgot Password?

enableVirtualKeyboard: Bool
    Enable virtual keyboard extension for entering password
    Default: false

forceVirtualKeyboard: Bool
    Force Virtual Keyboard for entering password
    *If true, also sets enableVirtualKeyboard property to true
    Default: false

encrypt: Bool
    encrypt password using SHA1
    Default: false

salt: String
    Salt string for encryption, password gets appended to salt for encryption
    * If encrypt property is false, salt is not used

forgotPasswordLink: String
    Forgot Password Link href url
    Default: about:blank

url : String
    URL where the request is submitted
    Required config option!

basePath : String
    Path where the images are located
    Default : /

method : String
    The method used to submit the request
    Default : post
    
modal : Bool
    Is the dialog modal or not?
    Default : false


Methods :
=========
show (element)
    This will show the LoginDualog. element is for animation (Ext.Window::show())

hide ()
    This will hide the dialog window.

destroy ()
    Destroys the LoginDialog by purging event listeners, css stylesheets and removing the components.
    
cancel ()
    This will cancel (quit) the window. Will send cancel event

submit ()
    Submit the login form

setMessage (String : msg)
    Set the LoginDialog message


Events :
==========
cancel (DialogWindow wnd)
    Is fired when cancel button (if set) was pressed. If returns false then
    cancel is aborted.

show (DialogWindow wnd)
    Is fired when dialog is fully loaded and visible.

submit (DialogWindow wnd, Object values)
    Is fired when login details are about to be submitted.
    Returning false will cancel

success (DialogWindow wnd, Ext.form.Action action)
    Is fired when login was successful. Returning false will
    prevent LoginDialog from closing.

failure (DialogWindow wnd, Ext.form.Action action, String message)
    Is fired when login was not successful. Error message is also passed
    to the event handler.
