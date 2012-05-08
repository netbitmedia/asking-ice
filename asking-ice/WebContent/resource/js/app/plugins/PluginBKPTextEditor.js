/**
 * 
 */

BKPTextEditorPlugin = Class.extend({
	init : function() {
		this.name = "BKPTextEditorPlugin";
		this.mceNeeded = false;
		this.i = 0;
	},
	
	onTinyEditorInit: function(eventData){
		var id = eventData.id;
		var mem = SingletonFactory.getInstance(Application).getSystemProperties().get("memcached.tinyeditor");
		/*if(mem == undefined){
			mem = Array();
		}
		if(mem[id] != undefined){
			return;
		}*/
		mem = Array();
		var instance = new TINY.editor.edit('editor' ,{
		    id:id,
		    height:'200px',
		    width:'100%',
		    cssclass:'te',
		    controlclass:'tecontrol',
		    rowclass:'teheader',
		    dividerclass:'tedivider',
		    controls:['bold','italic','underline','|',
		              'orderedlist','unorderedlist','|','outdent','indent','|','leftalign',
		              'centeralign','rightalign','blockjustify','|',,'insertcode','|','redo','undo','n',
		              'link','unlink','|','image','|','unformat'],
		    footer:true,
		    fonts:['Verdana','Arial','Georgia','Trebuchet MS'],
		    xhtml:true,
		    cssfile:'static/js/thirdparty/tinyeditor/style.css',
		    bodyid:'editor',
		    footerclass:'tefooter',
		    toggle:{text:'source',activetext:'wysiwyg',cssclass:'toggle'},
		    resize:{cssclass:'resize'}
		});
		mem[id]= instance;
		SingletonFactory.getInstance(Application).getSystemProperties().set("memcached.tinyeditor",mem);
	},
	
	onEnd: function(){
		SingletonFactory.getInstance(Application).getSystemProperties().set("memcached.tinyeditor",undefined);
	}
}).implement(PluginInterface);
