/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.bkprofile.dataaccesslayer;

/**
 *
 * @author Hung
 */
public class ArticleTbl extends Table implements ITable  {
    public static ITable instance;
    public static ITable getInstance() throws Exception {
        if (instance == null) {
                instance = new ArticleTbl();
        }
        return instance;
    }
    private ArticleTbl() throws Exception {
        
    }
    @Override
    public String getSQL() {
       return "SELECT a.id as id, a.title as title,a.summary as summary, a.content as content,a.isSelected as isSelected, a.totalVote as totalVote,a.createdDate as createdDate, a.totalVote as totalVote, a.createdDate as createdDate,at.id as typeID,at.articleTypeName as typeName,  u.id as userID,u.username as username,u.avatar as avatar FROM ((`articles` as a LEFT JOIN `articleTypes` as at ON at.id = a.typeID) LEFT JOIN `bk_users` as u ON a.userID  = u.id) WHERE a.id >=? AND a.id <=? group by a.id,u.id order by a.createdDate desc";
    }

}
