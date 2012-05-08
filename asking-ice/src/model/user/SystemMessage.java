package model.user;

import java.sql.Timestamp;
import java.util.ArrayList;

import model.Base;

public class SystemMessage extends Base {
	
	public long id;
	public long userId;
	public String msg;
	public String action;
	public String link;
	public Timestamp since;
	
	public SystemMessage() {
		this.table = "systemmessages";
		this.key = "id";
	}
	
	public SystemMessage getMessage() throws Exception {
		ArrayList<SystemMessage> list = this.select("userId = ?userId");
		if (list.isEmpty())
			return null;
		return list.get(0);
	}

	public void removeByUser() throws Exception {
		this.delete("userId = ?userId");
	}
}