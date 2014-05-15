Ext.ns('Ext.ux.plugins');
Ext.ux.plugins.VirtualKeyboard = Ext.extend ( Ext.util.Observable, {
	events: {},
	/**
	 * Init of plugin
	 * @param {Ext.Component} field
	 */
	init: function(field) {
		this.addEvents({
			'expand': true,
			'collapse': true
		});

		if(field.getXType() != 'textfield' && field.getXType() != 'textarea')
			return;
		
		this.component = field;
		field.virtualKeyboardPlugin = this;

		field.enableKeyEvents = true;
		field.on({
			'destroy': this.destroy,
			'focus': function(f){
				this.activeTarget = f;
			},
			'keypress': function(field, e){
				if(e.getKey() == e.ESC)
					field.collapseKeyboard();
			},
			scope: this
		});
		
		Ext.apply(field, {
			onRender: field.onRender.createSequence(function(ct, position) {
				this.wrap = this.el.wrap({cls: "x-form-field-wrap"});
				if(this.fieldLabel && this.keyboardConfig.showIcon) {
					var label = this.el.findParent('.x-form-element', 5, true) || this.el.findParent('.x-form-field-wrap', 5, true);
					
					this.virtualKeyboardIcon = label.createChild({
						cls:(this.keyboardIconCls || 'ux-virtualkeyboard-icon'),
						style:'width:16px; height:18px; position:absolute; left:0; top:0; display:block; background:transparent no-repeat scroll 0 2px;'
					});
					
					this.alignKeyboardIcon = function(){
						var el = this.el; 
						this.virtualKeyboardIcon.alignTo(el, 'tl-tr', [2, 0]);
					}
					//Redefine alignErrorIcon to move the errorIcon (if it exist) to the right of helpIcon
					if(this.alignErrorIcon) {
						this.alignErrorIcon = function() {
							this.errorIcon.alignTo(this.virtualKeyboardIcon, 'tl-tr', [2, 0]);
						}
					}
					
					this.on('resize', this.alignKeyboardIcon, this);
					
					this.virtualKeyboardIcon.on('click', function(e){
						if(this.disabled){
							return;
						}
						this.expandKeyboard();
						this.el.focus();
					}, this);
					
				}
			}), //end of onRender
			
			initKeyboard: function(){
				var cls = 'x-keyboard-container';
				
				this.keyboardContainer = new Ext.Layer({
					shadow: true,
					cls: [cls, this.virtualKeyboardClass].join(' '),
					constrain: false
				});
				
				this.keyboardContainer.setWidth(370);
				
				var config = this.keyboardConfig || {};
				config['showCloseButton'] = true;
				config['keyboardTarget'] = this;
				
				this.keyboard = new Ext.ux.VirtualKeyboard(config);
				this.keyboard.render(this.keyboardContainer);
				
				this.keyboard.getTBar().add('-', new Ext.Button({
					text: this.keyboardConfig.closeButtonText || 'Close',
					listeners: {
						'click': this.collapseKeyboard,
						scope: this
					},
					scope: this
				}));
			},
			
			collapseKeyboardIf : function(e){
				if( !e.within(this.wrap) && !e.within(this.keyboardContainer) && !this.keyboard.selectingLanguage ){
					this.collapseKeyboard();
				}
			},

			expandKeyboard : function(){
				if(this.isKeyboardExpanded() /*|| !this.hasFocus*/){
					return;
				}
				if(!this.keyboard)
					this.initKeyboard();
				this.keyboardContainer.alignTo(this.wrap, this.keyboardAlign || 'tl-bl?');
				this.keyboardContainer.show();
				Ext.getDoc().on('mousewheel', this.collapseKeyboardIf, this);
				Ext.getDoc().on('mousedown', this.collapseKeyboardIf, this);
				this.virtualKeyboardPlugin.fireEvent('expand', this);
			},

			collapseKeyboard : function(){
				if(!this.isKeyboardExpanded()){
					return;
				}
				this.keyboardContainer.hide();
				Ext.getDoc().un('mousewheel', this.collapseKeyboardIf, this);
				Ext.getDoc().un('mousedown', this.collapseKeyboardIf, this);
				this.virtualKeyboardPlugin.fireEvent('collapse', this);
			},

			
			isKeyboardExpanded : function(){
				return this.keyboardContainer && this.keyboardContainer.isVisible();
			}

		}); //end of Ext.apply
	}, // end of function init
	
	destroy: function(component){
		if(component){
			if(component.keyboard){
				component.keyboard.keyboard.remove();
				delete component.keyboard;
			}
			if(component.keyboardContainer){
				component.keyboardContainer.remove();
				delete component.keyboardContainer;
			}
		}
	},
	
	expand: function(){
		if(this.activeTarget){
			this.activeTarget.expandKeyboard();
		}
	}

}); // end of extend