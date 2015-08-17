<?php
/**
 * Created by PhpStorm.
 * User: uros
 * Date: 5.8.2015
 * Time: 6:19
 */

require_once("settings.php");

class GisAppLoader
{
    function __construct($user, $project, $db)
    {
        $this->db_connection = $db;
        $this->user = $user;
        $this->project = $project;
    }

    private $db_connection = null;
    public $user = "";
    public $project = "";
    public $feedback = "";

    public function checkUserProject()
    {
        $sql = 'SELECT check_user_project(:user_name,:project);';
        $query = $this->db_connection->prepare($sql);
        $query->bindValue(':user_name', $this->user);
        $query->bindValue(':project', $this->project);
        $query->execute();
        $result_row = $query->fetchObject();
        if ($result_row) {
            return $result_row->check_user_project;
        } else
            return 'TR.loginFailMessage';
    }

    public function getProjectDataFromDB()
    {
        $sql = 'SELECT row_to_json(get_project_data(:project)) AS data;';
        $query = $this->db_connection->prepare($sql);
        $query->bindValue(':project', $this->project);
        $query->execute();
        $result_row = $query->fetchObject();
        if ($result_row) {
            return $result_row->data;
        } else
            return 'TR.loginFailMessage';

    }

    public function getGisProjectsFromDB()
    {
        return json_encode(array('path' => GISAPPURL));
    }

    public function getProjectConfigs()
    {
        if (file_exists(PROJECT_PATH . $this->project . '.json')) {
            try {
                $filestr = file_get_contents(PROJECT_PATH . $this->project . '.json', true);
                return $filestr;
            } catch (Exception $e) {
                $this->feedback = $e->getMessage();
                return false;
            }
        } else {
            return json_encode(new stdClass); //empty json object
        }
    }
}