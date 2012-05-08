package module;

import org.ice.db.Result;
import org.ice.db.Viewer;

import model.article.Article;
import model.article.ArticleVote;
import model.user.User;

public class ArticleModule extends BaseAjaxModule {

	public void browseArticlesTask() throws Exception {
		Article article = new Article();
		result = new Result(true, null, article.browseArticles());
	}
	
	public void listArticlesTask() throws Exception {
		Article article = new Article();
		int pageIndex = 0;
		int pageSize = 10;
		article.type = 0;
		try {
			pageIndex = Integer.parseInt(getParam("page"));
		} catch (Exception ex) {}
		try {
			pageSize = Integer.parseInt(getParam("pageSize"));
		} catch (Exception ex) {}
		try {
			article.type = Integer.parseInt(getParam("type"));
		} catch (Exception ex) {}
		result = new Result(true, null, article.listSelected(pageIndex, pageSize));
	}
	
	public void getSummaryTask() throws Exception {
		Article article = new Article();
		article.id = Long.parseLong(getParam("id"));
		Viewer v = new Viewer();
		if (article.load()) {
			User user = new User();
			user.id = article.userId;
			user.load();
			
			v.put("summary", article.summary);
			v.put("userID", article.userId);
			v.put("name", user.name);
			v.put("about", user.about);
		}
		result = new Result(true, null, v.getMap());
	}
	
	public void getDetailTask() throws Exception {
		Article article = new Article();
		article.id = Long.parseLong(getParam("id"));
		result = new Result(true, null, article.fetchDetail());
	}
	
	public void addVoteTask() throws Exception {
		ArticleVote articleVote = new ArticleVote();
		articleVote.articleId = Long.parseLong(getParam("id"));
		articleVote.userId = viewer.id;
		articleVote.add();
	}
}
