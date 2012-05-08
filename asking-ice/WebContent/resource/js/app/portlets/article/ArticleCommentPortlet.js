/**
 * @author Hung
 */
ArticleCommentPortlet = Class.extend({
	init : function() {
		this.name="ArticleCommentPortlet";
		this.articleID=null;
		this.articleDetail=null;
		this.model = {};
		this.root = SingletonFactory.getInstance(Application).getSystemProperties().get("host.root");
		this.uid = SingletonFactory.getInstance(Application).getSystemProperties().get("user.id");
		this.needMCE=true;
		this.activeCommentPage=1;
		this.totalCommentPage=0;
	},
	
	onBegin : function() {
		this.registerObserver();
		this.getArticleID();				
	},
	
	trim:function(s) {
			return s.replace(/^\s+/,"").replace(/\s+$/, "");
	},
	
	trimOfEditor:function(s){
		return s.replace(/^(&nbsp;)+/,"").replace(/(&nbsp;)+$/,"");
	},				
	
	convertHtmlDataToDisplay:function(s){
		return s.replace(/\\n/g,'').replace(/\\/g,'');
	},
	
	getArticleID : function(){
		this.articleID = this.getRequest().getParam('aid');
		if(this.articleID == null || this.articleID == undefined){
			var subject = SingletonFactory.getInstance(Subject);
			var request = new Request("ErrorPage", undefined, {"code":"888", "msg":"Lỗi","content":"Bài viết không tồn tại trong hệ thống!"}); 
			subject.notifyEvent('RequestRoute', request);
		}
	},
	
	getAjax:function(){
		var curPlt=this;
		this.onAjax('article','get-detail',{'id':this.articleID},'POST', {
			onSuccess: function(ret)	{
				curPlt.articleDetail=ret;		
				//curPlt.totalCommentPage=parseInt(curPlt.articleDetail.commentsID.length/5);
				curPlt.model = ret;
				var atype = ret.type;
				if (atype == 1)	{
					curPlt.model.atype = "Bài báo khoa học";
				} else if (atype == 2)	{
					curPlt.model.atype = "Bài chia sẻ kinh nghiệm";
				} else if (atype == 3) {
					curPlt.model.atype = "Câu hỏi hay";
				} else {
					curPlt.model.atype = "Bài phỏng vấn";
				}
				//curPlt.buildArticleComments();
				
				curPlt.getPortletPlaceholder().paintCanvas(curPlt.render());		
				//curPlt.initEditor();
				//curPlt.buildArticleCommentPagination();
				
				$('.simple_tab a').removeClass('active');
				$('.simple_tab a[type='+atype+']').addClass('active');
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('CleanFont');
			},
			onFailure:function(message){
				alert("thất bại rồi!");
			}
		});
	},
	
	initEditor : function()	{
		if(this.needMCE){
			this.requestForEffectiveResource('TextAreaContainer').html(this.renderView('MCE', {}));
			var curID = "HungPDArticleCommentPortlet-CommentTextEditor";
			//var sbj = SingletonFactory.getInstance(Subject);
			//sbj.notifyEvent("TinyEditorInit",{id : curID, content: ""});
		}
	},
	
	buildArticleContent:function(){
		var objParams={};
		var templateID=this.name+"-content-template";
		objParams.articleID=this.articleDetail.details.id;
		objParams.content=this.convertHtmlDataToDisplay(this.articleDetail.details.content);
		var contentContent=tmpl(templateID,objParams);
		this.model.articleContent=contentContent;
	},
	
	buildArticleComments:function(){
		var objParams={};
		
		var templateID=this.name+"-articleComment-template";
		var commentContent="";
		var commentList=this.articleDetail.commentsUserID;
		if(commentList.length==0){
			this.model.articleComments="";
			return;
		}
		start=(this.activeCommentPage-1)*5;
		while((start<(this.activeCommentPage*5))&&(start<this.articleDetail.commentsID.length)){
			objParams={};
			objParams.commentsID=this.articleDetail.commentsID[start];
			objParams.commentsUserID=this.articleDetail.commentsUserID[start];
			
			objParams.commentsUserFullName=this.articleDetail.commentsUserFullName[start];
			
			objParams.commentsCreatedDate=this.articleDetail.commentsCreatedDate[start];
			objParams.commentsContent=this.convertHtmlDataToDisplay(this.articleDetail.commentsContent[start]);
			commentContent+=tmpl(templateID,objParams);	
			start++;
		};
		this.model.articleComments=commentContent;
	},
	
	buildArticleCommentPagination:function(){
		var objParams={};
		objParams.activeCommentPage=this.activeCommentPage;
		objParams.totalCommentPage=this.totalCommentPage;
		if(this.totalCommentPage>1){			
		this.requestForEffectiveResource('NavigationLink').html(tmpl('HungPDArticleCommentPortlet-articleComment-SearchMoreButton-template',objParams));
		//alert(tmpl('HungPDArticleCommentPortlet-articleComment-SearchMoreButton-template',objParams));	
		}
	},
	
	onSubmitComment:function(eventData){
		var obj =this;// obj.name+"-CommentTextEditor";
        var str=this.trim($("#"+this.name+"-CommentTextEditor").val());
        if(this.trim(str).length>300){
        	alert("Rất tiếc! Hãy nhập đúng 300 từ");
        } else if(this.trim(str).length==0){
        	alert("Không nhập nội dung rỗng!");        	
        } else{
        	this.onAjax('article','add-article-comment',{'articleID':this.articleID,'content':str},'POST', {
        		onSuccess: function(ret)	{
					obj.run();					
				},
				onFailure:function(message){
					alert("thất bại rồi!");
				}
			});
        };        
	},
	
	onDeleteArticleComment:function(eventData){
		var obj=this;
		var cid=eventData.commentID;
		var result=window.confirm("Có chắc chắn xóa ?");
		if(!result){
			return;
		}
		this.onAjax('article','delete-article-comment',{'commentID':cid},'POST', 
		{'onSuccess': function(ret)	{
			obj.run();
		},
		onFailure:function(message){
			alert("thất bại rồi!");
		}});
	},
	
	onArticleVoteSubmit:function(){
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('NeedLogin', {type: "ArticleVoteSubmit"});
	},
	
	onLoginSuccess: function(eventData) {
		if (eventData.type != 'ArticleVoteSubmit')
			return;
		var obj=this;
		var articleID=this.articleID;
		this.onAjax('article','add-vote',{'id':articleID},'POST', {
			onSuccess: function(ret)	{
				var oldVote = parseInt(obj.requestForEffectiveResource('ArticleVote').html());
				obj.requestForEffectiveResource('ArticleVote').html(oldVote+1);
			}
		});
	},
	
	onUpdateCommentPage:function(eventData){
		if(this.activeCommentPage==1&&eventData.type==-1){
			return;
		}
		if(this.activeCommentPage==this.totalCommentPage&&eventData.type==1){
			return;
		}
		this.activeCommentPage+=eventData.type;
		this.run();
				
	},		
	
	run : function() {
		this.getAjax();
	},
	
	onReloadPage : function(){
		this.init();
		this.onBegin();
		this.run();
	},
	
	onEnd : function()	{
		this.unregisterObserver();
	}	
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface).implement(AjaxInterface);