ExpertiseEditorPlugin = Class.extend({
	init: function()	{
		this.name = "ExpertiseEditorPlugin";
	},
	
	onSubmitExpertiseForward: function(eventData)	{
		var namespace = eventData.namespace;
		
		var expToSent = Array();
		var expcontainer = $('#'+namespace+'-ListExpertise .tokenContainer');
		$(expcontainer).find('label.lblToken').each(function(index, value)	{
			var id = $(value).attr('eid');
			expToSent.push(id);
		});
		
		var callback = eventData.callback;
		if (expToSent.length == 0)	{
			callback();
			return;
		}
		expToSent = expToSent.join(',');
		
		var subject = SingletonFactory.getInstance(Subject);
		this.onAjax('user-ajax', 'add-expertise', {'experts': expToSent}, 'POST', 
			{'onSuccess': function(ret)	{
				callback();
				$(expcontainer).html('');
				subject.notifyEvent('ExpertiseChanged');
			}
		});
	},
	
	onRenderExpertiseEditor: function(eventData)	{
		this.placeholder = eventData.placeholder;
		var namespace = eventData.namespace;
		$(this.placeholder).html(tmpl('ExpertiseSubplaceholder', {}));
		var expertiseMsg = 'Kinh nghiệm';
		var guideExpertiseMsg = 'Bạn nên nhập đầy đủ kinh nghiệm của mình để người khác có thể dễ dàng kết nối đến bạn hơn';
		$(this.placeholder).find('#ProfileExpertise').html(tmpl('ListContainer', {'id':'ListExpertise', 'name': 'expertise', 'keyword':expertiseMsg, 'namespace':namespace,'guideMsg':guideExpertiseMsg}));
		
		var addExpertiseInput = $(this.placeholder).find('[container="ListExpertise"] input.ui-autocomplete-input');
		
		//setup autocomplete
		var eventData = {};
		eventData.focusCallback = "RegisterAddExpertiseFocus";
		eventData.selectCallback = "RegisterAddExpertiseSelect";
		eventData.autocompleteObject = addExpertiseInput;
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		eventData.autocompleteSource = solrRoot+"/autocomplete/catch";
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('NeedAutocomplete', eventData);
	},
	
	onRegisterAddExpertiseFocus: function(eventData)	{
		var ui = eventData.ui;
		var addExpertiseInput = $(this.placeholder).find('[container="ListExpertise"] input.ui-autocomplete-input');
		$(addExpertiseInput).val(ui.item.label);
	},
	
	onRegisterAddExpertiseSelect: function(eventData)	{
		var ui = eventData.ui;
		var label = ui.item.label;
		var tmp = null;
		try {
			tmp = $("a[catch='"+escape(label)+"']");	
		} catch (e) {
			// TODO: handle exception
		}
		var value = tmp.attr("catch_id");
		var addExpertiseContainer = $(this.placeholder).find('[container="ListExpertise"] div.tokenContainer');
		var addExpertiseInput = $(this.placeholder).find('[container="ListExpertise"] input.ui-autocomplete-input');
		$(addExpertiseInput).val('');
		$(addExpertiseContainer).append(tmpl('TokenPartial', {'label':label, 'value':value}));
	}
}).implement(PluginInterface).implement(AjaxInterface);

