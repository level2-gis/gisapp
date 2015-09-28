<?php

/**
 * Class OneFileLoginApplication
 *
 * An entire php application with user registration, login and logout in one file.
 * Uses very modern password hashing via the PHP 5.5 password hashing functions.
 * This project includes a compatibility file to make these functions available in PHP 5.3.7+ and PHP 5.4+.
 *
 * @author Panique
 * @link https://github.com/panique/php-login-one-file/
 * @license http://opensource.org/licenses/MIT MIT License
 *
 * modifications Uros Preloznik
 */

namespace GisApp;

use \PDO;

require_once("settings.php");
require_once("class.DbLoader.php");

class Login
{


    /**
     * @var object Database connection
     */
    private $db_connection = null;

    /**
     * @var bool Login status of user
     */
    private $user_is_logged_in = false;

    /**
     * @var string System messages, likes errors, notices, etc.
     */
    public $feedback = "";


    /**
     * Does necessary checks for PHP version and PHP password compatibility library and runs the application
     */
    public function __construct()
    {
        $this->performMinimumRequirementsCheck();
        
//        if ($this->performMinimumRequirementsCheck()) {
//            $this->runApplication();
//        }
    }

    /**
     * Performs a check for minimum requirements to run this application.
     * Does not run the further application when PHP version is lower than 5.3.7
     * Does include the PHP password compatibility library when PHP version lower than 5.5.0
     * (this library adds the PHP 5.5 password hashing functions to older versions of PHP)
     * @return bool Success status of minimum requirements check, default is false
     */
    private function performMinimumRequirementsCheck()
    {
        if (version_compare(PHP_VERSION, '5.3.7', '<')) {
            echo "Sorry, Simple PHP Login does not run on a PHP version older than 5.3.7 !";
        } elseif (version_compare(PHP_VERSION, '5.5.0', '<')) {
            require_once("libraries/password_compatibility_library.php");
            return true;
        } elseif (version_compare(PHP_VERSION, '5.5.0', '>=')) {
            return true;
        }
        // default return
        return false;
    }

    /**
     * This is basically the controller that handles the entire flow of the application.
     */
    public function runApplication()
    {

        // start the session, always needed!
        $this->doStartSession();
        // check for possible user interactions (login with session/post data or logout)
        $this->performUserLoginAction();
        // show "page", according to user's login status


        if ($this->getUserLoginStatus()) {
            $this->showPageLoggedIn();

        } else {
            if (isset($_GET["action"]) && $_GET["action"] == "register") {
                $this->doRegistration();
                $this->showPageRegistration();
            } else {

                $this->showPageLoginForm();
            }
        }
    }


    /**
     * Creates a PDO database connection (in this case to a SQLite flat-file database)
     * @return bool Database creation success status, false by default
     */
    private function createDatabaseConnection()
    {
        try {
            $this->db_connection = new PDO(DB_CONN_STRING, DB_USER, DB_PWD);
            return true;
        } catch (PDOException $e) {
            $this->feedback = "PDO database connection problem: " . $e->getMessage();
        } catch (Exception $e) {
            $this->feedback = "General problem: " . $e->getMessage();
        }
        return false;
    }

    /**
     * Handles the flow of the login/logout process. According to the circumstances, a logout, a login with session
     * data or a login with post data will be performed
     */
    private function performUserLoginAction()
    {
        if (isset($_GET["action"]) && $_GET["action"] == "logout") {
            $this->doLogout();
        } elseif (!empty($_SESSION['user_name']) && ($_SESSION['user_is_logged_in'])) {
            $this->doLoginWithSessionData();
        } elseif (isset($_POST["login"])) {
            $this->doLoginWithPostData();
        }
    }

    /**
     * Simply starts the session.
     * It's cleaner to put this into a method than writing it directly into runApplication()
     */
    private function doStartSession()
    {
        session_start();
    }

    /**
     * Set a marker (NOTE: is this method necessary ?)
     */
    private function doLoginWithSessionData()
    {
        $this->user_is_logged_in = true; // ?
    }

