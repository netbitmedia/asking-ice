PrivilegePortlet = Class.extend({
	init: function()	{
		this.name = "PrivilegePortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	run: function()	{
		var obj = this;
		this.getPortletPlaceholder().paintCanvas(this.render());
		this.onAjax('ajax', 'get-all-privileges', {}, 'GET', {
			'onSuccess': function(ret) {
				var privs = Array();
				for(var i in ret.privs)	{
					privs.push({title: ret.privs[i].title, requiredScore: ret.privs[i].requiredScore});
				}
				ret.privs = privs;
				ret.privs.sort(function(a, b) {
					return b.requiredScore - a.requiredScore;
				});
				var remainingScore = 0;
				for(var i=1;i<ret.privs.length;i++)	{
					if (parseInt(ret.privs[i].requiredScore) <= parseInt(ret.current))	{
						remainingScore = ret.privs[i-1].requiredScore - ret.current;
						if (remainingScore < 0)
							remainingScore = 0;
						break;
					}
				}
				ret.remainingScore = remainingScore;
				obj.requestForEffectiveResource('ContentPlaceholder').html(obj.renderView('Privileges', ret));
			}
		});
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface);