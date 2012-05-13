package com.bkprofile.dataaccesslayer;

public class CatchWordTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new CatchWordTbl();
		}
		return instance;
	}

	private CatchWordTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT * FROM `questioncatch` as qc, `catchwords` as k WHERE qc.catchWordId = k.id and qc.questionId = ?";
	}
}
