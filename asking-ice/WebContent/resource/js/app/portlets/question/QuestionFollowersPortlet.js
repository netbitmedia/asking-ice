QuestionFollowersPortlet = ListFollowersPortlet.extend({
	init: function()	{
		this.name = "QuestionFollowersPortlet";
		this.key = "qid";
		this.controller = "question";
		this.action = "get-followers";
	},
	
	onQuestionFollowerChange: function()	{
		this.run();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);
