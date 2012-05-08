//CommentPlugin = Class.extend(
//{
//	init : function() {
//		this.name = "CommentPlugin";
//		this.app = SingletonFactory.getInstance(Application);
//		this.root = this.app.getSystemProperties().get(
//				"host.root");
//	},
//	
//	onShowComment: function(eventData){
//		var uid = eventData.uid;
//		var aid = eventData.aid;
//		var plhldID = "#extension-content-plhld-" + aid + "-" + uid ;
//		var commentAnswerPlhldID = "#comment-list-plhld-" + aid + "-" + uid ; 
//		var element = $(plhldID + " " + commentAnswerPlhldID);
//		var currentPlt = this;
//		
//		if($(element).attr("flag") == undefined || $(element).attr("flag") == false){
//			$(element).attr("flag",true);
//		} else {
//			$(element).removeAttr("flag");
//			$(commentAnswerPlhldID).slideToggle();
//			return;
//		}
//		
//		//ajax loading
//		//getAllCommentsAction
//		var url = this.root + "answer/get-all-comments/";
//		var sbj = SingletonFactory.getInstance(Subject);
//		// xoay xoay ajax => nen de thanh plugin
//		
//		$.get(url, {aid:aid}, function(ret){
//			try {
//				ret = $.parseJSON(ret);								
//				if(ret.result == "error"){
//					//error
//					return;
//				}
//				$(commentAnswerPlhldID).hide();
//				$(commentAnswerPlhldID).empty();
//
//				//fetch comment number
//				currentPlt.bindNumberOfComment(aid,uid,ret.data.length);
//				
//				// dump to list
//				ret = ret.data;
//				for(var key in ret){
//					var objParam = {};
//					objParam.content = ret[key]["content"];
//					objParam.date = formatDate(ret[key]["created_date"]);
//					objParam.uid = ret[key]["userID"];
//					objParam.username = ret[key]["name"] ;
//					objParam.avatar = ret[key]["avatar"];
//					var template = $(tmpl("CommonPortlet-CommentItem",objParam));
//					$(commentAnswerPlhldID).append(template);
//				}
//				var checkImg = {};
//				checkImg.zone = $(commentAnswerPlhldID);
//				sbj.notifyEvent("RequestProfileImageCheck", checkImg);
//				$(commentAnswerPlhldID).slideToggle("slow");
//			} catch (e) {
//			}
//		});
//	},
//	
//	bindNumberOfComment: function(aid, uid, data){
//		var cmtID = "comment_no_"+aid+"_"+uid;
//		$("#" + cmtID).html("Bàn luận thêm ("+data+")");
//	},
//	
//	onAddComment: function(eventData){
////						$.facebox("Chức năng này đang được hoàn thiện. Mong bạn vui lòng quay lại sau.");
//		var uid = eventData.uid;
//		var aid = eventData.aid;
//		var plhldID = "#extension-content-plhld-" + aid + "-" + uid ;
//		var commentAnswerPlhldID = " #comment-addnew-plhld-" + aid + "-" + uid ; 
//		var element = $(plhldID + " " + commentAnswerPlhldID);
//		$(element).slideToggle('fast');
//	},
//	
//	onAddNewComment: function(eventData){
//		this.checkUserLogin(eventData, "AddNewComment");
//	},
//	
//	addNewComment: function(eventData){
//		var plhldContent = eventData.id;
//		var aid = eventData.aid;
//		var uid = eventData.uid;
//		var content = $("#"+plhldContent).val();
//		var currentPlt = this;
//		if(jQuery.trim( content ) == ""){
//			$.facebox("Bạn chưa nhập thông tin!");
//			return;
//		}
//		var url = this.root + "answer/add-new-comment/";
//		var sbj = SingletonFactory.getInstance(Subject);
//		var commentAnswerPlhldID = " #comment-addnew-plhld-" + aid + "-" + uid ;
//		// xoay xoay ajax => nen de thanh plugin
//		
//		$.post(url, {aid:aid, content:content}, function(ret){
//			try {
//				ret = $.parseJSON(ret);
//				ret = ret.result;
//				if(ret == "error"){
//					//error
//					return;
//				}
//				sbj.notifyEvent("NotifyGlobal",
//				"Thêm thành công");
//				$(commentAnswerPlhldID).slideToggle("fast");
//				
//				// bind number of data
//				var cmtID = "comment_no_"+aid+"_"+uid;
//				var cmtNo = eval($("#"+cmtID).html());
//				cmtNo = cmtNo + 1;
//				currentPlt.bindNumberOfComment(aid,uid,cmtNo);
//				$("#"+plhldContent).val("");
//			} catch (e) {
//				// error
//			}
//		});
//	},
//	
//	checkUserLogin : function(eventData, type) {
//		var evtArgs = {};
//		evtArgs.type = type;
//		evtArgs.evtData = eventData;
//		var sbj = SingletonFactory.getInstance(Subject);
//		sbj.notifyEvent("NeedLogin", evtArgs);
//	},
//	
//	onLoginSuccess : function(eventData) {
//		var type = eventData.type;
//		var evtArgs = eventData.evtData;
//		if (type != undefined && evtArgs != undefined) {
//			switch (type) {
//			case "AddNewComment":
//				this.addNewComment(evtArgs);
//				break;
//			default:
//				break;
//			}
//		}
//	}
//}).implement(PluginInterface);
