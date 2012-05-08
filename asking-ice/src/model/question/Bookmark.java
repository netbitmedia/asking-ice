package model.question;

import java.sql.Timestamp;

import model.Base;

public class Bookmark extends Base {

	public long id;
	public long userId;
	public long questionId;
	public Timestamp since;
	
	public String title;
	
	public Bookmark() {
		this.table = "bookmarks";
		this.key = "id";
	}
	
	public void add() throws Exception {
		this.insert("userId, questionId, since");
	}
	
	public void remove() throws Exception {
		this.delete("userId = ?userId AND questionId = ?questionId");
	}

	public Object isBookmarked() throws Exception {
		return !this.select("userId = ?userId AND questionId = ?questionId", null, null, null, 0, 1).isEmpty();
	}

	public Object getQuestions(int pageIndex, int pageSize) throws Exception {
		return this.foreignJoin(new Question(), "questionId", this.where("userId"), "title", null, "since DESC", null, pageIndex, pageSize);
	}
}
