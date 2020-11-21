/**
 * Login base class
 */

function Login() {
}

Login.prototype = {
    /**
     * get login status and invoke the callback with the result
     *
     * {
     *   success: <boolean>,
     *   user: <user name> // if signed in
     * }
     */
    status: function (callback) {
        callback({
            success: false,
            user: 'User'
        });
    },

    /**
     * sign in and invoke the callback with the login result
     *
     * {
     *   success: <boolean>,
     *   user: <user name> // if sign in was successful
     * }
     */
    signIn: function (user, password, callback) {
        callback({
            success: true,
            user: "User"
        });
    },

    /**
     * sign out and invoke the callback
     */
    signOut: function (callback) {
        callback();
    }
};
