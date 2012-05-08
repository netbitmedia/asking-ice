package module;

import inc.annotations.AccessControl;
import model.question.Answer;
import model.question.AnswerFlag;
import model.question.AnswerVote;
import model.question.Comment;
import model.user.NotificationObserver;

import org.ice.db.Result;

public class AnswerModule extends BaseAjaxModule {

	@AccessControl
	public void addTask() throws Exception 	{
		Answer answer = new Answer();
		answer.userId = viewer.id;
		answer.questionId = Long.parseLong(getParam("qid"));
		answer.setContent(getParam("content"));
		answer.add();
	}
	
	@AccessControl
	public void updateTask() throws Exception {
		Answer answer = new Answer();
		answer.id = Long.parseLong(getParam("aid"));
		answer.load();
		answer.oldContent = answer.content;
		answer.userId = viewer.id;
		answer.setContent(getParam("content"));
		answer.edit();
		
		int notify = Integer.parseInt(getParam("notify"));
		if (notify == 1)	{
			NotificationObserver n = new NotificationObserver();
			n.onMessage(null, answer);
		}
	}
	
	public void getNoCommentTask() throws Exception	{
		Comment comment = new Comment();
		comment.answerId = Long.parseLong(getParam("aid"));
		result = new Result(true, null, comment.countByAnswer());
	}

	@AccessControl
	public void addNewCommentTask() throws Exception {
		Comment comment = new Comment();
		comment.userId = viewer.id;
		comment.answerId = Long.parseLong(getParam("aid"));
		comment.setContent(getParam("content"));
		comment.add();
	}
	
	public void getAllCommentsTask() throws Exception {
		Comment comment = new Comment();
		comment.answerId = Long.parseLong(getParam("aid"));
		result = new Result(true, null, comment.fetchByAnswers());
	}
	
	@AccessControl
	public void updateVoteTask() throws Exception {
		AnswerVote vote = new AnswerVote();
		vote.answerId = Long.parseLong(getParam("aid"));
		vote.userId = viewer.id;
		vote.add();
	}
	
	public void hasSentNegativeCommentTask() throws Exception {
		AnswerFlag flag = new AnswerFlag();
		flag.answerId = Long.parseLong(getParam("id"));
		flag.userId = viewer.id;
		result = new Result(true, null, flag.isFlagged());
	}
	
	@AccessControl
	public void addNegativeCommentTask() throws Exception {
		AnswerFlag flag = new AnswerFlag();
		flag.type = Integer.parseInt(getParam("type"));
		
		Answer answer = new Answer();
		answer.id = Long.parseLong(getParam("id"));
		answer.load();
		
		flag.add(viewer, answer);
	}
}
