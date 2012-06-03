ExpertsPortlet = Class.extend({
	init: function()	{
		this.name = "ExpertsPortlet";
		this.pos = 0;
	},
	
	onBegin: function()	{
		this.model = {};
	},
	
	run: function()	{
		var obj = this;
		this.onAjax('ajax', 'get-experts', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.model = {users: ret};
				obj.getPortletPlaceholder().paintCanvas(obj.render());
				obj.startInterval(6000, obj.slideUsers);
			}
		});
	},
	
	slideUsers: function() {
		var e = this.requestForEffectiveResource('Experts').find('ul.box_list');
		var total = e.children().length;
		this.pos -= 5;
		if (-this.pos >= total)
			this.pos = 0;
		e.animate({'margin-top': this.pos*23}, 1500);
	},
	
	onEnd: function() {
		this.stopInterval();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(IntervalTimerInterface);