PasswordResetPortlet = Class.extend({
	init: function()	{
		this.name = "PasswordResetPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onReloadPage: function()	{
		this.run();
	},
	
	onResetButtonClick: function()	{
		var obj = this;
		var pw = this.requestForEffectiveResource('Password').val();
		var cfpw = this.requestForEffectiveResource('ConfirmPassword').val();
		if (pw == undefined || pw == "")	{
			obj.requestForEffectiveResource('Error').html('Bạn phải nhập mật khẩu');
			return;
		}
		if (pw != cfpw)	{
			obj.requestForEffectiveResource('Error').html('Hai mật khẩu không giống nhau');
			return;
		}
		
		var token = this.token;
		if (token == undefined)	{
			token = this.getRequest().getParam('token');
		}
		
		this.onAjax('user-ajax', 'reset-password', 
				{'token': token, 'passwd': pw}, 'POST', {
						'onSuccess': function()	{
							var subject = SingletonFactory.getInstance(Subject);
							subject.notifyEvent('NotifyGlobal', 'Bạn đã thay đổi mật khẩu thành công');
							subject.notifyEvent('RequestRoute', new Request('Login'));
						},
						
						'onFailure': function(message)	{
							obj.requestForEffectiveResource('Error').html(message);	
						}
					});
	},
		
	run: function()	{
		this.getPortletPlaceholder().paintCanvas('');
		var token = this.getRequest().getParam('token', undefined);
		if (token == undefined)	{
			this.getPortletPlaceholder().paintCanvas(this.renderView('ErrorInvalidToken', {}));
		} else {
			var obj = this;
			this.onAjax('user-ajax', 'is-token-valid', {'token':token}, 'GET', {
				'onSuccess': function(ret)	{
					obj.token = token;
					obj.getPortletPlaceholder().paintCanvas(obj.render());
				},
				'onFailure': function(message)	{
					obj.getPortletPlaceholder().paintCanvas(obj.renderView('ErrorInvalidToken', {error: message}));
				}
			});
		}
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);