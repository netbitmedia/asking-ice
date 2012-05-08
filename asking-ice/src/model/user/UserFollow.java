package model.user;

import java.util.ArrayList;

import model.Base;

public class UserFollow extends Base {
	
	public long sourceId;
	public long targetId;

	public UserFollow()	{
		super();
		this.table = "userfollow";
		this.key = "id";
	}

	public boolean isFollowing() throws Exception {
		ArrayList<UserFollow> list = this.select("sourceId = ?sourceId AND targetId = ?targetId");
		return !list.isEmpty();
	}
	
	public void add() throws Exception {
		this.insert("sourceId,targetId");
	}

	public void remove() throws Exception {
		this.delete("sourceId = ?sourceId AND targetId = ?targetId");
	}
	
	public ArrayList<User> fetchFollowers() throws Exception {
		User user = new User();
		return user.primaryJoin(this, "sourceId", this.where("targetId"), "users.id,name,avatar", "", null, null, -1, -1);
	}
	
	public ArrayList<User> fetchFollowing() throws Exception {
		User user = new User();
		return user.primaryJoin(this, "targetId", this.where("sourceId"), "users.id,name,avatar", "", null, null, -1, -1);
	}
}
