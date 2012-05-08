BookmarkPortlet = Class.extend({
	init: function() {
		this.name = "BookmarkPortlet";
		this.page = 0;
	},
	
	onBegin: function() {
		this.registerObserver();
	},
	
	onReloadPage: function() {
		this.run();
	},
	
	onGetMoreBookmarks: function() {
		this.page++;
		var id = this.getRequest().getParam('id');
		var obj = this;
		this.onAjax('question', 'get-bookmark-questions', {id: id, page: this.page}, 'get', {
			onSuccess: function(ret) {
				obj.model = {list: ret};
				obj.requestForEffectiveResource('Container').append(obj.renderView('QuestionTmpl', obj.model));
				if (ret.length < 10)
					obj.requestForEffectiveResource('ViewMore').hide();
			}
		}, true, 300000);
	},
	
	run: function() {
		var id = this.getRequest().getParam('id');
		var obj = this;
		this.onAjax('question', 'get-bookmark-questions', {id: id}, 'get', {
			onSuccess: function(ret) {
				obj.model = {list: ret};
				obj.getPortletPlaceholder().paintCanvas(obj.render());
				obj.requestForEffectiveResource('Container').html(obj.renderView('QuestionTmpl', obj.model));
				if (ret.length < 10)
					obj.requestForEffectiveResource('ViewMore').hide();
			}
		}, true, 300000);
	},
	
	onEnd: function() {
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);