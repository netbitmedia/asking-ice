/**
 * @author HungPDEditArticlePortlet: Portlet để nhập bài viết mới
 */
ArticleEditPortlet=Class.extend(
{
	init:function(){
		this.name="ArticleEditPortlet";
		//this.usingFacebox=true;
		this.topicValArray=Array();
		this.topicValInsertArray=Array();
		this.topicValDeleteArray=Array();
		this.topicTextArray=Array();
		this.articleID=-1;
		//alert("ubuntu");
		//hai cai bien nay de phuc vu cho text editor
		this.app = SingletonFactory.getInstance(Application);
		this.props = this.app.getSystemProperties();
					
		//window.location="#";
	},

	onBegin:function(){
		this.model={};
		var params=this.getRequest().getParams();
		this.articleID=params["ArticleID"];
		//alert(this.articleID);
		this.registerObserver();
		
		
	},
	onReloadPage: function()	{
		this.onBegin();
		this.run();
		//alert("aaa");
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
	run:function(){
		this.getPortletPlaceholder().paintCanvas(this.render());
		var curID = "HungPDEditArticlePortlet-ArticleTextEditor";
		var sbj = SingletonFactory.getInstance(Subject);
		sbj.notifyEvent("TinyEditorInit",{id : curID, content: ""});
		sbj.notifyEvent("HungPDEditArticleTopicInputFetchAutoComplete",{});
		
					
		this.bindingArticleFromServer();					
	},
	onHungPDEditArticleTopicInputFetchAutoComplete:function(){
		//
		var addTopicInputBox=$("#"+this.name+"-txtTopicInput");//this.requestForEffectiveResource("txtTopicInput");
		//addTopicInputBox.val("sasas");
		//alert("aaa");
		var eventData={};
		eventData.selectCallback="HungPDEditArticleTopicInputSelect";
		eventData.autocompleteObject=addTopicInputBox;
		eventData.autocompleteSource="ajax/autocomplete-catchwords";
		var subject=SingletonFactory.getInstance(Subject);
		subject.notifyEvent("NeedAutocomplete",eventData);
	},
	onHungPDEditArticleTopicInputSelect:function(eventData){
	    var ui = eventData.ui;
		var i = 0;
    	var txt = ui.item.label;
    	var value = ui.item.id;   
    	//alert(txt);
		this.appendsTopic({'txt':txt,'value':value});
	},		
	bindingArticleFromServer:function(){
		var obj=this;
		var currentArticle={};
		//alert(obj.articleID);
		//var att=this.requestForEffectiveResource("txtArticleName").val("âsasa");
		this.onAjax('article','get-article-from-id',{'articleID':obj.articleID},'GET',{
			'onSuccess':function(ret){
				try{
					currentArticle.articleID=ret.details.id;
					currentArticle.articleTypeID=ret.details.typeID;
					currentArticle.articleTitle=ret.details.title;
					currentArticle.articleSummary=ret.details.summary;
					currentArticle.catchwordsID=ret.catchwordsID;
					currentArticle.catchwordsName=ret.catchwordsName;
					currentArticle.articleContent=ret.details.content;
					//var start=0;
					if(obj.topicValArray==undefined){
						obj.topicValArray=Array();
					}
					if(obj.topicTextArray==undefined){
						obj.topicTextArray=Array();
					}
					for(start=0;start<currentArticle.catchwordsID.length;start++){
						obj.topicValArray.push(currentArticle.catchwordsID[start]);
						obj.topicTextArray.push(currentArticle.catchwordsName[start]);
						obj.appendsTopicFirstTime({'txt':currentArticle.catchwordsName[start],'value':currentArticle.catchwordsID[start]});
					}
					obj.requestForEffectiveResource("txtArticleName").val(currentArticle.articleTitle);
					obj.requestForEffectiveResource("cbArticleType").val(currentArticle.articleTypeID);
					obj.requestForEffectiveResource("SummaryTextEditor").val(obj.convertHtmlDataToDisplay(currentArticle.articleSummary));
					var mceID = obj.name+"-ArticleTextEditor";
					var instance = obj.props.get("memcached.tinyeditor");
					var str=ret.details.content;
					instance[mceID].e.body.innerHTML=obj.convertHtmlDataToDisplay(str);//th
					//instance[mceID].e.body.innerHTML.replace(/\/g,"&lt;");
					//alert(str.replace(/\\/g,''));
					
				} catch(err){
					obj.topicValArray=Array();
					obj.topicTextArray=Array();
					currentArticle.articleID="";
					currentArticle.articleTitle=ret.details.title;
					currentArticle.articleSummary=ret.details.summary;
					currentArticle.articleContent=ret.details.content;
					alert(err);
				}
				
				//alert(currentArray);
				//alert(currentArticle.articleTitle);
			}
		});
		
	},
	appendsTopicFirstTime:function(eventData){
		var txt=eventData.txt;
		var value=eventData.value;
		//alert(value);
		var obj=this;
		for(start=0;start<this.topicTextArray.length;start++){
			if(obj.topicValArray[start]==value){
					break;
			}
		}
		if(start==this.topicTextArray.length){
			this.topicValArray.push(value);
			this.topicTextArray.push(txt);
			//return;
			
		}
		//this.topicValArray.push(value);
		//this.topicTextArray.push(txt);
		//alert(this.topicTextArray.length);
		var topicContainer=this.requestForEffectiveResource("TopicsContainer");
		var txtTopicInput=this.requestForEffectiveResource("txtTopicInput");
		var textToken=$("<label class=\"tokenContent\">"+txt+"</label>");			
		var span=$("<span>").addClass("edit_class").append(textToken);
		var a=$("<span>").addClass("btnStl").addClass("delToken").bind("click",function(event){
			var start=0;
			for(start=0;start<obj.topicValArray.length;start++){
				if(obj.topicValArray[start]==value){
					break;
				}
			}
			obj.topicValDeleteArray.push(obj.topicValArray[start]);
			alert("delete list: "+obj.topicValDeleteArray.length);
			obj.topicValArray.splice(start,1);
			obj.topicTextArray.splice(start,1);
			$(event.target).parent().remove();
		}).html("X").css("text-align","center").appendTo(span)	;
		topicContainer.append(span);
				
	},
	appendsTopic:function(eventData){
		var txt=eventData.txt;
		var value=eventData.value;
		//alert(this.topicTextArray.length);
		//alert(value);
		var obj=this;
		for(start=0;start<this.topicTextArray.length;start++){
			if(obj.topicValArray[start]==value){
					break;
			}
		}
		if(start==this.topicTextArray.length){
			this.topicValArray.push(value);
			this.topicTextArray.push(txt);
			this.topicValInsertArray.push(value);
			
		} else{
			return;
		}
		//alert(this.topicTextArray.length);
		//this.topicValArray.push(value);
		//this.topicTextArray.push(txt);
		//alert(this.topicTextArray.length);
		var topicContainer=this.requestForEffectiveResource("TopicsContainer");
		var txtTopicInput=this.requestForEffectiveResource("txtTopicInput");
		var textToken=$("<label class=\"tokenContent\">"+txt+"</label>");			
		var span=$("<span>").addClass("uiToken").append(textToken);
		var a=$("<span>").addClass("btnStl").addClass("delToken").bind("click",function(event){
			var start=0;
			for(start=0;start<obj.topicValArray.length;start++){
				if(obj.topicValArray[start]==value){
					break;
				}
			}
			obj.topicValDeleteArray.push(obj.topicValArray[start]);
			//alert("delete list: "+obj.topicValDeleteArray.length);
			obj.topicValArray.splice(start,1);
			obj.topicTextArray.splice(start,1);
			$(event.target).parent().remove();
		}).html("X").css("text-align","center").appendTo(span)	;
		topicContainer.append(span);	
		//alert("insert list: "+obj.topicValInsertArray.length);	
	},		
	onHungPDEditArticleSubmit:function(eventData){
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
			//alert(selectedTopicsArray.length+" ");
			var conf=window.confirm('Bạn có chắc chắn muốn sửa');
			if(!conf){
				return;
			}
			var obj1=this;
			//alert(articleTitle);
			this.onAjax('article', 'edit-article', {'articleID':this.articleID,'title': articleTitle,'type':articleType,'summary':articleSummary, 'content': articleContent, 'catchwordsIDToDelete': obj1.topicValDeleteArray,'catchwordsIDToInsert': obj1.topicValInsertArray}, 'POST', 
			{'onSuccess': function(ret)	{
				obj1.topicValArray = Array();
				obj1.topicTextArray = Array();
				//alert("Thành công rồi!");
				var updateStatus=ret.message;
				//alert(ret.message);
				var sbj = SingletonFactory.getInstance(Subject);
				sbj.notifyEvent("NotifyGlobal", "Đã thay đổi bài viết thành công, bạn hãy đợi trong giây lát!");
				//window.alert('aaa');
				window.location='#!page/UserArticle';
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
		});
	};
	},
	onDeleteArticle:function(){
		var result=window.confirm('Bạn có chắc chắn xóa bài viết này?');
		if(result){
			
			this.onAjax('article', 'user-delete-article', {'articleID':this.articleID}, 'POST', 
			{'onSuccess': function(ret)	{
				window.alert('Cám ơn bạn. Nội dung bài viết đã được xóa');
				window.location='#!page/UserArticle';
			
			},
			onFailure:function(message){
			}});
		}
	},
	fetch:function(){			
	},
	onEnd: function(){
		this.unregisterObserver();
	}
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface).implement(AjaxInterface);