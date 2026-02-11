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

This implementation uses the existing `/client/wsgi/data.wsgi` script, which provides a simple array-based response format compatible with ExtJS array stores.

### WSGI Data Script

**File: `client/wsgi/data.wsgi`**

The data.wsgi script is a Python-based lookup endpoint that:
- Connects to PostgreSQL database lookup tables
- Supports filtering by query string (searches both code and description)
- Returns results as simple arrays matching static store format
- Supports JSONP callback for cross-domain requests

**URL Pattern:**
```
/wsgi/data.wsgi?table=lookup.ko&gtype=&query=[SEARCH_QUERY]
```

**Parameters:**
- `table` (required): Name of the lookup table (e.g., "lookup.ko" for cadastre areas)
- `gtype` (required): Geometry type filter (can be empty string)
- `query` (optional): Search term entered by user
- `category` (optional): Category filter
- `cb` (optional): JSONP callback function name

**Response Format:**
```json
{
  "results": [
    [964, "VELENJE"],
    [1964, "IHAN"]
  ]
}
```

The response is a simple array where each element is `[code, description]`. This format matches the static array store format used in ExtJS, making the remote store behave identically to a static store.

### Database Requirements

The data.wsgi script requires a lookup table with the following structure:

```sql
CREATE TABLE lookup.ko (
  id serial PRIMARY KEY,
  code integer,
  description text,
  geom_type integer NOT NULL,
  category text,
  CONSTRAINT "uc_lookup_ko" UNIQUE (code, geom_type)
);

-- geom_type: 1=point, 2=line, 3=polygon
-- For cadastre areas, geom_type is typically 3 (polygon)

-- Create index for better search performance
CREATE INDEX idx_lookup_ko_code ON lookup.ko(code);
CREATE INDEX idx_lookup_ko_description ON lookup.ko(description);
```

**Example Data:**
```sql
-- The description should include the code for proper display
INSERT INTO lookup.ko (code, description, geom_type, category)
VALUES 
  (964, '964 VELENJE', 3, 'ko'),
  (1964, '1964 IHAN', 3, 'ko'),
  (1982, '1982 ŠUJICA', 3, 'ko'),
  (1983, '1983 BABNA GORA', 3, 'ko');

-- Or use a view to automatically format:
CREATE OR REPLACE VIEW lookup.ko AS
SELECT 
  code,
  code || ' ' || name AS description,
  geom_type,
  category
FROM cadastre_base_table;
```

**Important:** The `description` column should contain the formatted display text including the code (e.g., "964 VELENJE"). This ensures the combo box displays properly when a value is selected. The data.wsgi script returns `[[code, description], ...]` and ExtJS uses the first element as the value and the second as the display text.

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

**New Pattern (combo box with data.wsgi):**
```javascript
{
  "xtype": "combo",
  "name": "ko_id",
  "fieldLabel": "KO",
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
    "xtype": "arraystore",
    "url": "wsgi/data.wsgi",
    "baseParams": {
      "table": "lookup.ko",
      "gtype": ""
    },
    "root": "results",
    "id": 0,
    "fields": [
      "value",
      "text"
    ]
  }
}
```

**Key Differences from Static Store:**
- Uses `"mode": "remote"` to fetch data from server
- Uses `"xtype": "arraystore"` for array format compatibility
- `"url": "wsgi/data.wsgi"` points to the data endpoint
- `"baseParams"` specifies the lookup table and geometry type
- `"id": 0` specifies which array element is the unique identifier (the code)
- `"fields": ["value", "text"]` maps array elements to field names
- Response format `[[code, description], ...]` where description includes code (e.g., "964 VELENJE")
- ExtJS automatically uses first array element as value and second as display text

### Configuration Properties Explained

- **xtype**: "combo" - Ext JS combo box component
- **name**: "ko_id" - Field name for the search form (matches database field)
- **fieldLabel**: "KO" - Label displayed next to the field
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
- **store**: Configuration for the array data store
  - **xtype**: "arraystore" - ExtJS array store for array format data
  - **url**: "wsgi/data.wsgi" - Path to the data.wsgi endpoint
  - **baseParams**: Fixed parameters sent with every request
    - **table**: "lookup.ko" - Name of the lookup table in database
    - **gtype**: "" - Geometry type filter (empty for all types)
  - **root**: "results" - JSON array containing results
  - **id**: 0 - Index of the unique identifier field (the code)
  - **fields**: ["value", "text"] - Maps array elements to named fields

**Array Store Format:**
The data.wsgi script returns simple arrays: `[[code, description], [code, description], ...]`

