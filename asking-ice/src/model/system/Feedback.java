package model.system;

import inc.InputValidator;

import java.sql.Timestamp;

import model.Base;
import model.user.User;

public class Feedback extends Base {

	public long id;
	public long userId;
	public String content;
	public String email;
	public Timestamp since;
	
	public String name;
	
	public Feedback()	{
		super();
		this.table = "feedbacks";
		this.key = "id";
	}
	
	public Object listAll(int pageIndex, int pageSize) throws Exception {
		return this.foreignJoin(new User(), "userId", "OR userId IS NULL", "name", null, "since DESC", null, pageIndex, pageSize);
	}

	public void setContent(String content) throws Exception	{
		if (content == null || content.isEmpty())	{
			throw new Exception("Nội dung góp ý không được để trống");
		}
		
		if (content.length() > 500)	{
			throw new Exception("Nội dung góp ý không được quá 500 kí tự");
		}
		
		this.content = content;
	}
	
	public void setEmail(String email) throws Exception {
		InputValidator.validateEmail(email);
		this.email = email;
	}
	
	public void add() throws Exception	{
		this.insert("userId, content, email");
	}
}
