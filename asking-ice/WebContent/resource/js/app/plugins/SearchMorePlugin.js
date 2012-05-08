SearchMorePlugin = Class.extend({
	init: function()	{
		this.name = "SearchMorePlugin";
	},
	
	showSearchMoreButton: function()	{
		if ($('#effective-area .page_more').length > 0)
			$('#effective-area .page_more').show();
	},
	
	hideSearchMoreButton: function()	{
		if ($('#effective-area .page_more').length > 0)
			$('#effective-area .page_more').hide();
	},
	
	showNoMoreSearch: function()	{
		//if ($('#effective-area .no-more-search-result-placeholder').length > 0)	{
		//	$('#effective-area .no-more-search-result-placeholder').show();
		//}
	},
	
	hideNoMoreSearch: function()	{
		if ($('#effective-area .no-more-search-result-placeholder').length > 0)
			$('#effective-area .no-more-search-result-placeholder').hide();
	},
	
	onBeginSearching: function()	{
		this.showSearchMoreButton();
		this.hideNoMoreSearch();
	},
	
	onNoMoreResult: function()	{
		this.hideSearchMoreButton();
		this.showNoMoreSearch();
	},
	
	onHtmlUpdated: function()	{
		var obj = this;
		$('.extension-point[extensionName="PostResultList"]').each(function(index, value) {
			if ($(value).find('[flag="SearchMore"]').length > 0)	{
				return;
			}
			$(value).append(tmpl('SearchMorePluginTemplate', {}));
			obj.hideNoMoreSearch();
		});
	}
}).implement(PluginInterface);

QuestionTabPlugin = Class.extend({
	init: function()	{
		this.name = "QuestionTabPlugin";
		this.type = undefined;
	},
	
	onSearchResultChangeType: function(eventData)	{
		this.type = eventData.type;
		this.refreshType();
	},
	
	onSearchResultChangeScope: function(eventData)	{
		this.scope = eventData.scope;
		this.refreshScope();
	},
	
	refreshType: function()	{
		var type = this.type;
		$('a[type="Latest"]').removeClass('active');
		$('a[type="Top"]').removeClass('active');
		$('a[type="Open"]').removeClass('active');
		if (type == 'notification-filter' || type == undefined)	{
			$('a[type="Latest"]').addClass('active');
		} else if (type == 'question-best')	{
			$('a[type="Top"]').addClass('active');
		} else if (type == 'question-open')	{
			$('a[type="Open"]').addClass('active');
		}
	},
	
	refreshScope: function()	{
		var scope = this.scope;
		$('a[scope="limit"]').removeClass('active');
		$('a[scope="all"]').removeClass('active');
		if (scope == 'all')	{
			$('a[scope="all"]').addClass('active');
		} else {
			$('a[scope="limit"]').addClass('active');
		}
	},
	
	onHtmlUpdated: function()	{
		$('.extension-point[extensionName="SearchResultTitle"]').each(function(index, value) {
			if ($(value).find('[flag="QuestionTab"]').length > 0)	{
				return;
			}
			$(value).append(tmpl('QuestionTabTemplate', {}));
		});
		
		this.refreshScope();
		this.refreshType();
	},
	
	onEnd: function()	{
		$('#effective-area .tab-question').remove();
	}
}).implement(PluginInterface);