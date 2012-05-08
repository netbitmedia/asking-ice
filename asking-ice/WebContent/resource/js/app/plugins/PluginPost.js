/**
 * 
 */

PostPlugin = Class.extend({
	init : function() {
		this.name = "PostPlugin";
		this.app = SingletonFactory.getInstance(Application);
		this.root = this.app.getSystemProperties().get("host.root");
//		this.topics = this.app.getSystemProperties().get(
//				"memcached.topics");
//		this.contexts = this.app.getSystemProperties().get(
//				"memcached.contexts");
//		this.contextsDescription = null;
//
//		this.addedContexts = null;
//		this.contextMap = Array();
//		this.addedContextsNumber = 0;
//		this.addedTopics = null;
//		this.topicMap = Array();
//		this.topicAvaiContextCommit = Array();
//		this.topicNewContextCommit = Array();
	},

	onVoteUpQuestion : function(eventData) {
		this.checkUserLogin(eventData, "VoteUpQuestion");
	},

	voteUpQuestion : function(eventData) {
		this.onAjax('question', 'update-vote', {qid: eventData.id, type: 1}, 'POST', {
			'onSuccess': function(ret) {
				var up = parseInt($("#AnswerPortlet-QVote").html().substr(1));
				up += 1;
				$("#AnswerPortlet-QVote").html("+"+up);
				return;
			}
		});
	},

	onVoteDownQuestion : function(eventData) {
		this.checkUserLogin(eventData, "VoteDownQuestion");
	},

	voteDownQuestion : function(eventData) {
		var url = this.prepareQuestionUrl(eventData, 0);
		$.get(url, {}, function(ret) {
			ret = $.parseJSON(ret);
			ret = ret.result;
			if (ret == "success") {
				var up = parseInt($(".bkp_q_vote_down").html());
				up += 1;
				$(".bkp_q_vote_down").html(up);
				return;
			}
		});
	},

	// login
	onVoteAnswerIncrease : function(eventData) {
		this.checkUserLogin(eventData, "VoteAnswerIncrease");
	},

	voteAnswerIncrease : function(eventData) {
		this.onAjax('answer', 'update-vote', {aid: eventData.id, type: 1}, 'POST', {
			'onSuccess': function(ret) {
				var aid = eventData.id;
				var current = parseInt($("#AnswerPortlet-AVote-" + aid).html().substr(1));
				current += 1;
				$("#AnswerPortlet-AVote-" + aid).html("+"+current);
				return;
			}
		});
	},

	// login
	onVoteAnswerDecrease : function(eventData) {
		this.checkUserLogin(eventData, "VoteAnswerDecrease");
	},

	voteAnswerDecrease : function(eventData) {
		var url = this.prepareUrl(eventData, 0);
		$.get(url, {}, function(ret) {
			ret = $.parseJSON(ret);
			ret = ret.result;
			if (ret == "success") {
				var aid = eventData.aid;
				var current = parseInt($(
						"#answer-" + aid + "-voteNum")
						.children().html());
				current -= 1;
				$("#answer-" + aid + "-voteNum").children()
						.html(current);
				// $("#vote-down-" + aid).attr("onclick",
				// "return false");
				return;
			}
		});
	},

//	onToggleDownEditTopic : function(eventData) {
//		var id = eventData.id;
//		$("#" + id).slideToggle('fast');
//		$("#bkp-topic-search-new").val("");
//		this.buildTopics(SingletonFactory.getInstance(
//				Application).getSystemProperties().get(
//				"memcached.topics"));
//	},
//
//	onToggleUpEditTopic : function(eventData) {
//		var id = eventData.id;
//		// $("#" + id).children("input[type=text]").val("");
//		$("#" + id).slideToggle('fast');
//	},
//
//	// login
//	onTopicAdded : function(eventData) {
//		this.checkUserLogin(eventData, "TopicAdded");
//	},
//
//	topicAdded : function(eventData) {
//		var id = eventData.id;
//		// var value = $("#" +
//		// id).children("input[type=text]").val().trim();
//		// if(value == ""){
//		// return;
//		// }
//		var params = SingletonFactory.getInstance(Page)
//				.getRequest().getParams();
//		var questionID = params["qid"];
//		var selected = $("#" + id + "  option:selected");
//		for ( var i = 0; i < selected.length; i++) {
//			var value = $(selected[i]).val();
//			var text = $(selected[i]).text();
//
//			// TODO: đưa value lên server
//			// đưa value vào trong list
//			// Nếu trong list có rồi thì thoi
//			var topicAdded = this.app.getSystemProperties()
//					.get("memcached.addedTopics");
//			if (topicAdded[value] != undefined) {
//				return;
//			}
//
//			var objParam = {};
//			objParam.tid = generateId("tt");
//			objParam.content = text;
//			objParam.cid = value;
//			objParam.uid = this.app.getSystemProperties().get("user.id");
//			var newTp = tmpl("AnswerPortlet-Topic", objParam);
//			
//			$("#" + id).parent().parent().siblings(
//					".bkp_question_topics").append(newTp);
//
//			// set back to memcached
//			topicAdded[value] = objParam.tid;
//			var sysProp = this.app.getSystemProperties();
//			sysProp.set("memcached.addedTopics", topicAdded);
//
//			// dump to server
//			var curUrl = this.root
//					+ "question/add-catchword/qid/"
//					+ questionID + "/cid/" + value;
//			var sbj = SingletonFactory.getInstance(Subject);
//			$.ajax({
//				url : curUrl,
//				data : {},
//				success : function(ret) {
//					sbj.notifyEvent("NotifyGlobal",
//							"Thêm thành công");
//				},
//				error : function() {
//					sbj.notifyEvent("NotifyGlobal",
//							"Thêm thất bại");
//				}
//			});
//		}
//	},
//
//	onTopicDeleted : function(eventData) {
//		this.checkUserLogin(eventData, "TopicDeleted");
//	},
//
//	topicDeleted : function(eventData) {
//		var id = eventData.id;
//		var params = SingletonFactory.getInstance(Page)
//				.getRequest().getParams();
//		var questionID = params["qid"];
//		var value = $("#" + id).attr("cid")
//		var text = $("#" + id + " label").text();
//
//		var topicAdded = this.app.getSystemProperties().get(
//				"memcached.addedTopics");
//		topicAdded[value] = undefined;
//		var sysProp = this.app.getSystemProperties();
//		sysProp.set("memcached.addedTopics", topicAdded);
//
//		$("#" + id).remove();
//		// dump to server
//		var curUrl = this.root
//				+ "question/remove-catchword/qid/" + questionID
//				+ "/cid/" + value;
//		var sbj = SingletonFactory.getInstance(Subject);
//		$
//				.ajax({
//					url : curUrl,
//					data : {},
//					success : function(ret) {
//						sbj.notifyEvent("NotifyGlobal",
//								"Xóa thành công");
//					},
//					error : function() {
//						sbj.notifyEvent("NotifyGlobal",
//								"Xóa thất bại");
//					}
//				});
//	},
//
//	onTopicChanged : function(eventData) {
//		var id = eventData.id;
//		var pid = eventData.pid;
//		var value = $("#" + id).val().trim().replace("  ", " ")
//				.toLowerCase();
//		var e = eventData.e;
//		var topics = SingletonFactory.getInstance(Application)
//				.getSystemProperties().get("memcached.topics");
//		var arr = Array();
//		var newTopics = null;
//		var isEqual = false;
//		for ( var key in topics) {
//			var curObj = topics[key];
//			var content = curObj['catchWord'].toLowerCase();
//			var match = new RegExp(value);
//			if (content == value) {
//				isEqual = true;
//			}
//			if (match.test(content)) {
//				arr.push(curObj);
//			}
//		}
//
//		newTopics = this.buildTopics(arr);
//		if (newTopics != null) {
//			$("#" + pid).empty().append(newTopics.children());
//		}
//	},
//
//	buildTopics : function(arr) {
//		var result = $("<div><div></div></div>");
//		for ( var key in arr) {
//			var curObj = arr[key];
//			var newTp = $("<option value='" + curObj['id']
//					+ "'>" + curObj['catchWord'] + "</option>");
//			result.children().append(newTp);
//		}
//		return result.children();
//	},
//
//	onMoreContent : function(eventData) {
//		var uiid = eventData.uiid;
//		var parentID = eventData.pid;
//		var templateID = eventData.tid;
//		var templateFields = eventData.fields;
//		var id = SingletonFactory.getInstance(Page)
//				.getRequest().getParams()['qid'];
//		var name = eventData.name;
//		var type = eventData.type;
//		var action = eventData.action;
//		var page = parseInt($("#" + uiid).attr("page"));
//		var rows = eventData.rows;
//		var curPlg = this;
//		var curUrl = this.root + type + "/" + action + "/"
//				+ name + "/" + id + "/page/" + page + "/rows/"
//				+ rows;
//		var result = null;
//		var sbj = SingletonFactory.getInstance(Subject);
//		$.ajax({
//			url : curUrl,
//			async : false,
//			success : function(ret) {
//				ret = $.parseJSON(ret);
//				ret = ret.result;
//				if (ret == undefined || ret == "error") {
//					sbj.notifyEvent("NotifyGlobal",
//							"Không lấy thêm được!");
//					return;
//				}
//				result = ret;
//			}
//		});
//
//		var resultUI = $("<div></div>");
//		// shit
//		result = result.answers;
//
//		var count = 0;
//		for ( var key in result) {
//			var curObj = result[key];
//			count++;
//			var objParam = {};
//			for ( var field in templateFields) {
//				var fName = templateFields[field];
//				var fArr = Array();
//				if (fName.indexOf(".") != -1) {
//					fArr = fName.split(".");
//					objParam[field] = curObj[fArr[0]][fArr[1]]
//							|| "";
//				} else {
//					objParam[field] = curObj[fName] || "";
//				}
//
//			}
//			resultUI.append(tmpl(templateID, objParam));
//		}
//		resultUI.children().children().hide();
//		$("#" + parentID)
//				.append(resultUI.children().children());
//
//		// Presenting only
//		var numChild = $("#" + parentID).children().length;
//		var from = numChild - count;
//		$("#" + parentID).children().slice(from, numChild)
//				.slideToggle("fast");
//
//		var sum = page + count;
//		$("#" + uiid).attr("page", sum);
//
//		var sbj = SingletonFactory.getInstance(Subject);
//		sbj.notifyEvent("FixBrokenImage");
//		sbj.notifyEvent("BindingChangeAnswer");
//		sbj.notifyEvent("ShowBio", {'qid': id});
//		sbj.notifyEvent("RenderBioEditLink", {'qid': id});
//	},
//
//	onCreateNewTopicContext : function(eventData) {
//		this.checkUserLogin(eventData, "CreateNewContext");
//	},

	checkUserLogin : function(eventData, type) {
		var evtArgs = {};
		evtArgs.type = type;
		evtArgs.evtData = eventData;
		var sbj = SingletonFactory.getInstance(Subject);
		sbj.notifyEvent("NeedLogin", evtArgs);
	},

	onLoginSuccess : function(eventData) {
		var type = eventData.type;
		var evtArgs = eventData.evtData;
		if (type != undefined && evtArgs != undefined) {
			switch (type) {
			case "VoteAnswerIncrease":
				this.voteAnswerIncrease(evtArgs);
				break;
			case "VoteAnswerDecrease":
				this.voteAnswerDecrease(evtArgs);
				break;
//			case "TopicAdded":
//				this.topicAdded(evtArgs);
//				break;
//			case "TopicDeleted":
//				this.topicDeleted(evtArgs);
//				break;
//			case "CreateNewContext":
//				this.createNewContextSuccess(evtArgs);
//				break;
			case "VoteUpQuestion":
				this.voteUpQuestion(evtArgs);
				break;
			case "VoteDownQuestion":
				this.voteDownQuestion(evtArgs);
				break;
			default:
				break;
			}
		}
//		this.onCheckTopicEditable();
	},

//	createNewContextSuccess : function() {
//		var subject = SingletonFactory.getInstance(Subject);
//		var rq = SingletonFactory.getInstance(Page)
//				.getRequest();
//		var params = rq.getParams();
//		var request = new Request("TopicCreatePage", "", {
//			"pageCallBack" : "Question",
//			"needParam" : true,
//			"paramName" : "qid",
//			"paramVal" : params['qid']
//		});
//		subject.notifyEvent('RequestRoute', request);
//	},
//	
//	onCheckTopicEditable: function(eventData){
//		var currentUid = SingletonFactory.getInstance(Application).getSystemProperties().get("user.id");
//		$(".extension-point[extensionName='CheckTopicEditable']").each(function(index,value){
//			 var uid = $(value).attr("uid");
//			 if(uid == currentUid){
//				$(value).find(".delToken").show(); 	
//			 } else {
//			 	$(value).find(".delToken").hide();
//			 }
//		});
//	},
//	
//	onCheckTopicEditableZone: function(eventData){
//		var zone = eventData.zone;
//		var currentUid = SingletonFactory.getInstance(Application).getSystemProperties().get("user.id");
//		$(zone).find(".extension-point[extensionName='CheckTopicEditable']").each(function(index,value){
//			 var uid = $(value).attr("uid");
//			 if(uid == currentUid){
//				$(value).find(".delToken").show(); 	
//			 } else {
//			 	$(value).find(".delToken").hide();
//			 }
//		});
//	},
//
//	onHtmlUpdated : function() {
//		var id = SingletonFactory.getInstance(Application)
//				.getSystemProperties().get("user.id");
//		$(".extension-point[extensionName='ProfileImageCheck'][uid='"+ id + "']")
//			.css("background-color", "#FAFAFA");
//	}

}).implement(PluginInterface).implement(AjaxInterface);
