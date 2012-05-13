package com.bkprofile.dataaccesslayer;

public class VoteInterestTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new VoteInterestTbl();
		}
		return instance;
	}

	private VoteInterestTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT cw.id, cw.catchWord, '' as explanation, cw.detail, sum(a.vote) as ques_vote, sum(ans.vote) as ans_vote, a.userId as ques_user_id, ans.userID as ans_user_id FROM (((`userinterest` as u inner JOIN `catchwords` as cw ON u.catchwordId = cw.id) LEFT JOIN `questioncatch` as c ON cw.id = c.catchWordId ) LEFT JOIN `questions` as a ON c.questionId = a.id) LEFT JOIN answers as ans on ans.questionId = c.questionId where u.userId = ? group by cw.id";
	}
}
