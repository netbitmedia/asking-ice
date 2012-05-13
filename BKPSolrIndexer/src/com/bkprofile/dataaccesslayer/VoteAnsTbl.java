package com.bkprofile.dataaccesslayer;


public class VoteAnsTbl extends Table implements ITable {

	public static ITable instance;

	/**
	 * @param args
	 * @throws Exception
	 */
	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new VoteAnsTbl();
		}
		return instance;
	}
	
	private VoteAnsTbl() throws Exception {
		super();
	}

	public String getSQL(){
		return "SELECT cw.id, cw.catchWord, u.explanation, cw.detail, sum(ans.vote) as vote FROM (((`usercatch` as u inner JOIN `catchwords` as cw ON u.catchwordId = cw.id) LEFT JOIN `questioncatch` as c ON cw.id = c.catchWordId) INNER JOIN `questions` as a ON c.questionId = a.id ) LEFT JOIN answers as ans on ans.questionId = c.questionId where u.userId = ? and ans.userId = u.userId group by cw.id";
	}

}