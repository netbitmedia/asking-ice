package model.system;

import java.sql.Timestamp;

import model.Base;

public class Invitation extends Base {
	
	public long id;
	public long senderId;
	public String targetEmail;
	public Timestamp since;

	public Invitation()	{
		this.table = "invitation";
		this.key = "id";
	}

	public boolean emailExist() throws Exception {
		return !this.select("targetEmail = ?targetEmail", "id", null, null, 0, 1).isEmpty();
	}

	public void add() throws Exception {
		this.insert("senderId, targetEmail");
	}
}
