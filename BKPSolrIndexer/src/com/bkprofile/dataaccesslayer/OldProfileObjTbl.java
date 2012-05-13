package com.bkprofile.dataaccesslayer;

import com.bkprofile.utils.ConfigLoader;

public class OldProfileObjTbl extends Table implements ITable {
	private ConfigLoader configLoader;
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new OldProfileObjTbl();
		}
		return instance;
	}

	private OldProfileObjTbl() throws Exception {
	}

	public String getSQL() {
		this.configLoader = ConfigLoader.getInstance();
		return this.configLoader.getQuery();
	}
}
