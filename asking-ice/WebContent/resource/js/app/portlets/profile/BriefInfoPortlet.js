BriefInfoPortlet = Class.extend({
	init: function()	{
		this.name = "BriefInfoPortlet";
	},
	
	onReloadPage: function()	{
		this.run();
	},
	
	run: function()	{
		this.model = {};
		var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
		var obj = this;
		var props = SingletonFactory.getInstance(Application).getSystemProperties();
		var id = this.getRequest().getParam('id');
		this.onAjax('user-ajax', 'get-brief-info', {'id': id}, 'GET', {
			'onSuccess': function(ret)	{
				// basic
				var avatar = ret.avatar;
				obj.model.page = obj.getRequest().getParam('page');
				obj.model.id = id ? id: props.get('user.id');
				obj.model.name = ret.name;
				obj.model.avatar = avatar;
				
				// statistic
				obj.model.answerCount = ret.answerCount;
				obj.model.questionCount = ret.questionCount;
				obj.model.score = ret.score;
				if (ret.isExpert == 0)	{
					if (ret.score < 200)	{
						obj.model.titleType = 0;
						obj.model.title = "Thành viên thường";
					} else if (ret.score < 600) {
						obj.model.titleType = 1;
						obj.model.title = "Thành viên tích cực";
					} else {
						obj.model.titleType = 2;
						obj.model.title = "Thành viên uy tín";
					}
				} else {
					obj.model.titleType = 3;
					obj.model.title = "Chuyên gia về "+ret.expertField;
				}
				
				// interests
				obj.model.interestTitle = "Lĩnh vực quan tâm";
				obj.model.interestContexts = ret.interests;
				
				// catches
				obj.model.expertiseTitle = "Kinh nghiệm";
				obj.model.expertiseContexts = ret.catches;
				
				obj.getPortletPlaceholder().paintCanvas(obj.render());
			}
		});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);