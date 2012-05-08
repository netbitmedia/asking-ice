ProfileNameEditPlugin = Class.extend({
	init: function()	{
		this.name = "ProfileNameEditPlugin";
	},
	
	saveData: function(event)	{
		var target = event.target;
		var newValue = $(target).val().trim();
		var oldValue = $(target).attr('oldValue');
		if (newValue == "")	{
			newValue = oldValue;
		}
		$(target).parent().removeAttr('editing');
		$(target).parent().html(newValue);
		if (oldValue != newValue)	{
			this.onAjax('user-ajax', 'edit-name', {'name': newValue}, 'POST', {});
		}
	},
	
	onProfileEditOnBlur: function(event)	{
		this.saveData(event);
	},
	
	onProfileEditOnKeyup: function(event)	{
		var keycode = event.keyCode;
		if (keycode == 13)	{
			this.saveData(event);
		}
	},
	
	onProfileNameEditClick: function(event)	{
		var target = event.target;
		var editTarget = $(target).parent().siblings('#BriefInfoEditPortlet-ProfileName');
		if ($(editTarget).attr('editing') == 'editing')
			return;
		var old = $(editTarget).html();
		$(editTarget).attr('editing', 'editing');
		$(editTarget).html('<input type="text" oldValue="'+old+'" onkeyup="generateEvent(&apos;ProfileEditOnKeyup&apos;, event)" onblur="generateEvent(&apos;ProfileEditOnBlur&apos;, event)" value="'+old+'">');
		$(editTarget).find('input').focus();
	},

	renderEditLink: function()	{
		var obj = this;
		$('.extension-point[extensionName="ProfileName"]').each(function(index, value)	{
			if ($(value).find('div[flag="ProfileNameEdit"]').length>0)
				return;
			$(value).append(tmpl('ProfileNameEdit', {}));
		});
	},
	
	onHtmlUpdated: function()	{
		this.renderEditLink();
	}
}).implement(PluginInterface).implement(AjaxInterface);