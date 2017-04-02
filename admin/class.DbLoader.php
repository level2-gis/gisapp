<?php

/**
 * class.DbLoader.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2015), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 */

namespace GisApp;

require_once("settings.php");

class DbLoader
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
        $exec = $query->execute();
        if($exec) {
            $result_row = $query->fetchObject();
            if ($result_row) {
                return $result_row->check_user_project;
            } else
                return 'TR.loginFailMessage';
        }
        else {
            //SQL execute error, get error message
            return $query->errorInfo()[2];
        }
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
        } else {
            $this->feedback = $query->errorInfo()[2];
            return false;
        }


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
                //check if json is valid string
                if (json_decode($filestr) === null) {
                    $this->feedback = "No permission or bad project json configuration!";
                    return false;
                } else {
                    return $filestr;
                }
            } catch (Exception $e) {
                $this->feedback = $e->getMessage();
                return false;
            }
        } else {
            return json_encode(new \stdClass()); //empty json object
        }
    }
}
