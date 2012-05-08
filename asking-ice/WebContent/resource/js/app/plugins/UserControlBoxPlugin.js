UserControlBoxPlugin = Class.extend({
	init: function()	{
		this.name = "UserControlBoxPlugin";
	},
	
	onSystemPropertyChanged: function(eventData)	{
		if (eventData == 'user.login')	{
			this.setupUserBox();
		}
	},
	
	onUpdateUserStatus: function(eventData)	{
		this.onBegin();
	},
	
	onPageBegan: function()	{
		this.checkActiveMenu();
	},
	
	checkActiveMenu: function()	{
		var request = SingletonFactory.getInstance(Page).getRequest();
		var page = request.getName();
		$('#UserControlBoxPlugin a').each(function()	{
			var p = $(this).attr('page');
			if (p == page)	{
				$(this).addClass('active');
			} else {
				$(this).removeClass('active');
			}
		});
	},
	
	onBegin: function(eventData)	{
		var properties = SingletonFactory.getInstance(Application).getSystemProperties();
		var obj = this;
		this.onAjax('ajax', 'check-user-status', {}, 'GET', 
			{'onSuccess': function(ret)	{
				if (ret == 0)	{
					properties.set('user.login', 0, true);
					properties.set('user.id', -1, true);
				} else {
					properties.set('user.login', 1, true);
					properties.set('user.id', ret.id, true);
					properties.set('user.name', ret.name, true);
					properties.set('user.username', ret.username, true);
					properties.set('user.type', ret.type, true);
					properties.set('user.role', ret.role, true);
					properties.set('user.avatar', ret.avatar, true);
				}
				obj.setupUserBox();
			}});
	},

	setupUserBox: function()	{
		var systemProperties = SingletonFactory.getInstance(Application).getSystemProperties();
		var loggedIn = systemProperties.get('user.login');
		var obj = {};
		var page = SingletonFactory.getInstance(Page);
		var subject = SingletonFactory.getInstance(Subject);
		if (loggedIn == true)	{
			subject.notifyEvent('FetchLiveNotification');
			obj.login = true;
			obj.name = systemProperties.get('user.name');
		} else {
			obj.login = false;
			if (page.pagename == 'Home')	{
				subject.notifyEvent('RequestRoute', new Request('Introduce'));
			}
		}
		if ($('#UserControlBoxPlugin').length <= 0)	{
			$('div.extension-point[extensionName="TopRight"]').append(tmpl('UserControlBoxPluginContainer', {}));
		}
		var type = systemProperties.get('user.type');
		if (type == 'person'){
			obj.userPage = 'User/id/'+systemProperties.get('user.id');;
		} else if (type == 'partner'){
			obj.userPage = 'PartnerProfile/id/'+systemProperties.get('user.id');
		}
		 
		$('#UserControlBoxPlugin').html(tmpl('UserControlBoxPluginTmpl', obj));
//		$("li.cutdi").blur(function () {
//	         $('#navAccount').addClass('_hidden');
//	    });
		this.checkActiveMenu();
	},
	
	onToggleAccountNav: function()	{
		if($('#navAccount').is("._hidden")) $('#navAccount').removeClass("_hidden");
		else $('#navAccount').addClass("_hidden");
	},
	
	onEnd: function()	{
		if ($('#UserControlBoxPlugin').length > 0)
			$('#UserControlBoxPlugin').remove();
	}
}).implement(PluginInterface).implement(AjaxInterface);

LiveNotificationPlugin = Class.extend({
	init: function()	{
		this.name = "LiveNotificationPlugin";
		this.fullFetched = false;
	},
	
	onBegin: function()	{
		this.startInterval(300000, this.fetch);
	},
	
	onFetchLiveNotification: function()	{
		this.fetch();
	},
	
	onFetchFullNotifications: function() {
		if (this.fullFetched)
			return;
		this.fullFetched = true;
		this.onAjax('user-ajax', 'get-full-notification', {}, 'GET', {
			onSuccess: function(ret)	{
				var notifs = Array();
				for(var i=0;i<ret.length;i++)	{
					var link = eval("("+ret[i].link+")");
					var href=Array();
					for(var j in link)	{
						var param = j;
						if (param == 'type')
							param = 'page';
						href.push(param+"/"+link[j]);
					}
					ret[i].content = tmpl('NotificationItem-'+ret[i].type, ret[i]);
					ret[i].link = "#!"+href.join("/");
					notifs.push(ret[i]);
				}
				$('#NotificationDropdown').html(tmpl('NotificationList', {notifs: notifs}));
				$('#NotificationNumber').html('0');
				$('#NotificationNumber').css('background-color', '#AAA');
			}
		});
	},
	
	fetch: function()	{
		var loggedin = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		if (loggedin == 1)	{
			this.onAjax('user-ajax', 'get-live-notification', {}, 'GET', {
				'onSuccess': function(ret)	{
					$('#NotificationNumber').html(ret);
					if (ret == 0)	{
						$('#NotificationNumber').css('background-color', '#AAA');
					}
				}
			});
		}
	}
}).implement(PluginInterface).implement(AjaxInterface).implement(IntervalTimerInterface);

UserLogoutPlugin = Class.extend({
	init: function()	{
		this.name = "UserLogoutPlugin";
	},
	
	onPageBegan: function()	{
		this.onAjax('ajax', 'logout', {}, 'POST', {
			'onSuccess': function(ret)	{
				var systemProperties = SingletonFactory.getInstance(Application).getSystemProperties();
				systemProperties.set('user.login', 0, true);
				systemProperties.set('user.id', undefined, true);
				var request = new Request("Introduce");
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent("RequestRoute", request);
			}
		});
	}
}).implement(PluginInterface).implement(AjaxInterface);