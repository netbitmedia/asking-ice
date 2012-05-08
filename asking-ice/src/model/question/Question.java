package model.question;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.Random;

import model.Base;
import model.user.User;

import exception.InputException;

public class Question extends Base {
	
	public long id;
	public String title;
	public String content;
	
	public long userId;
	public long targetId;
	public long targetNextId;
	
	public String bestSource;
	public int anonymous;
	public int vote;
	public Timestamp since;
	
	public String name;
	public String avatar;

	public Question()	{
		super();
		this.table = "questions";
		this.key = "id";
	}
	
	public long countByUser() throws Exception {
		return countByCustom("userId = ?userId");
	}

	public Object fetchDetail() throws Exception {
		ArrayList<Question> list = this.foreignJoin(new User(), "userId", this.where("id"), "name, avatar", null, null, null, 0, 1);
		if (list.isEmpty())
			return null;
		if (list.get(0).anonymous == 1)	{
			list.get(0).name = null;
			list.get(0).avatar = null;
			list.get(0).userId = 0;
		}
		return list.get(0);
	}

	public void setContent(String param) {
		this.content = param;
	}

	public void edit() throws Exception {
		this.update("content", "userId = ?userId AND id = ?id");
	}
	
	public void adminEdit() throws Exception {
		this.update("content", "id = ?id");
	}

	public void addVote() throws Exception {
		this.update("vote = vote + 1");
	}

	public void setTitle(String param) throws InputException {
		if (param == null || param.isEmpty())
			throw new InputException("Tiêu đề không được để trống");
		param = param.trim();
		if (param.length() > 100)
			throw new InputException("Tiêu đề không được dài hơn 100 kí tự");
		if (param.indexOf('?') == -1)	{
			throw new InputException("Tiêu đề câu hỏi phải có dấu hỏi (?)");
		}
		param = param.substring(0, 1).toUpperCase()+param.substring(1);
		this.title = param;
	}

	public void add() throws Exception {
		ArrayList<Question> list = this.select("title = ?title", null, null, null);
		this.vote = 0;
		if (!list.isEmpty()) {
			this.id = list.get(0).id;
			return;
		}
		this.insert("userId, targetId, targetNextId, title, content, vote, anonymous");
	}

	public Object getExtraQuestions() throws Exception {
		return this.view(this.select("id > ?id", "id, title, since", "id DESC", null, 0, 3), "id, title, since");
	}

	public Object getShuffleQuestions(int pageSize) throws Exception {
//		long total = this.countTotal();
//		String shuffleIds = "-1";
//		Random rand = new Random(new Date().getTime());
//		for(int i=0;i<pageSize;i++)	{
//			shuffleIds += ","+Math.abs(rand.nextLong())%total;
//		}
//		return this.select("id IN ("+shuffleIds+")", "id, title", null, null, 0, pageSize);

		ArrayList<Question> featureList = this.select("bestSource is not null", null, "RAND()", null, 0, 7);
		ArrayList<Question> commonList = this.select("bestSource is null", null, "RAND()", null, 0, 3);
		ArrayList<Question> all = new ArrayList<Question>();
		all.addAll(featureList);
		all.addAll(commonList);
		return all;
	}

	public void editAnonymous() throws Exception {
		this.update("anonymous", "id = ?id AND userId = ?userId");
	}

	public void setBestSource(String bestSource) throws InputException {
		if (bestSource == null || bestSource.isEmpty())
			throw new InputException("Bạn phải nhập lý do");
		this.bestSource = bestSource;
	}

	public void updateBestSource() throws Exception {
		this.update("bestSource");
	}
}
