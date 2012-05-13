package com.bkprofile.dataaccesslayer;

public class AnswerCountTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new AnswerCountTbl();
		}
		return instance;
	}

	private AnswerCountTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT count(*) as count, sum(vote) as vote FROM `answers` where userId = ?";
	}
}
