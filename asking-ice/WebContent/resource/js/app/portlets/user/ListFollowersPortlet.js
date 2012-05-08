/**
 * @author KhanhHH
 */
ListFollowersPortlet = AbstractFollowersPortlet.extend({
	init: function()	{
		this.name = "ListFollowersPortlet";
		this.key = 'id';
		this.controller = 'user-ajax';
		this.action = 'get-followers';
	},
	
	onFollowersChange: function()	{
		this.run();
	},
	
	onListAllFollowers: function() {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ShowPopup', {id: 'ListFollowers', title: 'Những người đang follow', content: this.renderView('AllPeople', this.model)});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);