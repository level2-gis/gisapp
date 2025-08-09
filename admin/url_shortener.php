<?php
/**
 * Simple URL Shortener for GIS App Permalinks
 * Creates short URLs by storing long permalinks in database/file
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

/**
 * Clean up old URLs
 */
function cleanupOldUrls($maxAge = 31536000) { // Default: 1 year
    $deleted = 0;
    $files = glob(DATA_DIR . '*.txt');
    
    foreach ($files as $file) {
        $data = json_decode(file_get_contents($file), true);
        
        // Skip if it's old format or can't decode
        if (!is_array($data) || !isset($data['last_accessed'])) {
            continue;
        }
        
        // Delete if not accessed in maxAge seconds
        if (time() - $data['last_accessed'] > $maxAge) {
            unlink($file);
            $deleted++;
        }
    }
    
    return $deleted;
}

// Configuration
// Dynamically determine the base URL
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'];
$scriptDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
define('URL_BASE', $protocol . $host . $scriptDir . '/'); // e.g., http://localhost/gisapp/admin/
define('DATA_DIR', __DIR__ . '/short_urls/');

// Ensure data directory exists
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Occasionally clean up old URLs (1% chance on each request)
if (rand(1, 100) === 1) {
    cleanupOldUrls(2592000); // Delete URLs not accessed for 30 days
}

/**
 * Generate a short code
 */
function generateShortCode($length = 6) {
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $shortCode = '';
    for ($i = 0; $i < $length; $i++) {
        $shortCode .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $shortCode;
}

/**
 * Store URL using file system with timestamp
 */
function storeUrlFile($shortCode, $longUrl) {
    $filename = DATA_DIR . $shortCode . '.txt';
    $data = [
        'url' => $longUrl,
        'created' => time(),
        'last_accessed' => time()
    ];
    return file_put_contents($filename, json_encode($data)) !== false;
}

/**
 * Retrieve URL using file system with access tracking
 */
function getUrlFile($shortCode) {
    $filename = DATA_DIR . $shortCode . '.txt';
    if (file_exists($filename)) {
        $data = json_decode(file_get_contents($filename), true);
        
        // Handle old format (plain text) for backward compatibility
        if (!is_array($data)) {
            return $data; // Return the plain URL for old format
        }
        
        // Update last accessed time
        $data['last_accessed'] = time();
        file_put_contents($filename, json_encode($data));
        
        return $data['url'];
    }
    return false;
}

// Handle GET request with 'link' parameter (redirect to long URL)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['link'])) {
    $shortCode = preg_replace('/[^a-zA-Z0-9]/', '', $_GET['link']);
    
    $longUrl = getUrlFile($shortCode);
    
    if ($longUrl) {
        // Redirect to the long URL
        header("Location: " . $longUrl);
        exit;
    } else {
        // If short URL not found, redirect to main app (graceful fallback)
        header("Location: " . URL_BASE);
        exit;
    }
}

// Handle GET request with 'code' parameter (for backward compatibility and AJAX requests)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['code'])) {
    $shortCode = preg_replace('/[^a-zA-Z0-9]/', '', $_GET['code']);
    
    $longUrl = getUrlFile($shortCode);
    
    if ($longUrl) {
        // Check if this is an AJAX request (for getting URL without redirect)
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
            echo json_encode(['success' => true, 'longUrl' => $longUrl]);
            exit;
        } else {
            // Redirect to the long URL
            header("Location: " . $longUrl);
            exit;
        }
    } else {
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
            echo json_encode(['success' => false, 'error' => 'Short URL not found']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Short URL not found']);
        }
        exit;
    }
}

// Handle POST/GET request to create short URL
if (isset($_GET['longPermalink']) || isset($_POST['longPermalink'])) {
    $longUrl = $_GET['longPermalink'] ?? $_POST['longPermalink'];
    
    // Validate URL
    if (empty($longUrl)) {
        http_response_code(400);
        echo json_encode(['error' => 'No URL provided']);
        exit;
    }
    
    // Generate unique short code
    do {
        $shortCode = generateShortCode();
        $exists = getUrlFile($shortCode);
    } while ($exists !== false);
    
    // Store the URL
    $success = storeUrlFile($shortCode, $longUrl);
    
    if ($success) {
        // Create the shortened URL with 'link' parameter
        $shortUrl = URL_BASE . '?link=' . $shortCode;
        echo json_encode([
            'success' => true,
            'shortUrl' => $shortUrl,
            'shortCode' => $shortCode,
            'originalUrl' => $longUrl
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create short URL']);
    }
    exit;
}

// Invalid request
http_response_code(400);
echo json_encode(['error' => 'Invalid request']);
?>
