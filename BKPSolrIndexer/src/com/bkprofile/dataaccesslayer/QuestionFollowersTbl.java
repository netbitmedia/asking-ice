package com.bkprofile.dataaccesslayer;

public class QuestionFollowersTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new QuestionFollowersTbl();
		}
		return instance;
	}

	private QuestionFollowersTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT DISTINCT usercatch.userId FROM questioncatch INNER JOIN usercatch ON questioncatch.catchWordId = usercatch.catchwordId AND questioncatch.questionId = ?";
	}
}
