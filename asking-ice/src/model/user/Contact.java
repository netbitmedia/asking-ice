package model.user;

import model.Base;

public class Contact extends Base {
	
	public long id;
	public long userId;
	public String name;
	public String email;
	public long targetId;
	public int followed;
	
	public String username;
	public String avatar;
	
	public Contact() {
		this.table = "contacts";
		this.key = "id";
	}
	
	public void add() throws Exception {
		if (name == null || name.isEmpty())	{
			name = email;
		}
		this.insert("userId, name, email, targetId, followed");
	}
	
	public void updateJoined() throws Exception {
		this.update("targetId", "email = ?email");
	}

	public Object fetchToInvite() throws Exception {
		return this.select("userId = ?userId AND targetId = 0", "name, email", null, null, 0, 10);
	}

	public Object fetchContacts(int page) throws Exception {
		return this.foreignJoin(new User(), "targetId", this.where("userId"), "users.name as username, avatar", "email, contacts.name, targetId", null, null, page, 20);
	}
}