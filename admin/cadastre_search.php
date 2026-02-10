<?php

/**
 * cadastre_search.php -- part of Server side of Extended QGIS Web Client
 *
 * Copyright (2014-2025), Level2 team All rights reserved.
 * More information at https://github.com/uprel/gisapp
 * 
 * Provides type-ahead search for cadastre areas (ko_id and imeko fields)
 */

require_once("settings.php");

header('Content-Type: application/json');

try {
    // Get query parameter
    $query = isset($_GET['query']) ? trim($_GET['query']) : '';
    
    // Validate query parameter
    if (empty($query)) {
        echo json_encode([
            'results' => [],
            'total' => 0
        ]);
        exit();
    }
    
    // Get table name from request (optional, defaults to a common table name)
    // SECURITY: Use whitelist validation to prevent SQL injection
    $requested_table = isset($_GET['table']) ? $_GET['table'] : 'cadastre';
    
    // Whitelist of allowed table names
    // In production, populate this from your database configuration
    $allowed_tables = [
        'cadastre',
        'parcele',
        'parcele_layer',
        'stavbe',
        'stavbe_layer',
        'katastrske_obcine',
        'cadastral_areas'
    ];
    
    // Validate table name against whitelist
    if (!in_array($requested_table, $allowed_tables, true)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid table name',
            'results' => [],
            'total' => 0
        ]);
        exit();
    }
    
    $table = $requested_table;
    
    // Connect to database
    $db = new PDO(DB_CONN_STRING, DB_USER, DB_PWD);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Prepare search parameters
    $search = '%' . $query . '%';
    $search_name = '%' . strtolower($query) . '%';
    
    // Build SQL query - searches both ko_id (as text) and imeko (case-insensitive)
    // ko_id is searched as text to support partial matches
    // imeko is searched case-insensitively using LOWER()
    // Table name is validated against whitelist before use
    $sql = "SELECT DISTINCT ko_id, imeko, 
                   ko_id || ' - ' || imeko AS display
            FROM " . $table . "
            WHERE ko_id::text LIKE :search 
               OR LOWER(imeko) LIKE :search_name
            ORDER BY ko_id
            LIMIT 20";
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':search', $search, PDO::PARAM_STR);
    $stmt->bindParam(':search_name', $search_name, PDO::PARAM_STR);
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return JSON response in format expected by Ext.data.JsonStore
    echo json_encode([
        'results' => $results,
        'total' => count($results)
    ]);
    
} catch (PDOException $e) {
    // Log the error server-side for debugging
    error_log('Cadastre search database error: ' . $e->getMessage());
    
    // Return generic error message to client (avoid exposing database details)
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred. Please contact administrator.',
        'results' => [],
        'total' => 0
    ]);
} catch (Exception $e) {
    // Log the error server-side for debugging
    error_log('Cadastre search error: ' . $e->getMessage());
    
    // Return generic error message to client
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again.',
        'results' => [],
        'total' => 0
    ]);
}
