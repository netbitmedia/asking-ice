package com.bkprofile.dataaccesslayer;


/**
 * Get votes of user's expertises based on question's votes
 * */
public class VoteQuestionTbl extends Table implements ITable {

	public static ITable instance;

	/**
	 * @param args
	 * @throws Exception
	 */
	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new VoteQuestionTbl();
		}
		return instance;
	}
	
	private VoteQuestionTbl() throws Exception {
		super();
	}

	public String getSQL(){
		return "SELECT cw.id, cw.catchWord, u.explanation, cw.detail, sum(vote) as vote FROM `questions` as a, `questioncatch` as c, `usercatch` as u, `catchwords` as cw WHERE u.catchwordId = cw.id AND cw.id = c.catchWordId AND a.id = c.questionId AND u.userId = a.userId AND a.userId = ? group by cw.id";
	}

}