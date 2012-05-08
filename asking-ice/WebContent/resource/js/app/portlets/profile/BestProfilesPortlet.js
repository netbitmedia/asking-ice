BestProfilesPortlet = Class.extend({
	init : function() {
		this.name = "BestProfilesPortlet";
		this.model = {};
		this.defaultResultNo = 5;
	},
	
	onBegin: function(){
		this.registerObserver();
		this.cache = new Array();
		this.expertiseID = this.getRequest().getParam('id');
	},
	
	// done
	run : function() {
		var _this = this;
		this.getPortletPlaceholder().paintCanvas(this.render());
		var fl1 = 'expertise_name_' + this.expertiseID;
		var fl2 = 'expert_rank_position_' + this.expertiseID;
		var fl3 = 'expert_rank_percentage_' + this.expertiseID;
		var fl4 = 'expert_rank_name_' + this.expertiseID;
		var fl5 = 'interest_name_' + this.expertiseID;
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		var url = solrRoot+"/person/hardcore?wt=json&version=2.2&echoParams=NONE";
		var fl = 'profile_id,full_name,avatar,' + fl1 + "," + fl2 + "," + fl3 + "," + fl4 + "," + fl5;
		$.getJSON(url, {'rows':5,'q':this.expertiseID,'fl':fl}, function(ret){
			ret = ret.response.docs;
			_this.cache["bestprofilepage"] = 0;
			_this.cache["bestprofiles"] = new Array();
			if(ret.length != 0){
				_this.cache["bestprofiles"] = ret;
				_this.fetchData(ret, 0, _this.defaultResultNo);
			} else {
				_this.requestForEffectiveResource('TopContent').find(".top-userpro").append("<div class='italic'>Chưa có xếp hạng</div>");
			}
		});
	},
	
	fetchData: function(ret,start,stop){
		this.requestForEffectiveResource('TopContent').find(".top-userpro").empty();
		var isRanked = true;
		for( var i = start; i< stop; i++){
			if(ret[i] == undefined){
				continue;
			}
			var objParam = {};
			objParam.avatar = ret[i].avatar ;
			objParam.name = ret[i].full_name ;
			var expertiseName = 'expertise_name_' + this.expertiseID;
			var expertRankName = 'expert_rank_name_' + this.expertiseID;
			var interestName = 'interest_name_' + this.expertiseID;
			objParam.topic = ret[i][expertiseName] || ret[i][expertRankName] || ret[i][interestName];
			var expertiseRank = 'expert_rank_position_' + this.expertiseID;
			if(ret[i][expertiseRank] != undefined){
//						objParam.rank = ret[i][expertiseRank];
				objParam.rank = (i+1);
			} else {
				objParam.rank = undefined;
				isRanked = false;
			}
			objParam.id = ret[i].profile_id;
			var obj = {};
			var expertRankPercentage = 'expert_rank_percentage_' + this.expertiseID;
			obj.er = ret[i][expertRankPercentage] || 0;
			obj.total = 1000;
			objParam.tips = tmpl("ExpertiseRankDescription",obj);
			var data = tmpl("BestProfilesPortletItem",objParam);
			this.requestForEffectiveResource('TopContent').find(".top-userpro").append(data);
		}
		if(!isRanked){
			this.requestForEffectiveResource('TopContent').find(".top-userpro").prepend("<div class=\"italic\">Chưa có xếp hạng</div>");
		}
		var sbj = SingletonFactory.getInstance(Subject);
		sbj.notifyEvent("HtmlUpdated");
		
	},
	
	onBestProfilesNext: function(){
		this.cache["bestprofilepage"] ++;
		if(this.cache["bestprofilepage"] * this.defaultResultNo >= this.cache["bestprofiles"].length){
			this.cache["bestprofilepage"] --;
			return;
		}
		var start = this.cache["bestprofilepage"] * this.defaultResultNo;
		var stop = this.cache["bestprofilepage"] * this.defaultResultNo + this.defaultResultNo;
		this.fetchData(this.cache["bestprofiles"], start, stop);
	},
	
	onBestProfilesPrevious: function(){
		if(this.cache["bestprofilepage"] == 0){
			return;
		}
		this.cache["bestprofilepage"] --;
		var start = this.cache["bestprofilepage"] * this.defaultResultNo;
		var stop = this.cache["bestprofilepage"] * this.defaultResultNo + this.defaultResultNo;
		this.fetchData(this.cache["bestprofiles"], start, stop);
	},
	
	onReloadPage: function(){
		this.onBegin();
		this.run();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface);