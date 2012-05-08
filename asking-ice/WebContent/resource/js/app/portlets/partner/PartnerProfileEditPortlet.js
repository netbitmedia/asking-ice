PartnerProfileEditPortlet = Class.extend({
	
	init: function()	{
		this.name = "PartnerProfileEditPortlet";
	},
		
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	onCancelUpdateProfile: function(target) {
		var p = $(target).parent();
		p.hide();
		p.siblings('.edit_content').show();
		p.siblings('.edit-note').show();
	},
	
	onUpdateProfile: function(data) {
		var obj = this;
		this.onAjax('user-ajax', 'update-profile', {field: data.field, value: data.value}, 'get', {
			onSuccess: function(ret) {
				var p = $(data.target).parent();
				if (data.show) return;
				p.hide();
				p.siblings('.edit_content').show();
				p.siblings('.edit-note').show();
				p.siblings('.edit_content').html(data.value);
			},
			onFailure: function(msg) {
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('NotifyError', msg);
			}
		});
	},

	run: function()	{
		var obj = this;
		this.onAjax('ajax', 'get-profile-info', {}, 'GET', {
			'onSuccess': function(ret)	{
				if (ret == undefined) ret = {};
				obj.model = {result: ret};
				obj.getPortletPlaceholder().paintCanvas(obj.render());
				$('input[value="'+ret.gender+'"]').attr('checked', 'checked');
				$('.edit-note').click(function() {
					$(this).siblings('.edit_content').hide();
					$(this).hide();
					$(this).siblings('.edit_placeholder').show();
				});
//				var tmplType = "partnerTmpl2";
//				var tblName = "";
//				if(ret.type === "person"){
//					tmplType = 'ProfileUserTmpl';
//					tblName = "person";
//				};
//				if (ret.type === "partner"){
//					tmplType = 'PartnerTmpl';
//					tblName = "partner";
//				};
//				var id = ret['primary_bind'];
//				obj.dynamicRender(ret, tblName, id, tmplType, 'profile', null, 1);
//				obj.design(obj.requestForEffectiveResource('Profile'));
//				var x =  obj.requestForEffectiveResource('Profile').find(".dynamic-edit-main .row:last");
//				x.show();
//				
//				//for hidden suggestion
//				var subject = SingletonFactory.getInstance(Subject);
//				subject.notifyEvent('AttachFocusDetection', {'target': obj.requestForEffectiveResource('Profile').find("[profileExtension='school']").children(".dynamic-edit-form-add-item"), 'defaultValue': 'Thêm trường mới rồi ấn enter'});
//				subject.notifyEvent('AttachFocusDetection', {'target': obj.requestForEffectiveResource('Profile').find("[profileExtension='class']").children(".dynamic-edit-form-add-item"), 'defaultValue': 'Thêm lớp mới rồi ấn enter'});
//				subject.notifyEvent('AttachFocusDetection', {'target': obj.requestForEffectiveResource('Profile').find("[profileExtension='project']").children(".dynamic-edit-form-add-item"), 'defaultValue': 'Thêm công ty mới rồi ấn enter'});
//				
//				//for date picker
//				// $('input.date_picker').datepicker( $.datepicker.regional[ "fr" ] );
//				$('input.date_picker').datepicker({
//					changeMonth: true,
//					changeYear: true,
//					yearRange: "-50:+0"
//				});
//				$('input.date_picker').datepicker( "option", "dateFormat", "dd/mm/yy");
			},
		});
	},
	
//	upperCaseFirstLetter: function(x){
//		return x.substring(0,1).toUpperCase() + x.substring(1);
//	},
//	
//	dynamicRender: function(ret, tblName, id, tmplType, profileExtensionName, fatherID, level){
//		obj = this;
//		obj.encapData(ret, tblName, id, level);
//		var tmp = "[profileExtension='"+profileExtensionName+"']:last";
//		var profileExtension = $(obj.requestForEffectiveResource('Profile')).find(tmp);
//		profileExtension.append(obj.renderView(tmplType, {partner: ret}));
//		for (var j in ret){
//			if ((typeof ret[j].val) === "object"){
//				var x = j;
//				var fatherID2 = ret[j].id;
//				ret[x] = ret[x]['val'];
//				for (var i in ret[x]){
//					var id2 = ret[x][i]['id'];
//					var tblName2 = "profileDetailed" + obj.upperCaseFirstLetter(x);
//					var ret2 = ret[x][i];
//					ret2.fatherID=fatherID2;
//					ret2.tbl=tblName2;
//					ret2.isNew=0;
//					ret2.level=level;
//					var tmplType2 = obj.upperCaseFirstLetter(x)+"Tmpl";
//					var profileExtensionName2 = x;
//					this.dynamicRender(ret2, tblName2, id2, tmplType2, profileExtensionName2, fatherID2, level+2);
//					// obj.encapData(ret[x][i], "profileDetailed" + obj.upperCaseFirstLetter(x) , id);
//					// var html = tmpl("MockupPartnerProfileEditPortlet-"+obj.upperCaseFirstLetter(x)+"Tmpl",{partner: ret[x][i]});
//					// $("#MockupPartnerProfileEditPortlet-"+obj.upperCaseFirstLetter(x)+"s").append(html);
//				}
//			}
//		}
//	},
//	
//	onDynamicEditSaveButtonClick: function(eventData)	{
//		var obj = this;
//		var e = $(eventData.target).siblings("input");
//		this.saveRows(e);
//		// var key = e.attr("name");
//		// var id = e.attr("tid");
//		// var tbl = e.attr("tbl");
//		// var fatherID = e.attr("fatherID");
//		// var value = e.val();
//		// var json=[{'key':key, 'tbl':tbl, 'id':id, 'val': value, 'fatherID': fatherID}];
//		// this.onAjax('ajax', 'dynamic-update-profile', 
//			// {'data':json}
//			// , 'GET', 
//			// {onSuccess: function(ret)	{
//				// var form = e.parent(".dynamic-edit-form");
//				// var label = form.siblings(".dynamic-edit-content");
//				// label.find(".dynamic-edit-content-value").text($.trim(e.val()));
//				// label.show();
//				// form.hide();
//				// form.parents(".row").find("input").attr("tid",ret[0]);
//				// form.parents(".row").find("div.uploader").find("input").attr("value",ret[0]);
//				// form.parents(".row").find(".dynamic-edit-new-hide-first").show();
//				// // obj.design(obj.requestForEffectiveResource('News'));
//			// },
//			// onFailure: function(message)	{
//				// alert("Fail");
//		// }});
//	},
//	
//	saveRows: function(e, func){
//		var key = e.attr("name");
//		var id = e.attr("tid");
//		// var tbl = e.attr("tbl");
//		// var fatherID = e.attr("fatherID");
//		var fatherID = e.parents("[profileExtension]").attr("fatherID");
//		var tbl = e.parents("[profileExtension]").attr("tbl");
//		var value = e.val();
//		var json=[{'key':key, 'tbl':tbl, 'id':id, 'val':value, 'fatherID':fatherID}];
//		this.onAjax('ajax', 'dynamic-update-profile', 
//			{'data':json}
//			, 'GET', 
//			{onSuccess: function(ret)	{
//				var form = e.parent(".dynamic-edit-form");
//				var label = form.siblings(".dynamic-edit-content");
//				label.find(".dynamic-edit-content-value").text($.trim(e.val()));
//				label.show();
//				form.hide();
//				form.parents(".row").find("input").attr("tid",ret[0]);
//				form.parents(".row").find("div.uploader").find("input").attr("value",ret[0]);
//				form.parents(".row").find(".dynamic-edit-new-hide-first").show();
//				// obj.design(obj.requestForEffectiveResource('News'));
//				if (func != null){
//					func.call(this, ret[0]);
//				}
//			},
//			onFailure: function(message)	{
//				alert("Fail");
//		}});
//	},
//	
//	onDynamicEditAddButtonClick: function(eventData)	{
//		var obj = this;
//		var profileExtensionName = "school";
//		var tmplType = "ClassTmpl";
//		var tmp = "[profileExtension='"+profileExtensionName+"']:last";
//		var profileExtension = $(obj.requestForEffectiveResource('Profile')).find(tmp);
//		tmp = {partner: {fatherID: {val: eventData.fatherID}, tbl: {val: eventData.tbl}, isNew: {val: 1}}};
//		profileExtension.append(obj.renderView(tmplType, tmp));
//		obj.design(obj.requestForEffectiveResource('Profile'));
//	},
//	
//	onMockupUpdateProfileButtonClick: function(eventData)	{
//		var obj = this;
//		var json = [];
//		var e = this.requestForEffectiveResource('FormMain');
//		var i = 0;
//		e.find("span.edit-profile-form:visible input").each(function() {
//			var key = $(this).attr("name");
//			var id = $(this).attr("tid");
//			var tbl = $(this).attr("tbl");
//			var value = $(this).val();
//			json[i++]={'key':key, 'tbl':tbl, 'id':id, 'val': value};
//		});
//		
//		this.onAjax('ajax', 'dynamic-update-profile', 
//			{'data':json}
//			, 'GET', 
//			{onSuccess: function(ret)	{
//				alert("Success");
//				var lb = obj.requestForEffectiveResource('FormMain').find("span.edit-profile-label");
//				var form = obj.requestForEffectiveResource('FormMain').find("span.edit-profile-form");
//				var tmp = form.find("input:visible").each(function (){
//					var lb = $(this).parent("span.edit-profile-form").siblings("span.edit-profile-label");
//					var val = lb.find("span.edit-profile-label-value");
//					val.text($.trim(this.value));
//					lb.show();
//				});
//				form.hide();
//			},
//			onFailure: function(message)	{
//				alert("Fail");
//		}});
//			
//	},
//	
//	addNewItem: function(tar){
//		var obj = this;
//		tar.find(".dynamic-edit-form-add-item").keypress(function(e){
//			if(e.which == 13){
//				obj.saveRows($(e.target), function (id){
//					var fid = $(e.target).attr("fatherID");
//					var lev = $(e.target).attr("level");
//					var tbl = $(e.target).attr("tbl");
//					var tm = $(e.target).attr("tmpl");
//					var ret = {name:e.target.value, isNew:1, fatherID:fid, level: lev, tbl: tbl, id: id};
//					obj.encapData(ret, tbl, id, e.target.level);
//					$(e.target).after(obj.renderView(tm, {partner: ret}));
//					obj.design($(e.target).parent());
//					$(e.target).val("");
//				});
//			}
//		});
//	},
//	
//	onDyanmicEditDeleteButtonClick: function(eventData)	{
//		var ok = confirm("Bạn chắc muốn xóa chứ?'");
//		if (ok)	{
//			var obj = $(eventData.target);
//			var row = obj.parents(".dynamic-edit-head-item").parent(".dynamic-edit-main").hide();
//			console.log(row);
//			var tid = "";
//			var tbl = "";
//			row.find("input[tid]").each(function(){
//				if(tid === "") {
//					tid = $(this).attr("tid");
//					tbl = $(this).attr("tbl");
//				}
//			});
//			json = [];
//			json[0]={'tbl':tbl, 'id':tid};
//			this.onAjax('ajax', 'dynamic-delete-profile', 
//			{'data':json}
//			, 'GET', 
//			{onSuccess: function(ret)	{
//				alert("Xóa thành công!")
//			},
//			onFailure: function(message)	{
//				alert("Có lỗi xảy ra khi xóa");
//			}});
//		}		
//	},
//	
//	onAddNewItem: function(eventData){
//		var tar = eventData.target;
//		var e = eventData;
//		var obj = this;
//		if(e.which == 13){
//			obj.saveRows($(e.target), function (id){
//				var fid = $(e.target).parents("[profileExtension]").attr("fatherID");
//				var lev = $(e.target).parents("[profileExtension]").attr("level");
//				var tbl = $(e.target).parents("[profileExtension]").attr("tbl");
//				var tm = $(e.target).parents("[profileExtension]").attr("tmpl");
//				var ret = {name:e.target.value, isNew:1, fatherID:fid, level: lev, tbl: tbl, id: id};
//				obj.encapData(ret, tbl, id, e.target.level);
//				$(e.target).after(obj.renderView(tm, {partner: ret}));
//				obj.design($(e.target).parent());
//				$(e.target).val("");
//			});
//		}
//	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}

}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface).implement(InlineEditorInterface);