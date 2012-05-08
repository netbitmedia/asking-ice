PartnerBasicInfoPortlet = Class.extend({
	init: function()	{
		this.name = "PartnerBasicInfoPortlet";
		this.registerObserver();
	},
	
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
		this.fetch();
	},
	
	fetch: function()	{
		var obj = this;
		var id = this.getRequest().getParam('id');
		this.onAjax('ajax','get-partner-intro',{'id':id},'POST', {
			'onSuccess': function(ret){
				var tblName = "partner";
				var tmplType = 'IntroductionTmpl';
				var tid = ret['id'];
				obj.encapData(ret, tblName, tid, id);
				obj.requestForEffectiveResource('Introduction').html(obj.renderView(tmplType,{partner:ret}));
				obj.design(obj.requestForEffectiveResource('Introduction'));
				var properties = SingletonFactory.getInstance(Application).getSystemProperties();
				var userID = properties.get('user.id',undefined);
				if (id == userID){
					obj.requestForEffectiveResource('Introduction').find("span.dynamic-edit-selection").show();
				} else{
					obj.requestForEffectiveResource('Introduction').find("span.dynamic-edit-selection").hide();
				}
				obj.requestForEffectiveResource('Introduction').find(".dynamic-edit-editable").hide();
			}
		});
	},
	
	onDynamicEditViewButtonClick: function(eventData)	{
		this.requestForEffectiveResource('Introduction').find(".dynamic-edit-editable").hide();
	},
	
	onDynamicEditEditButtonClick: function(eventData)	{
		this.requestForEffectiveResource('Introduction').find(".dynamic-edit-editable").show();
	},
	
	onDynamicEditSaveButtonClick: function(eventData)	{
		var obj = this;
		var e = $(eventData.target).siblings("input");
		var key = e.attr("name");
		var id = e.attr("tid");
		var tbl = e.attr("tbl");
		var value = e.val();
		var json=[{'key':key, 'tbl':tbl, 'id':id, 'val': value}];
		this.onAjax('ajax', 'dynamic-update-profile', 
			{'data':json}
			, 'POST', 
			{onSuccess: function(ret)	{
				var form = e.parent(".dynamic-edit-form");
				var label = form.siblings(".dynamic-edit-content");
				label.find(".dynamic-edit-content-value").html($.trim(e.val()));
				label.show();
				form.hide();
				form.parents(".row").find("input").attr("tid",ret[0]);
				form.parents(".row").find(".dynamic-edit-new-hide-first").show();
			},
			onFailure: function(message)	{
				alert("Fail");
		}});
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(InlineEditorInterface).implement(ObserverInterface);