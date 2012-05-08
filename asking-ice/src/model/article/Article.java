package model.article;

import java.sql.Timestamp;
import java.util.ArrayList;

import model.Base;
import model.user.User;

public class Article extends Base {
	
	public long id;
	public long userId;
	public String title;
	public String summary;
	public String content;
	public int selected;
	public int vote;
	public int type;
	public Timestamp since;
	
	public String name;

	public Article()	{
		super();
		this.table = "articles";
		this.key = "id";
	}
	
	public ArrayList<Article> browseArticles() throws Exception {
		return this.select("selected = 1", "id, title", "since DESC", null, 0, 18);
	}
	
	public ArrayList<Article> listSelected(int pageIndex, int pageSize) throws Exception {
		if (type == 0)
			return this.foreignJoin(new User(), "userId", "selected = 1", "name", "articles.id, userId, title, summary, vote, since", "since DESC", null, pageIndex, pageSize);
		else
			return this.foreignJoin(new User(), "userId", "selected = 1 AND "+this.where("type"), "name", "articles.id, userId, title, summary, vote, since", "since DESC", null, pageIndex, pageSize);
	}
	
	public ArrayList<Article> fetchLatest() throws Exception {
		return this.foreignJoin(new User(), "userId", null, "name", "articles.id, userId, title", "since DESC", null, 0, 3);
	}

	public ArrayList<Article> fetchMostVoted() throws Exception {
		return this.foreignJoin(new User(), "userId", null, "name", "articles.id, userId, title, summary, vote", "vote DESC", null, 0, 3);
	}

	public Object fetchDetail() throws Exception {
		ArrayList<Article> list = this.foreignJoin(new User(), "userId", this.where("id"), "name", "articles.id, userId, title, summary, content, articles.type, vote", "since DESC", null, 0, 1);
		if (list.isEmpty()) return null;
		return list.get(0);
	}

	public void addVote() throws Exception {
		this.update("vote = vote + 1");
	}
}
