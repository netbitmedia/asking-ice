NewsInsertPortlet = Class.extend({
	init: function()	{
		this.name = "NewsInsertPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
		this.fetch();
	},
	
	fetch: function() {
		var obj = this;
		var id = this.getRequest().getParam('id');
		this.onAjax('ajax','get-partner-news',{'id':id},'POST', {
			'onSuccess': function(ret){
				var tblName = "partnerNews";
				var tmplType = 'NewsTmpl';
				// var x = {};
				// x.title="Điền tựa đề vào đây";
				// x.image="http://www.surfinginfuerteventura.com/wp-content/uploads/2011/06/advertise-here.gif";
				// x.content="Điền nội dung tóm tắt vào đây";
				// x.url="http://www.google.com.vn";
				// ret[ret.length] = x;
				var tmp = obj.requestForEffectiveResource('News');
				for (var i = 0; i<ret.length; i++){
					var tid = ret[i]['id'];
					ret[i].isNew=0;
					ret[i].tbl=tblName;
					obj.encapData(ret[i], tblName, tid, id);
					tmp.append(obj.renderView(tmplType,{news:ret[i]}));
				}
				obj.design(obj.requestForEffectiveResource('News'));
				var properties = SingletonFactory.getInstance(Application).getSystemProperties();
				var userID = properties.get('user.id',undefined);
				if (id === userID){
					obj.requestForEffectiveResource('News').find("span.dynamic-edit-selection").show();
				} else{
					obj.requestForEffectiveResource('News').find("span.dynamic-edit-selection").hide();
				}
				obj.requestForEffectiveResource('News').find(".dynamic-edit-editable").hide();
				
				//for hidden text suggestion
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('AttachFocusDetection', {'target': obj.requestForEffectiveResource('News').find("[name='title']"), 'defaultValue': 'Nhập vào tựa đề tin tức'});
				subject.notifyEvent('AttachFocusDetection', {'target': obj.requestForEffectiveResource('News').find("[name='content']"), 'defaultValue': 'Nhập vào tóm tắt tin tức'});
				subject.notifyEvent('AttachFocusDetection', {'target': obj.requestForEffectiveResource('News').find("[name='url']"), 'defaultValue': 'Nhập vào đường dẫn tới tin tức'});
				subject.notifyEvent('AttachFocusDetection', {'target': obj.requestForEffectiveResource('News').find("[name='title_new']"), 'defaultValue': 'Nhập vào tựa đề tin tức mới'});
			}
		});
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
			, 'GET', 
			{onSuccess: function(ret)	{
				var form = e.parent(".dynamic-edit-form");
				var label = form.siblings(".dynamic-edit-content");
				label.find(".dynamic-edit-content-value").text($.trim(e.val()));
				label.show();
				form.hide();
				form.parents(".row").find("input").attr("tid",ret[0]);
				form.parents(".row").find("div.uploader").find("input").attr("value",ret[0]);
				form.parents(".row").find(".dynamic-edit-new-hide-first").show();
				// obj.design(obj.requestForEffectiveResource('News'));
			},
			onFailure: function(message)	{
				alert("Fail");
		}});
	},
	
	onDynamicEditCommitButtonClick: function(eventData)	{
		var obj = this;
		var json = [];
		var e = this.requestForEffectiveResource("News").find(".dynamic-edit-form:visible input");
		var i = 0;
		e.each(function() {
			var key = $(this).attr("name");
			var id = $(this).attr("tid");
			var tbl = $(this).attr("tbl");
			var value = $(this).val();
			json[i++]={'key':key, 'tbl':tbl, 'id':id, 'val': value};
		});
		
		this.onAjax('ajax', 'dynamic-edit-commit', 
			{'data':json}
			, 'GET', 
			{onSuccess: function(ret)	{
				alert("Success");
				e.each(function (){
					var form = $(this).parent(".dynamic-edit-form");
					var label = form.siblings(".dynamic-edit-content");
					label.find(".dynamic-edit-content-value").text($.trim(this.value));
					label.show();
					form.hide();
				});
			},
			onFailure: function(message)	{
				alert("Fail");
		}});
	},
	
	onChangeNewsImage: function(eventData)	{
		var target = eventData.e.target;
		var form = $(target).parent();
		var tmp = form.submit();
		var id = $(target).attr("tid");
		var obj = this;
		var getImageAjax = function ()	{
			obj.onAjax('ajax', 'get-news-image', 
				{'id':id}
				, 'GET', 
				{onSuccess: function(ret)	{
					form.parent().siblings("a").find("img").attr("src", ret);
				},
				onFailure: function(message)	{
					alert("Fail");
			}});
		};
		setTimeout(getImageAjax,200);
	},
	
	onDyanmicEditDeleteButtonClick: function(eventData)	{
		var ok = confirm("Bạn chắc muốn xóa chứ?'");
		if (ok)	{
			var obj = $(eventData.target);
			var row = obj.parents("div.row").hide();
			var tid = "";
			var tbl = "";
			row.find("input[tid]").each(function(){
				if(tid === "") {
					tid = $(this).attr("tid");
					tbl = $(this).attr("tbl");
				}
			});
			json = [];
			json[0]={'tbl':tbl, 'id':tid};
			this.onAjax('ajax', 'dynamic-delete-profile', 
			{'data':json}
			, 'GET', 
			{onSuccess: function(ret)	{
				alert("Xóa thành công!")
			},
			onFailure: function(message)	{
				alert("Có lỗi xảy ra khi xóa");
			}});
		}		
	},
	
	saveRows: function(e, func){
		var key = e.attr("name");
		if (key === "title_new"){
			key = "title";
		}
		var id = e.attr("tid");
		// var tbl = e.attr("tbl");
		// var fatherID = e.attr("fatherID");
		var fatherID = e.parents("[profileExtension]").attr("fatherID");
		var tbl = e.parents("[profileExtension]").attr("tbl");
		var value = e.val();
		var json=[{'key':key, 'tbl':tbl, 'id':id, 'val':value, 'fatherID':fatherID}];
		this.onAjax('ajax', 'dynamic-update-profile', 
			{'data':json}
			, 'GET', 
			{onSuccess: function(ret)	{
				var form = e.parent(".dynamic-edit-form");
				var label = form.siblings(".dynamic-edit-content");
				label.find(".dynamic-edit-content-value").text($.trim(e.val()));
				label.show();
				form.hide();
				form.parents(".row").find("input").attr("tid",ret[0]);
				form.parents(".row").find("div.uploader").find("input").attr("value",ret[0]);
				form.parents(".row").find(".dynamic-edit-new-hide-first").show();
				// obj.design(obj.requestForEffectiveResource('News'));
				if (func != null){
					func.call(this, ret[0]);
				}
			},
			onFailure: function(message)	{
				alert("Fail");
		}});
	},
	
	onAddNewItem: function(eventData){
		var tar = eventData.target;
		var e = eventData;
		var obj = this;
		if(e.which == 13){
			obj.saveRows($(e.target), function (id){
				var fid = $(e.target).parents("[profileExtension]").attr("fatherID");
				var lev = $(e.target).parents("[profileExtension]").attr("level");
				var tbl = $(e.target).parents("[profileExtension]").attr("tbl");
				var tm = $(e.target).parents("[profileExtension]").attr("tmpl");
				var ret = {title:e.target.value, isNew:1, fatherID:fid, level: lev, tbl: tbl, id: id};
				obj.encapData(ret, tbl, id, e.target.level);
				$(e.target).after(obj.renderView(tm, {news: ret}));
				obj.design($(e.target).parent());
				$(e.target).val("");
			});
		}
	},
	
	onDynamicEditAddButtonClick2: function(eventData)	{
		var obj = this;
		var oldLast = this.requestForEffectiveResource('News').find(".dynamic-edit-main .row:last");
		var newLast = oldLast.clone();
		oldLast.find(".dynamic-edit-new-hide-first").hide();
		oldLast = oldLast.show()[0];
		this.requestForEffectiveResource('News').find(".dynamic-edit-main").append(newLast);
		this.design($(oldLast));
	},
	
	onDynamicEditAddButtonClick: function(eventData)	{
		var obj = this;
		var profileExtensionName = "news";
		var tmplType = "NewsTmpl";
		var tmp = "[profileExtension='"+profileExtensionName+"']";
		var profileExtension = $(obj.requestForEffectiveResource('News')).find(tmp);
		tmp = {partner: {fatherID: {val: eventData.fatherID}, tbl: {val: eventData.tbl}, isNew: {val: 1}}};
		profileExtension.append(obj.renderView(tmplType, tmp));
		obj.design(obj.requestForEffectiveResource('News'));
	},
	
	onDynamicEditViewButtonClick: function(eventData)	{
		this.requestForEffectiveResource('News').find(".dynamic-edit-editable").hide();
	},
	
	onDynamicEditEditButtonClick: function(eventData)	{
		this.requestForEffectiveResource('News').find(".dynamic-edit-editable").show();
	},
	
	onEnd: function(){
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface).implement(InlineEditorInterface);