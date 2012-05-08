PaginationPlugin = Class.extend({
	init: function()	{
		this.name = "PaginationPlugin";
		this.pageLinks = Array();
		this.numPages = null;
		this.numDocs = null;
		this.rows = 10;
		this.curPage = 0;
		this.paginationPage = 0;
	},
	
	onFetchPaginationLink: function(eventData)	{
		this.numDocs = eventData.numDocs;
		this.rows = eventData.rows;
		this.curPage = eventData.curPage;
		this.request = eventData.request;
		$(eventData.placeholder).append(this.fetchPageLink());
	},
	
	onPaginationOnclick: function(pagination)	{
		this.request.setParam('pagination',  pagination);
		var sbj = SingletonFactory.getInstance(Subject);
		sbj.notifyEvent('RequestRoute', this.request);
	},
	
	fetchPageLink: function(){
		var result = $("<div></div>");
		var numPages = Math.ceil(this.numDocs / this.rows);
		if(numPages == 0){
			numPages = 1;
		}
		var curPage = parseInt(this.curPage); 
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
				objParam.content = x;
				objParam.page = x;
				pageLinks[x-1] = tmpl("Pagination-NavOther",objParam);
			}
		}
		
		if (curPage > 1 && curPage <= pageLinks.length){
			var objParam = {};
			objParam.page = curPage-1;
			objParam.content = "&#171 Trước&nbsp;";
			result.append(tmpl("Pagination-NavOther",objParam));
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
			objParam.page = curPage+1;
			objParam.content = "&nbsp;Sau&nbsp;&#187";
			result.append(tmpl("Pagination-NavOther",objParam));
		}
		return result;
	}
}).implement(PluginInterface);