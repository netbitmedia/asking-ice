ProfileEduViewPortlet = Class.extend({
	
	init: function()	{
		this.name = "ProfileEduViewPortlet";
	},
		
	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},

	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
		this.fetch();
	},
	
	fetch: function()	{
		var obj = this;
		this.onAjax('ajax', 'get-profile-info', {}, 'GET', {
			'onSuccess': function(ret)	{
				var tmplType = "SchoolTmpl";
				var tblName = "";
				var id = ret['primary_bind'];
				obj.dynamicRender(ret, tblName, id, tmplType, 'profile', null, 1);
			},
		});
	},
	
	upperCaseFirstLetter: function(x){
		return x.substring(0,1).toUpperCase() + x.substring(1);
	},
	
	dynamicRender: function(ret, tblName, id, tmplType, profileExtensionName, fatherID, level){
		obj = this;
		obj.encapData(ret, tblName, id, level);
		var tmp = "[profileExtension='"+profileExtensionName+"']:last";
		var profileExtension = $(obj.requestForEffectiveResource('Profile')).find(tmp);
		profileExtension.append(obj.renderView(tmplType, {partner: ret}));
		for (var j in ret){
			if ((typeof ret[j].val) === "object"){
				var x = j;
				var fatherID2 = ret[j].id;
				ret[x] = ret[x]['val'];
				for (var i in ret[x]){
					var id2 = ret[x][i]['id'];
					var tblName2 = "profileDetailed" + obj.upperCaseFirstLetter(x);
					var ret2 = ret[x][i];
					ret2.fatherID=fatherID2;
					ret2.tbl=tblName2;
					ret2.isNew=0;
					ret2.level=level;
					var tmplType2 = obj.upperCaseFirstLetter(x)+"Tmpl";
					var profileExtensionName2 = x;
					this.dynamicRender(ret2, tblName2, id2, tmplType2, profileExtensionName2, fatherID2, level+2);
					// obj.encapData(ret[x][i], "profileDetailed" + obj.upperCaseFirstLetter(x) , id);
					// var html = tmpl("MockupPartnerProfileEditPortlet-"+obj.upperCaseFirstLetter(x)+"Tmpl",{partner: ret[x][i]});
					// $("#MockupPartnerProfileEditPortlet-"+obj.upperCaseFirstLetter(x)+"s").append(html);
				}
			}
		}
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}

}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface).implement(AjaxInterface).implement(InlineEditorInterface);