package model.question;

import model.Base;

public class AnswerVote extends Base {
	
	public long id;
	public long userId;
	public long answerId;

	public AnswerVote()	{
		super();
		this.table = "answervote";
		this.key = "id";
	}
	
	public void add() throws Exception {
		this.insert("userId, answerId");
		Answer answer = new Answer();
		answer.id = answerId;
		answer.addVote();
	}
}
