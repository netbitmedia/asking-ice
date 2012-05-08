StaticContentPortlet = Class.extend({
	init:function() {
		this.name = "StaticContentPortlet";
		this.ids = new Array("History", "AboutUs","ImportantScoreIntro","BKProfileUseAskingAPI","FromBKP", "AboutBKProfile", "VersionOfBKprofile","ArticleIntroduce", "RecoverError", "Tutorial", "Faq", "TermOfUse", "Privacy", "Architecture");
	},
	
	displayContent: function(){
		var request = this.getRequest();
		var id = request.getParam("page");
		for( var i=0; i<this.ids.length; i++ ){
			var res = this.requestForEffectiveResource(this.ids[i]);
			if(res != undefined && ! res.hasClass("doNotDisplay")){
				res.addClass("doNotDisplay");
			}
		}
		this.requestForEffectiveResource(id).removeClass("doNotDisplay");
	},
	
	onReloadPage: function(){
		this.displayContent();
	},
	
	run: function() {
		this.getPortletPlaceholder().drawToCanvas(this.render());
		this.displayContent();
	}
}).implement(RenderInterface).implement(PortletInterface);