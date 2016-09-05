/**
 * Mapfish Appserver login
 */

function MapfishLogin() {
  this.statusUrl = "/session/login";
  this.signInUrl = "/session/sign_in";
  this.signOutUrl = "/session/sign_out";
}

// inherit from Login
MapfishLogin.prototype = new Login();

/**
 * get login status and invoke the callback with the result
 *
 * {
 *   success: <boolean>,
 *   user: <user name> // if signed in
 * }
 */
MapfishLogin.prototype.status = function(callback) {
  var request = $.ajax({
    url: this.statusUrl,
    context: this
  });

  request.done(function(data, status) {
    result = {
      success: false
    };
    if (data.success) {
      result.success = true;
      result.user = data.user.login;
    }
    callback(result);
  });

  request.fail(function(jqXHR, status) {
    alert(I18n.login.statusFailed + "\n" + jqXHR.status + ": " + jqXHR.statusText);
  });
};

/**
 * sign in and invoke the callback with the login result
 *
 * {
 *   success: <boolean>,
 *   user: <user name> // if sign in was successful
 * }
 */
MapfishLogin.prototype.signIn = function(user, password, callback) {
  var request = $.ajax({
    type: 'POST',
    url: this.signInUrl,
    data: {
      user: {
        login: user,
        password: password
      }
    },
    dataType: 'json',
    context: this
  });

  request.done(function(data, status) {
    callback({
      success: true,
      user: data.user.login
    });
  });

  request.fail(function(jqXHR, status) {
    callback({
      success: false
    });
  });
};

/**
 * sign out and invoke the callback
 */
MapfishLogin.prototype.signOut = function(callback) {
  var request = $.ajax({
    url: this.signOutUrl,
    context: this
  });

  request.done(function(data, status) {
    callback();
  });

  request.fail(function(jqXHR, status) {
    alert(I18n.login.signOutFailed + "\n" + jqXHR.status + ": " + jqXHR.statusText);
  });
};
