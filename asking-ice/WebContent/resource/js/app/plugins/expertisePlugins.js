ExpertisePlugin = Class.extend({
	init: function()	{
		this.name = "ExpertisePlugin";
	},
	
	onHtmlRendered: function(eventData)	{
		this.render();
	},
	
	onHtmlUpdated: function(eventData)	{
		this.render();
	},
	
	render: function(eventData)	{
		$('.extension-point[extensionName="ExpertiseTitle"]').each(function(index, value)	{
			if ($(value).find('div[flag="ExpertisePlugin"]').length > 0)
				return;
			var old = $(value).html();
			var eid = $(value).attr('extensionId');
			$(value).html("<a href='#!page/Topic/id/"+eid+"' onmouseover='generateEvent(&apos;ExpertiseTitleHover&apos;, event)'>"+old+"</a><div flag='ExpertisePlugin'></div>");
		});
		
		$('.extension-point[extensionName="InterestTitle"]').each(function(index, value)	{
			if ($(value).find('div[flag="ExpertisePlugin"]').length > 0)
				return;
			var old = $(value).html();
			var eid = $(value).attr('extensionId');
			$(value).html("<a href='#!page/Topic/id/"+eid+"' onmouseover='generateEvent(&apos;ExpertiseTitleHover&apos;, event)'>"+old+"</a><div flag='ExpertisePlugin'></div>");
		});
	}
}).implement(PluginInterface).implement(AjaxInterface);

TemplateDebugPlugin = Class.extend({
	init: function()	{
		this.rendered = false;
		this.name = "TemplateDebugPlugin";
	},
	
	onHtmlRendered: function(eventData)	{
		if (this.rendered)
			return;
		$.each($('.portlet-container'), function(index, value)	{
			$(value).append('<div>Portlet Container: '+$(value).attr('id')+'</div>');
		});
		this.rendered = true;
	}
}).implement(PluginInterface);

TextAreaAutoExpandPlugin = Class.extend({
	init: function()	{
		this.name = "TextAreaAutoExpandPlugin";
	},

	onExpandTextArea: function(eventData)	{
		var value = eventData.target;
		if ($(value).attr('flag') == 'TextAreaAutoExpand')
			return;
		var minHeight = eventData.min;
		var maxHeight = eventData.max;
		$(value).attr('flag', 'TextAreaAutoExpand');
		$(value).TextAreaExpander(minHeight, maxHeight);
	}
}).implement(PluginInterface);

FormatterPlugin = Class.extend({
	init: function()	{
		this.name = "FormatterPlugin";
	},
	
	onNeedFormatting: function(eventData)	{
		$('.extension-point[extensionName="Placeholder"]').each(function(index, value)	{
			if ($(value).attr('flag') == 'formatted')	{
				return;
			}
			
			//adjust depth
			var depth = $(value).attr('depth');
			if (depth == undefined) depth = 0;
			if (depth > 0) depth --;
			if (depth > 3) depth = 3;
//			$(value).attr('style', 'margin-left: '+(depth*115)+'px');
			var state = $(value).attr('state');
			var type = $(value).attr('type');
			var key = $($(value).find('.keyword')[0]).html();
			var v = $($(value).find('.content')[0]).html();
			
			var formatter = SingletonFactory.getInstance(FormatterFactory).getFormatter(type, state);
			if (formatter != undefined)	{
				formatter.format(key, v, value);
			}
			
			$(value).attr('flag', 'formatted');
		});
		
		$(".customDatePicker input").each(function(index, value)	{
			$(value).datepicker({dateFormat:"dd, M yy", 
				changeMonth: true,
				changeYear: true,
				yearRange:'-100:+10',
				showOn: "button",
				buttonImage: "static/images/cal.png",
				buttonImageOnly: true,
				buttonText: "Choose date",
				onSelect: function(dateText, inst) {$(value).attr("modified","true");}
			});
		});
	},
	
	onAddToken: function(eventData)	{
		if (eventData.keyCode == 13)	{
			var target = eventData.target;
			var partial = {};
			partial.content = $(target).val();
			partial.oid = "";
			//var container = $(target).siblings('.tokenContainer').append(tmpl('ListPartial-Edit', partial));
			$(target).val('');
		}
	},
	
	onDelToken: function(eventData)	{
		var target = eventData.target;
		$(target).parent().remove();
	},
	
	onAddEmailToken: function(eventData)	{
		if (eventData.keyCode == 13)	{
			var target = eventData.target;
			var provider = $(target).siblings('select').find('option:selected').html();
			var partial = {};
			partial.oid = "";
			partial.content = $(target).val()+'@'+provider;
			//var container = $(target).siblings('.tokenContainer').append(tmpl('ListPartial-Edit', partial));
			$(target).val('');
		}
	}
}).implement(PluginInterface);

FormatterFactory = Class.extend({
	getFormatter: function(type, state)	{
		var className = type+state+"Formatter";
		if (window[className] == undefined)	{
			//console.warn('Formatter '+type+'-'+state+' is not defined!');
			return undefined;
		} else {
			return new window[className	](state);
		}
	}
});

BaseFormatter = Class.extend({
	init: function()	{
		
	},
	
	format: function(key, value, placeholder)	{
		this.placeholder = placeholder;
		this.doFormat(key, value, placeholder);
	},
	
	doFormat: function(key, value, placeholder)	{
		$(placeholder).html(this.render(key, value));
	}
});

