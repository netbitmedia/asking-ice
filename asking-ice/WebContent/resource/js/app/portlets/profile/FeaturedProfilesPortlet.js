FeaturedProfilesPortlet = Class.extend({
	init: function()	{
		this.name = "FeaturedProfilesPortlet";
	},
	
	run: function()	{
		var obj = this;
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		var url = solrRoot+"/person/best?wt=json&version=2.2&echoParams=NONE";
		$.getJSON(url, {
			'start':0, 'rows':7
		}, function(ret)	{
				var docs = ret.response.docs;
				obj.model = {};
				obj.model.users = Array();
				//shuffle
				var shuffled = Array();
				for(var i=0;i<2;i++)	{
					var rand = Math.floor(Math.random()*docs.length);
					shuffled.push(docs[rand]);
					docs.splice(rand, 1);
				}
				
				for(var i=0;i<shuffled.length;i++)	{
					var expertises = Array();
					if (shuffled[i].expertise != undefined)	{
						for(var j=0;j<shuffled[i].expertise.length && j<2;j++)	{
							expertises.push(shuffled[i].expertise[j]);
						}
					}
					expertises = expertises.join(', ');
					if (expertises.length > 20)
						expertises = expertises.substr(0, 17)+'...';
					obj.model.users.push({id: shuffled[i].profile_id, name:shuffled[i].full_name, expertise:expertises});
				}
				obj.getPortletPlaceholder().paintCanvas(obj.render());
			});
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface);