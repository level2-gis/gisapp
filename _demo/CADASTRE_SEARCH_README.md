# Cadastre Area Search with Type-Ahead Combo Box

This document explains how to implement and use the type-ahead combo box for searching cadastre areas (katastrske občine) in QGIS Web Client using the existing `search.wsgi` script.

## Overview

The type-ahead combo box provides a better user experience compared to separate text fields:
- Single field for searching both code (ko_id) and name (imeko)
- Live suggestions as the user types
- Clear visual display showing both code and name
- Searches with minimum 2 characters
- Returns up to 20 results

## Backend Implementation

This implementation uses the existing `/client/wsgi/search.wsgi` script, which is already part of the QGIS Web Client infrastructure.

### WSGI Search Script

**File: `client/wsgi/search.wsgi`**

The search.wsgi script is a Python-based search endpoint that:
- Connects to PostgreSQL database with search tables
- Supports full-text search using PostgreSQL tsvector or ILIKE
- Returns results with bounding boxes for zoom functionality
- Supports JSONP callback for cross-domain requests

**URL Pattern:**
```
/wsgi/search.wsgi?searchtables=search_ko&srs=3794&query=[SEARCH_QUERY]&limit=20
```

**Parameters:**
- `searchtables` (required): Name of the search table (e.g., "search_ko" for cadastre areas)
- `srs` (required): Spatial reference system ID (e.g., "3794")
- `query` (required): Search term entered by user
- `limit` (optional): Maximum number of results (default: 10)
- `cb` (optional): JSONP callback function name

**Response Format:**
```json
{
  "results": [
    {
      "ko_id": "964",
      "displaytext": "964 - VELENJE",
      "searchtable": "search_ko",
      "bbox": [504879.2, 134090.29, 511105.31, 137353.88],
      "showlayer": "Katastrske občine",
      "selectable": "1",
      "geometry": null
    }
  ]
}
```

The WSGI response includes:
- **ko_id**: The cadastre area code (used as the value for filtering)
- **displaytext**: Formatted display text showing "CODE - NAME"
- **bbox**: Bounding box for zoom functionality
- **showlayer**: Layer name to display
- **selectable**: Whether the result is selectable
- **geometry**: WKT geometry (for point features)

### Database Requirements

The search.wsgi script requires a search table with the following structure:

```sql
CREATE TABLE search_ko (
  ko_id VARCHAR(10),               -- Cadastre area code (e.g., "964")
  displaytext VARCHAR(255),        -- Display text in format "CODE - NAME"
  searchstring VARCHAR(255),       -- Searchable text (lowercase)
  searchstring_tsvector tsvector,  -- Full-text search vector (optional)
  search_category VARCHAR(50),     -- Category for grouping (e.g., "01-ko")
  showlayer VARCHAR(255),          -- Layer name to show/zoom to
  the_geom GEOMETRY                -- Geometry for bounding box calculation
);

-- Create indexes for better search performance
CREATE INDEX idx_search_ko_ko_id ON search_ko(ko_id);
CREATE INDEX idx_search_ko_searchstring ON search_ko(searchstring);
CREATE INDEX idx_search_ko_tsvector ON search_ko USING gin(searchstring_tsvector);
```

**Example Data:**
```sql
INSERT INTO search_ko (ko_id, displaytext, searchstring, search_category, showlayer, the_geom)
VALUES 
  ('964', '964 - VELENJE', '964 velenje', '01-Katastrske občine', 'Katastrske občine', ST_GeomFromText('POLYGON(...)', 3794)),
  ('1964', '1964 - IHAN', '1964 ihan', '01-Katastrske občine', 'Katastrske občine', ST_GeomFromText('POLYGON(...)', 3794));
```

**Note:** The `ko_id` field should contain just the cadastre area code, while `displaytext` contains the formatted display text. The WSGI script returns both fields, allowing the combo box to display the full text while submitting only the code for filtering.

## Frontend Configuration

### Combo Box Configuration

Replace the two separate textfields with a single combo box that uses the WSGI search script:

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

**New Pattern (combo box with WSGI):**
```javascript
{
  "xtype": "combo",
  "name": "ko_id",
  "fieldLabel": "KO",
  "displayField": "displaytext",
  "valueField": "ko_id",
  "allowBlank": true,
  "emptyText": "Izberi kat. občino",
  "editable": true,
  "typeAhead": true,
  "forceSelection": true,
  "selectOnFocus": true,
  "mode": "remote",
  "triggerAction": "all",
  "minChars": 2,
  "queryDelay": 100,
  "filterOp": "=",
  "store": {
    "xtype": "jsonstore",
    "url": "wsgi/search.wsgi",
    "baseParams": {
      "searchtables": "search_ko",
      "srs": "3794",
      "limit": "20"
    },
    "root": "results",
    "fields": [
      {"name": "ko_id", "type": "string"},
      {"name": "displaytext", "type": "string"},
      {"name": "searchtable", "type": "string"},
      {"name": "bbox", "type": "auto"},
      {"name": "showlayer", "type": "string"},
      {"name": "selectable", "type": "string"},
      {"name": "geometry", "type": "auto"}
    ]
  },
  "tpl": "<tpl for=\".\"><div class=\"x-combo-list-item\">{displaytext}</div></tpl>",
  "itemSelector": "div.x-combo-list-item",
  "listWidth": 300
}
```

### Configuration Properties Explained

