UserTabGeneratorPlugin = Class.extend({
	init: function()	{
		this.name = "UserTabGeneratorPlugin";
		this.ids = new Array("User","UserFeed","UserQuestion","UserTarget","UserAnswer","UserBookmark","UserReportedQuestions");
	},
	
	onHtmlUpdated: function()	{
		var request = SingletonFactory.getInstance(Page).getRequest();
		var page = request.getParam("page");
		var plugin = this;
		if ($('#UserTabGeneratorPlaceholder').length <= 0)	{
			var template = $(tmpl('UserTabGeneratorPlaceholder-Tmpl', {}));
			$('.extension-point[extensionName="ProfileTab"]').append(template);
			var count = 0;
			$('.extension-point[extensionName="ProfileTab"]').find(".user-tab a").each(function(){
				count++;
				if(plugin.ids[count-1] != page){
					$(this).removeClass("active");
				} else {
					$(this).addClass("active");
				}
				var curID = "userTab-" + count;
				$(this).attr("id",curID);
				$(this).attr("onClick","generateEvent('UserTabGeneratorChange',{id:'"+curID+"'})");
			});
		}else{
			for( var i=0; i<this.ids.length; i++ )	{
				if($('#userTab-'+(i+1)).hasClass("active")){
					$('#userTab-'+(i+1)).removeClass("active");
				}
				if(!$('#userTab-'+(i+1)).hasClass("active")){
					$('#userTab-'+(i+1)).addClass("active");
				}
			}
			
			for( var i=0; i<this.ids.length;i++ )	{
				if(this.ids[i] == page){
					$('#userTab-'+(i+1)).addClass("active");
				}else{
					$('#userTab-'+(i+1)).removeClass("active");
				}
			}
		}
	},
	
	onEnd: function()	{
		if ($('#UserTabGeneratorPlaceholder').length > 0)
			$('#UserTabGeneratorPlaceholder').remove();
	}
}).implement(PluginInterface);

UserEditMenuGeneratorPlugin = Class.extend({
	init: function()	{
		this.name = "UserEditMenuGeneratorPlugin";
		this.ids = new Array("PartnerProfileEdit", "UserAvatarEdit", "UserExpertiseEdit", "UserInterestEdit");
	},
	
	onHtmlUpdated: function()	{
		var request = SingletonFactory.getInstance(Page).getRequest();
		var page = request.getParam("page");
		var plugin = this;
		if ($('#UserEditMenu').length <= 0)	{
			var template = $(tmpl('UserEditMenuTmpl', {}));
			$('.extension-point[extensionName="MiddleMain"]').append(template);
			var count = 0;
			$('.extension-point[extensionName="MiddleMain"]').find(".user-tab a").each(function(){
				count++;
				if(plugin.ids[count-1] != page){
					$(this).removeClass("active");
				} else {
					$(this).addClass("active");
				}
				var curID = "userEditTab-" + count;
				$(this).attr("id",curID);
			});
		}else{
			for( var i=0; i<this.ids.length; i++ )	{
				if($('#userEditTab-'+(i+1)).hasClass("active")){
					$('#userEditTab-'+(i+1)).removeClass("active");
				}
				if(!$('#userEditTab-'+(i+1)).hasClass("active")){
					$('#userEditTab-'+(i+1)).addClass("active");
				}
			}
			
			for( var i=0; i<this.ids.length;i++ )	{
				if(this.ids[i] == page){
					$('#userEditTab-'+(i+1)).addClass("active");
				}else{
					$('#userEditTab-'+(i+1)).removeClass("active");
				}
			}
		}
		
		if (request.getParam('msg') == 'reg_complete')	{
			$('#UserEditMenu-Msg').html('<div class="green_box">Quá trình đăng ký đã hoàn tất. Bạn có thể sửa thông tin cá nhân ngay bây giờ.<br /><a href="#" class="bold">Click vào đây để quay lại trang chủ</a></div>');
		}
	},
	
	onEnd: function()	{
		if ($('#UserEditMenu').length > 0)
			$('#UserEditMenu').remove();
	}
}).implement(PluginInterface);

