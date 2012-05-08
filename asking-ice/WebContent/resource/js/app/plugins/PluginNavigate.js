/**
 * 
 */

NavigateRoutePlugin = Class.extend({
	init: function()	{
		this.name = "NavigateRoute";
	},
	
	onGoToPrevious: function(eventData)	{
		history.go(-2);
	},
	
	onGoToHome: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		var request = new Request("Home",undefined, null); 
		subject.notifyEvent('RequestRoute', request);
	},
	
	onGoToPage: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		var request ;
		if(eventData.page == undefined){
			//console.error("Error ! No page to go to");
		}else{
			var pagename = eventData.page;
			var params = eventData.params;
			request = new Request(pagename, undefined, params);
			subject.notifyEvent('RequestRoute', request);
		}
	}
}).implement(PluginInterface);

NavigatorPlugin = Class.extend({
	init: function() {
		this.name = "NavigatorUI";
		this.pageLinks = Array();
		this.numPages = null;
		this.numDocs = null;
		this.rows = 10;
		this.curPage = 0;
		this.searchPage = 0;
		this.dataLength = 0;
		this.searchController = "";
	},
	
	onFetchSearchResultNumber: function(eventData){
		eventData.numDocs = eventData.numDocs || 0;
		var template = tmpl("SearchResultPortlet-SearchResultNumber",eventData);
		$('.extension-point[extensionName="SearchResultTitle"]').each(function(index, value)	{
			$(value).append(template);
		});
	},
	
	onFetchNavigationLink: function(eventData){
		this.numDocs = eventData.numDocs;
		this.rows = eventData.rows;
		this.searchPage = eventData.searchPage;
		this.dataLength = eventData.dataLength;
		this.query = eventData.query;
		this.core = eventData.core;
		this.searchController = eventData.searchController;
		
		var currentPlugin = this;
		$('.extension-point[extensionName="NavigatorUI"]').each(function(index, value)	{
			$(value).append(currentPlugin.fetchPageLink());
		});
	},
	
	fetchPageLink: function(){
		var result = $("<div></div>");
		if(this.dataLength == 0){
			return result;
		}
		var numPages = Math.ceil(this.numDocs / this.rows);
		if(numPages == 0){
			numPages = 1;
		}
		var curPage = parseInt(this.searchPage); 
		var pageLinks = Array();
		if (curPage > numPages){
			curPage = numPages;
		}
		if (curPage <= 0){
			curPage = 1;
		}
		
		for(var x = 1; x <= numPages; x ++) {
			if (x == curPage) {
				var objParam = {};
				objParam.content = x;
				pageLinks[x-1] = tmpl("CommonPortlet-NavCurrent",objParam);
			} else {
				var objParam = {};
				objParam.query = this.query;
				objParam.core = this.core;
				objParam.searchPage = x;
				objParam.content = x;
				objParam.rows = this.rows;
				objParam.searchController = this.searchController;//"SearchResultDynamic";
				pageLinks[x-1] = tmpl("CommonPortlet-NavOther",objParam);
			}
		}
		
		if (curPage > 1 && curPage <= pageLinks.length){
			var objParam = {};
			objParam.query = this.query;
			objParam.core = this.core;
			objParam.searchPage = curPage-1;
			objParam.content = "&#171 Trước&nbsp;";
			objParam.rows = this.rows;
			objParam.searchController = this.searchController;//"SearchResultDynamic"
			result.append(tmpl("CommonPortlet-NavOther",objParam));
		}
		
		
		for (var key= curPage-11; key <= curPage+9; key++ ) {
			if (key<0) continue;
			if (key>= pageLinks.length) continue;
			if (key == curPage)
				result.append(pageLinks[key]);
			else
				result.append(pageLinks[key]);
		}		
		
		if(curPage < pageLinks.length){
			var objParam = {};
			objParam.query = this.query;
			objParam.core = this.core;
			objParam.searchPage = curPage+1;
			objParam.content = "&nbsp;Sau&nbsp;&#187";
			objParam.rows = this.rows;
			objParam.searchController = this.searchController;;//"SearchResultDynamic";
			result.append(tmpl("CommonPortlet-NavOther",objParam));
		}
		return result;
	}
}).implement(PluginInterface);
