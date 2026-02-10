# Cadastre Area Search with Type-Ahead Combo Box

> **⚠️ SECURITY NOTICE:** Before deploying to production, you MUST update the table whitelist in `admin/cadastre_search.php` to match your database schema. See [Security Considerations](#security-considerations) for details.

This document explains how to implement and use the type-ahead combo box for searching cadastre areas (katastrske občine) in QGIS Web Client.

## Overview

The type-ahead combo box provides a better user experience compared to separate text fields:
- Single field for searching both code (ko_id) and name (imeko)
- Live suggestions as the user types
- Clear visual display showing both code and name
- Searches with minimum 2 characters
- Returns up to 20 results

## Backend Implementation

### File: `admin/cadastre_search.php`

This PHP endpoint handles the search queries from the combo box.

**Features:**
- Accepts a `query` parameter from the search combo box
- Searches both `ko_id` (code) and `imeko` (name) fields
- Uses `LIKE` with wildcards for flexible matching
- Case-insensitive search for names using `LOWER()`
- Returns JSON response in format expected by Ext.data.JsonStore
- Limits results to 20 by default
- Handles errors gracefully

**Database Requirements:**
- PostgreSQL/PostGIS database
- Table with `ko_id` and `imeko` columns
- Database connection configured in `admin/settings.php`

**URL Parameters:**
- `query` (required): Search term entered by user
- `table` (optional): Table name to search (defaults to 'cadastre')

**Response Format:**
```json
{
  "results": [
    {
      "ko_id": "1234",
      "imeko": "LJUBLJANA",
      "display": "1234 - LJUBLJANA"
    }
  ],
  "total": 1
}
```

## Frontend Configuration

### Combo Box Configuration

Replace the two separate textfields with a single combo box:

**Old Pattern (two fields):**
```javascript
{
  "xtype": "textfield",
  "name": "ko_id",
  "fieldLabel": "Številka k.o.",
  "filterOp": "=",
  ...
},
{
  "xtype": "textfield",
  "name": "imeko",
  "fieldLabel": "Ime k.o.",
  "filterOp": "ILIKE",
  ...
}
```

**New Pattern (combo box):**
```javascript
{
  "xtype": "combo",
  "fieldLabel": "Katastrska občina",
  "name": "ko_search",
  "hiddenName": "ko_id",
  "displayField": "display",
  "valueField": "ko_id",
  "typeAhead": true,
  "mode": "remote",
  "triggerAction": "all",
  "minChars": 2,
  "queryDelay": 100,
  "allowBlank": false,
  "blankText": "Vnesi številko ali ime k.o.",
  "filterOp": "=",
  "store": {
    "xtype": "jsonstore",
    "url": "admin/cadastre_search.php?table=your_table_name",
    "root": "results",
    "fields": [
      {"name": "ko_id", "type": "string"},
      {"name": "imeko", "type": "string"},
      {"name": "display", "type": "string"}
    ]
  },
  "tpl": "<tpl for=\".\"><div class=\"x-combo-list-item\"><b>{ko_id}</b> - {imeko}</div></tpl>",
  "itemSelector": "div.x-combo-list-item",
  "listWidth": 300
}
```

### Configuration Properties Explained

- **xtype**: "combo" - Ext JS combo box component
- **fieldLabel**: Label displayed next to the field
- **name**: Field name for the search form
- **hiddenName**: "ko_id" - The actual value submitted (ko_id code)
- **displayField**: "display" - Field shown in the combo box (formatted string)
- **valueField**: "ko_id" - Field used as the value
- **typeAhead**: true - Enables type-ahead functionality
- **mode**: "remote" - Fetches data from server as user types
- **triggerAction**: "all" - Shows all results when dropdown is triggered
- **minChars**: 2 - Minimum characters before search starts
- **queryDelay**: 100 - Delay in milliseconds before sending query
- **allowBlank**: false - Field is required
- **filterOp**: "=" - Uses equality operator for WMS filter
- **store**: Configuration for the JSON data store
  - **url**: Path to the search endpoint (include ?table=your_table_name)
  - **root**: "results" - JSON array containing results
  - **fields**: Field definitions matching the JSON response
- **tpl**: HTML template for dropdown items (shows "CODE - NAME")
- **itemSelector**: CSS selector for dropdown items
- **listWidth**: Width of the dropdown list in pixels

## Example Configuration

See `_demo/cadastre_search_example.json` for complete examples of:
- Parcele (parcels) search configuration
- Stavbe (buildings) search configuration

Both examples include:
- Type-ahead combo box for cadastre area
- Additional textfield for parcel number (st_parcele)
- Grid columns configuration for search results
- Selection and zoom settings

## Usage in Projects

### Option 1: JSON Configuration File

Create a JSON file with search configurations (like the example) and reference it in your project setup.

### Option 2: GlobalOptions.js

Add the search panel configuration to `site/js/GlobalOptions.js`:

```javascript
var cadastreSearch = {
  title: "Parcele",
  useWmsRequest: true,
  queryLayer: "parcele_layer",
  formItems: [
    // ... combo box configuration here ...
  ],
  gridColumns: [
    // ... grid columns here ...
  ],
  selectionLayer: "parcele_layer",
  selectionZoom: 0,
  doZoomToExtent: true
};

var mapSearchPanelConfigs = {
  "your_project": [cadastreSearch]
};
```

## Database Setup

Ensure your cadastre table has the required structure:

```sql
-- Example table structure
CREATE TABLE cadastre (
  id SERIAL PRIMARY KEY,
  ko_id VARCHAR(4) NOT NULL,
  imeko VARCHAR(255) NOT NULL,
  geom GEOMETRY(MultiPolygon, 3857)
);

-- Add indexes for better search performance
CREATE INDEX idx_cadastre_ko_id ON cadastre(ko_id);
CREATE INDEX idx_cadastre_imeko ON cadastre(imeko);
```

## Customization

### Change Table Name

Add the table parameter to the store URL:

```javascript
"url": "admin/cadastre_search.php?table=my_cadastre_table"
```

### Adjust Result Limit

Modify the `LIMIT` clause in `admin/cadastre_search.php` (default is 20).

### Change Search Behavior

Edit the SQL WHERE clause in `admin/cadastre_search.php` to adjust how searches match records.

### Custom Display Format

Modify the `display` field in the SQL query or the `tpl` template to change how results are displayed.

## Security Considerations

### CRITICAL: Table Name Validation

**The endpoint MUST use a whitelist to validate table names.** The current implementation includes a whitelist of allowed tables:

```php
$allowed_tables = [
    'cadastre',
    'parcele',
    'parcele_layer',
    'stavbe',
    'stavbe_layer',
    'katastrske_obcine',
    'cadastral_areas'
];
```

**You MUST update this whitelist** to match your actual database tables. Remove any tables you don't use and add any tables you need.

**DO NOT remove the whitelist validation** - this is essential to prevent SQL injection attacks via the table parameter.

### Other Security Measures

- The endpoint uses PDO prepared statements to prevent SQL injection
- Error messages are generic to avoid exposing database structure
- Detailed errors are logged server-side for administrators
- Consider adding authentication/authorization checks if needed
- Consider rate limiting to prevent abuse

## Troubleshooting

### No Results Appearing

1. Check database connection in `admin/settings.php`
2. Verify table name is correct in the URL parameter
3. Ensure `ko_id` and `imeko` columns exist in the table
4. Check browser console for JavaScript errors
5. Check server logs for PHP errors

### Dropdown Not Showing

1. Verify `minChars` is set appropriately (default: 2)
2. Check that the store URL is correct and accessible
3. Ensure the JSON response format matches the expected structure
4. Check browser network tab for failed requests

### Search Not Working

1. Verify `filterOp` is set to "=" for the combo box
2. Ensure `hiddenName` is "ko_id" so the correct value is submitted
3. Check that the query layer configuration matches your QGIS project

## Benefits Over Separate Fields

1. **Better UX**: Single field instead of two separate ones
2. **Flexible Search**: Search by code or name without choosing
3. **Type-Ahead**: Live suggestions improve findability
4. **Clear Results**: Formatted display shows both code and name
5. **Less Errors**: Dropdown selection ensures valid values
6. **Faster**: Users can see all matching options immediately

## Migration Guide

To migrate from the old two-field pattern:

1. Replace the two textfield configurations with the combo box
2. Keep other form fields (like st_parcele) unchanged
3. Update grid columns if needed
4. Test thoroughly with your data
5. Adjust the table parameter in the store URL to match your database

## License

This implementation is part of Extended QGIS Web Client and follows the same GPL-v3.0 license.
