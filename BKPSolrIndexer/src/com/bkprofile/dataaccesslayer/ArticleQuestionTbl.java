/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.bkprofile.dataaccesslayer;

/**
 *
 * @author Hung
 */
public class ArticleQuestionTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new ArticleQuestionTbl();
		}
		return instance;
	}

	private ArticleQuestionTbl() throws Exception {
            
	}

	public String getSQL() {
            return "SELECT q.id as questionID, q.content as questionContent FROM `articleQuestions` as aq, `questions` as q WHERE aq.questionId = q.id and aq.articleId = ?";
        }

}
