AskUserPlugin = Class.extend({
	init: function()	{
		this.name = "AskUserPlugin";
	},
	
	onMakeNewTargetedQuestion: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		var profileName = $(eventData.target).parents('.stat_outer:first').siblings('.user-name').html();
		var pid = SingletonFactory.getInstance(Page).getRequest().getParam('id');
		subject.notifyEvent('MakeNewQuestion', {profile: [{name: profileName, id: pid}]});
	},
	
	onHtmlUpdated: function()	{
		$('.extension-point[extensionName="BriefInfoControl"]').each(function()	{
			var props = SingletonFactory.getInstance(Application).getSystemProperties();
			var loggedIn = props.get('user.login');
			var pid = undefined;
			if (loggedIn == 1)	{
				var uid = props.get('user.id');
				pid = SingletonFactory.getInstance(Page).getRequest().getParam('id');
				if (uid == pid)		{	//same user
					return;
				}
			} else {
				return;
			}
			if ($(this).find('.[flag="AskUser"]').length > 0)	{
				return;
			}
			$(this).append(tmpl('AskUserPluginTmpl', {}));
		});
	}
}).implement(PluginInterface);