Where `description` should include the code for proper display (e.g., "964 VELENJE").

ExtJS ArrayStore automatically interprets:
- First element (code) as the **value** (submitted to WMS filter)
- Second element (description with code) as the **text** (shown to user)

**Key Properties for WMS Filter Integration:**
- `forceSelection: true` ensures a value from the list is selected
- `name: "ko_id"` specifies the field name used in the WMS filter
- `filterOp: "="` defines the filter operation used in the WMS request

The combo box displays the description (e.g., "964 VELENJE") but submits only the code (e.g., 964) for filtering, ensuring clean WMS filter queries like `ko_id = 964`.

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

### Change Lookup Table

Update the `table` parameter in baseParams:

```javascript
"baseParams": {
  "table": "lookup.my_custom_table",
  "gtype": ""
}
```

### Filter by Category

Add a category parameter to filter results:

```javascript
"baseParams": {
  "table": "lookup.ko",
  "gtype": "",
  "category": "cadastre"
}
```

### Adjust Geometry Type Filter

Set the gtype parameter (1=point, 2=line, 3=polygon):

```javascript
"baseParams": {
  "table": "lookup.ko",
  "gtype": "3"  // Only polygons
}
```

### Customize Display Format

The display format comes directly from the database `description` column. To show "CODE DESCRIPTION" format:

```sql
-- Option 1: Update existing data
UPDATE lookup.ko SET description = code || ' ' || description 
WHERE description NOT LIKE code || '%';

-- Option 2: Create a view with formatted description
CREATE OR REPLACE VIEW lookup.ko AS
SELECT 
  code,
  code || ' ' || name AS description,
  geom_type,
  category
FROM cadastre_base_table;
```

The combo box will then display "964 VELENJE", "1964 IHAN", etc.

## Security Considerations

The data.wsgi script includes several security measures:

- **Table name validation**: Implicitly validated through database schema (table must exist)
- **Parameterized queries**: All user input is passed through PDO prepared statements
- **Query sanitization**: Uses parameterized queries for search terms
- **Connection security**: Uses the existing qwc_connect module for database connections

### Additional Security Measures

- Keep lookup tables in a separate schema (e.g., `lookup.ko`)
- Limit database user permissions to SELECT only on lookup tables
- Consider limiting access to the WSGI script via Apache/web server configuration
- Monitor search queries for potential abuse
- Implement rate limiting if needed

## Troubleshooting

### No Results Appearing

1. Check that the lookup table exists: `SELECT * FROM lookup.ko LIMIT 5;`
2. Verify the `table` parameter matches your table name exactly (including schema)
3. Check that the table has `code` and `description` columns
4. Ensure data exists in the table
5. Check browser console for JavaScript errors
6. Check Apache error logs for WSGI errors

### Dropdown Not Showing

1. Verify `minChars` is set appropriately (default: 2)
2. Check that the store URL is correct: `wsgi/data.wsgi`
3. Ensure the JSON response format matches the expected structure
4. Check browser network tab for failed requests
5. Verify the WSGI script has execute permissions
6. Test the URL directly in browser: `wsgi/data.wsgi?table=lookup.ko&gtype=&query=test`

### Search Not Working

1. Verify `filterOp` is set to "=" for exact matching on ko_id
2. Ensure `name` is "ko_id" to match the database field
3. Verify `forceSelection` is true so a value is selected
4. Check that the query layer configuration matches your QGIS project
5. Ensure the database layer has a `ko_id` field that matches the codes from lookup.ko table
6. Test the data.wsgi URL with a query parameter to ensure it returns results

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

1. **Create the lookup table** in your database (see Database Requirements section)
2. **Populate the lookup table** with cadastre data - **important**: format description to include code:
   ```sql
   INSERT INTO lookup.ko (code, description, geom_type, category)
   SELECT 
     ko_id::integer AS code,
     ko_id || ' ' || imeko AS description,  -- Format as "CODE NAME"
     3 AS geom_type,
     'ko' AS category
   FROM your_cadastre_table;
   ```
3. **Replace the two textfield configurations** with the combo box (see example)
4. **Keep other form fields** (like st_parcele) unchanged
5. **Update baseParams** to match your table name
6. **Ensure your database layers** have a `ko_id` field matching the codes in lookup.ko
7. **Test the data.wsgi endpoint** directly: `wsgi/data.wsgi?table=lookup.ko&gtype=&query=test`
8. **Verify the response format** includes properly formatted descriptions
9. **Test thoroughly** with your data before deploying to production

## License

This implementation is part of Extended QGIS Web Client and follows the same GPL-v3.0 license.
