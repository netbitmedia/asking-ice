EmailPasswdEditPortlet = Class.extend({
	init: function()	{
		this.name = "EmailPasswdEditPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	afterEdit: function(target) {
		$('.'+target).show();
		$('.'+target+'_edit').hide();
		$('.error').html('');
	},
	
	onSubmitNewsletter: function() {
		$('.error').html('');
		var checkbox = this.requestForEffectiveResource('NewsletterCheck');
		var email = this.requestForEffectiveResource('NewsletterEmail').val().trim();
		
		var obj = this;
		var subject = SingletonFactory.getInstance(Subject);
		if (checkbox.is(':checked'))	{
			if (email == "")	{
				this.requestForEffectiveResource('EmailError').html("Email không được để trống");
				return;
			}
			
			this.onAjax('ajax', 'subscribe', {email: email}, 'POST', {
				'onSuccess': function(ret)	{
					subject.notifyEvent('NotifyGlobal', 'Bạn đã đăng ký nhận newsletter thành công!');
					obj.run();
				},
				'onFailure': function(message)	{
					obj.requestForEffectiveResource('EmailNewsletterError').html(message);
				}
			});
		} else {
			this.onAjax('ajax', 'unsubscribe-user', {}, 'POST', {
				'onSuccess': function(ret)	{
					subject.notifyEvent('NotifyGlobal', 'Bạn đã hủy nhận newsletter thành công!');
					obj.run();
				}
			});
		}
	},
	
	onSubmitEmail: function() {
		$('.error').html('');
		var curPass = this.requestForEffectiveResource('EmailPass').val().trim();
		var email = this.requestForEffectiveResource('EmailInput').val().trim();
		
		var obj = this;
		if (curPass == "")	{
			obj.requestForEffectiveResource('EmailPassError').html("Bạn phải nhập mật khẩu hiện tại");
			return;
		}
		if (email == "")	{
			obj.requestForEffectiveResource('EmailError').html("Email không được để trống");
			return;
		}
		
		this.onAjax('user-ajax', 'edit-email-password', {currentPasswd: curPass, email: email}, 'POST', {
			'onSuccess': function(ret)	{
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('NotifyGlobal', 'Bạn đã thay đổi email thành công!');
				obj.afterEdit('bkp_email');
				obj.requestForEffectiveResource('EmailPass').val('');
				obj.requestForEffectiveResource('Email').html(email);
			},
			'onFailure': function(message)	{
				if (message.indexOf('sai') == -1)
					obj.requestForEffectiveResource('EmailError').html(message);
				else
					obj.requestForEffectiveResource('EmailPassError').html(message);
			}
		});
	},
	
	onSubmitPasswd: function()	{
		$('.error').html('');
		var curPass = this.requestForEffectiveResource('CurrentPasswd').val().trim();
		var pass = this.requestForEffectiveResource('Passwd').val().trim();
		var confirmPass = this.requestForEffectiveResource('ConfirmPasswd').val().trim();

		var obj = this;
		if (curPass == "")	{
			obj.requestForEffectiveResource('CurPassError').html("Bạn phải nhập mật khẩu cũ");
			return;
		}
		if (pass == "")	{
			obj.requestForEffectiveResource('NewPassError').html("Mật khẩu không được để trống");
			return;
		}
		if (pass != confirmPass)	{
			obj.requestForEffectiveResource('ConfirmPassError').html("Hai mật khẩu phải giống nhau");
			return;
		}
		
		this.onAjax('user-ajax', 'edit-email-password', {'currentPasswd': curPass, 'passwd': pass}, 'POST', {
			'onSuccess': function(ret)	{
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('NotifyGlobal', 'Bạn đã thay đổi mật khẩu thành công!');
				obj.afterEdit('bkp_passwd');
				obj.requestForEffectiveResource('CurrentPasswd').val('');
				obj.requestForEffectiveResource('Passwd').val('');
				obj.requestForEffectiveResource('ConfirmPasswd').val('');
			},
			'onFailure': function(message)	{
				if (message.indexOf('sai') == -1)
					obj.requestForEffectiveResource('NewPassError').html(message);
				else
					obj.requestForEffectiveResource('CurPassError').html(message);
			}
		});
	},
	
	onNewsletterSubscribeCheckChanged: function() {
		var input = this.requestForEffectiveResource('NewsletterCheck');
		if (input.is(':checked'))	{
			this.requestForEffectiveResource('NewsletterEmail').removeAttr('disabled');
		} else {
			this.requestForEffectiveResource('NewsletterEmail').attr('disabled', '');
		}
	},
	
	run: function()	{
		var obj = this;
		var prop = SingletonFactory.getInstance(Application).getSystemProperties();
		obj.model = {};
		obj.model.name = prop.get('user.name');
		obj.model.username = prop.get('user.username');
		obj.model.avatar = prop.get('user.avatar');
		obj.model.newsletter = "Tắt";
		obj.model.newsletterChecked = "";
		obj.model.newsletterDisable = "disabled";
		obj.model.newsletterEmail = "";
		this.onAjax('user-ajax', 'get-user-edit-info', {}, 'GET', {
			'onSuccess': function(ret)	{
				if (ret.subscribe != null)	{
					obj.model.newsletter = "Bật";
					obj.model.newsletterChecked = "checked";
					obj.model.newsletterDisable = "";
					obj.model.newsletterEmail = ret.subscribe.email;
				}
				
				obj.getPortletPlaceholder().paintCanvas(obj.render());
				obj.requestForEffectiveResource('Email').html(ret.email);
				obj.requestForEffectiveResource('EmailInput').val(ret.email);
			}
		});
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);