AutocompletePlugin = Class.extend({
	init: function()	{
		this.name = "AutocompletePlugin";
	},
	
	onNeedAutocomplete: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		var url = eventData.autocompleteSource;
		var obj = eventData.autocompleteObject;
		var type = eventData.type;
		if (type == undefined)	{
			type = 'Expertise';
		}
		
		if (eventData.fetchSourceCallback != undefined)
			subject.notifyEvent(eventData.fetchSourceCallback);
		$(obj).autocomplete({
			source: function(req, add){
				var term = $(obj).val();
				req.q = term;
				req.wt = 'json';
				$.getJSON(url, req, function(data) {
					var suggestions = [];
					data = data.response.docs;
					$.each(data, function(i, val){
						if (type == 'Expertise')
							suggestions.push({label:val['catch'], value:val.catch_id, type: 'expertise', follow: val.catch_follow});
						else if (type == 'Question')
							suggestions.push({label: val.question, value: val.questionId, type: 'question', catchwords: val.catchWords});
						else
							suggestions.push({label: val.full_name, value: val.profile_id, type: 'person', catchwords: val.expertise, avatar: val.avatar, ans: val.expertise_total_ans_count});
					});
					if (type == 'RecommendPerson')	{
						var askMsg = 'Không tìm thấy? Mời trả lời qua email';
						suggestions.push({label: askMsg, value: askMsg, type: 'email'});
					}
					add(suggestions);
				});
			},
			focus:  function(e,ui){
				if (eventData.focusCallback != undefined)
					subject.notifyEvent(eventData.focusCallback, {'ui':ui});
			},
			select: function(e,ui){
				if (eventData.selectCallback != undefined)
					subject.notifyEvent(eventData.selectCallback, {'ui':ui});
			},
			result: function(e, ui)	{
				if (eventData.resultCallback != undefined)
					subject.notifyEvent(eventData.resultCallback, {'ui':ui});
			}
		});
	}
}).implement(PluginInterface);