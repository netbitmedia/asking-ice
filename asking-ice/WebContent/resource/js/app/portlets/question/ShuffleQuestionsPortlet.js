ShuffleQuestionsPortlet = Class.extend({
	init: function()	{
		this.name = "ShuffleQuestionsPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
		this.fetch();
	},
	
	onFetchShuffleQuestions: function() {
		this.fetch();
	},
	
	fetch: function()	{
		var obj = this;
		this.onAjax('question', 'get-shuffle-questions', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('Questions').html(obj.renderView('QuestionsTmpl', {user: ret}));
			}
		});
	},
	
	onReloadPage: function(){
		this.fetch();
	}
}).implement(PortletInterface).implement(AjaxInterface).implement(RenderInterface).implement(ObserverInterface);