InterestEditorPlugin = Class.extend({
	init: function()	{
		this.name = "InterestEditorPlugin";
	},
	
	onSubmitInterestForward: function(eventData)	{
		var namespace = eventData.namespace;
		
		var intToSent = Array();
		var intcontainer = $('#'+namespace+'-ListInterestedArea .tokenContainer');
		$(intcontainer).find('label.lblToken').each(function(index, value)	{
			var id = $(value).attr('eid');
			intToSent.push(id);
		});
		var callback = eventData.callback;
		if (intToSent.length == 0)	{
			callback();
			return;
		}
		intToSent = intToSent.join(',');
		
		var subject = SingletonFactory.getInstance(Subject);
		this.onAjax('user-ajax', 'add-expertise', {'interests': intToSent}, 'POST', 
			{'onSuccess': function(ret)	{
				callback();
				$(intcontainer).html('');
				subject.notifyEvent('InterestedAreaChanged');
			}
		});
	},
	
	onRenderInterestEditor: function(eventData)	{
		this.placeholder = eventData.placeholder;
		var namespace = eventData.namespace;
		$(this.placeholder).html(tmpl('ExpertiseSubplaceholder', {}));
		var followMsg = 'Lĩnh vực quan tâm';
		var guideFollowMsg = 'Bạn nên nhập lĩnh vực quan tâm để chúng tôi có thể dễ dàng gợi ý cho bạn những câu hỏi mà bạn quan tâm';
		$(this.placeholder).find('#ProfileFollow').html(tmpl('ListContainer', {'id':'ListInterestedArea','name': 'interested-area', 'keyword':followMsg, 'namespace':namespace,'guideMsg':guideFollowMsg}));
		
		var addInterestInput = $(this.placeholder).find('[container="ListInterestedArea"] input.ui-autocomplete-input');
		
		//setup autocomplete
		var eventData = {};
		eventData.focusCallback = "RegisterAddInterestFocus";
		eventData.selectCallback = "RegisterAddInterestSelect";
		eventData.autocompleteObject = addInterestInput;
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		eventData.autocompleteSource = solrRoot+"/autocomplete/catch";
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('NeedAutocomplete', eventData);
	},
	
	onRegisterAddInterestFocus: function(eventData)	{
		var ui = eventData.ui;
		var addInterestInput = $(this.placeholder).find('[container="ListInterestedArea"] input.ui-autocomplete-input');
		$(addInterestInput).val(ui.item.label);
	},
	
	onRegisterAddInterestSelect: function(eventData)	{
		var ui = eventData.ui;
		var label = ui.item.label;
		var value = ui.item.id;
		var addInterestContainer = $(this.placeholder).find('[container="ListInterestedArea"] div.tokenContainer');
		//var addInterestInput = $(this.placeholder).find('[container="ListInterestedArea"] input.ui-autocomplete-input');
		$(addInterestContainer).append(tmpl('TokenPartial', {'label':label, 'value':value}));
	}	
}).implement(PluginInterface).implement(AjaxInterface);

ExpertiseDeletePlugin = Class.extend({
	init: function()	{
		this.name = "ExpertiseDeletePlugin";
	},
	
	onHtmlUpdated: function(eventData)	{
		$('#effective-area .extension-point[extensionName="ExpertisePartial"]').each(function(index, value)	{
			if ($(value).find('[flag="ExpertiseDelete"]').length > 0)
				return;
			$(value).append('<span flag="ExpertiseDelete"></span>');
			var obj = {};
			obj.id = $(value).attr('extensionId');
			$(value).append(tmpl('ExpertiseDelete', obj));
		});
	},
	
	onExpertiseDeleteButtonClick: function(eventData)	{
		var target = eventData.target;
		var id = $(target).attr('eid');
		this.onAjax('user-ajax', 'remove-single-expertise', {'id':id}, 'POST', 
			{'onSuccess': function(ret)	{
				$(target).parents(".uiListItem:first").remove();
			},
			'onFailure': function(){
				$.facebox('Hiện thời hệ thống không thể xóa mục này. Bạn vui lòng thử lại sau');
			}
		});
	}
}).implement(PluginInterface).implement(AjaxInterface);

ExpertRankPlugin = Class.extend({
	init: function()	{
		this.name = "ExpertRankPlugin";
		this.getInfo();
	},
	
	getInfo: function(){
		var _this = this;
		var request = SingletonFactory.getInstance(Page).getRequest();
		var profileid = request.getParam('id');
		_this.onAjax('ajax','get-expert-rank-user',{'uid':profileid},'GET',{
			'onSuccess':function(ret){
				if(ret[0] != undefined){
					SingletonFactory.getInstance(Application).getSystemProperties().set("memcached.expertise", ret[0]);
				}
			}
		},true,300000);
	},
	
	render: function()	{
		$('#effective-area .extension-point[extensionName="expertisePartialLeft"]').each(function(index, value)	{
			if ($(value).find('.flag[flagName="expertiseRank"]').length > 0)
				return;
			var obj = {};
			obj.id = $(value).attr('extensionId');
			
			// solr query
			if(SingletonFactory.getInstance(Application).getSystemProperties().get("memcached.expertise") != undefined){
				var ret = SingletonFactory.getInstance(Application).getSystemProperties().get("memcached.expertise");
				if(ret['expert_rank_position_' + obj.id] != undefined){
					obj.rank = ret['expert_rank_position_' + obj.id];
					obj.expertRank = ret['expert_rank_percentage_' + obj.id];
					var objParam = {};
					objParam.er = obj.expertRank;
					objParam.total = 1000;
					obj.tips = tmpl("ExpertiseRankDescription",objParam);
					$(value).append($('<span class="flag" flagName="expertiseRank"></span>'));
					$(value).append("&nbsp;");
					$(value).append(tmpl('ExpertiseRank', obj));
				} else {
					obj.expertRank = 0;
				}
			} else {
				
			}
			
			
//			_this.onAjax('ajax', 'get-expert-rank-specific-user', {'uid':profileid, 'cid':obj.id}, 'GET', {
//				'onSuccess': function(ret)	{
//					if ($(value).find('.flag[flagName="expertiseRank"]').length > 0)
//						return;
//					
//					if(ret[0] != undefined && ret[0].expertRank != undefined){
//						obj.rank = ret[0].rank;
//						obj.expertRank = Math.round(10000 * ret[0].expertRank)/100;
//					} else {
//						obj.rank = "0";
//					}
//					var objParam = {};
//					objParam.er = obj.expertRank;
//					objParam.total = 1000;
//					obj.tips = tmpl("ExpertiseRankDescription",objParam);
//					$(value).append($('<span class="flag" flagName="expertiseRank"></span>'));
//					$(value).append("&nbsp;");
//					$(value).append(tmpl('ExpertiseRank', obj));
//				}
//			}, true, 300000);
		});
	},
	
	onReloadPlugin: function(eventData)	{
		var _this = this;
		var request = SingletonFactory.getInstance(Page).getRequest();
		var profileid = request.getParam('id');
		_this.onAjax('ajax','get-expert-rank-user',{'uid':profileid},'GET',{
			'onSuccess':function(ret){
				if(ret[0] != undefined){
					SingletonFactory.getInstance(Application).getSystemProperties().set("memcached.expertise", ret[0]);
				}
				this.render();
			}
		},true,300000);
	},
	
	onHtmlUpdated: function(eventData)	{
		this.render();
	}
}).implement(PluginInterface).implement(AjaxInterface);

