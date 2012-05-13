package com.bkprofile.dataaccesslayer;


/**
 * Get user's vote by answers with respect to user's expertises
 * @author nguyenvandonganh
 *
 */
public class VoteAnswerTbl extends Table implements ITable {

	public static ITable instance;

	/**
	 * @param args
	 * @throws Exception
	 */
	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new VoteAnswerTbl();
		}
		return instance;
	}
	
	private VoteAnswerTbl() throws Exception {
		super();
	}

	public String getSQL(){
		return "SELECT cw.id, cw.catchWord, u.explanation, cw.detail, sum(a.vote) as vote FROM `answers` as a, `questioncatch` as c, `usercatch` as u, `catchwords` as cw WHERE u.catchwordId = cw.id AND cw.id = c.catchWordId AND a.questionId = c.questionId AND u.userId = a.userId AND a.userId = ? group by cw.id";
	}

}