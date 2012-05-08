SimilarQuestionsPortlet = Class.extend({
	init: function()	{
		this.name = "SimilarQuestionsPortlet";
		this.questionID = null;
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	},
	
	run: function()	{
		this.questionID = this.getRequest().getParam('qid');
		this.getPortletPlaceholder().paintCanvas(this.render());
		this.fetch();
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('AttachFocusDetection', {target: this.requestForEffectiveResource('AddQuestionInputBox'), defaultValue: 'Nhập câu hỏi tương tự'});
		
		var AddQuestionInputBox = this.requestForEffectiveResource("AddQuestionInputBox");
		var eventData = {};
		eventData.selectCallback = "SimilarQuestionSelect";
		eventData.autocompleteObject = AddQuestionInputBox;
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		eventData.autocompleteSource = solrRoot+"/autocomplete/question";
		eventData.type = "Question";
		subject.notifyEvent('NeedAutocomplete', eventData);
	},
	
	onRemoveSimilarQuestion: function(event)	{
		$(event.target).parent().remove();
	},
	
	onSimilarQuestionsButtonClick: function()	{
		var ids = Array();
		this.requestForEffectiveResource('AttachQuestions').find('[qid]').each(function() {
			ids.push($(this).attr('qid'));
		});
		
		if (ids.length != 0)	{
			var obj = this;
			this.onAjax('question', 'attach-similar-questions', {ids: ids.join(','), id: this.questionID}, 'post', {
				onSuccess: function()	{
					obj.run();
				}
			});
		} else {
			this.requestForEffectiveResource('SimilarQuestions').show();
			this.requestForEffectiveResource('AttachQuestions').hide();
		}
	},
	
	onSimilarQuestionSelect: function(eventData) {
		var ui = eventData.ui;
		var txt = ui.item.label;
		var value = ui.item.id;
		var topicContainer = this.requestForEffectiveResource("AddQuestionContainer");
		
		$(topicContainer).append(this.renderView('QuestionTmpl', {id: value, label: txt}));
	},
	
	fetch: function()	{
		var obj = this;
		this.onAjax('question', 'get-similar-questions', {qid: obj.questionID}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('SimilarQuestions').html(obj.renderView('SimilarQuestionsTmpl', {user: ret}));
			}
		});
	},
	
	onViewAllSimilarQuestions: function()	{
		var obj = this;
		this.onAjax('question', 'get-similar-questions', {qid: obj.questionID, all: 1}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('SimilarQuestions').html(obj.renderView('SimilarQuestionsTmpl', {user: ret}));
				obj.requestForEffectiveResource('ViewMore').remove();
			}
		});
	},
	
	onAttachSimilarQuestions: function()	{
		this.requestForEffectiveResource('SimilarQuestions').hide();
		this.requestForEffectiveResource('AttachQuestions').show();
	},
	
	onReloadPage: function(){
		this.run();
	}
}).implement(PortletInterface).implement(AjaxInterface).implement(RenderInterface).implement(ObserverInterface);