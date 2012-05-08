/**
 * 
 */

SearchResHelperPlugin = Class.extend({
	init : function() {
		this.name = "SearchResHelperPlugin";
	},
	
	checkTopics: function(eventData){
		$('.extension-point[extensionName="CheckTopicsAvai"]').each(function(){
			var children = $(this).children("a"); 
			var length = children.length;
			var shown = 4;
			children.slice(shown,length).remove();
			if(length > shown){
				$(this).append("<label style='color:#666666'>...</label>");
			}
		});
	},

	checkContentAvai: function(eventData){
		$('.extension-point[extensionName="CheckContentAvai"]').each(function(){
			var html = $(this).find(".show_more_content").html().trim();
			if(html != ""){
				$(this).css("display","inline-block");
			}
		});
	},
	
	localCheckTopic: function(eventData){
		$(eventData).find('.extension-point[extensionName="CheckTopicsAvai"]').each(function(index,value){
			var children = $(value).children("a"); 
			var length = children.length;
			var shown = 4;
			children.slice(shown,length).remove();
			if(length > shown){
				$(value).append("<label style='color:#666666'>...</label>");
			}
		});
	},
	
	localCheckContentAvai: function(eventData){
		$(eventData).find('.extension-point[extensionName="CheckContentAvai"]').each(function(index,value){
			var html = $(value).find(".show_more_content").html().trim();
			if(html != ""){
				$(value).css("display","inline-block");
			}
		});
	},
	
	onHtmlRendered : function(eventData) {
		this.checkContentAvai(eventData);
		this.checkTopics(eventData);
	},
	
	onRequestCheckAnswerContent: function(eventData){
		this.localCheckContentAvai(eventData);
		this.localCheckTopic(eventData);
	}
}).implement(PluginInterface);