    /**
     * Process flow of login with POST data
     */
    public function doLoginWithPostData()
    {
        if ($this->checkLoginFormDataNotEmpty()) {
            if ($this->createDatabaseConnection()) {
                $this->checkPasswordCorrectnessAndLogin();
            }
        }
    }

    /**
     * Logs the user out
     */
    public function doLogout()
    {
        $_SESSION = array();
        session_destroy();
        $this->user_is_logged_in = false;
        $this->feedback = "You were just logged out.";
    }

    /**
     * The registration flow
     * @return bool
     */
    private function doRegistration()
    {
        if ($this->checkRegistrationData()) {
            if ($this->createDatabaseConnection()) {
                $this->createNewUser();
            }
        }
        // default return
        return false;
    }

    /**
     * Validates the login form data, checks if username and password are provided
     * @return bool Login form data check success state
     */
    private function checkLoginFormDataNotEmpty()
    {
        $user = filter_input(INPUT_POST,'user_name',FILTER_SANITIZE_STRING);
        $pass = filter_input(INPUT_POST,'user_password',FILTER_SANITIZE_STRING);

        if (!empty($user) && !empty($pass)) {
            return true;
        } elseif (empty($user)) {
            $this->feedback = "Username field was empty.";
        } elseif (empty($_POST['user_password'])) {
            $this->feedback = "Password field was empty.";
        }
        // default return
        return false;
    }

    /**
     * Checks if user exits, if so: check if provided password matches the one in the database
     * @return bool User login success status
     */
    private function checkPasswordCorrectnessAndLogin()
    {
        $user = filter_input(INPUT_POST,'user_name',FILTER_SANITIZE_STRING);
        $project = filter_input(INPUT_POST,'project',FILTER_SANITIZE_STRING);
        $email = "";
        $pass = false;

        $gisApp = new DbLoader($user, $project, $this->db_connection);

        //check if we have guest user
        if (strtolower($user == 'guest')) {
            //no user and password verify
            $pass = true;
        } else {
            $sql = 'SELECT user_name, user_email, user_password_hash
                FROM users
                WHERE user_name = :user_name
                LIMIT 1';
            $query = $this->db_connection->prepare($sql);
            $query->bindValue(':user_name', $user);
            $query->execute();

            // Btw that's the weird way to get num_rows in PDO with SQLite:
            // if (count($query->fetchAll(PDO::FETCH_NUM)) == 1) {
            // Holy! But that's how it is. $result->numRows() works with SQLite pure, but not with SQLite PDO.
            // This is so crappy, but that's how PDO works.
            // As there is no numRows() in SQLite/PDO (!!) we have to do it this way:
            // If you meet the inventor of PDO, punch him. Seriously.
            $result_row = $query->fetchObject();
            if ($result_row) {
                // using PHP 5.5's password_verify() function to check password
                $pass = password_verify($_POST['user_password'], $result_row->user_password_hash);
                $email = $result_row->user_email;
            } else {
                $this->feedback = 'TR.noUser';
                return false;
            }
        }


        if ($pass) {
            //aditional check if project and user exists and user has permission to use project
            $check = $gisApp->checkUserProject();
            if ($check == 'OK') {
                //get additional project info
                $project_data = $gisApp->getProjectDataFromDB();

                //get all GIS projects for user for themeswitcher
                $gis_projects = $gisApp->getGisProjectsFromDB();

                //search configs
                $project_settings = $gisApp->getProjectConfigs();
                if ($project_settings !== false) {
                    // write user data into PHP SESSION
                    $_SESSION['user_name'] = $user;
                    $_SESSION['user_email'] = $email;
                    $_SESSION['user_is_logged_in'] = true;
                    $_SESSION['project'] = $project;
                    $_SESSION['data'] = $project_data;
                    $_SESSION['settings'] = $project_settings;
                    $_SESSION['gis_projects'] = $gis_projects;
                    $this->user_is_logged_in = true;

                    //update lastlogin and count
                    $sql = "UPDATE users SET last_login=now(),count_login = count_login + 1 WHERE user_name = :user_name";
                    $query = $this->db_connection->prepare($sql);
                    $query->bindValue(':user_name', $user);
                    $query->execute();

                    return true;
                } else {
                    return false;
                }
            } else {
                $this->feedback = $check;
                return false;
            }
        } else {
            $this->feedback = 'TR.wrongPassword';
            return false;
        }
    }

