/**
 * 
 */

EditPendingQuestionsPlugin = Class
		.extend(
				{
					init : function() {
						this.name = "EditPendingQuestionsPlugin";
						this.app = SingletonFactory.getInstance(Application);
						this.root = this.app.getSystemProperties().get(
								"host.root");
						this.topics = this.app.getSystemProperties().get(
								"memcached.topics");
						this.addedTopics = null;
						this.pendingQuestion = {};
					},

					// From AnswerPortlet
					getAjaxAllTopics: function(){
						var curPlt = this;
						var curUrl = this.root + "catchword/get-all-catchwords/";
						$.ajax({url:curUrl, async:false , success: function(ret){
							ret = $.parseJSON(ret);
							ret = ret.result;
							if(ret == undefined || ret == "error"){
								return;
							}
							curPlt.topics = ret;
							SingletonFactory.getInstance(Application).getSystemProperties().set("memcached.topics",ret);
						}});
						this.topics = curPlt.topics;
					},
					
					// From AnswerPortlet
					getAjaxTopicQuestion: function(){
						var curPlt = this;
						var curUrl = this.root + "question/get-all-un-auth-catchwords-question/qid/" + this.questionID;
						$.ajax({url:curUrl, async:false, success: function(ret){
							ret = $.parseJSON(ret);
							ret = ret.result;
							if(ret == undefined || ret == "error"){
								return;
							}
							curPlt.topicsQuestion = ret;
						}});
						this.topicsQuestion = curPlt.topicsQuestion;
					},
					
					// From AnswerPortlet
					buildQuestionTopics: function(){
						var result = $("<div><div></div></div>");
						var topicAdded = Array();
						for ( var key in this.topicsQuestion) {
							var objParam = {};
							var curObj = this.topicsQuestion[key];
							objParam.tid = generateId("tt");
							objParam.content = curObj['catchword'];
							objParam.cid = curObj['id'];
							topicAdded[this.questionID + "-" + curObj['id']] = objParam.tid;
							var newTp = tmpl("AnswerPortlet-Topic",objParam);
							result.children().append(newTp);
						}
						// fetch to cache
						var sysProp = SingletonFactory.getInstance(Application).getSystemProperties();
						sysProp.set("memcached.addedTopics",topicAdded);
						this.pendingQuestion.topics = result.children();
					},
					
					// From AnswerPortlet
					buildAllTopics: function(){
						var result = $("<div><div></div></div>");
						for ( var key in this.topics) {
							var curObj = this.topics[key];
							var newTp = $("<option value='"+curObj['id']+"'>"+curObj['catchWord']+"</option>");
							result.children().append(newTp);
						}
						this.pendingQuestion.avaiTopics = result.children();
					},
					
					// In question Pending, no other is found
					onEditPendingQuestion: function(eventData){
						this.checkUserLogin(eventData, "EditPendingQuestion");
						
					},
					
					editPendingQuestion: function(eventData){
						this.questionID = eventData.id;
						
						if(this.topics == undefined){
							this.getAjaxAllTopics();
						}
						this.getAjaxTopicQuestion();
						// dump topicsQuestions
						this.buildQuestionTopics();
						
						// dump topics
						this.buildAllTopics();
						
						// get data from cached in profilePortlet
						var pendingQuestions = SingletonFactory.getInstance(Application).getSystemProperties().get("memcached.pendingQuestions");
						var objParam = {};
						objParam.topics = this.pendingQuestion.topics || Array();
						objParam.avaiTopics = this.pendingQuestion.avaiTopics || Array();
						objParam.qcontent = pendingQuestions[this.questionID].title;
						objParam.qdetail =  pendingQuestions[this.questionID].content;
						objParam.qid =  this.questionID;
						var template = tmpl("QuestionPendingPortlet-EditQuestion", objParam);
						var tmp = $(".questionEmphasized[qid='"+this.questionID+"']").children("span");
						pendingQuestions[this.questionID]['span'] = tmp;
						SingletonFactory.getInstance(Application).getSystemProperties().set("memcached.pendingQuestions",pendingQuestions);
						$(".questionEmphasized[qid='"+this.questionID+"']").empty().append($(template));
					},
					
					//
					onSavePendingQuestions: function(eventData){
						var id = eventData.id;	
						var parent = eventData.parent;
						var title = $("#editquestion-title-" + id).val();
						var content = $("#editquestion-content-" + id).val();
						
						var curUrl = this.root + "question/update-un-auth-question";
						var sbj = SingletonFactory.getInstance(Subject);
						$
						.ajax({
							url : curUrl,
							type : "POST",
							data : {
								"content" : content,
								"title" : title,
								"qid" : id
							},
							success : function(ret) {
								var cache = SingletonFactory.getInstance(Application).getSystemProperties().get("memcached.pendingQuestions");
								var span = cache[id]['span'];
								cache[id].title = title;
								cache[id].content = content;
								SingletonFactory.getInstance(Application).getSystemProperties().set("memcached.pendingQuestions",cache);
								$(".questionEmphasized[qid='"+id+"']").empty().append("<strong>" + title + "</strong>").append(span);
								sbj.notifyEvent("NotifyGlobal",
										"Sửa thành công");
							},
							error : function(ret) {
								sbj.notifyEvent("NotifyGlobal","Sửa thất bại");
							}
						});
						
					},
					
					onCancelPendingQuestions: function(eventData){
						var id = eventData.id;	
						var cache = SingletonFactory.getInstance(Application).getSystemProperties().get("memcached.pendingQuestions");
						var span = cache[id]['span'];
						var title = cache[id].title;
						$(".questionEmphasized[qid='"+id+"']").empty().append("<strong>" + title + "</strong>").append(span);
					},

					onToggleDownEditTopic : function(eventData) {
						var id = eventData.id;
						$("#" + id).slideToggle('fast');
						$("#" + id + " #bkp-topic-search-new").val("");
						this.buildTopics(SingletonFactory.getInstance(
								Application).getSystemProperties().get(
								"memcached.topics"));
					},

					onToggleUpEditTopic : function(eventData) {
						var id = eventData.id;
						// $("#" + id).children("input[type=text]").val("");
						$("#" + id).slideToggle('fast');
					},

					// login
					onTopicAdded : function(eventData) {
						this.checkUserLogin(eventData, "TopicAdded");
					},

					topicAdded : function(eventData) {
						var id = eventData.id;
						// dang sau la pending question
						var questionID = this.questionID;
						var selected = $("#" + id + "  option:selected");
						for ( var i = 0; i < selected.length; i++) {
							var value = $(selected[i]).val();
							var text = $(selected[i]).text();

							// TODO: đưa value lên server
							// đưa value vào trong list
							// Nếu trong list có rồi thì thoi
							var topicAdded = this.app.getSystemProperties()
									.get("memcached.addedTopics");
							if (topicAdded[questionID + "-" + value] != undefined) {
								return;
							}

							var objParam = {};
							objParam.tid = generateId("tt");
							objParam.content = text;
							objParam.cid = value;
							var newTp = tmpl("AnswerPortlet-Topic", objParam);
							$("#" + id).parent().siblings(
									".bkp_question_topics").append(newTp);

							// set back to memcached
							topicAdded[questionID + "-" + value] = objParam.tid;
							var sysProp = this.app.getSystemProperties();
							sysProp.set("memcached.addedTopics", topicAdded);

							// dump to server
							var curUrl = this.root
									+ "question/add-catchword-un-auth/qid/"
									+ questionID + "/cid/" + value;
							var sbj = SingletonFactory.getInstance(Subject);
							$.ajax({
								url : curUrl,
								data : {},
								success : function(ret) {
									sbj.notifyEvent("NotifyGlobal",
											"Thêm thành công");
								},
								error : function() {
									sbj.notifyEvent("NotifyGlobal",
											"Thêm thất bại");
								}
							});
						}
					},

					onTopicDeleted : function(eventData) {
						this.checkUserLogin(eventData, "TopicDeleted");
					},

					topicDeleted : function(eventData) {
						var id = eventData.id;
						var questionID = this.questionID;
						var value = $("#" + id).attr("cid")
						var text = $("#" + id + " label").text();

						var topicAdded = this.app.getSystemProperties().get(
								"memcached.addedTopics");
						topicAdded[questionID + "-" + value] = undefined;
						var sysProp = this.app.getSystemProperties();
						sysProp.set("memcached.addedTopics", topicAdded);

						$("#" + id).remove();
						// dump to server
						var curUrl = this.root
								+ "question/remove-un-auth-catchword/qid/" + questionID
								+ "/cid/" + value;
						var sbj = SingletonFactory.getInstance(Subject);
						$
								.ajax({
									url : curUrl,
									data : {},
									success : function(ret) {
										sbj.notifyEvent("NotifyGlobal",
												"Xóa thành công");
									},
									error : function() {
										sbj.notifyEvent("NotifyGlobal",
												"Xóa thất bại");
									}
								});
					},

					onTopicChanged : function(eventData) {
						var id = eventData.id;
						var pid = eventData.pid;
						var value = $("#" + id).val().trim().replace("  ", " ")
								.toLowerCase();
						var e = eventData.e;
						var topics = SingletonFactory.getInstance(Application)
								.getSystemProperties().get("memcached.topics");
						var arr = Array();
						var newTopics = null;
						var isEqual = false;
						for ( var key in topics) {
							var curObj = topics[key];
							var content = curObj['catchWord'].toLowerCase();
							var match = new RegExp(value);
							if (content == value) {
								isEqual = true;
							}
							if (match.test(content)) {
								arr.push(curObj);
							}
						}

						newTopics = this.buildTopics(arr);
						if (newTopics != null) {
							$("#" + pid).empty().append(newTopics.children());
						}
					},

					buildTopics : function(arr) {
						var result = $("<div><div></div></div>");
						for ( var key in arr) {
							var curObj = arr[key];
							var newTp = $("<option value='" + curObj['id']
									+ "'>" + curObj['catchWord'] + "</option>");
							result.children().append(newTp);
						}
						return result.children();
					},

					onCreateNewTopicContext : function(eventData) {
						this.checkUserLogin(eventData, "CreateNewContext");
					},

					checkUserLogin : function(eventData, type) {
						var evtArgs = {};
						evtArgs.type = type;
						evtArgs.evtData = eventData;
						var sbj = SingletonFactory.getInstance(Subject);
						sbj.notifyEvent("NeedLogin", evtArgs);
					},

					onRejectChanges : function(eventData) {
						var curUid = eventData.uid;
						var curAid = eventData.aid;
						$("#extension-content-plhld-" + curAid + "-" + curUid)
								.children().hide('fast');
					},

					onLoginSuccess : function(eventData) {
						var type = eventData.type;
						var evtArgs = eventData.evtData;
						if (type != undefined && evtArgs != undefined) {
							switch (type) {
							case "TopicAdded":
								this.topicAdded(evtArgs);
								break;
							case "TopicDeleted":
								this.topicDeleted(evtArgs);
								break;
							case "SubmitAnswer":
								this.submitAnswer(evtArgs);
								break;
							case "AcceptChanges":
								this.acceptChanges(evtArgs);
								break;
							case "CreateNewContext":
								this.createNewContextSuccess(evtArgs);
								break;
							case "EditPendingQuestion":
								this.editPendingQuestion(evtArgs);
								break;
							default:
								break;
							}
						}
					},

					createNewContextSuccess : function() {
						var subject = SingletonFactory.getInstance(Subject);
						var rq = SingletonFactory.getInstance(Page)
								.getRequest();
						var params = rq.getParams();
						var request = new Request("TopicCreatePage", "", {
							"pageCallBack" : params["page"],
							"needParam" : true
						});
						subject.notifyEvent('RequestRoute', request);
					},

					onHtmlUpdated : function() {
						var id = SingletonFactory.getInstance(Application)
								.getSystemProperties().get("user.id");
						$(
								".extension-point[extensionName='ProfileImageCheck'][uid='"
										+ id + "']").css("background-color",
								"#FAFAFA");
					}

				}).implement(PluginInterface);
