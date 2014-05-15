Ext.override(Ext.form.Checkbox, {
	checked: undefined,
	actionMode: 'wrap',
	innerCls: 'x-form-checkbox-inner',
	onResize: function(){
		Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
		if(!this.boxLabel){
			this.innerWrap.alignTo(this.wrap, 'c-c');
		}
	},
	initEvents: function(){
		Ext.form.Checkbox.superclass.initEvents.call(this);
		this.mon(this.el, {
			click: this.onClick,
			change: this.onClick,
			mouseenter: this.onMouseEnter,
			mouseleave: this.onMouseLeave,
			mousedown: this.onMouseDown,
			mouseup: this.onMouseUp,
			scope: this
		});
	},
	onRender: function(ct, position){
		Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
		if(this.inputValue !== undefined){
			this.el.dom.value = this.inputValue;
		}else{
			this.inputValue = this.el.dom.value;
		}
		this.innerWrap = this.el.wrap({
			cls: this.innerCls
		});
		this.wrap = this.innerWrap.wrap({
			cls: 'x-form-check-wrap'
		});
		if(this.boxLabel){
			this.labelEl = this.wrap.createChild({
				tag: 'label',
				htmlFor: this.el.id,
				cls: 'x-form-cb-label',
				html: this.boxLabel
			});
		}else{
			this.innerWrap.addClass('x-form-check-no-label');
		}
	},
	initValue: function(){
		if(this.checked !== undefined){
			this.setValue(this.checked);
		}else{
			if(this.value !== undefined){
				this.setValue(this.value);
			}
			this.checked = this.el.dom.checked;
		}
		this.originalValue = this.getValue();
	},
	getRawValue: function(){
		return this.rendered ? this.el.dom.checked : this.checked;
	},
	getValue: function(){
		return this.getRawValue() ? this.inputValue : undefined;
	},
	onClick: function(){
		if(Ext.isSafari){
			this.focus();
		}
		if(this.el.dom.checked != this.checked){
			this.setValue(this.el.dom.checked);
		}
	},
	setValue: function(v){
		this.checked = typeof v == 'boolean' ? v : v == this.inputValue;
		if(this.rendered){
			this.el.dom.checked = this.checked;
			this.el.dom.defaultChecked = this.checked;
			this.innerWrap[this.checked ? 'addClass' : 'removeClass']('x-form-check-checked');
			this.validate();
		}
		this.fireEvent('check', this, this.checked);
		return this;
	},
	onMouseEnter: function(){
		this.wrap.addClass('x-form-check-over');
	},
	onMouseLeave: function(){
		this.wrap.removeClass('x-form-check-over');
	},
	onMouseDown: function(){
		this.wrap.addClass('x-form-check-down');
	},
	onMouseUp: function(){
		this.wrap.removeClass('x-form-check-down');
	},
	onFocus: function(){
		Ext.form.Checkbox.superclass.onFocus.call(this);
		this.wrap.addClass('x-form-check-focus');
	},
	onBlur: function(){
		Ext.form.Checkbox.superclass.onBlur.call(this);
		this.wrap.removeClass('x-form-check-focus');
	}
});
Ext.override(Ext.form.Radio, {
	innerCls: 'x-form-radio-inner',
	onClick: Ext.form.Radio.superclass.onClick,
	setValue: function(v){
		Ext.form.Radio.superclass.setValue.call(this, v);
		if(this.rendered && this.checked){
			var p = this.el.up('form') || Ext.getBody(),
				els = p.select('input[name=' + this.el.dom.name + ']'),
				id = this.el.dom.id;
			els.each(function(el){
				if(el.dom.id != id){
					Ext.getCmp(el.dom.id).setValue(false);
				}
			});
		}
		return this;
	}
});