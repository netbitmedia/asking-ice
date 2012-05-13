/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.bkprofile.dataaccesslayer;

/**
 *
 * @author Hung
 */
public class ArticleCommentTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new ArticleCommentTbl();
		}
		return instance;
	}

	private ArticleCommentTbl() throws Exception {
            
	}

	public String getSQL() {
            return "SELECT c.id as commentID, c.content as commentContent, c.since as commentCreatedDate,u.id as commentUserID,u.username as commentUsername,u.avatar as commentAvatar  FROM `articleComments` as c, `bk_users` as u,articles as a WHERE c.userID = u.id and c.articleID=a.id and c.articleID = ?";
        }

}