    /**
     * Validates the user's registration input
     * @return bool Success status of user's registration data validation
     */
    private function checkRegistrationData()
    {
        // if no registration form submitted: exit the method
        if (!isset($_POST["register"])) {
            return false;
        }

        // validating the input
        if (!empty($_POST['user_name'])
            && strlen($_POST['user_name']) <= 64
            && strlen($_POST['user_name']) >= 2
            && preg_match('/^[a-z\d]{2,64}$/i', $_POST['user_name'])
            && !empty($_POST['user_email'])
            && strlen($_POST['user_email']) <= 64
            && filter_var($_POST['user_email'], FILTER_VALIDATE_EMAIL)
            && !empty($_POST['user_password_new'])
            && !empty($_POST['user_password_repeat'])
            && ($_POST['user_password_new'] === $_POST['user_password_repeat'])
            && strtolower($_POST['user_name']) != 'guest'
        ) {
            // only this case return true, only this case is valid
            return true;
        } elseif (empty($_POST['user_name'])) {
            $this->feedback = "Empty Username";
        } elseif (strtolower($_POST['user_name']) == 'guest') {
            $this->feedback = "Guest is not allowed username";
        } elseif (empty($_POST['user_password_new']) || empty($_POST['user_password_repeat'])) {
            $this->feedback = "Empty Password";
        } elseif ($_POST['user_password_new'] !== $_POST['user_password_repeat']) {
            $this->feedback = "Password and password repeat are not the same";
        } elseif (strlen($_POST['user_password_new']) < 6) {
            $this->feedback = "Password has a minimum length of 6 characters";
        } elseif (strlen($_POST['user_name']) > 64 || strlen($_POST['user_name']) < 2) {
            $this->feedback = "Username cannot be shorter than 2 or longer than 64 characters";
        } elseif (!preg_match('/^[a-z\d]{2,64}$/i', $_POST['user_name'])) {
            $this->feedback = "Username does not fit the name scheme: only a-Z and numbers are allowed, 2 to 64 characters";
        } elseif (empty($_POST['user_email'])) {
            $this->feedback = "Email cannot be empty";
        } elseif (strlen($_POST['user_email']) > 64) {
            $this->feedback = "Email cannot be longer than 64 characters";
        } elseif (!filter_var($_POST['user_email'], FILTER_VALIDATE_EMAIL)) {
            $this->feedback = "Your email address is not in a valid email format";
        } else {
            $this->feedback = "An unknown error occurred.";
        }

        // default return
        return false;
    }

    /**
     * Creates a new user.
     * @return bool Success status of user registration
     */
    private function createNewUser()
    {
        // remove html code etc. from username and email
        $user_name = htmlentities($_POST['user_name'], ENT_QUOTES);
        $user_email = htmlentities($_POST['user_email'], ENT_QUOTES);
        $user_password = $_POST['user_password_new'];
        // crypt the user's password with the PHP 5.5's password_hash() function, results in a 60 char hash string.
        // the constant PASSWORD_DEFAULT comes from PHP 5.5 or the password_compatibility_library
        $user_password_hash = password_hash($user_password, PASSWORD_DEFAULT);

        $sql = 'SELECT * FROM users WHERE user_name = :user_name';
        $query = $this->db_connection->prepare($sql);
        $query->bindValue(':user_name', $user_name);
        $query->execute();

        // As there is no numRows() in SQLite/PDO (!!) we have to do it this way:
        // If you meet the inventor of PDO, punch him. Seriously.
        $result_row = $query->fetchObject();
        if ($result_row) {
            $this->feedback = "Sorry, that username is already taken. Please choose another one.";
        } else {
            $sql = 'INSERT INTO users (user_name, user_password_hash, user_email)
                    VALUES(:user_name, :user_password_hash, :user_email)';
            $query = $this->db_connection->prepare($sql);
            $query->bindValue(':user_name', $user_name);
            $query->bindValue(':user_password_hash', $user_password_hash);
            $query->bindValue(':user_email', $user_email);
            // PDO's execute() gives back TRUE when successful, FALSE when not
            // @link http://stackoverflow.com/q/1661863/1114320
            $registration_success_state = $query->execute();

            if ($registration_success_state) {
                $this->feedback = "Your account has been created successfully.";
                return true;
            } else {
                $this->feedback = "Sorry, your registration failed. Please go back and try again.";
            }
        }
        // default return
        return false;
    }

    /**
     * Simply returns the current status of the user's login
     * @return bool User's login status
     */
    public function getUserLoginStatus()
    {
        return $this->user_is_logged_in;
    }

    /**
     * Simple demo-"page" that will be shown when the user is logged in.
     * In a real application you would probably include an html-template here, but for this extremely simple
     * demo the "echo" statements are totally okay.
     */
    private function showPageLoggedIn()
    {
        $scr = filter_input(INPUT_SERVER,["SCRIPT_NAME"]);

        if ($this->feedback) {
            echo $this->feedback . "<br/><br/>";
        }

        echo 'Hello ' . $_SESSION['user_name'] . ', you are logged in.<br/><br/>';
        echo '<a href="' . $scr . '?action=logout">Log out</a>';

        //TODO cleanup this. Superuser not need to register anymmore
        //if ($_SESSION['user_name'] == SUPERUSER)
        //    echo '</br><a href="' . $_SERVER['SCRIPT_NAME'] . '?action=register">SUPERUSER: Register new account</a>';


        echo "<h3> PHP List All Session Variables</h3>";
        echo "sess_id: ".session_id()."<br/><br/>";
        foreach ($_SESSION as $key => $val)
            echo $key . ": " . $val . "<br/><br/>";

    }

    /**
     * Simple demo-"page" with the login form.
     * In a real application you would probably include an html-template here, but for this extremely simple
     * demo the "echo" statements are totally okay.
     */
    private function showPageLoginForm()
    {
        $scr = filter_input(INPUT_SERVER,["SCRIPT_NAME"]);

        if ($this->feedback) {
            echo $this->feedback . "<br/><br/>";
        }

        echo '<h3>Login</h3>';

        echo '<form method="post" action="' . $scr . '" name="loginform">';
        echo '<label for="login_input_username">Username (or email)</label> ';
        echo '<input id="login_input_username" type="text" name="user_name" required /> ';
        echo '<label for="login_input_password">Password</label> ';
        echo '<input id="login_input_password" type="password" name="user_password" required /> ';
        echo '<input type="submit"  name="login" value="Log in" />';
        echo '</form>';

        echo '<a href="' . $scr . '?action=register">Register new account</a>';
    }

    /**
     * Simple demo-"page" with the registration form.
     * In a real application you would probably include an html-template here, but for this extremely simple
     * demo the "echo" statements are totally okay.
     */
    private function showPageRegistration()
    {
        $scr = filter_input(INPUT_SERVER,["SCRIPT_NAME"]);

        if ($this->feedback) {
            echo $this->feedback . "<br/><br/>";
        }

        echo '<h2>Registration</h2>';

        echo '<form method="post" action="' . $scr . '?action=register" name="registerform">';
        echo '<label for="login_input_username">Username (only letters and numbers, 2 to 64 characters)</label></br>';
        echo '<input id="login_input_username" type="text" pattern="[a-zA-Z0-9]{2,64}" name="user_name" required /></br>';
        echo '<label for="login_input_email">User\'s email</label></br>';
        echo '<input id="login_input_email" type="email" name="user_email" required /></br>';
        echo '<label for="login_input_password_new">Password (min. 6 characters)</label></br>';
        echo '<input id="login_input_password_new" class="login_input" type="password" name="user_password_new" pattern=".{6,}" required autocomplete="off" /></br>';
        echo '<label for="login_input_password_repeat">Repeat password</label></br>';
        echo '<input id="login_input_password_repeat" class="login_input" type="password" name="user_password_repeat" pattern=".{6,}" required autocomplete="off" /></br></br>';
        echo '<input type="submit" name="register" value="Register" />';
        echo '</form>';

        echo '<a href="' . $scr . '">Homepage</a>';
    }
}

