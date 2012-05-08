/**
 * 
 */

ProfileImageCheckPlugin = Class.extend({
	init: function()	{
		this.name = "ProfileImageCheckPlugin";
	},
	
	onHtmlRendered: function(eventData)	{
		this.render();
	},
	
	onHtmlUpdated: function(eventData)	{
		this.render();
	},
	
	onFixBrokenImage: function(eventData){
		this.render();
	},
	
	render: function(eventData)	{
			$("img.bkp_pic_profile").error(
				function() {
					$(this).attr("src", "resource/images/unknown.png");
				});
	},
	
	onRequestProfileImageCheck: function(eventData){
		var zone = eventData.zone;
		$(zone).find("img.bkp_pic_profile").error(
			function() {
				$(this).attr("src", "resource/images/unknown.png");
		});
	}
}).implement(PluginInterface);
