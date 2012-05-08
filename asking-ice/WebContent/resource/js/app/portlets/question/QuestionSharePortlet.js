QuestionSharePortlet = Class.extend({
	init: function()	{
		this.name = "QuestionSharePortlet";
		this.usingFacebox = false;
		
		this.answers = null;
		this.question = null;
		
		this.questionID = null;
		this.linkQuestion = null;
		this.strQuestionTitle = null;
		this.linkAction = null;
		this.avatarAsker = null;
		this.strCaption = 'asking.vn';
		this.strDefaultMessage = '';
		this.strActionName = null;
		this.strDesciption = null;

		this.root = SingletonFactory.getInstance(Application).getSystemProperties().get("host.root");
		
    	window.fbAsyncInit = function() {
		    FB.init({appId: '192257437556427', status: true, cookie: true, xfbml: false});
    	};
	},
	
	requestForEffectiveResource: function(targetName){
		if(this.usingFacebox){
			return $("#"+this.name+"-"+targetName);
		}else{
			return this._super.requestForEffectiveResource(targetName);
		}
	},
	
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	onAjaxQueryFetched: function(eventData) {
		var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
		if (eventData.url == root+'/question/get-question-detail')	{
			this.question = eventData.result.data;
		} else if (eventData.url == root+'/question/get-answers')	{
			this.answers = eventData.result.data;
		}
	},
	
	onShareFacebook: function(eventData)	{
		this.questionID = this.getRequest().getParam('qid');
		
		var loggedIn = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		if (loggedIn != 1)	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent("NeedLogin", {type: 'ShareFacebook', event: eventData});
		} else {
			this.publishSharing();
		}	
	},
	
	onLoginSuccess: function(eventData)	{
		if (eventData.type != 'ShareFacebook')
			return;
		this.publishSharing();
	},
	
	publishSharing: function() {
		this.buildContent();
		this.startShare();
	},
	
	buildContent: function(){		
		var count=0;
		if(this.question.avatar == undefined || this.question.avatar == ""){ //assign default avatar of bkprofile
			this.avatarAsker = "http://asking.vn/resource/images/home/bee24.png";
		}else{
			this.avatarAsker = "http://asking.vn/resource/avatar/" + this.question.avatar;	
		}
		this.strQuestionTitle = this.question.title;
		this.linkAction = "http://asking.vn/#!page/Question/qid/" + this.questionID;
		
		for ( var key in this.answers){count++;} //get length of answers.
		var max = -1;
		for ( var key in this.answers){
			var curObj = this.answers[key];
			if (curObj['vote'] > max)	{
				this.strDescription = "Trả lời tốt nhất: " + $('<div>'+curObj['content']+'</div>').text();
				max = curObj.vote;
			}
		}
		if (count == 0){
			this.strActionName = 'Trả lời câu hỏi';
			this.strDescription = this.question.content.trim().replace(/\\n/g, '<br />');
		} else {
			this.strActionName = count+' trả lời';
		}
		return;
	},
	
	startShare: function() {
		var curPlt = this;
		 FB.ui(
		   {
		     method: 'feed',
		     name: this.strQuestionTitle,
		     link: 'http://asking.vn#!page/Question/qid/'+this.questionID,
		     picture: this.avatarAsker,
		     caption: this.strCaption,
		     description: this.strDescription,
		     message: this.strDefaultMessage,
		     actions: [
    			{ name: this.strActionName, link: this.linkAction }
  			 ],
		   },
		   function(response) {
		     if (response && response.post_id) {
		       var sbj = SingletonFactory.getInstance(Subject);
		       /*curPlt.onAjax('question', 'add-share-facebook', {'question_id': curPlt.questionID, 'session_id': response.post_id}, 'POST', 
				{'onSuccess': function(ret)	{
					var sbj = SingletonFactory.getInstance(Subject);
					sbj.notifyEvent("NotifyGlobal", curPlt.getLocalizedText("SetDataSuccess"));
				},
				'onFailure': function(message)	{
					var sbj = SingletonFactory.getInstance(Subject);
					sbj.notifyEvent("NotifyGlobal", curPlt.getLocalizedText("SetDataFailure"));
				}
				});*/    
			   sbj.notifyEvent("NotifyGlobal", "Bạn đã chia sẻ câu hỏi trên Facebook thành công");
		     }
		   }
 		);
	},

	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
		var e = document.createElement('script'); e.async = true;
	    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
	    $("#fb-root").append(e);
	},
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);