- **xtype**: "combo" - Ext JS combo box component
- **name**: "ko_id" - Field name for the search form (matches database field)
- **fieldLabel**: "KO" - Label displayed next to the field
- **displayField**: "displaytext" - Field shown in the combo box (formatted text from WSGI)
- **valueField**: "ko_id" - Field used as the value (cadastre code from WSGI)
- **allowBlank**: true - Field is optional (can be changed to false if required)
- **emptyText**: "Izberi kat. občino" - Placeholder text when field is empty
- **editable**: true - Allows typing in the combo box for searching
- **typeAhead**: true - Enables type-ahead functionality
- **forceSelection**: true - User must select a value from the list (cannot enter arbitrary text)
- **selectOnFocus**: true - Automatically selects text when the field gains focus
- **mode**: "remote" - Fetches data from server as user types
- **triggerAction**: "all" - Shows all results when dropdown is triggered
- **minChars**: 2 - Minimum characters before search starts
- **queryDelay**: 100 - Delay in milliseconds before sending query
- **filterOp**: "=" - Uses equality operator for WMS filter (exact match on ko_id)
- **store**: Configuration for the JSON data store
  - **url**: Path to the WSGI search script
  - **baseParams**: Fixed parameters sent with every request
    - **searchtables**: Name of the search table in database
    - **srs**: Spatial reference system (adjust to your project's SRS)
    - **limit**: Maximum number of results
  - **root**: "results" - JSON array containing results
  - **fields**: Field definitions matching the WSGI response
    - **ko_id**: Cadastre area code (e.g., "964")
    - **displaytext**: Formatted display text (e.g., "964 - VELENJE")
    - Standard WSGI fields: searchtable, bbox, showlayer, selectable, geometry
- **tpl**: HTML template for dropdown items (shows displaytext)
- **itemSelector**: CSS selector for dropdown items
- **listWidth**: Width of the dropdown list in pixels

**Key Properties for WMS Filter Integration:**
- `forceSelection: true` ensures a value from the list is selected
- `valueField: "ko_id"` specifies which field value is submitted to the WMS filter
- `filterOp: "="` defines the filter operation used in the WMS request

The combo box displays `displaytext` (e.g., "964 - VELENJE") but submits `ko_id` (e.g., "964") for filtering, ensuring clean WMS filter queries like `ko_id = '964'`.

## Example Configuration

See `_demo/cadastre_search_example.json` for complete examples of:
- Parcele (parcels) search configuration
- Stavbe (buildings) search configuration

Both examples include:
- Type-ahead combo box for cadastre area
- Additional textfield for parcel/location number (st_parcele)
  - **Note**: The field name `st_parcele` is used in both configurations as specified in the requirements. In your implementation, you may want to rename this field to match your database schema (e.g., `st_stavbe` for buildings).
- Grid columns configuration for search results
- Selection and zoom settings

The combo box displays formatted text (e.g., "964 - VELENJE") from the `displaytext` field while submitting only the cadastre code (e.g., "964") from the `ko_id` field for filtering. This ensures user-friendly display with precise database filtering.

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

### Change Search Table

Update the `searchtables` parameter in baseParams:

```javascript
"baseParams": {
  "searchtables": "my_custom_search_table",
  "srs": "3794",
  "limit": "20"
}
```

### Change Spatial Reference System

Update the `srs` parameter to match your project:

```javascript
"baseParams": {
  "searchtables": "search_ko",
  "srs": "4326",  // WGS84
  "limit": "20"
}
```

### Adjust Result Limit

Change the `limit` parameter (default in WSGI is 10):

```javascript
"baseParams": {
  "searchtables": "search_ko",
  "srs": "3794",
  "limit": "50"  // Return up to 50 results
}
```

### Custom Display Format

The displaytext field should be formatted in your database search table. Example:

```sql
UPDATE search_ko SET displaytext = ko_id || ' - ' || imeko;
```

## Security Considerations

The search.wsgi script includes several security measures:

- **Search table validation**: Only tables with names matching `[A-Za-z,._]` are allowed (the regex `[^A-Za-z,._]` rejects any name containing characters outside this set)
- **Parameterized queries**: All user input is passed through PDO prepared statements
- **Query sanitization**: For tsvector search, special characters are sanitized to avoid tsquery syntax errors
- **Connection security**: Uses the existing qwc_connect module for database connections

### Additional Security Measures

- Consider limiting access to the WSGI script via Apache/web server configuration
- Monitor search queries for potential abuse
- Implement rate limiting if needed
- Keep the search table separate from production data tables

## Troubleshooting

### No Results Appearing

1. Check that the search table exists and has data: `SELECT * FROM search_ko LIMIT 5;`
2. Verify the `searchtables` parameter matches your table name
3. Check that the `srs` parameter matches your project's coordinate system
4. Ensure the displaytext field is properly formatted
5. Check browser console for JavaScript errors
6. Check Apache error logs for WSGI errors

### Dropdown Not Showing

1. Verify `minChars` is set appropriately (default: 2)
2. Check that the store URL is correct: `wsgi/search.wsgi`
3. Ensure the JSON response format matches the expected structure
4. Check browser network tab for failed requests
5. Verify the WSGI script has execute permissions

### Search Not Working

1. Verify `filterOp` is set to "=" for exact matching on ko_id
2. Ensure `name` is "ko_id" to match the database field
3. Verify `valueField` is "ko_id" so the code value is submitted
4. Check that the query layer configuration matches your QGIS project
5. Ensure the database layer has a `ko_id` field that matches the values from search_ko table

### Database Connection Errors

1. Check the qwc_connect.py configuration file
2. Verify PostgreSQL connection settings
3. Ensure the database user has SELECT permissions on search tables
4. Check Apache error logs for detailed error messages

## Benefits Over Separate Fields

1. **Better UX**: Single field instead of two separate ones
2. **Flexible Search**: Search by code or name without choosing
3. **Type-Ahead**: Live suggestions improve findability
4. **Clear Results**: Formatted display shows both code and name
5. **Less Errors**: Dropdown selection ensures valid values
6. **Faster**: Users can see all matching options immediately

## Migration Guide

To migrate from the old two-field pattern:

1. **Create the search table** in your database (see Database Requirements section)
2. **Populate the search table** with cadastre data:
   ```sql
   INSERT INTO search_ko (ko_id, displaytext, searchstring, search_category, showlayer, the_geom)
   SELECT 
     ko_id AS ko_id,
     ko_id || ' - ' || imeko AS displaytext,
     lower(ko_id || ' ' || imeko) AS searchstring,
     '01-Katastrske občine' AS search_category,
     'Katastrske občine' AS showlayer,
     geom AS the_geom
   FROM your_cadastre_table;
   ```
3. **Replace the two textfield configurations** with the combo box (see example)
4. **Keep other form fields** (like st_parcele) unchanged
5. **Update baseParams** to match your SRS and table name
6. **Ensure your database layers** have a `ko_id` field matching the codes in search_ko
7. **Test thoroughly** with your data before deploying to production

## License

This implementation is part of Extended QGIS Web Client and follows the same GPL-v3.0 license.
