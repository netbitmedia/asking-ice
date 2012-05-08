package model.question;

import model.Base;
import inc.InputValidator;

public class EmailRecommend extends Base {
	
	public long id;
	public long userId;
	public long questionId;
	public String email;
	public long since;
	public String msg;

	public EmailRecommend()	{
		super();
		this.table = "emailrecommend";
		this.key = "id";
	}
	
	public void setEmail(String email) throws Exception {
		InputValidator.validateEmail(email);
		this.email = email;
	}
	
	public void add() throws Exception	{
		this.insert("userId, email, questionId, msg");
	}
}
