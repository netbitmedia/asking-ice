FeedbackListPortlet = StatsPortlet.extend({
	init: function()	{
		this.name = "FeedbackListPortlet";
		this.interval = 600000;
	},
	
	run: function()	{
		this.fetch();
		this.startInterval(this.interval, this.fetch);
	},
	
	fetch: function()	{
		var obj = this;
		obj.getPortletPlaceholder().paintCanvas(obj.render());
		this.onAjax('ajax', 'get-feedback-list', {}, 'GET', {
			'onSuccess': function(ret)	{
				var model = {};
				model.feedbacks = ret;
				obj.requestForEffectiveResource('ContentPlaceholder').html(obj.renderView('Content', model));
			}
		});
	}
}).implement(PortletInterface).implement(AjaxInterface).implement(RenderInterface).implement(IntervalTimerInterface);;