HeadingViewFormatter = BaseFormatter.extend({
	render: function(key, value)	{
		var obj = {};
		obj.keyword = key;
		obj.content = value;
		return tmpl('HeadingPlaceholder', obj);
	}
});

HeadingEditFormatter = HeadingViewFormatter.extend({});

HiddenViewFormatter = BaseFormatter.extend({
	render: function(key, value)	{
		return "";
	}
});

HiddenEditFormatter = HiddenViewFormatter.extend({});

NoneViewFormatter = BaseFormatter.extend({
	render: function(key, value)	{
		var obj = {};
		obj.keyword = key;
		return tmpl('NonePlaceholder', obj);
	}
});

NoneEditFormatter = NoneViewFormatter.extend({});

ListViewFormatter = BaseFormatter.extend({
	init: function()	{
		this.separator = ', ';
	},
	
	doFormat: function(key, value, placeholder)	{
		var keyword = $(placeholder).attr('name');
		var id = 'ListFormatter-'+keyword;
		var partial = {};
		partial.content = value;
		partial.oid = $(placeholder).parents('[rootname]:first').attr('oid');
		if (isNaN(partial.oid))	{
			partial.oid = "";
		}
		var fragment = this.buildFragment(partial);
		if (value == "" || $(placeholder).attr('mockup') == 'true')	{
			fragment = "";
		}
		
		//find the previous placeholder, because list is singleton
		if ($(placeholder).parents('.children_container:first').find('#'+id).length > 0)	{
			if (value == "" || $(placeholder).attr('mockup') == 'true')	{
				$(placeholder).remove();
				return;
			}
			$(placeholder).parents('.children_container:first').find('#'+id).find('.content').append(this.separator+fragment);
			$(placeholder).parent().parent().remove();
		} else {
			//not found, create new placeholder
			var obj = {};
			obj.id = id;
			obj.keyword = key;
			obj.content = fragment;
			var html = this.onRender(obj);
			$(placeholder).html(html);
		}
	},
	
	onRender: function(obj)	{
		return tmpl('ListPlaceholder', obj);
	},
	
	buildFragment: function(partial)	{
		return tmpl('ListPartial', partial);
	}
});

ListEditFormatter = ListViewFormatter.extend({
	init: function()	{
		this.separator = '';
	},
	
	onRender: function(obj)	{
		return tmpl('ListPlaceholder-Edit', obj);
	},
	
	buildFragment: function(partial)	{
		return tmpl('ListPartial-Edit', partial);
	}
});

NormalViewFormatter = BaseFormatter.extend({
	doFormat: function(key, value, placeholder)	{
		var obj = {};
		obj.keyword = key;
		obj.content = value;
		//find previous placeholder
		var keyword = $(placeholder).attr('name');
		if (this.checkDuplicate(keyword))	{
			obj.keyword = "";
		}
		obj.name = keyword;
		$(placeholder).html(this.onRender(obj));
	},
	
	checkDuplicate: function(keyword)	{
		return ($(this.placeholder).parent().parent().parent().find('.normal-formatter[name="'+keyword+'"]').length > 0);
	},
	
	onRender: function(obj)	{
		return tmpl('NormalPlaceholder', obj);
	}
});

BasicInfoViewFormatter = NormalViewFormatter.extend({
	onRender: function(obj)	{
		return tmpl('BasicInfoPlaceholder', obj);
	}
});

TitleViewFormatter = NormalViewFormatter.extend({
	onRender: function(obj)	{
		return tmpl('TitlePlaceholder', obj);
	}
});

NormalEditFormatter = NormalViewFormatter.extend({
	onRender: function(obj)	{
		return tmpl('NormalPlaceholder-Edit', obj);
	}
});

NormalLargeEditFormatter = NormalViewFormatter.extend({
	onRender: function(obj)	{
		return tmpl('NormalLargePlaceholder-Edit', obj);
	}
});

DateViewFormatter = NormalViewFormatter.extend({});

DateEditFormatter = NormalViewFormatter.extend({
	checkDuplicate: function(keyword)	{
		return ($(this.placeholder).parent().parent().parent().find('.date-formatter[name="'+keyword+'"]').length > 0);
	},
	
	onRender: function(obj)	{
		return tmpl('DatePlaceholder-Edit', obj);
	}
});

EmailViewFormatter = NormalViewFormatter.extend({});

EmailEditFormatter = ListEditFormatter.extend({
	init: function()	{
		this.separator = '';
	},
	
	onRender: function(obj)	{
		var params = $(this.placeholder).attr('params');
		var providers = params.split(',');
		var objProviders = {};
		objProviders.providers = providers;
		obj.select = tmpl('EmailProviders-Edit', objProviders);
		return tmpl('EmailPlaceholder-Edit', obj);
	}
});

EnumViewFormatter = NormalViewFormatter.extend({});

EnumEditFormatter = BaseFormatter.extend({
	doFormat: function(key, value, placeholder)	{
		var params = $(placeholder).attr('params');
		var choices = params.split(',');
		var str = "";
		for(var i in choices)	{
			var choice = choices[i];
			var checked = "";
			if (choice == value)	{
				checked = "checked";
			}
			var obj = {};
			obj.checked = checked;
			obj.choice = choice;
			obj.name = $(placeholder).attr('name');
			str += tmpl('EnumPartial-Edit', obj);
		}
		var enumObj = {};
		enumObj.content = str;
		enumObj.keyword = key;
		$(placeholder).html(tmpl('EnumPlaceholder-Edit', enumObj));
	}
});
