package model.question;

import java.sql.Timestamp;

import model.Base;
import model.user.User;

public class Recommend extends Base {
	
	public long id;
	public long userId;
	public long questionId;
	public long targetId;
	public Timestamp since;
	
	public String name;
	public String avatar;

	public Recommend()	{
		super();
		this.table = "recommend";
		this.key = "id";
	}
	
	public void add() throws Exception	{
		if (userId != targetId)
			this.insert("userId, targetId, questionId");
	}

	public Object listByQuestion() throws Exception {
		return this.foreignJoin(new User(), "targetId", this.where("questionId"), "distinct name, avatar", "targetId", "since DESC", null, 0, 10);
	}
}
