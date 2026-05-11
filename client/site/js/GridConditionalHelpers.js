/**
 * Grid Conditional Rendering Helper Functions
 * These functions help manage conditional rendering in search result grids
 */

/**
 * Refresh grid rendering after conditions change
 * @param {Ext.grid.GridPanel} grid - The grid to refresh
 */
function refreshGridConditionalRendering(grid) {
    if (grid && grid.getView()) {
        grid.getView().refresh();
    }
}

/**
 * Apply conditional rendering to all active search grids
 */
function refreshAllGridConditionalRendering() {
    // Find all active search grids and refresh them
    var bottomPanel = Ext.getCmp('BottomPanel');
    if (bottomPanel && bottomPanel.items) {
        bottomPanel.items.each(function(item) {
            if (item.xtype === 'grid' || (item.resultsGrid && item.resultsGrid.getView)) {
                refreshGridConditionalRendering(item.resultsGrid || item);
            }
        });
    }
    
    // Refresh right panel grid if exists
    var rightPanel = Ext.getCmp('RightPanel');
    if (rightPanel && rightPanel.items) {
        rightPanel.items.each(function(item) {
            if (item.xtype === 'grid' || (item.resultsGrid && item.resultsGrid.getView)) {
                refreshGridConditionalRendering(item.resultsGrid || item);
            }
        });
    }
    
    // Refresh default search panel grid
    var searchGrid = Ext.getCmp('SearchPanelResultsGrid');
    if (searchGrid) {
        refreshGridConditionalRendering(searchGrid);
    }
}

/**
 * Set conditional rendering conditions and refresh all grids (optimized)
 * @param {Array|Object} conditions - Array of condition objects OR object with field-specific conditions
 */
function setGridConditionalConditions(conditions) {
    if (typeof GridConditionalConfig !== 'undefined') {
        if (Array.isArray(conditions)) {
            // Backward compatibility: convert array to field-specific format
            GridConditionalConfig.updateConditions(conditions);
        } else {
            // New optimized format: field-specific conditions object
            GridConditionalConfig.updateFieldConditions(conditions);
        }
        refreshAllGridConditionalRendering();
    }
}

/**
 * Add conditions for a specific field
 * @param {string} fieldName - Field name
 * @param {Array} conditions - Array of condition objects (without field property)
 */
function setFieldConditionalConditions(fieldName, conditions) {
    if (typeof GridConditionalConfig !== 'undefined') {
        GridConditionalConfig.fieldConditions[fieldName] = conditions || [];
        GridConditionalConfig._rebuildCache();
        refreshAllGridConditionalRendering();
    }
}

/**
 * Add a single condition to a specific field
 * @param {string} fieldName - Field name  
 * @param {Object} condition - Condition object (without field property)
 */
function addFieldConditionalCondition(fieldName, condition) {
    if (typeof GridConditionalConfig !== 'undefined') {
        GridConditionalConfig.addFieldCondition(fieldName, condition);
        refreshAllGridConditionalRendering();
    }
}

/**
 * Add a single condition and refresh grids
 * @param {Object} condition - Condition object to add
 */
function addGridConditionalCondition(condition) {
    if (typeof GridConditionalConfig !== 'undefined') {
        GridConditionalConfig.addCondition(condition);
        refreshAllGridConditionalRendering();
    }
}

/**
 * Clear all conditions and refresh grids
 */
function clearGridConditionalConditions() {
    if (typeof GridConditionalConfig !== 'undefined') {
        GridConditionalConfig.clearConditions();
        refreshAllGridConditionalRendering();
    }
}

/**
 * Example function to demonstrate usage
 */
function exampleConditionalRendering() {
    // Example: Clear existing conditions
    clearGridConditionalConditions();
    
    // Example: Add conditions based on your data
    var sampleConditions = [
        {
            field: 'status',
            operator: '=',
            value: 'active',
            cssClass: 'grid-row-green'
        },
        {
            field: 'priority',
            operator: '>',
            value: 5,
            cssClass: 'grid-row-red'
        },
        {
            field: 'area',
            operator: '>=',
            value: 1000,
            cssClass: 'grid-row-blue'
        }
    ];
    
    setGridConditionalConditions(sampleConditions);
}
