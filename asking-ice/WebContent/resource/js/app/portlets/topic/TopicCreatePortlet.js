TopicCreatePortlet = Class.extend({
	init : function() {
		this.name = "TopicCreatePortlet";
		this.model = {};
		this.template = "";
		this.topics = null;
		this.app = SingletonFactory.getInstance(Application);
		this.root = this.app.getSystemProperties().get("host.root");
		this.addedTopics = null;
		this.topicMap = Array();
		this.topicAvaiContextCommit = Array();
		this.topicNewContextCommit = Array();
	},
	
	onBegin: function()	{
		this.registerObserver();
		this.template = $(tmpl("CommonPortlet-TopicNew",{}));
	},
	
	onNewTopicAdded: function(eventData){
		var topicID = eventData.name;
		var topicDesID = eventData.des;
		
		var topicContent = $("#" + topicID).val().trim();
		var topicDes = $("#" + topicDesID).val().trim();
		
		if(topicContent == "" || topicDes == ""){
			alert("Chưa nhập đủ chủ đề và chi tiết chủ đề");
			return;
		}
		
		// đã có
		var objParam = {};
		objParam.content = topicContent;
		if(this.topicMap[objParam.content]){
			alert("Đã có chủ đề này.");
			return;
		}
		this.topicMap[objParam.content] = true;
		var template = tmpl("CommonPortlet-Topic",objParam);
		$("#commonCreatedTopics").append(template);
		objParam = {};
		objParam.topicName = topicContent;
		objParam.topicDes = topicDes;
		this.topicAvaiContextCommit.push(objParam);
	
		// reset
		$("#" + topicID).val("");
		$("#" + topicDesID).val("");
	},
	
	prepareTopics: function(){
		if(SingletonFactory.getInstance(Application).getSystemProperties().get("memcached.topics") == undefined){
			this.getAjaxAllTopics();
		}
	},
	
	getAjaxAllTopics: function(){
		var curPlt = this;
		this.onAjax('catchword', 'get-all-catchwords', {}, 'get', {
			onSuccess: function(ret){
				curPlt.preparedAvaiTopics (ret);
				curPlt.topics = ret;
				SingletonFactory.getInstance(Application).getSystemProperties().set("memcached.topics",ret);
			}
		});
		this.topics = curPlt.topics;
	},
	
	preparedAvaiTopics: function(arr){
		for ( var key in arr) {
			var curObj = arr[key];
			content = curObj['catchWord'];
			this.topicMap[content] = true;
		}
	},
	
	buildTopics: function(arr){
		var result = $("<div><div></div></div>");
		for ( var key in arr) {
			var curObj = arr[key];
			var newTp = $("<option value='"+curObj['id']+"'>"+curObj['catchWord']+"</option>");
			result.children().append(newTp);
		}
		return result.children();
	},
	
	onNewTopicConfirmed: function(){
		var curPlt = this;
		this.numCount = this.topicAvaiContextCommit.length;
		this.done = 0;
		for(var key in this.topicAvaiContextCommit){
			var curObj = this.topicAvaiContextCommit[key]; 
			var sbj = SingletonFactory.getInstance(Subject);
			this.onAjax('catchword', 'add-new-topic', curObj, 'post', {
				onSuccess: function(ret){
					if(!isNaN(ret)){
						curPlt.done++;
						sbj.notifyEvent("NotifyGlobal","Thêm thành công");
						sbj.notifyEvent("CommitTopicSuccess", {'value': ret, 'txt':curObj.topicName});
					}
				},
				onFailure: function(){
					sbj.notifyEvent("NotifyGlobal","Thêm thất bại");
				}
			});
		}
	},
	
	onCommitTopicSuccess: function()	{
		if(this.done < this.numCount){
			return;
		}
		var sbj = SingletonFactory.getInstance(Subject);
		var rq = SingletonFactory.getInstance(Page).getRequest();
		var params = rq.getParams();
		var page = params["pageCallBack"] || "Home";
		var needParam = params["needParam"] || {};
		var paramVal = params["paramVal"] || null;
		var paramName = params["paramName"] || null;
		var request = null;
			
		if(eval(needParam)){
			if(paramVal != null && paramName!= null){
				var obj = {};
				obj[paramName] = paramVal;
				request = new Request(page,"",obj);
			} else {
				request = new Request(page,"",{});
			}
		} else {
			request = new Request("Home","",{});
		}

		sbj.notifyEvent('RequestRoute', request);
	},
	
	run : function() {
		this.prepareTopics();
		this.getPortletPlaceholder().drawToCanvas(this.template);
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface).implement(AjaxInterface);