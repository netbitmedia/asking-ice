/**
 * @author Hung
 */
HungPDArticleTabPlugin = Class.extend({
	init: function()	{
		this.name = "HungPDArticleTabPlugin";
		this.type = undefined;
		//alert('cham chap qua');
		
	},
	onArticleSearchResultChangeType: function(eventData)	{
		this.type = eventData.type;
		//alert(this.type);
		this.refreshType();
		//alert('Nay thi onArticleSearchResultChangeType');
	},
	
	onArticleSearchResultChangeScope: function(eventData)	{
		this.scope = eventData.scope;
		this.refreshScope();
		//alert('Nay thi onSearchResultChangeScope');
	},
	refreshType: function()	{
		var type = this.type;
		$('a[type="tatca"]').removeClass('active');
		$('a[type="baibaokhoahoc"]').removeClass('active');
		$('a[type="chiasekinhnghiem"]').removeClass('active');
		$('a[type="baiphongvanhay"]').removeClass('active');
		$('a[type="cauhoichatluong"]').removeClass('active');
		if (type == 'tatca' || type == undefined)	{
			$('a[type="tatca"]').addClass('active');
		} else if (type == 'baibaokhoahoc')	{
			$('a[type="baibaokhoahoc"]').addClass('active');
		}		
		else if (type == 'chiasekinhnghiem')	{
			$('a[type="chiasekinhnghiem"]').addClass('active');
		} else if (type == 'baiphongvanhay')	{
			$('a[type="baiphongvanhay"]').addClass('active');
		}  else if (type == 'cauhoichatluong')	{
			$('a[type="cauhoichatluong"]').addClass('active');
		}
	},
	
	refreshScope: function()	{
		var scope = this.scope;
		$('a[scope="theoluongvote"]').removeClass('active');
		$('a[scope="theongaythang"]').removeClass('active');
		if (scope == 'theongaythang' || scope == undefined)	{
			$('a[scope="theongaythang"]').addClass('active');
		} else {
			$('a[scope="theoluongvote"]').addClass('active');
		}
	},
	onHtmlUpdated: function()	{
		$('.extension-point[extensionName="ArticleSearchResultTitle"]').each(function(index, value) {
			if ($(value).find('[flag="ArticleTab"]').length > 0)	{
			//cai nay dung de tranh truong hop cai tab bi load lai hai lan	
				return;
			}
			//alert('aaa');

			$(value).append(tmpl('ArticleTabTemplate', {}));
			//alert('HtmlUpdate');
		});
		
		$('.extension-point[extensionName="ArticleSearchResultPostTitle"]').each(function(index, value) {
			if ($(value).find('[flag="ArticleTab"]').length > 0)	{
				return;
			}
			//alert("aaaaaaaaaaaaaaa");
			$(value).append(tmpl('ArticleTabScopeTemplate', {}));
		});
		
		this.refreshScope();
		this.refreshType();
	},
	
	onEnd: function()	{
		$('#effective-area .tab-article').remove();
	}
}).implement(PluginInterface);

HungPDEditArticleButtonPlugin = Class.extend({
	init: function()	{
		this.name = "HungPDEditArticleButtonPlugin";
	},
	
	onMakeNewTargetedQuestion: function(eventData)	{
		var subject = SingletonFactory.getInstance(Subject);
		//var profileName = $(eventData.target).parents('.profile-count:first').siblings('.user-name').html();
		//var pid = SingletonFactory.getInstance(Page).getRequest().getParam('id');
		subject.notifyEvent('MakeNewQuestion', {profile: [{name: profileName, id: pid}]});
	},
	
	onHtmlUpdated: function()	{
		$('.extension-point[extensionName="HungPDEditArticleSpan"]').each(function(index,value)	{
			var props = SingletonFactory.getInstance(Application).getSystemProperties();
			var loggedIn = props.get('user.login');
			var pid = undefined;
			
			if (loggedIn == 1)	{
				
				var uid = props.get('user.id');
				pid = $(value).siblings('.HungPDEditArticleUserIDSpan').html();
				aid=$(value).siblings('.HungPDEditArticleIDSpan').html();
				isSelected=$(value).siblings('.HungPDEditArticleIsSelectedSpan').html();
				//alert(pid);
				//alert(isSelected);
				if ((uid != pid))		{	//same user
					return;
				}
				if (isSelected==1)		{	//same user
					return;
				}
			} else {
				return;
			}
			if ($(this).find('.[flag="HungPDEditArticleFlag"]').length > 0)	{
				return;
			}
			//alert("sss");
			$(this).append(tmpl('HungPDEditArticleButtonPluginTmpl', {'aid':aid}));
			
		});
	}
}).implement(PluginInterface);
HungPDDeleteArticleCommentPlugin = Class.extend({
	init: function()	{
		this.name = "HungPDDeleteArticleCommentPlugin";
	},
	
	
	onHtmlUpdated: function()	{
		$('.extension-point[extensionName="HungPDCommentArticleSpan"]').each(function(index,value)	{
			//alert("aaa");
			var props = SingletonFactory.getInstance(Application).getSystemProperties();
			var loggedIn = props.get('user.login');
			var userCommentID = undefined;
			var userCommentUserID = undefined;
			if(loggedIn==1)	{
				var uid = props.get('user.id');
				userCommentID=$(value).siblings('.HungPDCommentIDSpan').html();
				userCommentUserID = $(value).siblings('.HungPDCommentUserIDSpan').html();
				//alert(uid+"-"+userCommentUserID);
				if(uid!=userCommentUserID){
					return;
				}
				//alert($(value).html());
			} else{
				return;
			};
			if ($(value).find('.[flag="HungPDCommentFlag"]').length > 0)	{
				return;
			}
			
			 $(value).append(tmpl('HungPDDeleteArticleButtonPluginTmpl',{'commentID':userCommentID}));
		});
		return;
	}
}).implement(PluginInterface);

