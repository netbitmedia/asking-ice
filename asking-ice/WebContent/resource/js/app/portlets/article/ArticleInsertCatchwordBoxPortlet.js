/*
 * HungPDInsertArticleCatchwordBoxPortlet: Popup hiện lên để nhập các topic cho bài viết
 */
ArticleInsertCatchwordBoxPortlet = Class.extend({
	init:function(){
		this.name="ArticleInsertCatchwordBoxPortlet";
		this.model={};
		this.selectedTopics = Array();
		this.selectedTopicsName=Array();
		this.usingFacebox=false;
		this.activeText="";
		this.activeValue="";
		//alert('asasasasa');
	},
	requestForEffectiveResource: function(targetName){
		if(this.usingFacebox){
			return $("#"+this.name+"-"+targetName);
		}else{
			return this._super.requestForEffectiveResource(targetName);
		}
	},	
	onBegin:function(){
		this.registerObserver();
	},
	onReloadPage:function(){
		this.onBegin();
		this.run();
	},
	onInsertArticleCatchwordsShow:function(eventData){
			//alert("Ha ha ha");
			this.showPortlet(eventData);
	},
	showPortlet:function(eventData){
		/*var loggedIn = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		if (loggedIn != 1)	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent("NeedLogin", {type: 'InsertArticleCatchword', event: eventData});
		} else {
			this.doShowPortlet(eventData);
		}*/
		this.doShowPortlet(eventData);
	},
	doShowPortlet:function(eventData){
		
		/*
	
		 */
		this.usingFacebox=true;
		var app=SingletonFactory.getInstance(Application);
		var subject=SingletonFactory.getInstance(Subject);
		//this.model.optionMsg=$("#"+this.name+"-TextOptionalMessage").html();
		//this.model.optionalDetailMsg=$("#"+this.name+"-TextOptionalDetailMessage").html();
		//this.model.askMsg=$("#"+this.name+"-TextAskMessage").html();
		//alert("Ha ha ha");
		subject.notifyEvent('ShowPopup',{id:'HungPDInsertArticleCatchwordBox',title:'Hãy nhập topic',content:this.render()});
//		alert(this.selectedTopics.length+" a");
		if(this.selectedTopics!=undefined&&this.selectedTopics.length>0){
		var start=0;
		for(start=0;start<this.selectedTopics.length;start++){
		//	alert("asdasdasdassd");
			this.activeText=this.selectedTopicsName[start];
			this.activeValue=this.selectedTopics[start];
			this.appendTopic();
		};
			//appendT
		}

		var sbj = SingletonFactory.getInstance(Subject);
		sbj.notifyEvent("FetchArticleTopicsAutoComplete");			
		//alert("Ha ha ha");
	},	
	run:function(){
		//alert(this.selectedTopics.length+" a");
		this.getPortletPlaceHolder.paintCanvas(this.render());
	},

	onEnd:function(){
		//alert("Ko gọi nữa");
		this.unregisterObserver();
	},	
	onFetchArticleTopicsAutoComplete:function(){
		var eventData = {};
		//alert('sấ');		
		var addTopicInputBox = this.requestForEffectiveResource("InputBox"); 
		eventData.selectCallback="InsertArticleCatchwordSelect";//"AskNonTargetQuestionTopicSelect";
		eventData.autocompleteObject=addTopicInputBox;
		eventData.autocompleteSource="ajax/autocomplete-catchwords";
		//alert(addTopicInputBox.val());
		var subject=SingletonFactory.getInstance(Subject);
		subject.notifyEvent('NeedAutocomplete',eventData);
		//alert($(addTopicInputBox).val()+"sdds");
	},	
	onInsertArticleCatchwordSelect: function(eventData)	{
		//alert("ubuntu");
		var ui = eventData.ui;
		var i = 0;
		var txt = ui.item.label;
		var value = ui.item.id;	
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('InsertArticleCatchwordPortletAppend', {'txt': txt, 'value': value});
	},
	
	onInsertArticleCatchwordPortletAppend: function(eventData)	{
		var txt = eventData.txt;
		var value = eventData.value;
		var topicContainer = this.requestForEffectiveResource("AddTopicContainer");
		var addTopicInputBox = this.requestForEffectiveResource("InputBox");
		if (this.selectedTopics == undefined)
			this.selectedTopics = Array();
		if (this.selectedTopicsName == undefined)
			this.selectedTopicsName = Array();	
		for( i=0; i<this.selectedTopics.length;i++ ){
			if(this.selectedTopics[i] === value){
				return;
			}
		}
		var textToken = $("<label class='tokenContent'>"+txt+"</label>");
		
		this.selectedTopics.push(value);
		this.selectedTopicsName.push(txt);
		
		// UI ONLY
		var obj=this;
		var selectedTopics = this.selectedTopics;
		var selectedTopicsName = this.selectedTopicsName;
		var span = $("<span>").addClass("uiToken").append(textToken);
		var a = $("<span>").addClass("btnStl").addClass("delToken").bind("click",function(event){
				var start = 0;
				for( start=0; start<selectedTopics.length; start++ ){
					if(selectedTopics[start] === value){
						break;
					}
				}
				selectedTopics.splice(start, 1);
				selectedTopicsName.splice(start, 1);
				//obj.selectedTopicsName.pop(2);
				//alert($(event.target).parent());
				$(event.target).parent().remove();
			}).html("X").css("text-align","center").appendTo(span);
		topicContainer.append(span);
	},
	onInsertArticleCatchwordsButtonClick:function(eventData){
		//alert('I love you!');
		//var addTopicInputBox = this.requestForEffectiveResource('InputBox'); 
		//var term=this.requestForEffectiveResource('InputBox').val();
		//alert(term+" sdds");
		
		var subject=SingletonFactory.getInstance(Subject);
		subject.notifyEvent('AppendTopicsToPage',{topicValue:this.selectedTopics,topicText:this.selectedTopicsName});
		//this.selectedTopics=Array();
		//this.selectedTopicsName=Array();
	},
	appendTopic:function(){
		var txt =this.activeText;// eventData.txt;
		var value = this.activeValue;//eventData.value;
		var topicContainer = this.requestForEffectiveResource("AddTopicContainer");
		var addTopicInputBox = this.requestForEffectiveResource("InputBox");
		if (this.selectedTopics == undefined)
			this.selectedTopics = Array();
		if (this.selectedTopicsName == undefined)
			this.selectedTopicsName = Array();	
	
		var textToken = $("<label class='tokenContent'>"+txt+"</label>");
		//viec can o day chi la gan, ko can phai dua ra nua
		//this.selectedTopics.push(value);
		//this.selectedTopicsName.push(txt);
		
		// UI ONLY
		var selectedTopics = this.selectedTopics;
		var selectedTopicsName=this.selectedTopicsName;
		var span = $("<span>").addClass("uiToken").append(textToken);
		var a = $("<span>").addClass("btnStl").addClass("delToken").bind("click",function(event){
				var start = 0;
				for( start=0; start<selectedTopics.length; start++ ){
					if(selectedTopics[start] === value){
						break;
					}
				}
				selectedTopics.splice(start, 1);
				selectedTopicsName.splice(start, 1);
				//alert("da co");
				$(event.target).parent().remove();
			}).html("X").css("text-align","center").appendTo(span);
		topicContainer.append(span);
	},
	onInsertArticleCatchwordsButtonClick:function(eventData){
		//alert('I love you!');
		//var addTopicInputBox = this.requestForEffectiveResource('InputBox'); 
		//var term=this.requestForEffectiveResource('InputBox').val();
		//alert(term+" sdds");
		
		var subject=SingletonFactory.getInstance(Subject);
		subject.notifyEvent('AppendTopicsToPage',{topicValue:this.selectedTopics,topicText:this.selectedTopicsName});
	}
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface).implement(AjaxInterface);
