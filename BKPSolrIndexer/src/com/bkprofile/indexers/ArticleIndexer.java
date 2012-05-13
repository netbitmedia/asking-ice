/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.bkprofile.indexers;

import com.bkprofile.dataaccesslayer.ArticleCatchwordTbl;
import com.bkprofile.dataaccesslayer.ArticleCommentTbl;
import com.bkprofile.dataaccesslayer.ArticleQuestionTbl;
import com.bkprofile.dataaccesslayer.ArticleTbl;
import com.bkprofile.dataaccesslayer.CatchWordTbl;
import com.bkprofile.dataaccesslayer.ITable;
import com.bkprofile.entities.Doc;
import com.bkprofile.entities.DocPartial;
import com.bkprofile.utils.ConfigLoader;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;
import org.apache.solr.client.solrj.SolrServerException;

/**
 *
 * @author Hung
 */
public class ArticleIndexer extends AbstractIndexer  { 
    private static final int MAX_DOC_UPDATE = configLoader.getMaxDocCommit();
    private static final String ID_FIELD = "id";
    private int index = 1;

    private static ArticleIndexer instance = null;

    private ITable catchWordTable = null;
    private ITable commentTable = null;
    private ITable questionTable = null;

    public static ArticleIndexer getInstance() {
        if (instance == null) {
                instance = new ArticleIndexer();
        }
        return instance;
    }
    @Override
    public String getIdField() {
       return ID_FIELD;
    }
    private int getIndex() {
        return this.index++;
    }
    public boolean index() {
        ITable articleTable = null;
        try {
                articleTable = ArticleTbl.getInstance();
                this.catchWordTable = ArticleCatchwordTbl.getInstance();
                this.commentTable=ArticleCommentTbl.getInstance();
                this.questionTable=ArticleQuestionTbl.getInstance();
                articleTable.clearParams();
                articleTable.addParam(Integer.valueOf(this.rangeStart));
                articleTable.addParam(Integer.valueOf(this.rangeStop));
                boolean ok = articleTable.run();
                if (!ok) {
                        return false;
                }
                ResultSet data = articleTable.getDataSet();
                Doc doc = null;
                ArrayList<Doc> docs = new ArrayList<Doc>();
                int count = 0;
                int oldId = -1;
                while (data.next()) {
                        int id = data.getInt("id");
                        if (id != oldId) {
                                oldId = id;
                                count++;
                                if (doc != null) {
                                        docs.add(doc);
                                }
                                if (count++ > MAX_DOC_UPDATE) {
                                        updateDocuments(docs);
                                        optimiseUpdate();
                                        docs.clear();
                                        count = 1;
                                }
                                doc = new Doc(getIndex() + "");
                               
                               
                                
                                doc.add(new DocPartial("articleID", id +"", 0));
                                 doc.add(new DocPartial("title", data
                                                .getString("title"), 0));


                                 doc.add(new DocPartial("summary", data
                                                .getString("summary"), 0));
                                 doc.add(new DocPartial("content", data
                                                .getString("content"), 0));

                                String strTime = null;
                                Date date = data.getDate("createdDate");
                                Time time = data.getTime("createdDate");
                                System.out.println(id);
                                System.out.println(data.getString("createdDate"));
                                doc.add(new DocPartial("userID", data.getInt("userID")
                                                + ""));
                                doc.add(new DocPartial("avatar", data.getString("avatar")
                                                + ""));
                                doc.add(new DocPartial("username", data.getString("username")
                                                + ""));
                                doc.add(new DocPartial("typeID", data.getInt("typeID")
                                                + ""));
                                doc.add(new DocPartial("typeName", data.getString("typeName")
                                                + ""));
                                 doc.add(new DocPartial("isSelected", data.getInt("isSelected")
                                                                                + ""));
                                if ((date != null) && (time != null)) {
                                        strTime = buildSolrDate(date, time);
                                        doc.add(new DocPartial("createdDate", strTime, 0));
                                }
                                 doc.add(new DocPartial("totalVote", data.getInt("totalVote")
                                                + "", 0));
                                this.catchWordTable.clearParams();
				this.catchWordTable.addParam(Integer.valueOf(id));
				if (this.catchWordTable.run()) {
					ResultSet catchWord = this.catchWordTable.getDataSet();
					while (catchWord.next()) {
						String str = catchWord.getString("catchwordName");
						doc.add(new DocPartial("catchWords", str, 0));
						str = catchWord.getInt("catchWordID") + "";
						doc.add(new DocPartial("catchWordsID", str, 0));
					}
				}
                                this.commentTable.clearParams();
				this.commentTable.addParam(Integer.valueOf(id));
                                System.out.println(this.commentTable.getSQL());
				if (this.commentTable.run()) {
					ResultSet comment = this.commentTable.getDataSet();
					while (comment.next()) {
                                            String str = comment.getInt("commentID")+"";
                                            doc.add(new DocPartial("commentsID", str, 0));
                                            str = comment.getString("commentContent") + "";
                                            doc.add(new DocPartial("commentsContent", str, 0));
                                            str = comment.getString("commentUserID") + "";
                                            doc.add(new DocPartial("commentsUserID", str, 0));
                                             str = comment.getString("commentUsername") + "";
                                            doc.add(new DocPartial("commentsUsername", str, 0));
                                            str = comment.getString("commentAvatar") + "";
                                            doc.add(new DocPartial("commentsAvatar", str, 0));
                                            date = comment.getDate("commentCreatedDate");
                                            time = comment.getTime("commentCreatedDate");
                                          //  System.out.println(time+"asdasdasdasda");
                                            strTime = buildSolrDate(date, time);
                                            doc.add(new DocPartial("commentsCreatedDate", strTime, 0));
					}
				}
                                this.questionTable.clearParams();
				this.questionTable.addParam(Integer.valueOf(id));
				if (this.questionTable.run()) {
					ResultSet question = this.questionTable.getDataSet();
					while (question.next()) {
						String str = question.getInt("questionID")+"";
						doc.add(new DocPartial("questionsID", str, 0));
						str = question.getString("questionContent") + "";
						doc.add(new DocPartial("questionsContent", str, 0));
					}
				}
 
                    }
                }
                if (count > 0) {
                        docs.add(doc);
                        updateDocuments(docs);
                        optimiseUpdate();
                }
                data = null;
                docs.clear();
                docs = null;
        } catch (Exception e) {
                e.printStackTrace();
        } finally {
           // try{
                catchWordTable.dispose();
            /*} catch(Exception ex){
                System.out.println("Dung loi nua!");
            }*/
                articleTable.dispose();
                articleTable = null;
        }
        return true;
    }
    private String buildSolrDate(Date date, Time time) {
            Calendar cal = new GregorianCalendar();
            cal.setTimeZone(TimeZone.getTimeZone("GMT+7:00"));
            System.out.println(time.toString());
            cal.setTime(date);
            String strTime = "";
            strTime = strTime + cal.get(Calendar.YEAR);
            strTime = strTime + "-";
            strTime = strTime + (cal.get(Calendar.MONTH) + 1);
            strTime = strTime + "-";
            strTime = strTime + cal.get(Calendar.DAY_OF_MONTH);
            strTime = strTime + "T";
            strTime = strTime + time.toString();
            strTime = strTime + "Z";
            return strTime;
    }
    public void indexRange() {
            int step = configLoader.getStep();

            if (this.rangeStart == -1) {
                    this.rangeStart = 0;
            }
            if (this.rangeStop == -1) {
                    this.rangeStop = Integer.MAX_VALUE;
            }
            int end = this.rangeStop;

            this.rangeStop = this.rangeStart;
            boolean ok = true;
            while (ok) {
                    this.rangeStart = this.rangeStop;
                    int tmp = this.rangeStart + step;
                    this.rangeStop = (tmp > end ? end : tmp);
                    System.out.println("");
                    System.out.print("Index from ");
                    System.out.print(this.rangeStart + " to ");
                    System.out.println(this.rangeStop);
                    if (index())
                            ok = true;
                    else
                            ok = false;
            }
    }
   public static void main(String[] args)throws SolrServerException,
            IOException {
            ConfigLoader.getInstance();
            int min = -1;
            int max = Integer.MAX_VALUE;
            for (int i = 0; i < args.length; i++) {
                    if (args[i].equalsIgnoreCase("-c")) {
                            ConfigLoader.getInstance().setCore(args[(i + 1)]);
                    }
                    if (args[i].equalsIgnoreCase("-u")) {
                            ConfigLoader.getInstance().setUser(args[(i + 1)]);
                    }
                    if (args[i].equalsIgnoreCase("-p")) {
                            ConfigLoader.getInstance().setPassword(args[(i + 1)]);
                    }
                    if (args[i].equalsIgnoreCase("--min")) {
                            min = Integer.parseInt(args[(i + 1)]);
                    }
                    if (args[i].equalsIgnoreCase("--max")) {
                            max = Integer.parseInt(args[(i + 1)]);
                    }
            }

            ArticleIndexer obj = getInstance();
            obj.setRange(min, max);
            System.out.println("Indexing "
                            + ConfigLoader.getInstance().getCoreSolr());
            obj.indexRange();
            System.exit(0);
    }
}