HungPDArticleVotePlugin = Class.extend({
	init: function()	{
		this.name = "HungPDArticleVotePlugin";
		//alert("aaa");
	},
	
	
	onHtmlUpdated: function()	{
		$('.extension-point[extensionName="HungPDVoteSpan"]').each(function(index,value)	{
			//alert("aaa");
			var props = SingletonFactory.getInstance(Application).getSystemProperties();
			var loggedIn = props.get('user.login');
			var authorUserID = undefined;
			var articleID = undefined;
			var needToType = undefined;
			var contentToAppend="";
			if(loggedIn==1)	{
				var uid = props.get('user.id');
				needToType=$(value).siblings('.HungPDVoteNeedToVoteSpan').html();
				authorUserID=$(value).siblings('.HungPDVoteAuthorIDSpan').html();
				articleID = $(value).siblings('.HungPDVoteArticleIDSpan').html();
				//alert(articleID+"-"+authorUserID+"-"+needToType);
				
				if(uid!=authorUserID){
					if(needToType==1){
						//alert("dsdasdsadas");
						contentToAppend=tmpl('HungPDArticleVoteButtonTmpl',{'articleID': articleID,'authorID':authorUserID});
					} else if(needToType==2){
						contentToAppend=tmpl('HungPDArticleUnVoteButtonTmpl',{'articleID': articleID,'authorID':authorUserID});						
						//alert(contentToAppend);
					}
					
				} else{
					return;
				}
				//alert($(value).html());
			} else{
				return;
			};
			if ($(value).find('.[flag="HungPDArticleVoteFlag"]').length > 0)	{
				return;
			}		
			//alert(contentToAppend);
			 $(value).append(contentToAppend);
		});
		return;
	}
}).implement(PluginInterface);

HungPDIsSelectedTabPlugin = Class.extend({
	init: function()	{
		this.name = "HungPDArticleVotePlugin";
		//alert("aaa");
		this.type=null;
	},
	onIsSelectedArticleChangeType: function(eventData)	{
		this.type = eventData.type;
		//alert(this.type);
		this.refreshType();
		//alert('Nay thi onArticleSearchResultChangeType');
	},
	
	refreshType: function()	{
		var type = this.type;
		//alert(type);
		$('a[type="dadang"]').removeClass('active');
		$('a[type="chuadang"]').removeClass('active');	
		if (type == 'dadang' || type == undefined)	{
			$('a[type="dadang"]').addClass('active');
			//alert("aa");
		} else if (type == 'chuadang')	{
			$('a[type="chuadang"]').addClass('active');
			//alert("bb");
		}		
	},
	
	onHtmlUpdated: function()	{
		var obj=this;
		$('.extension-point[extensionName="ArticleIsSelectedTab"]').each(function(index,value)	{
		//	alert("aaa");
			
			var props = SingletonFactory.getInstance(Application).getSystemProperties();
			var loggedIn = props.get('user.login');
			var authorID = undefined;
			var contentToAppend="";
			if(loggedIn==1)	{
				var uid = props.get('user.id');
				authorID=$(value).siblings('.HungPDIsSelectedAuthorIDSpan').html();
			//	alert(authorID);
				if(uid==authorID){				
					
				} else{
					return;
				}
				//alert($(value).html());
			} else{
				return;
			};
			//alert($(value).html());
			if ($(value).find('.[flag="ArticleIsSelectedTabFlag"]').length > 0)	{
				
				return;
			}		
			//alert(contentToAppend);
			//alert(tmpl('ArticleIsSelectedTabTemplate',{}));
			 $(value).append(tmpl('ArticleIsSelectedTabTemplate',{}));
			 obj.refreshType();
		});
		return;
	}
}).implement(PluginInterface);