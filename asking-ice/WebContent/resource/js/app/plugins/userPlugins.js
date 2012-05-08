/**
 * 
 */
UserCheckLoginPlugin = Class.extend({
	init: function()	{
		this.name = "UserCheckLoginPlugin";
	},
	
	onPageBegan: function()	{
		var properties = SingletonFactory.getInstance(Application).getSystemProperties();
		var loggedIn = properties.get('user.login', undefined);
		var root = properties.get('host.root');
		var subject = SingletonFactory.getInstance(Subject);
		if (loggedIn == undefined)	{
			//query to server
			this.onAjax('ajax', 'check-user-status', {'profile-id':this.profile_id}, 'POST', 
					{'onSuccess': function(ret)	{
						if (ret == 0)	{
							properties.set('user.login', 0, true);
							var request = new Request('Login', undefined, null);
							subject.notifyEvent("RequestRoute", request);
						} else {
							properties.set('user.login', 1, true);
							properties.set('user.id', ret.userid, true);
						}
					}});
		} else if (loggedIn == false)	{
			var request = new Request('Login', undefined, null);
			subject.notifyEvent("RequestRoute", request);
		}
	}
}).implement(PluginInterface);

LoginSuccessRedirectPlugin = Class.extend({
	init: function()	{
		this.name = "LoginSuccessRedirectPlugin";
	},
	
	onLoginSuccess: function()	{
		var app = SingletonFactory.getInstance(Application);
		//FIXME: What is this? I don't remember :(
		var history = app.getSystemProperties().get("request.callback");
		var request = history != undefined ? history : new Request('Home', undefined, null);
		app.getSystemProperties().set("request.callback", undefined);
		var subject = new SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RequestRoute', request);
	}
}).implement(PluginInterface);