ProfileTabGeneratorPlugin = UserTabGeneratorPlugin.extend({
	init: function()	{
		this.name = "ProfileTabGeneratorPlugin";
		this.ids = new Array("Profile","ProfileFeed","ProfileQuestion","ProfileTarget","ProfileAnswer","ProfileBookmark","ProfileReportedQuestions");
	},
	
	onReloadPlugin: function()	{
		//remove old tab
		if ($('#ProfileTabGeneratorPlaceholder').length > 0)
			$('#ProfileTabGeneratorPlaceholder').remove();
		this.renderTab();
	},
	
	onHtmlUpdated: function()	{
		this.renderTab();
	},
	
	renderTab: function()	{
		var request = SingletonFactory.getInstance(Page).getRequest();
		var params = request.getParams();
		var page = request.getParam("page");
		if ($('#ProfileTabGeneratorPlaceholder').length <= 0)	{
			var id = params['id'] || undefined;
			var objParam = {};
			if (id != undefined){
				objParam.id = id;
			}
			
			var template = $(tmpl('ProfileTabGeneratorPlaceholder-DATmpl', objParam));
			var count = 0;
			var plugin = this;
			$('div.extension-point[extensionName="ProfileTab"]').each(function()	{
				$(this).append(template);
				$('.user-tab-item').removeClass('active');
				$(this).find(".user-tab a").each(function(){
					count++;
					if(plugin.ids[count-1] == page){
						$(this).addClass("active");
					}
					var curID = "userTab-" + count;
					$(this).attr("id",curID);
					$(this).addClass('user-tab-item');
				});
			});
		}
	},
	
	onEnd: function()	{
		if ($('#ProfileTabGeneratorPlaceholder').length > 0)
			$('#ProfileTabGeneratorPlaceholder').remove();
	}
}).implement(PluginInterface);

PartnerProfileTabGeneratorPlugin = UserTabGeneratorPlugin.extend({
	init: function()	{
		this.name = "PartnerProfileTabGeneratorPlugin";
		this.ids = new Array("PartnerProfile","PartnerProfileNews","PartnerProfileTarget","PartnerProfileAnswer");
	},
	
	onReloadPlugin: function()	{
		//remove old tab
		if ($('#MockupProfileTabGeneratorPlaceholder').length > 0)
			$('#MockupProfileTabGeneratorPlaceholder').remove();
		this.renderTab();
	},
	
	onHtmlUpdated: function()	{
		this.renderTab();
	},
	
	renderTab: function()	{
		var request = SingletonFactory.getInstance(Page).getRequest();
		var params = request.getParams();
		var page = request.getParam("page");
		if ($('#MockupProfileTabGeneratorPlaceholder').length <= 0)	{
			var id = params['id'] || undefined;
			var objParam = {};
			if (id != undefined){
				objParam.id = id;
			}
			
			var template = $(tmpl('MockupProfileTabGenerator-Tmpl', objParam));
			var count = 0;
			var plugin = this;
			$('div.extension-point[extensionName="MockupProfileTab"]').each(function()	{
				$(this).append(template);
				$('.user-tab-item').removeClass('active');
				$(this).find(".user-tab a").each(function(){
					count++;
					if(plugin.ids[count-1] == page){
						$(this).addClass("active");
					}
					var curID = "userTab-" + count;
					$(this).attr("id",curID);
					$(this).addClass('user-tab-item');
				});
			});
		}
	},
	
	onEnd: function()	{
		if ($('#MockupProfileTabGeneratorPlaceholder').length > 0)
			$('#MockupProfileTabGeneratorPlaceholder').remove();
	}
}).implement(PluginInterface);

ProfileSearchHeaderPlugin = Class.extend({
	init: function()	{
		this.name = "ProfileSearchHeaderPlugin";
	},
	
	setupParameters: function()	{
		this.request = SingletonFactory.getInstance(Page).getRequest();
		this.label = '';
		this.style = 'grey_title';
		
		switch(this.request.getParam('page'))	{
		case 'ProfileQuestion':
		case 'UserQuestion':
			this.label = 'Các câu đã hỏi';
			break;
		case 'ProfileTarget':
		case 'UserTarget':
			this.label = 'Các câu được hỏi';
			break;
		case 'ProfileAnswer':
		case 'UserAnswer':
			this.label = 'Các câu đã trả lời';
			break;
		case 'Topic':
			this.label = 'Các câu hỏi trong chủ đề';
			break;
		case 'Introduce':
			this.label = 'Các câu hỏi mới cập nhật';
			this.style='browse_title';
			break;
		}
	},
	
	onBegin: function()	{
		this.setupParameters();
	},
	
	onReloadPlugin: function()	{
		this.setupParameters();
	},
	
	onHtmlUpdated: function()	{
		var label = this.label;
		var style = this.style;
		$('div.extension-point[extensionName="SearchResultTitle"]').each(function()	{
			if ($(this).find('[flag="ProfileSearchHeader"]').length > 0)
				return;
			$(this).append(tmpl('ProfileSearchHeaderTmpl', {label: label, style: style}));
		});
	}
}).implement(PluginInterface);

TopMenuNavPlugin = Class.extend({
	init: function()	{
		this.name = "TopMenuNavPlugin";
	},
	
	onHtmlRendered: function() {
		var page = SingletonFactory.getInstance(Page);
		$('a[page]').removeClass('active');
		$('a[page="'+page.pagename+'"]').addClass('active');
	}
}).implement(PluginInterface);
