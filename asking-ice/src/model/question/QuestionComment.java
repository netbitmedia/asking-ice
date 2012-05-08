package model.question;

import java.sql.Timestamp;

import model.Base;
import model.user.User;

import exception.InputException;

public class QuestionComment extends Base {

	public long id;
	public long questionId;
	public long userId;
	public String content;
	public Timestamp since;
	
	public String name;
	public String avatar;
	
	public QuestionComment()	{
		super();
		this.table = "questioncomment";
		this.key = "id";
	}

	public long countByQuestion() throws Exception	{
		return this.countByCustom("questionId = ?questionId");
	}

	public void add() throws Exception {
		this.insert("questionId, userId, content");
	}

	public void setContent(String param) throws InputException {
		if (param == null || param.isEmpty() || param.length() > 500)
			throw new InputException("Nội dung không được để trống hoặc dài hơn 500 kí tự");
		this.content = param;
	}

	public Object fetchByQuestion() throws Exception {
		return this.foreignJoin(new User(), "userId", this.where("questionId"), "name, avatar", null, "since ASC", null, 0, 10);
	}
}