ExpertiseEditPlugin = Class.extend({
	init: function()	{
		this.name = "ExpertiseEditPlugin";
	},
	
	onExpertiseEditableBlur: function(eventData)	{
		var target = eventData.target;
		var id = $(target).attr('eid');
		var oldhtml = $(target).attr('oldhtml');
		var explanation = $(target).val();
		if (explanation == undefined || explanation.trim() == '')	{
			explanation = oldhtml;
		}
		if (oldhtml != explanation)	{
			this.onAjax('user-ajax', 'update-single-expertise', {'id': id, 'explanation': explanation}, 'POST', {});
		}
		$(target).parent().html(explanation);
		$(target).removeClass('ui-editable-edit');
	},
	
	onExpertiseEditClick: function(event)	{
		var target = $(event.target);
		var container = $(target).parent().siblings('.topic-info');
		var oldhtml = $(container).html().trim();
		var id = $(target).attr('eid');
		$(container).addClass('ui-editable-edit');
		$(container).html('<input eid='+id+' oldhtml="'+oldhtml+'" onblur="generateEvent(&apos;ExpertiseEditableBlur&apos;, event)" type="text" class="text" value="'+oldhtml+'">');
		$(container).find('input').focus();
	},
	
	onHtmlUpdated: function(eventData)	{
		$('.extension-point[extensionName="ExpertiseExplanation"]').each(function(index, value)	{
			if ($(value).find('[flag="ExpertiseExplanationEdit"]').length > 0)
				return;
			$(value).append('<span flag="ExpertiseExplanationEdit"></span>');
			var obj = {};
			obj.id = $(value).attr('extensionId');
			
			$(value).append(tmpl('ExpertiseEdit', obj));
//			$(value).addClass('editableLabel');
//			$(value).bind('click', function(event)	{
//				var target = event.target;
//				var oldhtml = $(target).html().trim();
//				var id = $(target).attr('eid');
//				$(target).addClass('ui-editable-edit');
//				$(target).html('<input eid='+id+' oldhtml="'+oldhtml+'" onblur="generateEvent(&apos;ExpertiseEditableBlur&apos;, event)" type="text" value="'+oldhtml+'">');
//				$(target).find('input').focus();
//			});
		});
	}
}).implement(PluginInterface).implement(AjaxInterface);

InterestDeletePlugin = Class.extend({
	init: function()	{
		this.name = "InterestDeletePlugin";
	},
	
	onHtmlUpdated: function(eventData)	{
		$('#effective-area .extension-point[extensionName="InterestPartial"]').each(function(index, value)	{
			if ($(value).find('[flag="InterestDelete"]').length > 0)
				return;
			$(value).append('<span flag="InterestDelete"></span>');
			var obj = {};
			obj.id = $(value).attr('extensionId');
			$(value).append(tmpl('InterestDelete', obj));
		});
	},
	
	onInterestDeleteButtonClick: function(eventData)	{
		var target = eventData.target;
		var id = $(target).attr('eid');
		this.onAjax('user-ajax', 'remove-single-interest',
			{'id': id}, 'POST', {
				onSuccess: function(ret)	{
					$(target).parent().parent().remove();
				}
			});
	}
}).implement(PluginInterface).implement(AjaxInterface);