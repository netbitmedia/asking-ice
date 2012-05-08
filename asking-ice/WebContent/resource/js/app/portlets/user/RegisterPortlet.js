RegisterPortlet = Class.extend({
	init: function()	{
		this.name = "RegisterPortlet";
		this.step = 1;
		this.subject = SingletonFactory.getInstance(Subject);
	},
	
	onBegin: function()	{
		this.model = {};
		this.model.welcomeMsg = this.getLocalizedText('Welcome');
		this.model.nameMsg = this.getLocalizedText('Name');
		this.model.usernameMsg = this.getLocalizedText('Username');
		this.model.passwordMsg = this.getLocalizedText('Password');
		this.model.emailMsg = this.getLocalizedText('Email');
		this.model.submitMsg = this.getLocalizedText('Submit');
		this.model.skipMsg = this.getLocalizedText('Skip');
		this.model.registerMsg = this.getLocalizedText('Register');
		this.model.additionInfoMsg = this.getLocalizedText('AdditionInfo');
		this.model.expertiseMsg = this.getLocalizedText('Expertise');
		this.model.tokenMsg = this.getLocalizedText('Token');
		
		this.model.passwordTitle = this.getLocalizedText('PasswordTitle');
		this.model.emailTitle = this.getLocalizedText('EmailTitle');
		this.registerObserver();
	},
	
	run: function()	{
		this.model.existEmail = "";
		this.model.preEmail = this.getRequest().getParam('email') || "";
		this.model.preName = this.getRequest().getParam('name') || "";
		this.step1();
	},
	
	step1: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.renderView('ViewStep1', this.model));
	},
	
	step1ClearError: function()	{
		this.requestForEffectiveResource('NameError').html('');
		this.requestForEffectiveResource('PasswordError').html('');
		this.requestForEffectiveResource('EmailError').html('');
		this.requestForEffectiveResource('TokenError').html('');
	},
	
	onRegisterButtonClick: function(eventData)	{
		var fullname = this.requestForEffectiveResource('Name').val();
		var password = this.requestForEffectiveResource('Password').val();
		var email = this.requestForEffectiveResource('Email').val();
		var token = this.requestForEffectiveResource('Token').val();
		var receive = this.requestForEffectiveResource('ReceiveUpdates').is(':checked') ? 1 : 0;
		var refererToken = this.getRequest().getParam('token');
		
		var subject = SingletonFactory.getInstance(Subject);
		
		var obj = this;
		this.step1ClearError();
		this.onAjax('ajax', 'register', 
				{'password':password, 'email':email, 'fullname':fullname
					, 'token': token, 'refererToken': refererToken, receive: receive}
				, 'POST', 
				{onSuccess: function(ret)	{
					subject.notifyEvent('UpdateUserStatus');
					if (obj.getInitParameters().type == 'home')
						obj.end();
					else
						obj.step3();
				},
				onFailure: function(msg, data)	{
					for(var i in data)	{
						var err = data[i];
						obj.handleRegisterError(err.type, err.msg);
					}
				}});
	},
	
	handleRegisterError: function(errType, errMsg)	{
		switch(errType)	{
		case "fullname":
			this.requestForEffectiveResource('NameError').html(errMsg);
			break;
		case "password":
			this.requestForEffectiveResource('PasswordError').html(errMsg);
			break;
		case "email":
			this.requestForEffectiveResource('EmailError').html(errMsg);
			break;
		case "token":
			this.requestForEffectiveResource('TokenError').html(errMsg);
			break;
		}
	},
	
	onLoginSuccess: function(eventData)	{
		if (eventData.type == 'Register')	{
			this.end();
		}
	},
	
	step3: function()	{
		this.getPortletPlaceholder().paintCanvas(this.renderView('ViewStep3', this.model));
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RenderExpertiseEditor', {placeholder:this.requestForEffectiveResource('ExpertisePlaceholder'), namespace:'RegisterPortlet'});
		subject.notifyEvent('RenderInterestEditor', {placeholder:this.requestForEffectiveResource('InterestPlaceholder'), namespace:'RegisterPortlet'});
	},
	
	onSkipExpertiseRegisterButtonClick: function(eventData)	{
		this.end();
	},
	
	onSubmitExpertiseRegisterButtonClick: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		var obj = this;
		this.submitComplete = 0;
		subject.notifyEvent('SubmitExpertiseForward', {callback: function()	{
			obj.expertiseSubmitted();
		}, namespace: this.name});
		subject.notifyEvent('SubmitInterestForward', {callback: function()	{
			obj.expertiseSubmitted();
		}, namespace: this.name});
	},
	
	expertiseSubmitted: function()	{
		this.submitComplete++;
		if (this.submitComplete >= 2)	{
			this.end();
		}
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	end: function()	{
		var request = new Request("UserAvatarEdit", null, {msg: 'reg_complete'});
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RequestRoute', request);
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface);