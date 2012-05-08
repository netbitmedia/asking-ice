AnnouncementPortlet = Class.extend({
	init: function()	{
		this.name = "AnnouncementPortlet";
	},
	
	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
		//this.onGetAnnouncement();
		//this.startInterval(300*1000, this.onGetAnnouncement);
	},

	onGetAnnouncement: function()	{
//		var obj = this;
//		this.onAjax('ajax', 'get-announcement', {}, 'GET', {
//			'onSuccess': function(ret)	{
//				if (ret == undefined || ret == "")
//					return;
//				obj.requestForEffectiveResource('AnnouncementContent').html(ret);
//			}
//		});
	},
	
	onEnd: function()	{
		this.stopInterval();
	}
}).implement(PortletInterface).implement(IntervalTimerInterface).implement(AjaxInterface).implement(RenderInterface);