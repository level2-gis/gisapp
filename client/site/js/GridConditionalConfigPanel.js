/**
 * Grid Conditional Rendering Configuration Panel
 * A simple UI for managing conditional rendering rules
 */

function createConditionalRenderingPanel() {
    var conditionStore = new Ext.data.JsonStore({
        fields: ['field', 'operator', 'value', 'cssClass'],
        data: GridConditionalConfig.getFlatConditions() // Use new method to get flat array
    });

    var conditionGrid = new Ext.grid.EditorGridPanel({
        store: conditionStore,
        columns: [
            {
                header: 'Field',
                dataIndex: 'field',
                width: 100,
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
            {
                header: 'Operator',
                dataIndex: 'operator',
                width: 120,
                editor: new Ext.form.ComboBox({
                    store: [
                        ['=', 'Equals'],
                        ['!=', 'Not Equals'],
                        ['>', 'Greater Than'],
                        ['<', 'Less Than'],
                        ['>=', 'Greater or Equal'],
                        ['<=', 'Less or Equal'],
                        ['contains', 'Contains'],
                        ['startswith', 'Starts With'],
                        ['endswith', 'Ends With'],
                        ['isnull', 'Is Null'],
                        ['isnotnull', 'Is Not Null'],
                        ['isempty', 'Is Empty'],
                        ['isnotempty', 'Is Not Empty'],
                        ['isnullorempty', 'Is Null or Empty'],
                        ['isnotnullorempty', 'Is Not Null or Empty']
                    ],
                    mode: 'local',
                    triggerAction: 'all',
                    displayField: 'text',
                    valueField: 'value',
                    selectOnFocus: true
                })
            },
            {
                header: 'Value',
                dataIndex: 'value',
                width: 100,
                editor: new Ext.form.TextField({
                    allowBlank: true  // Allow blank for null/empty operators
                }),
                renderer: function(value, metaData, record) {
                    var operator = record.get('operator');
                    if (operator === 'isnull' || operator === 'isnotnull' || 
                        operator === 'isempty' || operator === 'isnotempty' ||
                        operator === 'isnullorempty' || operator === 'isnotnullorempty') {
                        return '<i>(not used)</i>';
                    }
                    return value;
                }
            },
            {
                header: 'Style',
                dataIndex: 'cssClass',
                width: 120,
                editor: new Ext.form.ComboBox({
                    store: [
                        ['grid-row-red', 'Red'],
                        ['grid-row-green', 'Green'],
                        ['grid-row-blue', 'Blue'],
                        ['grid-row-yellow', 'Yellow'],
                        ['grid-row-orange', 'Orange']
                    ],
                    mode: 'local',
                    triggerAction: 'all',
                    displayField: 'text',
                    valueField: 'value'
                })
            }
        ],
        tbar: [
            {
                text: 'Add Condition',
                iconCls: 'x-add-icon',
                handler: function() {
                    var newRecord = new conditionStore.recordType({
                        field: '',
                        operator: '=',
                        value: '',
                        cssClass: 'grid-row-red'
                    });
                    conditionGrid.stopEditing();
                    conditionStore.insert(0, newRecord);
                    conditionGrid.startEditing(0, 0);
                }
            },
            {
                text: 'Remove Condition',
                iconCls: 'x-delete-icon',
                handler: function() {
                    var selectedRecord = conditionGrid.getSelectionModel().getSelected();
                    if (selectedRecord) {
                        conditionStore.remove(selectedRecord);
                    }
                }
            },
            '-',
            {
                text: 'Apply',
                iconCls: 'x-save-icon',
                handler: function() {
                    // Save conditions from grid to config
                    var conditions = [];
                    conditionStore.each(function(record) {
                        conditions.push({
                            field: record.get('field'),
                            operator: record.get('operator'),
                            value: record.get('value'),
                            cssClass: record.get('cssClass')
                        });
                    });
                    setGridConditionalConditions(conditions);
                    Ext.Msg.alert('Success', 'Conditional rendering rules applied successfully!');
                }
            },
            {
                text: 'Clear All',
                iconCls: 'x-clear-icon',
                handler: function() {
                    conditionStore.removeAll();
                    clearGridConditionalConditions();
                }
            }
        ],
        height: 300,
        autoScroll: true
    });

    var configWindow = new Ext.Window({
        title: 'Grid Conditional Rendering Configuration',
        width: 500,
        height: 400,
        modal: true,
        layout: 'fit',
        items: [conditionGrid],
        buttons: [
            {
                text: 'Close',
                handler: function() {
                    configWindow.close();
                }
            }
        ]
    });

    return configWindow;
}

/**
 * Show the conditional rendering configuration panel
 */
function showConditionalRenderingConfig() {
    var configPanel = createConditionalRenderingPanel();
    configPanel.show();
}
