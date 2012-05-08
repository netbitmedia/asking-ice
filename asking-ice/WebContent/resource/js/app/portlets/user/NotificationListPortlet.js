NotificationListPortlet = Class.extend({
	init: function()	{
		this.name = "NotificationListPortlet";
		this.page = 0;
	},
	
	onViewMoreNotification: function()	{
		this.page++;
		this.fetch();
	},
	
	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
		this.fetch();
	},
	
	fetch: function() {
		var obj = this;
		this.onAjax('user-ajax', 'get-all-notification', {page: this.page}, 'GET', {
			'onSuccess': function(ret)	{
				if (ret.length < 20)
					obj.requestForEffectiveResource('ViewMore').hide();
				if (ret.length == 0)	{
					if (obj.page == 0)
						obj.requestForEffectiveResource('Container').html('Hiện tại bạn không có thông báo nào');
				} else {
					var notifs = Array();
					for(var i=0;i<ret.length;i++)	{
						var link = eval("("+ret[i].link+")");
						var href=Array();
						for(var j in link)	{
							var param = j;
							if (param == 'type')
								param = 'page';
							else if (param == 'qid')
								ret[i].objId = link[j];
							href.push(param+"/"+link[j]);
						}
						ret[i].link = "#!"+href.join("/");
						ret[i].users = Array();
						ret[i].users.push({sourceId: ret[i].sourceId, name: ret[i].name});
						var since = $.timeFormatMin(ret[i].since);
						if (notifs[since] == undefined)
							notifs[since] = Array();
						var found = false;
						for(var j in notifs[since])	{
							if (ret[i].type == notifs[since][j].type && ret[i].objId == notifs[since][j].objId)	{
								notifs[since][j].users.push({sourceId: ret[i].sourceId, name: ret[i].name});
								found = true;
								break;
							}
						}
						if (!found)
							notifs[since].push(ret[i]);
					}
					for(var i in notifs)	{
						for(var j in notifs[i]) {
							notifs[i][j].usersTmpl = obj.renderView('UsersTemplate', {users: notifs[i][j].users});
							notifs[i][j].content = obj.renderView(notifs[i][j].type, notifs[i][j]);
						}
					}
					obj.requestForEffectiveResource('Container').append(obj.renderView('List', {notifs: notifs}));
				}
			}
		});
	},
	
	onBegin: function() {
		this.registerObserver();
	},
	
	onEnd: function() {
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);