/**
 * Page is a class for attaching portlets to appropriate position
 * a Page manages the display 
 * FIXME: not sure about provide supporting for template in each page ! 
 * currently unsupport
 * @augments Class
 * @author griever
 */

Page = Class.extend({
	
	/**
	 * Initialize fields
	 * @constructor
	 */
	init: function(){
		if(Page.singleton == undefined){
			throw "Page is Singleton !";
			return undefined;
		}
		this.portletContainer = SingletonFactory.getInstance(PortletContainer);
		this.pluginManager = SingletonFactory.getInstance(PluginManager);
		this.pagename = "";
		this.subject = SingletonFactory.getInstance(Subject);
	},
	
	/**
	 * Attach portlets to the page
	 * @function
	 */
	attachPortlets: function(){
		/*
		 * check for consistency with layout in here
		 * + portlet existence
		 * + portlet position
		 * + portlet active (?)
		 */
		for( var item in this.layout ){
			item = this.layout[item];
			if(item.active == undefined){
				item.active = true;
			}
			if (item.params == undefined)	{
				item.params = Array();
			}
			var existed = false;
			for( var i=0; i<this.portletContainer.portlets.length; i++ )	{
				var portletMeta = this.portletContainer.portlets[i];
				if( item.portlet === portletMeta.portlet.getName() ){
					existed = true;
					portletMeta.portlet.setInitParameters(item.params);
					portletMeta.active = item.active;
					if( item.position !== portletMeta.position ){
						portletMeta.position = item.position;
						this.portletContainer.movePortlet(portletMeta,item.position);
					}
					if ( item.active == true)	{
						//portlet need reload?
						try {
							portletMeta.portlet.onReloadPage();
							portletMeta.loaded = true;
						} catch (err)	{
							log(err);
						}
					}
					break;
				}
			}
			if(!existed){
				if (window[item.portlet] == undefined)	{
					log('portlet '+item.portlet+' is undefined');
				} else {
					var portlet = new window[item.portlet]();
					portlet.setInitParameters(item.params);
					this.portletContainer.addPortlet(portlet,item);
				}
			}
		}
		var portletsToRemoved = Array();
		for( var i=0; i<this.portletContainer.portlets.length; i++ )	{
			var portletMeta = this.portletContainer.portlets[i];
			var keep = false;
			for(var item in this.layout){
				item = this.layout[item];
				if( item.portlet === portletMeta.portlet.getName() ){
					if (item.active == false)	{
						this.portletContainer.deactivatePortlet(portletMeta);
					}
					keep = true;
					break;
				}
			}
			if(!keep){
				portletsToRemoved.push(portletMeta);
			}
		}
		for(var i=0;i<portletsToRemoved.length;i++)	{
			var plt = portletsToRemoved[i];
			var indexOf = this.portletContainer.portlets.indexOf(plt);
			this.portletContainer.removePortlet(indexOf);
		}
	},
	
	/**
	 * Private function
	 * Parse the layout
	 * @function
	 */
	generateData: function(pagename){
		var data = {};
		var tmp = {};

		if (pagename == undefined)	{
			throw {"Exception": "NotFound", "Message": "Page name is undefined"};
			return undefined;
		}
		var app = SingletonFactory.getInstance(Application);
		var jsonObj = app.getResourceManager().requestForResource("portlets",pagename);
		if (jsonObj == undefined)	{
			//console.error(pagename+' not exist!');
			throw {"Exception": "NotFound", "Message": 'Page name "'+pagename+'" not found!'};
			return undefined;
		}
		var jsonText = jsonObj.html();
		tmp = eval("("+jsonText+")");
		data.parent = tmp.parent;
		data.plugins = tmp.plugins;
		data.layout = tmp.portlets;
		var i,j;
		var toAddPlugins = new Array();
		var toAddPortlets = new Array();
		while(data.parent != undefined){
			jsonObj = app.getResourceManager().requestForResource("portlets",data.parent);
			if (jsonObj == undefined)	{
				//console.error(data.parent+' not exist!');
				throw {"Exception": "NotFound", "Message": '(Parent)Page name "'+data.parent+'" not found!'};
				return undefined;
			}
			jsonText = jsonObj.html();
			toAddPlugins = new Array();
			toAddPortlets = new Array();
			tmp = eval("("+jsonText+")");
			for( i=0; i<tmp.plugins.length; i++ )	{
				var existed = false;
				for( j=0; j<data.plugins.length; j++ )	{
					if(tmp.plugins[i].plugin == data.plugins[j].plugin){
						existed = true;
						break;
					}
				}
				if(!existed){
					toAddPlugins.push(tmp.plugins[i]);
				}
			}
			for( i=0; i<tmp.portlets.length; i++ )	{
				var existed = false;
				for( j=0; j<data.layout.length; j++ )	{
					if(tmp.portlets[i].portlet == data.layout[j].portlet){
						existed = true;
						break;
					}
				}
				if(!existed){
					toAddPortlets.push(tmp.portlets[i]);
				}
			}
			for( i=0;i<toAddPlugins.length;i++ ){
				data.plugins.push(toAddPlugins[i]);
			}
			for( i=0;i<toAddPortlets.length;i++ ){
				data.layout.push(toAddPortlets[i]);
			}
			data.parent = tmp.parent;
		}
		/*
		if(tmp.position != undefined){
			data.template = app.getResourceManager().requestForResource("page",pagename).html();
			data.position = tmp.position;
		}
		*/
		return data;
	},
	
	/**
	 * Get the current request
	 * @function
	 * @returns {Request} the current request
	 */
	getRequest: function(){
		return this.request;
	},
	
	/**
	 * Change the current request
	 * This method <b>should not</b> be called by developers
	 * @function
	 * @param {Request} the new request
	 */
	setRequest: function(request){
		this.request = request;
	},
	
	/**
	 * Attach plugins to the page
	 * @function
	 */
	attachPlugins: function(){
		var oldPlugins = this.pluginManager.getPlugins();
		for(var i in oldPlugins)	{
			var oldPlg = oldPlugins[i];
//			//console.log('old plugin: '+oldPlg.getName());
			oldPlg.keep = false;
		}
		
		for (var j in this.plugins)	{
			var newPlg = this.plugins[j];
			//check if the plugin exists
			var existed = false;
			for(var i=0; i<oldPlugins.length; i++)	{
				existed = false;
				var oldPlg = oldPlugins[i];
//				//console.log('check plugin '+newPlg.plugin+' against '+oldPlg.getName());
				if (oldPlg.getName() == newPlg.plugin)	{
					//console.log('plugin '+newPlg.plugin+' existed!');
					oldPlg.keep = true;
					existed = true;
					break;
				}
			}
			if (!existed)	{
				//console.log("load plugin: "+newPlg.plugin);
				if(window[newPlg.plugin] == undefined){
					//console.warn('Plugin '+newPlg.plugin+' is undefined!');
				} else {
					var plugin = new window[newPlg.plugin];
					plugin.keep = true;
					this.pluginManager.addPlugin(plugin, eval(newPlg.delay));
				}
			}
		}
		
		//find plugins that need to be removed
		var pluginsToRemoved = Array();
		for(var i in oldPlugins){
			var oldPlg = oldPlugins[i];
			if (oldPlg.keep != true)	{
				//console.log('plugin removed: '+oldPlg.getName());
				pluginsToRemoved.push(oldPlg);
			}
		}
		
		//removed unused plugins
		for(var i=0;i<pluginsToRemoved.length;i++)	{
			var plg = pluginsToRemoved[i];
			var indexOf = this.pluginManager.getPlugins().indexOf(plg);
			this.pluginManager.removePlugin(indexOf);
		}
		
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ReloadPlugin');
//		//console.log('newplugin', this.pluginManager.getPlugins());
	},
/*
	attachTemplate: function(){
		if(this.position != undefined){
				//console.log("attachTemplate");
				this.temp = new Array();
				for(var i in $("#"+this.position).children()){
					if(!isNaN(i)){
						var obj = $($("#"+this.position).children()[i]);
						obj.detach();
						this.temp.push(obj);
					}
				}
				//console.log("position:"+this.position);
				$("#"+this.position).html(this.template);
		}
	},
	
	wrapUpDisplay: function(){
		if(this.position != undefined){
			var tmp = new Array();
			for(var i in $("#"+this.position).children()){
				if(!isNaN(i)){
					var obj = $($("#"+this.position).children()[i]);
					obj.detach();
					tmp.push(obj);
				}
			}
			
			$("#"+this.position).html(tmp);
		}
	},
*/
	
	/**
	 * Called when the page begins its routine
	 * Parse the layout and attach plugins
	 * @param {pagename} the page name
	 * @function
	 */
	onBegin: function(pagename)	{
		var data = this.generateData(pagename);
		if (data == undefined)
			return;
		this.pagename = pagename;
		this.layout = data.layout;
		this.plugins = data.plugins;
		this.attachPlugins();
		this.subject.notifyEvent("PageBegan");
		/*
		this.template = data.template;
		this.position = data.position;
		*/
	},
	
	/**
	 * Run the page, attach portlets
	 */
	run: function()	{
		/*
		this.attachTemplate();
		*/
		this.attachPortlets();		
		this.subject.notifyEvent("AllPorletAdded");
		this.portletContainer.loadPortlets();
		this.subject.notifyEvent("AllPorletLoaded");
		/*
		this.wrapUpDisplay();
		*/
	},
	
	onEnd: function()	{
		
	},
	
	dispose: function()	{
		
	}
});