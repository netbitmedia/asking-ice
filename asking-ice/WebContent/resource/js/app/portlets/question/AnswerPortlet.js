AnswerPortlet = Class.extend({
	init : function() {
		this.name = "AnswerPortlet";
		this.model = {};
		this.question = null;
		this.topics = null;
		this.topicsQuestion = null;
		this.mce = $("");
		this.answers = null;
		this.questionID = null;
		this.needMCE = true;
		this.answerNum = 0;
		this.root = SingletonFactory.getInstance(Application).getSystemProperties().get("host.root");
		this.uid = SingletonFactory.getInstance(Application).getSystemProperties().get("user.id");
		this.quid = "";
	},

	onBegin : function() {
		this.registerObserver();
		this.model.qvoteup = "...";
		this.model.qvotedown = "...";
		this.model.avaiTopics = {};
		this.model.topics = {};
		this.model.mce = {};
		this.model.children = {};
	},
	
	getQuestionID: function(){
		var request = SingletonFactory.getInstance(Page).getRequest();
		var params = request.getParams();
		this.questionID = params['qid'];
		if(this.questionID == null || this.questionID == undefined){
			var subject = SingletonFactory.getInstance(Subject);
			var request = new Request("ErrorPage","donganh",{"code":"888", "msg":"Lỗi","content":"Câu hỏi không tồn tại trong hệ thống. Mong bạn thử lại"}); 
			subject.notifyEvent('RequestRoute', request);
		}
	},
	
	getAjax: function(){
		var curPlt = this;
		this.onAjax("question", "get-question-detail", {qid: this.questionID}, "GET", {
			onSuccess: function(ret) { 
				curPlt.question = ret;
				
				var owner = ret.userId;
				curPlt.ownerAvatar = ret.avatar;
				curPlt.questionOwner = owner;
				curPlt.buildQuestion();
				curPlt.getPortletPlaceholder().paintCanvas(curPlt.render());
				curPlt.requestForEffectiveResource('QVote').html("+"+ret.vote);
				curPlt.onAjax("question", "is-bookmarked", {id: curPlt.questionID}, "get", {
					onSuccess: function(ret) {
						if (ret)	{
							curPlt.requestForEffectiveResource("Bookmark").addClass('active');
						}
					}
				});
				
				var sbj = SingletonFactory.getInstance(Subject);
				sbj.notifyEvent('QuestionBuilt', {id: curPlt.questionID, userID: curPlt.questionOwner});
				
				var props = SingletonFactory.getInstance(Application).getSystemProperties();
				var role = 'default';
				if (props.get('user.login') == 1)	{
					role = props.get('user.role');
				}
				if (curPlt.questionOwner != curPlt.uid && (role == 'user' || role == 'default'))	{
					curPlt.requestForEffectiveResource('Question').find('.owner_fn').hide();
				}
				curPlt.getAjaxTopicQuestion();
			},
			onFailure: function(msg)	{
				var subject = SingletonFactory.getInstance(Subject);
				var request = new Request("ErrorPage","",{"code":"888", "msg":"Lỗi","content":"Câu hỏi không tồn tại trong hệ thống. Mong bạn thử lại"}, ["content"]); 
				subject.notifyEvent('RequestRoute', request);
				return;
			}
		});
	},
	
	onSystemPropertyChanged: function(eventData)	{
		if (eventData == 'user.login')	{
			var logged = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
			if (logged == 1)	{
				var sbj = SingletonFactory.getInstance(Subject);
				sbj.notifyEvent('QuestionBuilt', {id: this.questionID, userID: this.questionOwner});
				sbj.notifyEvent("AnswerBuilt", {'qid': this.questionID});
			}
		}
	},
	
	onReloadAnswers: function()	{
		this.getAjaxAnswer();
	},
	
	getAjaxAnswer: function(){
		var curPlt = this;
		this.onAjax('question', 'get-answers', {qid: this.questionID, page: 0}, 'GET', {
			'onSuccess': function(ret){
				curPlt.answers = ret;
				curPlt.buildAnswer(ret);
			},
			'onFailure': function(msg)	{
				var subject = SingletonFactory.getInstance(Subject);
				var request = new Request("ErrorPage","",{"code":"888", "msg":"Lỗi","content":"Câu hỏi không tồn tại trong hệ thống. Mong bạn thử lại"});
				subject.notifyEvent('RequestRoute', request);
				return;
			}
		});
	},
	
	getAjaxTopicQuestion: function(){
		var curPlt = this;
		this.onAjax("question", "get-all-catchwords-question", {qid: this.questionID}, "GET", {
			onSuccess: function(ret){
				if (ret.length == 0)	{
					var rel = curPlt.getRequest().getParam('rel');
					if (rel == 'ask')	{
						var subject = SingletonFactory.getInstance(Subject);
						subject.notifyEvent('NotifyMessage', 'Bạn vừa đặt câu hỏi nhưng lại không thêm chủ đề cho câu hỏi! Những câu hỏi không có chủ đề <b>mặc định sẽ không được hiển thị tại trang chủ</b>. Để câu hỏi của bạn nhanh chóng có được câu trả lời, bạn hãy thêm chủ đề thích hợp.<br /><img src="resource/images/tutorial-image/addtag.png" alt="addtag" />');
					}
				}
				curPlt.topicsQuestion = ret;
				curPlt.getAjaxAnswer();
				curPlt.buildTopics(ret);
			}
		}, true, 60000);
	},
	
	buildQuestion: function(){
		this.model.qcontent = this.question.title;
		this.model.qdetail = this.question.content.trim().replace(/\\n/g, '<br>');
		this.model.qdate = this.question.since;
		this.model.quser = "";
		this.model.qusertarget = "";
		this.model.avatar = this.ownerAvatar;
		this.model.anonymous = this.question.anonymous;
		this.model.bestSource = this.question.bestSource;
		if(this.question.name != undefined && this.question.name!=""){
			this.quid = this.question.userId;
			var objParam = {};
			objParam.quserid = this.model.quserid = this.question.userId;
			objParam.qusername = this.question.name;
			this.model.quser = this.renderView("UserLink",objParam);
		}
		
		//FIXME: Not yet
		if(this.question.target_name != undefined && this.question.target_name !=""){
			var objParam = {};
			objParam.quserid = this.question.targetId;
			objParam.qusername = this.question.target_name;
			this.model.qusertarget = this.renderView("UserLink",objParam);
		}
	},
	
	buildTopics: function(topicsQuestion){
		var topicAdded = Array();
		var arr = Array();
		for ( var key in topicsQuestion) {
			var objParam = {};
			var curObj = topicsQuestion[key];
			objParam.tid = generateId("tt");
			objParam.content = curObj['catchWord'];
			objParam.cid = curObj['id'];
			objParam.uid = this.quid;
			topicAdded[curObj['id']] = objParam.tid;
			arr.push(this.renderView("Topic",objParam));
		}
		this.requestForEffectiveResource('TopicArea').html(arr.join(','));
		this.requestForEffectiveResource('EditTopicArea').html(this.renderView("EditTopic",{topicsQuestion: topicsQuestion}));
		
		// fetch to cache
		var sysProp = SingletonFactory.getInstance(Application).getSystemProperties();
		sysProp.set("memcached.addedTopics", topicAdded);
		
		//var sbj = SingletonFactory.getInstance(Subject);
		//sbj.notifyEvent("CheckTopicEditable");
	},
	
	buildAnswer : function(answers) {
		var result = $("<div></div>");
		var hidden = $("<div></div>");
		var hiddenNo = 0;
		
		var checkUserAnswered = Array();
		for ( var key in answers) {
			this.answerNum ++;
			var objParam = {};
			var curObj = answers[key];
			objParam.uid = curObj['userId'];
			checkUserAnswered.push(curObj['userId']);
			// TODO: neu uid == this user => no need for mce
			if(curObj['userId'] == this.uid){
				this.needMCE = false;
			}
			objParam.aid = curObj['id'];
			objParam.uimglink = curObj.avatar;
			objParam.uname= curObj.name;
			objParam.avote = curObj['vote'];
			objParam.adate = curObj['since'];
			objParam.acontent = curObj['content'];
			objParam.lastEdited = curObj['lastEdited'];
			objParam.negatives = Array();
			
			//negative comments
			for(var i in curObj['negativeTypes'])	{
				var type = curObj['negativeTypes'][i];
				switch (type)	{
					case 1:
						objParam.negatives.push('Câu trả lời này cần phải đúng trọng tâm câu hỏi hơn');
						break;
					case 2:
						objParam.negatives.push('Câu trả lời này cần đưa ra ý kiến mới so với những câu trả lời trước đó');
						break;
					case 3:
						objParam.negatives.push('Câu trả lời này cần thêm giải thích');
						break;
					case 4:
						objParam.negatives.push('Câu trả lời này nên đưa vào phần bàn luận cho câu trả lời khác');
						break;
					case 5:
						objParam.negatives.push('Chứa nội dung từ nguồn khác nhưng không có chú thích');
						break;
				}
			}
			
			if (curObj.hidden == 1)	{
				var template = this.renderView("HiddenItem", objParam);
				hidden.append(template);
				hiddenNo++;
			}
			else {
				var template = this.renderView("Item", objParam);
				result.append(template);
			}
		}
		
		// Used in plugin
		SingletonFactory.getInstance(Application).getSystemProperties().set("memcached.answeredID",checkUserAnswered);
		this.requestForEffectiveResource('AnswersList').html($(result).html());
		this.requestForEffectiveResource('HiddenAnswersList').html($(hidden).html());
		this.requestForEffectiveResource('HiddenAnswerNo').html(hiddenNo);
		if (hiddenNo == 0)	{
			this.requestForEffectiveResource('HiddenAnswers').hide();
		}
		
		var sbj = SingletonFactory.getInstance(Subject);
		var checkImg = {};
		checkImg.zone = this.requestForEffectiveResource('AnswersList');
		sbj.notifyEvent("RequestProfileImageCheck", checkImg);
		checkImg.zone = this.requestForEffectiveResource('HiddenAnswersList');
		sbj.notifyEvent("RequestProfileImageCheck", checkImg);
		
		this.updateAnswerNum();
		this.initEditor(this.questionID);
		sbj.notifyEvent("BindingChangeAnswer");
		var qid = this.getRequest().getParam('qid');
		sbj.notifyEvent("ShowBio", {'qid': qid});
		sbj.notifyEvent("RenderBioEditLink", {'qid': qid});
		sbj.notifyEvent("AnswerBuilt", {'qid': qid});
		//clean style
		sbj.notifyEvent('CleanFont');
		
		var hl = this.getRequest().getParam('hl');
		if (hl != undefined)	{
			this.requestForEffectiveResource('Outer'+hl).addClass('highlighted');
			$.scrollTo(this.requestForEffectiveResource('Outer'+hl), 800);
		}
	},
	
	updateAnswerNum: function(){
		// update count
		var countPage = parseInt($("#answer-more-btn").attr("page"));
		var sum = this.answerNum + countPage;
		$("#answer-more-btn").attr("page",sum);
	},
	
	initEditor: function(qid)	{
		if(this.needMCE){
			this.requestForEffectiveResource('TextAreaContainer').html(this.renderView('MCE', {'qid': qid}));
			var curID = "AnswerPortlet-AnswerTextEditor";
			var sbj = SingletonFactory.getInstance(Subject);
			sbj.notifyEvent("TinyEditorInit",{id : curID, content: ""});
			sbj.notifyEvent("InitInputMethod",{id : curID, content: ""});
		}
	},
	
	run : function() {
		this.needMCE = true;
		this.getQuestionID();
		this.model.qid = this.questionID;
		this.getAjax();
	},
	
	onSubmitQuestionContent: function()	{
		var qid = this.getRequest().getParam('qid');
		var subject = SingletonFactory.getInstance(Subject);
		var content = this.requestForEffectiveResource('QDetail').find('textarea').val();
		if (content == this.detailOld)	{
			subject.notifyEvent('CancelSubmitQuestionEdit');
			return;
		}
		var obj = this;
		this.onAjax('question', 'edit-question', {content: content, id: qid}, 'POST', {
			'onSuccess': function(ret)	{
				obj.requestForEffectiveResource('QDetail').html(content);
				obj.requestForEffectiveResource('QEditControl').html('');
				obj.editState = 0;
			}
		});
	},
	
	onCancelChangeTopic: function() {
		this.requestForEffectiveResource('EditTopicContainer').hide();
		this.requestForEffectiveResource('TopicArea').parent().show();
		this.editTopicState = 0;
	},
	
	onCancelSubmitQuestionEdit: function()	{
		this.requestForEffectiveResource('QDetail').html(this.detailOld);
		this.requestForEffectiveResource('QEditControl').html('');
		this.editState = 0;
	},
	
	onBookmarkQuestion: function() {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('NeedLogin', {type: 'BookmarkQuestion'});
	},
	
	onLoginSuccess: function(eventData) {
		if (eventData.type == 'BookmarkQuestion')	{
			var obj = this;
			if (!this.requestForEffectiveResource('Bookmark').hasClass('active'))	{
				this.onAjax('question', 'bookmark', {id: this.questionID}, 'post', {
					onSuccess: function(ret) {
						obj.requestForEffectiveResource("Bookmark").addClass('active');
					}
				});
			} else {
				this.onAjax('question', 'remove-bookmark', {id: this.questionID}, 'post', {
					onSuccess: function(ret) {
						obj.requestForEffectiveResource("Bookmark").removeClass('active');
					}
				});
			}
		}
	},
	
	onNewTagSelect: function(eventData) {
		var ui = eventData.ui;
		var txt = ui.item.label;
		var value = ui.item.id;
		var obj = this;
		
		this.onAjax('question', 'add-tag', {id: this.questionID, tagId: value}, 'post', {
			onSuccess: function(ret) {
				obj.requestForEffectiveResource("EditTopicArea").append(obj.renderView('TopicTmpl', {id: value, catchWord: txt}));
			}
		});
	},
	
	onChangeQDetailButtonClick: function() {
		if (this.editState == 1)
			return;
		this.editState = 1;
		var oldContent = this.requestForEffectiveResource('QDetail').html();
		this.requestForEffectiveResource('QDetail').html(this.renderView('QDetailEdit', {oldContent: oldContent}));
		this.detailOld = oldContent;
		this.requestForEffectiveResource('QEditControl').html(this.renderView('QEditControlTmpl', {}));
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ExpandTextArea', {min: 45, max: 200, target: this.requestForEffectiveResource('QDetail').find('textarea')});
	},
	
	onChangeTopicButtonClick: function()	{
		if (this.editTopicState == 1)
			return;
		this.editTopicState = 1;
		this.requestForEffectiveResource('TopicArea').parent().hide();
		this.requestForEffectiveResource('EditTopicContainer').show();
		
		var subject = SingletonFactory.getInstance(Subject);
		var inputBox = this.requestForEffectiveResource("TopicInput");
		var eventData = {};
		eventData.selectCallback = "NewTagSelect";
		eventData.autocompleteObject = inputBox;
		var solrRoot = SingletonFactory.getInstance(Application).getSystemProperties().get('host.solr');
		eventData.autocompleteSource = solrRoot+"/autocomplete/catch";
		eventData.type = "Expertise";
		subject.notifyEvent('NeedAutocomplete', eventData);
		
		subject.notifyEvent('AttachFocusDetection', {target: inputBox, defaultValue: 'Nhập chủ đề cần thêm'});
	},
	
	onQuestionTagDeleteButtonClick: function(event) {
		this.onAjax('question', 'remove-tag', {id: this.questionID, tagId: $(event.target).attr('eid')}, 'post', {
			onSuccess: function() {
				$(event.target).parent().remove();
			}
		});
	},
	
	onReloadPage: function(){
		this.editState = 0;
		this.editTopicState = 0;
		this.run();
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface).implement(AjaxInterface);
