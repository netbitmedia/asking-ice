/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.bkprofile.dataaccesslayer;

/**
 *
 * @author Hung
 */
public class ArticleCatchwordTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new ArticleCatchwordTbl();
		}
		return instance;
	}

	private ArticleCatchwordTbl() throws Exception {
            
	}

	public String getSQL() {
            return "SELECT c.id as catchwordId, c.catchword as catchwordName FROM `articleCatchwords` as ac, `catchwords` as c WHERE ac.catchwordId = c.id and ac.articleId = ?";
        }

}
