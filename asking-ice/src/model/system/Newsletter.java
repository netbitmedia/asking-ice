package model.system;


import java.sql.Timestamp;

import model.Base;

public class Newsletter extends Base {

	public long id;
	public long userId;
	public String title;
	public String content;
	public Timestamp since;
	
	public Newsletter()	{
		super();
		this.table = "newsletter";
		this.key = "id";
	}
	
	public void add() throws Exception	{
		this.insert("userId, title, content, since");
	}
}
