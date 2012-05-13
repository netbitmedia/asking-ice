package com.bkprofile.models;

import java.util.ArrayList;

import org.ice.db.Table;

public class UserInterest extends Table {

	public long id;
	public long userId;
	public long catchWordId;
	
	public UserInterest() {
		this.key = "id";
		this.table = "userinterest";
	}
	
	public ArrayList<UserInterest> listInterest() throws Exception {
		return this.select(null);
	}
	
}
