/**
 * Grid Conditional Rendering Configuration
 * This object defines the conditions for row styling using field-specific organization for better performance
 */
var GridConditionalConfig = {
    // Field-specific conditions for fast lookup
    fieldConditions: Eqwc.settings.fieldConditions || {},
    // Cache for quick field existence check
    _hasConditionsCache: {},

    /**
     * Rebuild cache after conditions change
     */
    _rebuildCache: function() {
        this._hasConditionsCache = {};
        for (var field in this.fieldConditions) {
            if (this.fieldConditions.hasOwnProperty(field) && this.fieldConditions[field].length > 0) {
                this._hasConditionsCache[field] = true;
            }
        }
    },

    /**
     * Check if a field has any conditions defined (fast lookup)
     * @param {string} fieldName - The field name to check
     * @returns {boolean} - True if field has conditions
     */
    hasConditionsForField: function(fieldName) {
        return this._hasConditionsCache[fieldName] === true;
    },

    /**
     * Evaluate a single condition against a field value
     * @param {Object} condition - The condition object (without field property)
     * @param {*} fieldValue - The field value from the record
     * @returns {boolean} - True if condition matches
     */
    evaluateCondition: function(condition, fieldValue) {
        var compareValue = condition.value;
        
        // Handle special null/empty operators first
        switch (condition.operator) {
            case 'isnull':
                return fieldValue === null || fieldValue === undefined;
            case 'isnotnull':
                return fieldValue !== null && fieldValue !== undefined;
            case 'isempty':
                return fieldValue === null || fieldValue === undefined || 
                       String(fieldValue).trim() === '';
            case 'isnotempty':
                return fieldValue !== null && fieldValue !== undefined && 
                       String(fieldValue).trim() !== '';
            case 'isnullorempty':
                return fieldValue === null || fieldValue === undefined || 
                       String(fieldValue).trim() === '' || 
                       String(fieldValue).toLowerCase() === 'null';
            case 'isnotnullorempty':
                return fieldValue !== null && fieldValue !== undefined && 
                       String(fieldValue).trim() !== '' && 
                       String(fieldValue).toLowerCase() !== 'null';
        }
        
        // Handle null/undefined values for regular operators
        if (fieldValue === null || fieldValue === undefined) {
            // For equality checks, allow comparison with string representations
            if (condition.operator === '=' || condition.operator === '==') {
                return compareValue === null || compareValue === undefined || 
                       String(compareValue).toLowerCase() === 'null';
            }
            if (condition.operator === '!=' || condition.operator === '!==') {
                return !(compareValue === null || compareValue === undefined || 
                        String(compareValue).toLowerCase() === 'null');
            }
            return false; // For other operators, null values don't match
        }
        
        // Convert to string for string operations
        var fieldStr = String(fieldValue).toLowerCase();
        var compareStr = String(compareValue).toLowerCase();
        
        switch (condition.operator) {
            case '=':
            case '==':
                // Handle string 'null' comparison
                if (compareStr === 'null') {
                    return fieldStr === 'null' || fieldValue === null || fieldValue === undefined;
                }
                return fieldValue == compareValue;
            case '!=':
            case '!==':
                // Handle string 'null' comparison
                if (compareStr === 'null') {
                    return !(fieldStr === 'null' || fieldValue === null || fieldValue === undefined);
                }
                return fieldValue != compareValue;
            case '>':
                return parseFloat(fieldValue) > parseFloat(compareValue);
            case '<':
                return parseFloat(fieldValue) < parseFloat(compareValue);
            case '>=':
                return parseFloat(fieldValue) >= parseFloat(compareValue);
            case '<=':
                return parseFloat(fieldValue) <= parseFloat(compareValue);
            case 'contains':
                return fieldStr.indexOf(compareStr) !== -1;
            case 'startswith':
                return fieldStr.indexOf(compareStr) === 0;
            case 'endswith':
                return fieldStr.lastIndexOf(compareStr) === fieldStr.length - compareStr.length;
            default:
                return false;
        }
    },

    /**
     * Get the CSS class for a record based on field-specific conditions (optimized)
     * @param {Ext.data.Record} record - The grid record
     * @returns {string} - CSS class to apply (returns first match)
     */
    getRowClass: function(record) {
        // Quick check if we have any conditions at all
        if (Object.keys(this._hasConditionsCache).length === 0) {
            return '';
        }
        
        // Only check fields that have conditions defined
        for (var fieldName in this._hasConditionsCache) {
            if (this._hasConditionsCache.hasOwnProperty(fieldName)) {
                var fieldValue = record.get(fieldName);
                var conditions = this.fieldConditions[fieldName];
                
                // Evaluate conditions for this field
                for (var i = 0; i < conditions.length; i++) {
                    if (this.evaluateCondition(conditions[i], fieldValue)) {
                        return conditions[i].cssClass;
                    }
                }
            }
        }
        
        return ''; // No condition matched
    },

    /**
     * Update field-specific conditions dynamically
     * @param {Object} fieldConditions - Object with field names as keys and condition arrays as values
     */
    updateFieldConditions: function(fieldConditions) {
        this.fieldConditions = fieldConditions || {};
        this._rebuildCache();
    },

    /**
     * Update conditions dynamically (backward compatibility)
     * @param {Array} newConditions - Array of condition objects with field property
     */
    updateConditions: function(newConditions) {
        this.fieldConditions = {};
        if (newConditions && newConditions.length > 0) {
            for (var i = 0; i < newConditions.length; i++) {
                var condition = newConditions[i];
                if (condition.field) {
                    if (!this.fieldConditions[condition.field]) {
                        this.fieldConditions[condition.field] = [];
                    }
                    this.fieldConditions[condition.field].push({
                        operator: condition.operator,
                        value: condition.value,
                        cssClass: condition.cssClass
                    });
                }
            }
        }
        this._rebuildCache();
    },

    /**
     * Add a single condition to a specific field
     * @param {string} fieldName - Field name
     * @param {Object} condition - Condition object (without field property)
     */
    addFieldCondition: function(fieldName, condition) {
        if (!this.fieldConditions[fieldName]) {
            this.fieldConditions[fieldName] = [];
        }
        this.fieldConditions[fieldName].push(condition);
        this._rebuildCache();
    },

    /**
     * Add a single condition (backward compatibility)
     * @param {Object} condition - Condition object with field property
     */
    addCondition: function(condition) {
        if (condition.field) {
            this.addFieldCondition(condition.field, {
                operator: condition.operator,
                value: condition.value,
                cssClass: condition.cssClass
            });
        }
    },

    /**
     * Remove all conditions for a specific field
     * @param {string} fieldName - Field name
     */
    removeFieldConditions: function(fieldName) {
        delete this.fieldConditions[fieldName];
        this._rebuildCache();
    },

    /**
     * Remove condition by field and index
     * @param {string} fieldName - Field name
     * @param {number} index - Index of condition to remove
     */
    removeFieldCondition: function(fieldName, index) {
        if (this.fieldConditions[fieldName] && index >= 0 && index < this.fieldConditions[fieldName].length) {
            this.fieldConditions[fieldName].splice(index, 1);
            if (this.fieldConditions[fieldName].length === 0) {
                delete this.fieldConditions[fieldName];
            }
            this._rebuildCache();
        }
    },

    /**
     * Remove condition by index (backward compatibility - removes from first found field)
     * @param {number} index - Index of condition to remove
     */
    removeCondition: function(index) {
        // Convert to flat array for backward compatibility
        var conditions = this.getFlatConditions();
        if (index >= 0 && index < conditions.length) {
            var condition = conditions[index];
            var fieldConditions = this.fieldConditions[condition.field];
            for (var i = 0; i < fieldConditions.length; i++) {
                if (fieldConditions[i].operator === condition.operator && 
                    fieldConditions[i].value === condition.value &&
                    fieldConditions[i].cssClass === condition.cssClass) {
                    this.removeFieldCondition(condition.field, i);
                    break;
                }
            }
        }
    },

    /**
     * Clear all conditions
     */
    clearConditions: function() {
        this.fieldConditions = {};
        this._rebuildCache();
    },

    /**
     * Get flat array of conditions (for backward compatibility)
     * @returns {Array} - Array of condition objects with field property
     */
    getFlatConditions: function() {
        var flatConditions = [];
        for (var fieldName in this.fieldConditions) {
            if (this.fieldConditions.hasOwnProperty(fieldName)) {
                var conditions = this.fieldConditions[fieldName];
                for (var i = 0; i < conditions.length; i++) {
                    flatConditions.push({
                        field: fieldName,
                        operator: conditions[i].operator,
                        value: conditions[i].value,
                        cssClass: conditions[i].cssClass
                    });
                }
            }
        }
        return flatConditions;
    },

    /**
     * Get conditions for a specific field
     * @param {string} fieldName - Field name
     * @returns {Array} - Array of condition objects for the field
     */
    getFieldConditions: function(fieldName) {
        return this.fieldConditions[fieldName] || [];
    }
};

// Initialize the cache on startup
GridConditionalConfig._rebuildCache();
