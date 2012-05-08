package model.user;

import java.sql.Timestamp;

import model.question.Answer;
import model.question.AnswerFlag;
import model.question.AnswerVote;
import model.question.Comment;
import model.question.EmailRecommend;
import model.question.Question;
import model.question.QuestionVote;
import model.question.Recommend;

import inc.message.Observer;

public class FeedObserver extends NotificationObserver implements Observer {

	public long id;
	public long sourceId;
	public long targetId;
	public String content;
	public String type;
	public Timestamp since;

	public FeedObserver() {
		super();
		this.table = "feeds";
		this.key = "id";
	}

	protected void onAnswerReported(AnswerFlag table) throws Exception {
		content = "%name% đã góp ý cho một câu trả lời";
		type = "AnswerReported";
		sourceId = table.userId;
		targetId = table.answerId;
		this.add();
	}

	protected void onAnswerVoted(AnswerVote table) throws Exception {
		content = "%name% đã vote cho một câu trả lời";
		type = "AnswerVoted";
		sourceId = table.userId;
		targetId = table.answerId;
		this.add();
	}
	
	protected void onQuestionAdded(Question table) throws Exception {
		content = "%name% đã hỏi cho một câu trả lời";
		type = "QuestionAdded";
		sourceId = table.userId;
		targetId = table.id;
		this.add();
	}
	
	protected void onQuestionInvited(Recommend table) throws Exception {
		
	}
	
	protected void onQuestionInvitedEmail(EmailRecommend table) throws Exception {
		
	}

	protected void onQuestionVoted(QuestionVote table) throws Exception {
		content = "%name% đã vote cho một câu hỏi";
		type = "QuestionVoted";
		sourceId = table.userId;
		targetId = table.questionId;
		this.add();
	}

	protected void onAnswerCommented(Comment table) throws Exception {
		content = "%name% đã bình luận cho một câu trả lời";
		type = "AnswerCommented";
		sourceId = table.userId;
		targetId = table.answerId;
		this.add();
	}

	protected void onAnswerAdded(Answer table) throws Exception {
		content = "%name% đã trả lời một câu hỏi";
		type = "QuestionAnswered";
		sourceId = table.userId;
		targetId = table.questionId;
		this.add();
	}

	protected void add() throws Exception {
		this.insert("sourceId, targetId, content, type");
	}
}
