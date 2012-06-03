QuestionTypePortlet = Class.extend({
	
	init : function() {
		this.name = "QuestionTypePortlet";
	},

	run: function() {
		this.getPortletPlaceholder().paintCanvas(this.render());
		this.onReloadPage();
	},
	
	onReloadPage: function() {
		var param = this.getRequest().getParam('type');
		this.requestForEffectiveResource('Featured').removeClass('active');
		this.requestForEffectiveResource('Open').removeClass('active');
		this.requestForEffectiveResource('All').removeClass('active');
		this.requestForEffectiveResource('Feed').removeClass('active');
		
		if (SingletonFactory.getInstance(Page).pagename != "Home") {
			return;
		}
		
		switch (param) {
		case 'question-open':
			this.requestForEffectiveResource('Open').addClass('active');
			return;
		case 'question-best':
			this.requestForEffectiveResource('Featured').addClass('active');
			return;
		case 'question-all':
			this.requestForEffectiveResource('All').addClass('active');
			return;
		default:
			this.requestForEffectiveResource('Feed').addClass('active');
			return;
		}
	}
	
}).implement(RenderInterface).implement(PortletInterface);
