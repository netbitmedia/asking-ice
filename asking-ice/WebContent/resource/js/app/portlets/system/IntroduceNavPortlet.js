IntroduceNavPortlet = Class.extend({
	init:function() {
		this.name = "IntroduceNavPortlet";
	},
	
	onReloadPage: function(){
		this.run();
	},
	
	run: function() {
		this.getPortletPlaceholder().paintCanvas(this.render());
		//$('p[page="'+this.getRequest().getParam('page')+'"]').hide();
	}
}).implement(RenderInterface).implement(PortletInterface);