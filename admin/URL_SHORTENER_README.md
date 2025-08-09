# URL Shortener System - File-Based Implementation

## Overview
Simple file-based URL shortener for GIS app permalinks that creates short URLs using query parameters.

## How It Works

### Short URL Format
- **Input:** Long permalink URL
- **Output:** `http://localhost/gisapp/?link=ABC123`

### Files Structure
```
gisapp/
├── admin/ url_shortener.php       # Creates short URLs (AJAX endpoint)
├── index.php               # Handles short URL redirects
├── short_urls/             # Directory storing URL mappings
│   ├── ABC123.txt         # Contains URL data in JSON format
│   └── XYZ789.txt
└── client_common/settings.js  # Configuration
```

### Process Flow
1. **Creating Short URL:**
   - User clicks "Send Permalink" button
   - JavaScript calls `/gisapp/admin/url_shortener.php`
   - System generates unique 6-character code
   - Stores mapping in `short_urls/{code}.txt`
   - Returns: `http://localhost/gisapp/?link={code}`

2. **Using Short URL:**
   - User visits: `http://localhost/gisapp/?link=ABC123`
   - `index.php` detects `link` parameter
   - Reads stored URL from `short_urls/ABC123.txt`
   - Redirects to original long permalink
   - Updates access timestamp

## Features
- ✅ File-based storage (no database required)
- ✅ Automatic cleanup (30-day expiration)
- ✅ Access tracking and timestamps
- ✅ Backward compatibility with old formats
- ✅ User-friendly permalink window
- ✅ Graceful fallback if short URL not found

## Configuration
In `client_common/settings.js`:
```javascript
Eqwc.settings.permaLinkURLShortener = '/gisapp/admin/url_shortener.php';
```

## Data Format
Each `.txt` file contains JSON data:
```json
{
    "url": "http://localhost/gisapp/project?startExtent=...",
    "created": 1754679289,
    "last_accessed": 1754679309
}
```

## Maintenance
- Files older than 30 days are automatically cleaned up
- 1% chance of cleanup on each request
- Manual cleanup can be done by deleting old `.txt` files
