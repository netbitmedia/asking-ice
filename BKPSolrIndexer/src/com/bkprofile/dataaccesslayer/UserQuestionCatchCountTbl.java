package com.bkprofile.dataaccesslayer;

public class UserQuestionCatchCountTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new UserQuestionCatchCountTbl();
		}
		return instance;
	}

	private UserQuestionCatchCountTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT catchwordId, count(*) as numbers FROM questions AS aq INNER JOIN questioncatch AS aqc ON aq.id = aqc.questionId AND aq.userId = ? GROUP BY catchwordId";
	}
}
