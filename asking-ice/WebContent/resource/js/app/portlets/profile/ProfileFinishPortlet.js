ProfileFinishPortlet = Class.extend({
	init: function()	{
		this.name = "ProfileFinishPortlet";
	},
	
	onReloadPage: function() {
		this.run();
	},
	
	run: function()	{
		var obj = this;
		this.onAjax('user-ajax', 'check-finish-profile', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.model = {};
				var inc = 20;
				obj.model.finish = inc;
				obj.model.msgs = Array();
				if(ret.avatar != false) obj.model.finish += inc;
				else obj.model.msgs.push('<a href="#!page/UserAvatarEdit">Bạn chưa cập nhật hình đại diện?</a>');
				if(ret.catches != false) obj.model.finish += inc;
				else obj.model.msgs.push('<a href="#!page/UserExpertiseEdit">Bạn chưa cập nhật kinh nghiệm?</a>');
				if(ret.interest != false) obj.model.finish += inc;
				else obj.model.msgs.push('<a href="#!page/UserInterestEdit">Bạn chưa cập nhật lĩnh vực quan tâm?</a>');
				if(ret.question != false) obj.model.finish += inc;
				else obj.model.msgs.push('<a onclick=\'generateEvent("MakeNewQuestion", {})\'>Bạn chưa đặt câu hỏi nào?</a>');
				if (obj.model.finish < 100)
					obj.getPortletPlaceholder().paintCanvas(obj.render());
			}
		});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);