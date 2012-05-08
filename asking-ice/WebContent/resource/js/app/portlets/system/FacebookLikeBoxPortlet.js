FacebookLikeBoxPortlet = Class.extend({
	init: function()	{
		this.name = "FacebookLikeBoxPortlet";
	},
	
	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
		(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) {return;}
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=251988771483162";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}
}).implement(PortletInterface).implement(RenderInterface);