LoginPortlet = Class.extend({
	
	init: function()	{
		this.name = "LoginPortlet";
		this.model = {};
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onOpenIDLoginSuccess: function() {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('PopupRemove', {id: 'Login'});
		this.resyncStatus();
	},
	
	onLoginOpenID: function(eventData) {
		var w = 800;
		var h = 450;
		var left = (screen.width/2)-(w/2);
		var top = (screen.height/2)-(h/2);
		window.open('index/login-openid/login/'+eventData.type, 'openIDWindow', "status = 0, height = "+h+", width = "+h+", resizable = 0, left = "+left+", top = "+top);
	},
	
	onNeedLogin: function(eventData)	{
		this.currentEventData = eventData;
		//check login?
		var properties = SingletonFactory.getInstance(Application).getSystemProperties();
		var loggedIn = properties.get('user.login', undefined);
		//no evidence found
		if (loggedIn == undefined)	{
			this.resyncStatus(eventData);
		} else {
			this.checkLogin(eventData);
		}
	},
	
	resyncStatus: function(eventData)	{
		var obj = this;
		var properties = SingletonFactory.getInstance(Application).getSystemProperties();
		this.onAjax('ajax', 'check-user-status', {}, 'GET', 
			{'onSuccess': function(ret)	{
				if (ret == 0)	{
					properties.set('user.login', 0, true);
					properties.set('user.id', -1, true);
				} else {
					properties.set('user.id', ret.id, true);
					properties.set('user.name', ret.name, true);
					properties.set('user.login', 1, true);
					properties.set('user.type', ret.type, true);
					properties.set('user.role', ret.role, true);
				}
				obj.checkLogin(eventData);
			}
		});
	},
	
	checkLogin: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		var properties = SingletonFactory.getInstance(Application).getSystemProperties();
		var loggedIn = properties.get('user.login', undefined);
		if (loggedIn == 0)	{
			if (this.currentEventData.disableWarning == true)
				this.model.loginError = '';
			else 
				this.model.loginError = this.getLocalizedText('NeedLogin');
			subject.notifyEvent('ShowPopup', {'id': 'Login',title: 'Đăng nhập', 'content': this.render()});
			$('#LoginPortlet-Username').focus();
		} else {
			subject.notifyEvent('LoginSuccess', eventData);
		}
	},
	
	onPasswordTextBoxKeyUp: function(event)	{
		var keycode = event.keyCode;
		if (keycode == 13)	{
			this.onLoginButtonClick(event);
		}
	},
	
	onLoginButtonClick: function(eventData)	{
		var target = eventData.target;
		var form = $(target).parents('#LoginPortlet-Form:first');
		//ajax request
		var username = $(form).find('#LoginPortlet-Username').val();
		var password = $(form).find('#LoginPortlet-Password').val();
		var remember = $(form).find('#LoginPortlet-Persistent:checked').length;
		var loginError = $(target).parents('#LoginPortlet-Form:first').find('#LoginPortlet-LoginError');
		if (username == '' || password == '')	{
			$(loginError).html(this.getLocalizedText('LoginInsufficientInput'));
		}
		var obj = this;
		this.onAjax('ajax', 'login', {'username':username, 'password':password, 'persistent': remember}, 'POST', 
				{'onSuccess': function(ret)	{
					var properties = SingletonFactory.getInstance(Application).getSystemProperties();
					properties.set('user.id', ret.id, true);
					properties.set('user.name', ret.name, true);
					properties.set('user.login', 1, true);
					properties.set('user.type', ret.type, true);
					var subject = SingletonFactory.getInstance(Subject);
					subject.notifyEvent('PopupRemove', {id: 'Login'});
					subject.notifyEvent('LoginSuccess', obj.currentEventData);
				},
				'onFailure': function(message)	{
					$(loginError).html(message);
				}});
	},
	
	onReloadPage: function() {
		this.run();
	},
	
	onSystemPropertyChanged: function(eventData)	{
		if (eventData == 'user.login')	{
			if (this.getInitParameters().light == true) {
				var loggedin = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
				if (loggedin == 1)
					this.getPortletPlaceholder().paintCanvas('');
			}
		}
	},
	
	run: function()	{
		this.model.loginError = '';
		if (this.getInitParameters().light == true) {
			var loggedin = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
			if (loggedin != 1)
				this.getPortletPlaceholder().paintCanvas(this.renderView('LightView', this.model));
		} else {
			this.getPortletPlaceholder().paintCanvas(this.render());
		}
	}
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface).implement(AjaxInterface);