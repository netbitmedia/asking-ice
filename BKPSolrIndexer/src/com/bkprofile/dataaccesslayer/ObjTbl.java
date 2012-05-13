package com.bkprofile.dataaccesslayer;

public class ObjTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new ObjTbl();
		}
		return instance;
	}

	private ObjTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT *, bk.id as userID FROM `users` as bk WHERE (`bk`.id >= ?) AND (`bk`.id < ?)";
	}
}
