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

### Database Requirements

The search.wsgi script requires a search table with the following structure:

```sql
CREATE TABLE search_ko (
  displaytext VARCHAR(255),        -- Display text in format "CODE - NAME"
  searchstring VARCHAR(255),       -- Searchable text (lowercase)
  searchstring_tsvector tsvector,  -- Full-text search vector (optional)
  search_category VARCHAR(50),     -- Category for grouping (e.g., "01-ko")
  showlayer VARCHAR(255),          -- Layer name to show/zoom to
  the_geom GEOMETRY                -- Geometry for bounding box calculation
);

-- Create index for better search performance
CREATE INDEX idx_search_ko_searchstring ON search_ko(searchstring);
CREATE INDEX idx_search_ko_tsvector ON search_ko USING gin(searchstring_tsvector);
```

**Example Data:**
```sql
INSERT INTO search_ko (displaytext, searchstring, search_category, showlayer, the_geom)
VALUES 
  ('964 - VELENJE', '964 velenje', '01-Katastrske občine', 'Katastrske občine', ST_GeomFromText('POLYGON(...)', 3794)),
  ('1964 - IHAN', '1964 ihan', '01-Katastrske občine', 'Katastrske občine', ST_GeomFromText('POLYGON(...)', 3794));
```

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
  "fieldLabel": "Katastrska občina",
  "name": "ko_id",
  "displayField": "displaytext",
  "valueField": "displaytext",
  "typeAhead": true,
  "mode": "remote",
  "triggerAction": "all",
  "minChars": 2,
  "queryDelay": 100,
  "allowBlank": false,
  "blankText": "Vnesi številko ali ime k.o.",
  "filterOp": "ILIKE",
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
- **fieldLabel**: Label displayed next to the field
- **name**: "ko_id" - Field name for the search form (will contain the full displaytext)
- **displayField**: "displaytext" - Field shown in the combo box (from WSGI response)
- **valueField**: "displaytext" - Field used as the value (full text with code and name)
- **typeAhead**: true - Enables type-ahead functionality
- **mode**: "remote" - Fetches data from server as user types
- **triggerAction**: "all" - Shows all results when dropdown is triggered
- **minChars**: 2 - Minimum characters before search starts
- **queryDelay**: 100 - Delay in milliseconds before sending query
- **allowBlank**: false - Field is required
- **filterOp**: "ILIKE" - Uses case-insensitive LIKE operator for WMS filter (matches the full displaytext)
- **store**: Configuration for the JSON data store
  - **url**: Path to the WSGI search script
  - **baseParams**: Fixed parameters sent with every request
    - **searchtables**: Name of the search table in database
    - **srs**: Spatial reference system (adjust to your project's SRS)
    - **limit**: Maximum number of results
  - **root**: "results" - JSON array containing results
  - **fields**: Field definitions matching the WSGI response
    - Standard fields from search.wsgi: displaytext, searchtable, bbox, showlayer, selectable, geometry
- **tpl**: HTML template for dropdown items (shows displaytext directly)
- **itemSelector**: CSS selector for dropdown items
- **listWidth**: Width of the dropdown list in pixels

**Note**: The combo box searches and submits the full displaytext (e.g., "964 - VELENJE"). If you need to extract just the code, you can add custom JavaScript processing in your application logic.

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

**Important Note about Field Mapping:**

The example configuration uses `name="ko_id"` and `filterOp="ILIKE"` to filter on the full displaytext returned by WSGI. This assumes your database layer's field can match the displaytext format.

If your database layer has separate `ko_id` (numeric code) and `imeko` (name) columns, you may need to:
1. Modify your database to add a computed field matching the displaytext format, OR
2. Customize the search panel implementation in JavaScript to extract the code from displaytext before filtering, OR
3. Create a database view that includes the displaytext field for searching

Example database view:
```sql
CREATE OR REPLACE VIEW parcele_view AS
SELECT *, ko_id || ' - ' || imeko AS ko_displaytext, *
FROM parcele_layer;
```

Then set `name="ko_displaytext"` in your combo box configuration.

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

1. Verify `filterOp` is set to "ILIKE" for the combo box (case-insensitive matching)
2. Ensure `name` is set to match your query layer's field name
3. Check that the query layer configuration matches your QGIS project
4. Verify the displaytext format in your database matches what you expect in the filter

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
   INSERT INTO search_ko (displaytext, searchstring, search_category, showlayer, the_geom)
   SELECT 
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
6. **Test thoroughly** with your data before deploying to production

## License

This implementation is part of Extended QGIS Web Client and follows the same GPL-v3.0 license.
