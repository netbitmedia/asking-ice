package model.question;

import model.Base;

public class QuestionVote extends Base {
	
	public long id;
	public long userId;
	public long questionId;

	public QuestionVote()	{
		super();
		this.table = "questionvote";
		this.key = "id";
	}
	
	public void add() throws Exception	{
		this.insert("userId, questionId");
		Question question = new Question();
		question.id = questionId;
		question.addVote();
	}
}
