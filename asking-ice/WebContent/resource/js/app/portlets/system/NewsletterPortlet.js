NewsletterPortlet = Class.extend({
	init: function()	{
		this.name = "NewsletterPortlet";
		this.instance = undefined;
	},

	onBegin: function()	{
		this.model = {};
		this.registerObserver();
	},
	
	onEnd: function() {
		this.unregisterObserver();
	},
	
	onSendNewsletter: function() {
		var title = this.requestForEffectiveResource('Title').val();
		var content = this.instance.e.body.innerHTML;
		if (title == "" || content == "")	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('NotifyError', 'Bạn phải điền đầy đủ thông tin!');
			return;
		}
		
		var i = confirm('Bạn có chắc chắn muốn gửi newsletter cho toàn bộ users?');
		if (i)	{
			this.onAjax('admin', 'send-newsletter', {title: title, content: content}, 'post', {
				onSuccess: function(ret) {
				}
			});
		}
	},

	run: function()	{
		this.getPortletPlaceholder().drawToCanvas(this.render());
		
		var d = new Date();
		var month=new Array(12);
		month[0]="January";
		month[1]="February";
		month[2]="March";
		month[3]="April";
		month[4]="May";
		month[5]="June";
		month[6]="July";
		month[7]="August";
		month[8]="September";
		month[9]="October";
		month[10]="November";
		month[11]="December";
		
		var week;
		if (d.getDate() <= 7)
			week = 1;
		else if (d.getDate() <= 14)
			week = 2;
		else if (d.getDate() <= 21)
			week = 3;
		else
			week = 4;
		var d = new Date();
		var title = "Asking Newsletter - "+month[d.getMonth()]+" "+(d.getYear()+1900)+" Week "+week;
		this.requestForEffectiveResource('Title').val(title);
		
		this.instance = new TINY.editor.edit('editor' ,{
		    id:this.name+"-Content",
		    height:'400px',
		    width:'600px',
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
	}
}).implement(PortletInterface).implement(RenderInterface).implement(AjaxInterface).implement(ObserverInterface);