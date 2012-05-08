package model.question;

import java.sql.Timestamp;

import model.Base;
import model.user.User;

import exception.InputException;

public class Comment extends Base {

	public long id;
	public long answerId;
	public long userId;
	public String content;
	public Timestamp since;
	
	public String name;
	public String avatar;
	
	public Comment()	{
		super();
		this.table = "comments";
		this.key = "id";
	}

	public long countByAnswer() throws Exception	{
		return this.countByCustom("answerId = ?answerId");
	}

	public void add() throws Exception {
		this.insert("answerId, userId, content");
	}

	public void setContent(String param) throws InputException {
		if (param == null || param.isEmpty())
			throw new InputException("Nội dung không được để trống");
		this.content = param;
	}

	public Object fetchByAnswers() throws Exception {
		return this.foreignJoin(new User(), "userId", this.where("answerId"), "name, avatar", null, "since ASC", null, 0, 10);
	}
}
