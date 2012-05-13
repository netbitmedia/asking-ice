package com.bkprofile.dataaccesslayer;

public class QuestionCountTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new QuestionCountTbl();
		}
		return instance;
	}

	private QuestionCountTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT count(*) as count, sum(vote) as vote FROM `questions` where userId =?";
	}
}
