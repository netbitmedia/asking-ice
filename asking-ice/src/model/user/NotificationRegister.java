package model.user;

import java.util.ArrayList;

import model.Base;

public class NotificationRegister extends Base {
	
	public long id;
	public long userId;
	public long objId;
	public int type;
	
	public String name;
	public String avatar;
	public String email;

	public NotificationRegister()	{
		super();
		this.table = "notificationregister";
		this.key = "id";
	}
	
	public void registerQuestion() throws Exception	{
		this.type = 1;
		this.insert("userId, objId, type");
	}
	
	public void unregisterQuestion() throws Exception {
		this.delete("userId = ?userId AND objId = ?objId AND type = 1");
	}

	public ArrayList<NotificationRegister> listQuestionFollowers() throws Exception {
		return this.foreignJoin(new User(), "userId", this.where("objId"), "name, avatar", "userId", null, null, 0, 20);
	}
	
	public ArrayList<NotificationRegister> listQuestionFollowersEmail() throws Exception {
		return this.foreignJoin(new User(), "userId", this.where("objId"), "email", "userId", null, null, -1, -1);
	}

	public boolean isUserFollowQuestion() throws Exception {
		return !this.select("userId = ?userId AND objId = ?objId AND type = 1", "id", null, null).isEmpty();
	}
}
