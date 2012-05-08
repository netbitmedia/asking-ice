AllTopicsPortlet = Class.extend({
	init: function()	{
		this.name = "AllTopicsPortlet";
	},
	
	onBegin: function() {
		this.registerObserver();
	},
	
	onEnd: function() {
		this.unregisterObserver();
	},
	
	onNewTopicAdded: function(eventData) {
		this.getPortletPlaceholder().drawToCanvas(this.renderView('TopicItem', eventData));
	},
	
	run: function(name)	{
		var obj = this;
		obj.getPortletPlaceholder().paintCanvas(obj.render());
		
		this.onAjax('catchword', 'get-all-catchwords', {}, 'GET', {
			'onSuccess': function(ret)	{
				var maxLength = 23;
				var map = {};
				for(var i in ret)	{
					ret[i].catchWordTitle = ret[i].catchWord;
					if (ret[i].catchWord.length > maxLength)	{
						var trimmed = ret[i].catchWord.substr(0, maxLength - 3);
						var lastWordIndex = trimmed.lastIndexOf(' ');
						if (lastWordIndex != -1)	{
							trimmed = trimmed.substr(0, lastWordIndex);
						}
						ret[i].catchWord = trimmed+"...";
					}
					if (map[ret[i].contextId] == undefined) {
						map[ret[i].contextId] = {};
						map[ret[i].contextId].catchwords = Array();
						map[ret[i].contextId].context = ret[i].context;
					}
					map[ret[i].contextId].catchwords.push(ret[i]);
				}
				
				obj.requestForEffectiveResource('ContentPlaceholder').html(obj.renderView('Topics', {catchwords: map}));
				
				obj.map = map;
				obj.requestForEffectiveResource('ContextPlaceholder').html(obj.renderView('Contexts', {contexts: map}));
			}
		}, true, 300000);
	},
	
	refreshCatchwords: function() {
		var catchwords = Array();
		var obj = this;
		this.requestForEffectiveResource('ContextPlaceholder').find('input').each(function() {
			if ($(this).is(':checked'))	{
				var cid = $(this).attr('cid');
				for(var i in obj.map[cid].catchwords)	{
					catchwords.push(obj.map[cid].catchwords[i]);
				}
			}
		});
		obj.requestForEffectiveResource('ContentPlaceholder').html(obj.renderView('Topics', {catchwords: catchwords}));
	},
	
	onSelectAllContexts: function() {
		this.requestForEffectiveResource('ContextPlaceholder').find('input[type=checkbox]').attr('checked', 'checked');
		this.refreshCatchwords();
	},
	
	onDeselectAllContexts: function() {
		this.requestForEffectiveResource('ContextPlaceholder').find('input[type=checkbox]').removeAttr('checked');
		this.refreshCatchwords();
	},
	
	onContextSelectionChanged: function() {
		this.refreshCatchwords();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);