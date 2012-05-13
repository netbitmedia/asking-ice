package com.bkprofile.models;

import java.util.ArrayList;

import org.ice.db.Table;

public class UserCatch extends Table {

	public long id;
	public long userId;
	public long catchWordId;
	
	public UserCatch() {
		this.key = "id";
		this.table = "usercatch";
	}
	
	public ArrayList<UserCatch> listExpertise() throws Exception {
		return this.select(null);
	}
	
}
