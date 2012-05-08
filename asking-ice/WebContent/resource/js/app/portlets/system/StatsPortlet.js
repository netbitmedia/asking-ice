StatsPortlet = Class.extend({
	init: function()	{
		this.name = "StatsPortlet";
	},
	
	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
		this.fetch();
	},
	
	fetch: function()	{
		var obj = this;
		this.onAjax('ajax', 'count-stats', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('UserTotal').html(ret.user);
				obj.requestForEffectiveResource('QuestionTotal').html(ret.question);
				obj.requestForEffectiveResource('AnswerTotal').html(ret.answer);
				obj.requestForEffectiveResource('CatchwordTotal').html(ret.catchword);
			}
		});
	},
	
	onEnd: function()	{
	}
}).implement(PortletInterface).implement(AjaxInterface).implement(RenderInterface);