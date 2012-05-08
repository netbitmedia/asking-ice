/**
 * @author HungPDInsertArticlePortlet: Portlet để nhập bài viết mới
 */
ArticleInsertPortlet=Class.extend(
{
	init:function(){
		this.name="ArticleInsertPortlet";
		//this.usingFacebox=true;
		this.topicValArray=Array();
		this.topicTextArray=Array();
		//alert("ubuntu");
		//hai cai bien nay de phuc vu cho text editor
		this.app = SingletonFactory.getInstance(Application);
		this.props = this.app.getSystemProperties();
					
		//window.location="#";
	},
	/*requestForEffectiveResource: function(targetName){
		if(this.usingFacebox){
			return $("#"+this.name+"-"+targetName);
		}else{
			return this._super.requestForEffectiveResource(targetName);
		}
	},*/	
	onBegin:function(){
		//this.model={};
		this.registerObserver();
		
		
	},
	onReloadPage: function()	{
		this.onBegin();
		this.run();
		//alert("aaa");
	},
	onAppendTopicsToPage:function(eventData){
		//alert(eventData.id);
		var stringToAppend="<br/>";
		this.topicValArray=eventData.topicValue;
		this.topicTextArray=eventData.topicText;
		var start=0;
		for(start=0;start<this.topicValArray.length;start++){
			stringToAppend+=this.topicTextArray[start]+" "+this.topicValArray[start]+"<br/>";
		};
		stringToAppend+="<br/>";
		
		this.requestForEffectiveResource('TopicsContainer').html(stringToAppend);
		//var sub
		//alert($('HungPDInsertArticlePortlet-TopicsContainer'));
		
		var sbj=SingletonFactory.getInstance(Subject);
		
		sbj.notifyEvent("PopupRemove", {id: 'HungPDInsertArticleCatchwordBox'});
	},

	run:function(){
		//falert('sdsdsd');
		//chu y day la noi ma in cai portlet ra
		
		this.getPortletPlaceholder().paintCanvas(this.render());
		//sbj.notifyEvent("TinyEditorInit",{id:curID,content: ""});
		//alert('aaaaaaaa');
		var curID = "HungPDInsertArticlePortlet-ArticleTextEditor";
		var sbj = SingletonFactory.getInstance(Subject);
		sbj.notifyEvent("TinyEditorInit",{id : curID, content: ""});					
	},
	trim:function(s) {
		return s.replace(/^\s+/,"").replace(/\s+$/, "");
	},
	trimOfEditor:function(s){
		return s.replace(/^(&nbsp;)+/,"").replace(/(&nbsp;)+$/,"");
	},
	onHungPDInsertArticleSubmit:function(eventData){
		//alert("hungpd");
		//dau tien chung ta se validate truoc khi chay
		//ArticleError
		var errorArray=Array();
		var articleTitle=this.trim(this.requestForEffectiveResource("txtArticleName").val());
		var articleType=this.trim(this.requestForEffectiveResource("cbArticleType").val());		
		//alert(articleType);				
		var mceID = this.name+"-ArticleTextEditor";
		var instance = this.props.get("memcached.tinyeditor");
		var articleContent =this.trim(this.trimOfEditor(instance[mceID].e.body.innerHTML));//this.trimOfEditor(instance[mceID].e.body.innerHTML);
		var articleSummary=this.trim(this.requestForEffectiveResource("SummaryTextEditor").val());
		
		//alert(articleSummary);
		var topicLength=this.topicValArray.length;
	//	alert(articleTitle+" - "+articleContent+" - "+topicLength);
		if(articleTitle==""){
			errorArray.push("Hãy nhập tiêu đề bài viết!");
		}
		if(articleContent==""||articleContent=="<br>"){
			errorArray.push("Hãy nhập nội dung bài viết!");
		}			
		if(topicLength<=0){
			errorArray.push("Bài viết phải thuộc topic nào đó!");
		}
		if(errorArray.length>0){
			var errorList="<br/><font color=\"red\">";
			var start=0;
			for(start=0;start<errorArray.length;start++){
				errorList+=errorArray[start]+"<br/>";
				//alert(errorList);
			}
			errorList+="</font>";
			this.requestForEffectiveResource("ArticleError").html(errorList);
		} else{
			var selectedTopicsArray = null;
			if(this.topicValArray.length > 0){
				selectedTopicsArray = new Array();
			for( var i=0; i<this.topicValArray.length; i++ ){
			//	alert(this.topicValArray[i]);
				selectedTopicsArray.push({"catchword_id":this.topicValArray[i]}); 
			};
			//alert(selectedTopicsArray.length+" ");
			var obj1=this;
			this.onAjax('article', 'add-article', {'title': articleTitle,'type':articleType,'summary':articleSummary, 'content': articleContent, 'catch': selectedTopicsArray}, 'POST', 
			{'onSuccess': function(ret)	{
				obj1.topicValArray = Array();
				obj1.topicTextArray = Array();
				//alert("Thành công rồi!");
				var sbj = SingletonFactory.getInstance(Subject);
				sbj.notifyEvent("NotifyGlobal", "Đã nhập bài viết thành công, bạn hãy đợi trong giây lát!");
				window.location='#!page/Article';
			},
			'onFailure': function(message)	{
				var errorArray=Array();
				errorArray.push("Lỗi đã xảy ra khi đưa câu hỏi. Vui lòng check lại thông tin!");
				//	alert("Lỗi bực quá");
				var errorList="<br/><font color=\"red\">";
				var start=0;
				for(start=0;start<errorArray.length;start++){
					errorList+=errorArray[start]+"<br/>";
				//alert(errorList);
				}
			errorList+="</font>";
				obj1.requestForEffectiveResource("ArticleError").html(errorList);
				//obj.requestForEffectiveResource("QuestionError").html(obj.getLocalizedText("AskError"));
			}
			})
	};
			//alert("Nhập đúng rồi!");
		};
	},
	fetch:function(){			
	},
	onEnd: function(){
		this.unregisterObserver();
	}
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface).implement(AjaxInterface);