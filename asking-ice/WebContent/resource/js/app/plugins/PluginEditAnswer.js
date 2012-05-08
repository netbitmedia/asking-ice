AnswerEditPlugin = Class.extend({
	init : function() {
		this.name = "AnswerEditPlugin";
		this.app = SingletonFactory.getInstance(Application);
		this.props = this.app.getSystemProperties();
		this.root = this.app.getSystemProperties().get("host.root");
	},
	
	checkUserLogin : function(eventData, type) {
		var evtArgs = {};
		evtArgs.type = type;
		evtArgs.evtData = eventData;
		var sbj = SingletonFactory.getInstance(Subject);
		sbj.notifyEvent("NeedLogin", evtArgs);
	},
	
	onSubmitAnswer : function(eventData) {
		this.checkUserLogin(eventData, "SubmitAnswer");
	},
	
	onLoginSuccess : function(eventData) {
		var type = eventData.type;
		var evtArgs = eventData.evtData;
		if (type != undefined && evtArgs != undefined) {
			switch (type) {
				case "SubmitAnswer":
					this.submitAnswer(evtArgs);
					break;
				default:
					break;
			}
		}
	},

	submitAnswer : function(eventData) {
		var request = SingletonFactory.getInstance(Page).getRequest();
		var params = request.getParams();
		var qid = params['qid'];
		if (qid == undefined) {
			return;
		}
		var sbj = this.props.get("memcached.answeredID");
		var userid = this.props.get("user.id");
		if (sbj != undefined && userid != undefined) {
			for (var key in sbj) {
				var curID = sbj[key];
				if (curID == userid) {
					return;
				}
			}
		}
		var sbj = SingletonFactory.getInstance(Subject);

		var mceID = eventData.id;
		var instance = this.props.get("memcached.tinyeditor");
		var content = instance[mceID].e.body.innerHTML;
		var obj = this;
		this.onAjax('answer', 'add', {qid : qid, content : content}, 'POST', {
			'onSuccess' : function(ret) {
				instance[mceID].e.body.innerHTML = "";
				$('#AnswerPortlet-TextAreaContainer').html('');
				$('#AnswerPortlet-TextAreaContainer').hide();
				sbj.notifyEvent('ReloadAnswers');
			}
		});
	},
	
	checkImage: function(html){
		var parent = $("<div></div>");
		$(parent).append(html);
		var tmp = $(parent).find("img").each(function(index,value){
			var imgSrc = $(value).attr("src");
			
			var newImg = new Image();
			newImg.src = imgSrc;
			var height = newImg.height;
			var width = newImg.width;
			if(height == 0 || width == 0 || imgSrc == ""){
				$(value).remove();
			}
			if(width >= 400){
				$(value).attr('width','400');
			}
			$(value).css("vertical-align","middle");
			$(value).css("display","block");
			var subTmp = $("<center></center>");
			var valueTmp = $(value).clone();
			$(value).replaceWith($(subTmp).append($(valueTmp)));
		});
		return $(parent).html();
	},
	
	onEditAnswerSubmit: function(eventData)	{
		var uid = eventData.uid;
		var aid = eventData.aid;
		var mceID = "OwnAnswerEditor-" + uid + "-" + aid;
		var instance = SingletonFactory.getInstance(Application).getSystemProperties().get("memcached.tinyeditor");
		var content = instance[mceID].e.body.innerHTML;
		content = this.checkImage(content);
		var notify = $('#OwnAnswerEditor-NotifyFollowers').is(':checked') ? 1 : 0;

		var sbj = SingletonFactory.getInstance(Subject);
		this.onAjax('answer', 'update', {aid: aid, content: content, notify: notify}, 'POST',	{
			'onSuccess' : function(ret) {
				var ansArea = $('.extension-point[extensionName="AnswerExtension"][aid="'+aid+'"] .ans-extension-area .answer-editor');
				$(".ans-content[aid='"+aid+"']").html(content);
				ansArea.slideToggle();
			},
			'onFailure' : function(ret) {
				sbj.notifyEvent("NotifyGlobal", "Sửa thất bại");
			}
		});
	},
	
	onShowAnswerEdit: function(eventData)	{
		var aid = eventData.aid;
		var ansArea = $('.extension-point[extensionName="AnswerExtension"][aid="'+aid+'"] .ans-extension-area .answer-editor');
		if (!ansArea.is(':visible'))	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('AnswerExtensionControlChanged', {value: ''});
		}
		ansArea.slideToggle();
	},

	onAnswerBuilt : function() {
		var loggedin = this.props.get('user.login');
		var obj = this;
		if (loggedin != 0)	{
			var curUID = this.props.get('user.id');
			$('.extension-point[extensionName="AnswerExtension"]').each(function()	{
				if ($(this).find('[flag="AnsEdit"]').length > 0)	{
					return;
				}
				var aid = $(this).attr('aid');
				var uid = $(this).attr('uid');
				if (curUID == uid)	{
					$(this).find('.ans-control .extension_place').append(tmpl('AnswerEditPlugin-Control', {uid: uid, aid: aid}));
					$(this).find('.ans-extension-area').append(tmpl('AnswerEditPlugin-Area', {uid: uid, aid: aid}));
					var curID = "OwnAnswerEditor-" + uid + "-" + aid;
					var content = $(".ans-content[aid='"+aid+"']").html();
					$("#"+curID).val(content);

					var sbj = SingletonFactory.getInstance(Subject);
					sbj.notifyEvent("TinyEditorInit", {id : curID,content : ""});
				}
			});
		}
	},
	
	onRejectChanges : function(eventData) {
		var curUid = eventData.uid;
		var curAid = eventData.aid;
		$("#extension-content-plhld-" + curAid + "-" + curUid).children("div[id='answer-editor-"+ curAid +"-"+curUid + "']").hide('fast');
	}
}).implement(PluginInterface).implement(AjaxInterface);

AnswerExtensionHiddenPlugin = Class.extend({
	init: function()	{
		this.name = "AnswerExtensionHiddenPlugin";
	},
	
	onAnswerExtensionControlChanged: function()	{
		$('.answer-extension-item').hide();
	}
}).implement(PluginInterface);