ErrorPortlet = Class.extend(
{
	init : function() {
		this.name = "ErrorPortlet";
		this.model = {};
		this.heading = "";
		this.errorCode = "";
		this.data = {};
	},
	
	onBegin: function()	{
		this.registerObserver();
		this.getHandledErrorCode();
		this.prepareData();
		this.prepareTemplate();
	},
	
	getHandledErrorCode: function(){
		var data = tmpl("ErrorPortlet-HandledErrorCode",{});
		return eval(data);
	},
	
	checkErrorCode: function(errorCode){
		if(errorCode == undefined || errorCode == null){
			return true;
		}
		var data = this.getHandledErrorCode();
		for(var key in data){
			if(data[key] == errorCode){
				return true;
			}
		}
		return false;
	},
	
	prepareData: function(){
		var request = SingletonFactory.getInstance(Page).getRequest();
		var params = request.getParams();
		this.errorCode = params["code"] || 404;
		this.heading = params["msg"] || this.getMsgHeading("");;
		this.data = params['content'] || this.getMsgContent("");
		if(this.checkErrorCode(this.errorCode)){
			this.heading = this.getMsgHeading(this.errorCode);
			this.data = this.getMsgContent(this.errorCode);
		}
	},
	
	prepareTemplate: function(){
		this.model.errorHeader = this.heading;
		this.model.errorContent = this.data;
	},
	
	getMsgHeading: function(errorCode){
		var errorCodeID = "ErrorCode" + errorCode;
		return this.getPrefetchData(errorCodeID, "_Heading");
	},
	
	getMsgContent: function(errorCode){
		var errorCodeID = "ErrorCode" + errorCode;
		return this.getPrefetchData(errorCodeID, "_Content");
	},
	
	getPrefetchData: function(id,type){
		try{
			return tmpl(this.name + "-" + id + type,{});
		}
		catch(ex){
			return tmpl(this.name + "-" + "ErrorCode" + type,{});
		}
	},

	run : function() {
		this.getPortletPlaceholder().drawToCanvas(this.render());
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface);