package model.user;

import java.util.ArrayList;

import model.Base;

public class News extends Base {
	
	public long id;
	public long partnerId;
	public String title;
	public String url;
	public String content;
	public String image;
	
	public String name;

	public News()	{
		this.table = "news";
		this.key = "id";
	}

	public ArrayList<News> listLatest() throws Exception {
		return this.foreignJoin(new User(), "partnerId", null, "name", null, "since DESC", null, 0, 5);
	}
}
