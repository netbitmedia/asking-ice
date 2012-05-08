package model.article;

import model.Base;

public class ArticleVote extends Base {
	
	public long id;
	public long userId;
	public long articleId;

	public ArticleVote()	{
		super();
		this.table = "articlevote";
		this.key = "id";
	}
	
	public void add() throws Exception {
		this.insert("userId, articleId");
		Article article = new Article();
		article.id = articleId;
		article.addVote();
	}
}
