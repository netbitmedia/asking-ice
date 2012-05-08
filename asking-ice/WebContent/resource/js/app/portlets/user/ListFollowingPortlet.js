ListFollowingPortlet = ListFollowersPortlet.extend({
	init: function()	{
		this._super();
		this.name = "ListFollowingPortlet";
		this.action = "get-following";
	},
	
	onListAllFollowing: function() {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ShowPopup', {id: 'ListFollowers', title: 'Những người đang follow', content: this.renderView('AllPeople', this.model)});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);