SameQuestionsPortlet = Class.extend({
	init: function()	{
		this.name = "SameQuestionsPortlet";
		this.questionID = null;
		this.start = 0;
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
	},
	
	onAjaxQueryFetched: function(eventData) {
		var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
		if (eventData.url == root+'/question/get-all-catchwords-question')	{
			var catches = Array();
			for(var i in eventData.result.data)	{
				catches.push(eventData.result.data[i].catchWordId);
			}
			this.catches = catches;
			this.fetch();
		}
	},
	
	fetch: function()	{
		var obj = this;
		var questionId = this.getRequest().getParam('qid');
		$.getJSON('/solr/knowledge/intopic?wt=json&rows=5', {q: this.catches.join(' ')}, function(ret) {
			obj.requestForEffectiveResource('QuestionsContainer').html(obj.renderView('QuestionsTmpl', {question: ret.response.docs, currentId: questionId}));
			if (ret.response.docs.length < 5)	{
				obj.requestForEffectiveResource('ViewMore').hide();
			}
		});
	},
	
	onViewMoreSameQuestions: function()	{
		var obj = this;
		this.start += 5;
		var questionId = this.getRequest().getParam('qid');
		$.getJSON('/solr/knowledge/intopic?wt=json&rows=5&start='+this.start, {q: this.catches.join(' ')}, function(ret) {
			if (ret.response.docs.length < 5)	{
				obj.requestForEffectiveResource('ViewMore').hide();
			}
			obj.requestForEffectiveResource('QuestionsContainer').append(obj.renderView('QuestionsTmpl', {question: ret.response.docs, currentId: questionId}));
		});
	},
	
	onReloadPage: function(){
		this.run();
	}
}).implement(PortletInterface).implement(AjaxInterface).implement(RenderInterface).implement(ObserverInterface);