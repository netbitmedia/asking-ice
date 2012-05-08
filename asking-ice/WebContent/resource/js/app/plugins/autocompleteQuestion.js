AutocompleteSearcherPlugin = Class.extend({
	init: function()	{
		this.name = "AutocompleteSearcherPlugin";
	},
	
	onChangeAutocompleteType: function(eventData)	{
		var type = eventData.type;
		var target = eventData.target;
		var subject = SingletonFactory.getInstance(Subject);
		
		if (type == 'person')
			subject.notifyEvent('AttachFocusDetection', {'target': $(target), 'defaultValue': 'Nhập vào từ khóa cho người bạn muốn tìm'});
		else
			subject.notifyEvent('AttachFocusDetection', {'target': $(target), 'defaultValue': 'Tìm kiếm trước khi đặt câu hỏi'});
		subject.notifyEvent('AttachAutocompleteEngine', eventData);
	},
	
	onAttachAutocompleteEngine: function(eventData)	{
		this.autocompleteEngine = SingletonFactory.getInstance(AutocompleteEngineFactory).build(eventData.type);
		$(eventData.target).autocomplete(this.autocompleteEngine);
	},
	
	onHtmlRendered: function()	{
		var selected = $("#SearcherPortlet-Select option:selected");
		var id = selected.attr('value');
		
		var subject = SingletonFactory.getInstance(Subject);
		if (id == 1)	{
			subject.notifyEvent('ChangeAutocompleteType', {type: 'person', target: $('#SearcherPortlet-Input')});
		} else {
			subject.notifyEvent('ChangeAutocompleteType', {type: 'question', target: $('#SearcherPortlet-Input')});
		}
		
		//add click handler to friends div
		$("#friends").click(function(){
			//focus 'to' field
			$("#SearcherPortlet-Input").focus();
		});
		
		//add live handler for clicks on remove links
		$(".remove", document.getElementById("friends")).live("click", function(){
			//remove current friend
			$(this).parent().remove();
			
			//correct 'to' field position
			if($("#friends span").length === 0) {
				$("#SearcherPortlet-Input").css("top", 0);
			}
		});
	}
}).implement(PluginInterface);

AutocompleteEngineFactory = Class.extend({
	build: function(type)	{
		if (type == 'person')	{
			return new PersonAutocomplete();
		} else if (type== 'question') {
			return new QuestionAutocomplete();
		} else {
			return new QuestionOnlyAutocomplete();
		}
	}
});

PersonAutocomplete = Class.extend({
	source: function(req, add){
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		$.getJSON(solrRoot+"/person/person", {wt:'json', rows: '10', q: req.term}, function(data) {
			data = data.response.docs;
			var suggestions = [];
			$.each(data, function(i, val){
				suggestions.push({label: val.full_name, value: val.profile_id, type: 'person', catchwords: val.expertise, avatar: val.avatar, ans: val.expertise_total_ans_count});
			});
			
			//pass array to callback
			add(suggestions);
		});
	},
	
	//define select handler
	select: function(e, ui) {
		onClickPerson(ui.item.id);
	},
	
	//define select handler
	change: function() {
		//prevent 'to' field being updated and correct position
		$("#toPerson").css("top", 2);
	}
});

QuestionAutocomplete = Class.extend({
	//define callback to format results
	source: function(req, add){
		//pass request to server
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		$.getJSON(solrRoot+"/autocomplete/autocomplete", {wt:'json', rows: '8', q: req.term}, function(data) {
			data = data.response.docs;
			//create array for response objects
			var suggestions = [];
			//process response
			$.each(data, function(i, val){
				if (val.catch_id != undefined)	{
					suggestions.push({label: val['catch'], value: val.catch_id, type: 'expertise', follow: val.catch_follow});	
				} else if (val.questionId != undefined){
					suggestions.push({label: val.question, value: val.questionId, type: 'question', catchwords: val.catchWords});
				}
			});
			
			var askMsg = req.term;
			suggestions.push({label: askMsg, value: askMsg, type: 'ask'});
			
			//pass array to callback
			add(suggestions);
		});
	},
	
	//define select handler
	select: function(e, ui) {
		//create formatted friend
		var friend = ui.item.value;
		if (ui.item.type === "expertise"){
			moveToTopic(ui.item.id);
		} else if (ui.item.type == 'ask') {
			makeQuestion(friend);
		} else {
			try {
				var tmp = $("a[question='"+escape(friend)+"']");
				moveToAQuestion(tmp.attr("question_id"));
			} catch (e) {
			}
		}
	},
	
	//define select handler
	change: function() {
		//prevent 'to' field being updated and correct position
		$("#SearcherPortlet-Input").css("top", 2);
	}
});

QuestionOnlyAutocomplete = Class.extend({
	//define callback to format results
	source: function(req, add){
		//pass request to server
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		$.getJSON(solrRoot+"/autocomplete/question", {wt:'json', rows: '5', q: req.term}, function(data) {
			data = data.response.docs;
			//create array for response objects
			var suggestions = [];
			//process response
			$.each(data, function(i, val){
				suggestions.push({label: val.question, value: val.questionId, type: 'question', catchwords: val.catchWords});
			});
			
			var askMsg = req.term;
			suggestions.push({label: askMsg, value: askMsg, type: 'ask'});
			
			//pass array to callback
			add(suggestions);
		});
	},
	
	//define select handler
	select: function(e, ui) {
		//create formatted friend
		var friend = ui.item.value;
		if (ui.item.type === "expertise"){
			moveToTopic(ui.item.id);
		} else if (ui.item.type == 'ask') {
			makeQuestion(friend);
		} else {
			try {
				var tmp = $("a[question='"+escape(friend)+"']");
				moveToAQuestion(tmp.attr("question_id"));
			} catch (e) {
			}
		}
	},
	
	//define select handler
	change: function() {
		//prevent 'to' field being updated and correct position
		$("#SearcherPortlet-Input").css("top", 2);
	}
});

function onClickPerson(id){
	var subject = SingletonFactory.getInstance(Subject);
    var request = new Request("Profile", undefined,{id: id});
    subject.notifyEvent('RequestRoute', request);
}

function moveToAQuestion(question_id){
	var qid = question_id;
	var subject = SingletonFactory.getInstance(Subject);
    var request = new Request("Question","donganh",{"qid":qid});
    subject.notifyEvent('RequestRoute', request);
}

function moveToTopic(id){
	var subject = SingletonFactory.getInstance(Subject);
    var request = new Request("Topic", undefined, {'id':id});
    subject.notifyEvent('RequestRoute', request);
}

function makeQuestion(ques){
	var subject = SingletonFactory.getInstance(Subject);
	subject.notifyEvent("MakeNewQuestion", {question: ques});
}