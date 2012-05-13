package com.bkprofile.dataaccesslayer;

public class AutocompleteQuestionTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new AutocompleteQuestionTbl();
		}
		return instance;
	}

	private AutocompleteQuestionTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT q.id as id, q.title as question, k.catchWord as catchWord, q.vote as vote, sum(a.vote) as answerVote, q.since as date, a.since as answerDate, count(a.questionId) as numberAnswer FROM ((`questions` as q LEFT JOIN `questioncatch` as qc ON qc.questionId = q.id) LEFT JOIN `catchwords` as k ON qc.catchWordId  = k.id) LEFT JOIN answers as a ON q.id = a.questionId WHERE q.id >= ? AND q.id <= ? group by q.id, k.id order by q.id ";
	}
}
