package com.bkprofile.dataaccesslayer;

public class UserCatchTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new UserCatchTbl();
		}
		return instance;
	}

	private UserCatchTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT * FROM `usercatch` as u, `catchwords` as c WHERE u.catchwordId = c.id AND userId = ?";
	}
}
