AllUsersPortlet = Class.extend({
	init: function()	{
		this.name = "AllUsersPortlet";
	},
	
	run: function(name)	{
		var obj = this;
		this.onAjax('ajax', 'get-all-users', {}, 'GET', {
			'onSuccess': function(ret)	{
				var maxLength = 20;
				for(var i in ret)	{
					if (ret[i].catchWord.length > maxLength)	{
						var trimmed = ret[i].catchWord.substr(0, maxLength - 3);
						var lastWordIndex = trimmed.lastIndexOf(' ');
						if (lastWordIndex != -1)	{
							trimmed = trimmed.substr(0, lastWordIndex);
						}
						ret[i].catchWord = trimmed+"...";
					}
				}
				
				ret.sort(function(a, b) {
					return b.catchWord.length - a.catchWord.length;
				});
				
				obj.model = {};
				obj.model.catchwords = ret;

				obj.getPortletPlaceholder().paintCanvas(obj.render());
				obj.requestForEffectiveResource('ContentPlaceholder').find('ul:first').addClass('first');
				obj.requestForEffectiveResource('ContentPlaceholder').find('ul:last').addClass('last');
			}
		}, true, 300000);
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);