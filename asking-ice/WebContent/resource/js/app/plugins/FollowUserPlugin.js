FollowUserPlugin = Class.extend({
	init: function()	{
		this.name = "FollowUserPlugin";
	},
	
	onUnfollowUser: function(eventData)	{
		var uid = eventData.uid;
		var containerID = eventData.containerID; 
		this.onAjax('user-ajax', 'unfollow-user', {'uid': uid}, 'POST', {
			'onSuccess': function(ret)	{
				//Find the container with attribute uid == uid
				$("." + containerID).each(function(){
					if($(this).attr('uid') == uid)
						$(this).html(tmpl('FollowUserTmpl-Follow', {uid: uid,containerID:containerID}));
				});
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent("FollowersChange", {});
			}
		});
	},
	
	onFollowUser: function(eventData)	{
		var uid = eventData.uid;
		var containerID = eventData.containerID; 
		this.onAjax('user-ajax', 'follow-user', {'uid': uid}, 'POST', {
			'onSuccess': function(ret)	{
				//Find the container with attribute uid == uid
				$("." + containerID).each(function(){
					if($(this).attr('uid') == uid){
						$(this).html(tmpl('FollowUserTmpl-Unfollow', {uid: uid,containerID: containerID}));
					}
				});
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent("FollowersChange", {});
			}
		});
	},
	
	onFollowUserList: function(eventData){
		var props = SingletonFactory.getInstance(Application).getSystemProperties();	
		var currUID = props.get('user.id');
		var containerID = eventData.containerID ;
		var obj = this;
		//for all container of each follower
		$("div."+containerID).each(function()	{
			var objSelector = $(this); 
			var uid = objSelector.attr('uid');
			if(currUID == uid)
				return;
			obj.onAjax('user-ajax', 'is-user-following-user', {'uid': uid}, 'GET', {
			'onSuccess': function(ret)	{
				var follow = '';
				if (ret == true)	{
					follow = 'Unfollow';
				} else {
					follow = 'Follow';
				}
				//add button into this container
				objSelector.html(tmpl('FollowUserTmpl-'+follow, {uid: uid, containerID: containerID}));
			}//end OnSuccess
			});//end onAjax
		});//end Each
	
	},
	
	onReloadPlugin: function() {
		this.fetched = false;
	},
	
	onHtmlUpdated: function(eventData)	{
		var props = SingletonFactory.getInstance(Application).getSystemProperties();
		var loggedIn = props.get('user.login');
		var pid = undefined;
		if (loggedIn == 1)	{
			var uid = props.get('user.id');
			pid = SingletonFactory.getInstance(Page).getRequest().getParam('id');
			if (uid == pid)		{	//same user
				return;
			}
		} else {
			return;
		}
		if(this.fetched == true)	{
			this.renderWidget(this.isFollow, pid);
			return;
		}
		var obj = this;
		this.onAjax('user-ajax', 'is-user-following-user', {'uid': pid}, 'GET', {
			'onSuccess': function(ret)	{
				obj.fetched = true;
				obj.renderWidget(ret, pid);
			}//end OnSuccess
		});//end onAjax
	},
	
	renderWidget: function(ret, pid) {
		var follow = '';
		this.isFollow = ret;
		if (ret == true)	{
			follow = 'Unfollow';
		} else {
			follow = 'Follow';
		}
		$('.extension-point[extensionName="BriefInfoControl"]').each(function()	{
			if ($(this).find('[flag="FollowUser"]').length > 0)	{
				return;
			}
			$(this).append(tmpl('FollowUserTmpl', {uid: pid}));
			$('.followuser_container').html(tmpl('FollowUserTmpl-'+follow, {uid: pid,containerID:"followuser_container"}));
		});//end Each
	}
}).implement(PluginInterface).implement(AjaxInterface);