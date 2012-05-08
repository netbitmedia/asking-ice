UserBrowserPortlet = Class.extend({
	init: function()	{
		this.name = "UserBrowserPortlet";
	},
	
	run: function()	{
		var obj = this;
		this.getPortletPlaceholder().paintCanvas(this.render());
		this.onAjax('ajax', 'get-max-score-users', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('ContentPlaceholder-MaxScore').html(obj.renderView('MaxScoreList', {users: ret}));
			}
		}, true, 300000);
		
		this.onAjax('ajax', 'get-by-top-rank', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.model = {};
				obj.model.users = Array();
				var map = Array();
				for (var i in ret)	{
					if (ret[i] == undefined)
						continue;
					var id = ret[i].userId;
					if (map[id] == undefined)	{
						map[id] = i;
						ret[i].ranks = "<a class='lv_tag' href='#!page/Topic/id/"+ret[i].expertiseId+"'>"+ret[i].catchWord+"</a>";
					} else {
						var index = map[id];
						ret[index].ranks += ', '+"<a class='lv_tag' href='#!page/Topic/id/"+ret[i].expertiseId+"'>"+ret[i].catchWord+"</a>";
						ret[i] = undefined;
					}
				}
				
				for(var i in ret)	{
					if (ret[i] != undefined)
						obj.model.users.push(ret[i]);
				}

				obj.requestForEffectiveResource('ContentPlaceholder-TopRank').append(obj.renderView('TopRankList', obj.model));
			}
		}, true, 300000);
		
		this.onAjax('ajax', 'get-latest-users', {}, 'GET', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('ContentPlaceholder-Latest').html(obj.renderView('LatestList', {users: ret}));
			}
		}, true, 300000);
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);