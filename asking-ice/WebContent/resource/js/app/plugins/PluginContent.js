/**
 * 
 */

MoreContentPlugin = Class.extend(
		{
			init : function() {
				this.name = "MoreContentPlugin";
			},

			onHtmlRendered : function(eventData) {
				//this.render(eventData);
			},
			
			onCheckMoreLessContent: function(eventData){
				this.render(eventData);
			},
			
			render : function(eventData) {
				var showChar = 240;
				var ellipsestext = "...";
//				var moretext = "(more)";
//				var lesstext = "(less)";
				var index = 0;
				$('.extension-point[extensionName="MoreContent"]').each(function() {
					var content = $(this).text().substr(0, showChar).trim();
					$(this).html(content+ellipsestext);
//					index++;
//				    var content = $(this).html();
//				    var curChildren = $(this).children();
//				    var lengthChildren = curChildren.length;
//				    if(lengthChildren == 0){
//				  	   if(content.length > showChar) {
//				           var c = content.substr(0, showChar);
//				           var h = content.substr(showChar-1, content.length - showChar);
//				           var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
//				           $(this).html(html);
//				       }
//				    } 
//				    else {
//						for(var i=0; i< lengthChildren; i++){
//							var curContent = $(curChildren[i]).html().trim();
//							if(curContent == ""){
//								continue;
//							}
//							
//							var tmp = $("<div></div>").append(curContent.substring(0,showChar)); 
//				    		var other = $("<div></div>").append(curChildren);
//				    		if(content.length > showChar) {
//				    			var html = '<span class="showmorecontent">' + tmp.html() + '</span><span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="hiddencontentwithtags" style="display:none">' + other.html() + '</span><span class="morecontentwithtags"><a class="morelinkwithtags">' + moretext + '</a></span>';
//				    			$(this).html(html);
//					    	}
//							break;
//						}
//				    }
				   });
				
//				   $(".morelink").click(function(){
//				       if($(this).hasClass("less")) {
//				           $(this).removeClass("less");
//				           $(this).html(moretext);
//				       } else {
//				           $(this).addClass("less");
//				           $(this).html(lesstext);
//				       }
//				       $(this).parent().prev().toggle();
//				       $(this).prev().toggle();
//				       return false;
//				   });
				   
//				   $(".morelinkwithtags").click(function(){
//				       var hiddenItem = $(this).parent().siblings(".hiddencontentwithtags");
//				       var hiddenItemContent = hiddenItem.html();
//				       var showItem = $(this).parent().siblings(".showmorecontent");
//				       var shownItemContent = showItem.html();
//				       hiddenItem.empty().append(shownItemContent);
//				       showItem.empty().append(hiddenItemContent);
//
//				       if($(this).hasClass("lessContent")) {
//				           $(this).removeClass("lessContent");
//				           $(this).parent().siblings(".moreellipses").html(ellipsestext+"&nbsp;");
//				           $(this).html(moretext);
//				       } else {
//				           $(this).addClass("lessContent");
//				           $(this).parent().siblings(".moreellipses").html("");
//				           $(this).html(lesstext);
//				       }
//				       return false;
//				   });
			}
			
//			onCheckMoreLessContent: function(eventData){
//				var showChar = 120;
//				var ellipsestext = "...";
//				var moretext = "(more)";
//				var lesstext = "(less)";
//				var index = 0;
//				
//				$(eventData).find('.show_more_content').each(function(index,value) {
//					value = $(value);
//					index++;
//				    var content = $(value).html();
//				    var curChildren = $(value).children();
//				    var lengthChildren = curChildren.length;
//				    if(lengthChildren == 0){
//				  	   if(content.length > showChar) {
//				           var c = content.substr(0, showChar);
//				           var h = content.substr(showChar-1, content.length - showChar);
//				           var div = $("<div></div>");
//				           var a1 = $(c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span>');
//				           var a2 = $('<span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;</span>');
//				           var a3 = $('<a href="" class="morelink">' + moretext + '</a>');
//				           a3.click(function(){
//				        	   if($(this).hasClass("less")) {
//						           $(this).removeClass("less");
//						           $(this).html(moretext);
//						       } else {
//						           $(this).addClass("less");
//						           $(this).html(lesstext);
//						       }
//						       $(this).parent().prev().toggle();
//						       $(this).prev().toggle();
//						       return false;
//				           });
//				           $(a2).append(a3);
//				           div.append(a1).append(a2);
//				           $(value).empty.append(div.children());
//				       }
//				    } 
//				    else {
//				    	var tmp = $("<div></div>").append($(curChildren[0]).html().substring(0,showChar)); 
//				    	var other = $("<div></div>").append(curChildren);
//				    	if(content.length > showChar) {
//				    		var a1 = $('<span class="showmorecontent">' + tmp.html() + '</span><span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="hiddencontentwithtags" style="display:none">' + other.html() + '</span>');
//				    		var a2 = $('<span class="morecontentwithtags"></span>');
//				    		var a3 = $('<a class="morelinkwithtags">' + moretext + '</a>');
//				    		a3 = $(a3).click(function(){console.log("adsf");
//				    			var hiddenItem = $(this).parent().siblings(".hiddencontentwithtags");
//							       var hiddenItemContent = hiddenItem.html();
//							       var showItem = $(this).parent().siblings(".showmorecontent");
//							       var shownItemContent = showItem.html();
//							       hiddenItem.empty().append(shownItemContent);
//							       showItem.empty().append(hiddenItemContent);
//
//							       if($(this).hasClass("lessContent")) {
//							           $(this).removeClass("lessContent");
//							           $(this).parent().siblings(".moreellipses").html(ellipsestext+"&nbsp;");
//							           $(this).html(moretext);
//							       } else {
//							           $(this).addClass("lessContent");
//							           $(this).parent().siblings(".moreellipses").html("");
//							           $(this).html(lesstext);
//							       }
//							       return false;
//				    		});
//				    		a2 = $(a2).append(a3);
//				    		$(value).empty().append($(a1)).append($(a2));
//					    } 
//				    }
//				   });
//			}
		}).implement(PluginInterface);