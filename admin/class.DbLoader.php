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

    public function writeProjectData($newData) {
        $sql = 'UPDATE projects SET display_name = :title, crs = :crs WHERE name = :project';

        $query = $this->db_connection->prepare($sql);
        $query->bindValue(':title', $newData->title);
        $query->bindValue(':crs', $newData->crs);
        //$query->bindValue(':description', $newData->description);
        $query->bindValue(':project', $this->project);
        $query->execute();
        $result_row = $query->fetchObject();
        if (!($result_row)) {
            $this->feedback = $query->errorInfo()[2];
            return false;
        }
        return true;
    }

    public function writeUserPrintData($title,$description) {
        $sql = 'DELETE FROM users_print WHERE user_name = :user';
        $query = $this->db_connection->prepare($sql);
        $query->bindValue(':user', $this->user);
        $succes = $query->execute();
        if (!$succes){
            return false;
        }

        $sql = 'INSERT INTO users_print(user_name, title, description) VALUES (:user, :title, :description)';
        $query = $this->db_connection->prepare($sql);
        $query->bindValue(':user', $this->user);
        $query->bindValue(':title', $title);
        $query->bindValue(':description', $description);
        $succes = $query->execute();

        return $succes;
    }

}
