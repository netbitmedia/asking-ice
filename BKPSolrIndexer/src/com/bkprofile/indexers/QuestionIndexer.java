package com.bkprofile.indexers;

import com.bkprofile.dataaccesslayer.AnswerTbl;
import com.bkprofile.dataaccesslayer.CatchWordTbl;
import com.bkprofile.dataaccesslayer.ITable;
import com.bkprofile.dataaccesslayer.QuestionFlaggedTbl;
import com.bkprofile.dataaccesslayer.QuestionFollowersTbl;
import com.bkprofile.dataaccesslayer.QuestionTbl;
import com.bkprofile.entities.Doc;
import com.bkprofile.entities.DocPartial;
import com.bkprofile.utils.ConfigLoader;
import java.io.IOException;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.TimeZone;

import org.apache.solr.client.solrj.SolrServerException;

public class QuestionIndexer extends AbstractIndexer {
	private static final int MAX_DOC_UPDATE = configLoader.getMaxDocCommit();
	private static final String ID_FIELD = "question_id";
	private static QuestionIndexer instance = null;

	private ITable questionTable = null;
	private ITable catchWordTable = null;
	private ITable answerTable = null;
	private ITable questionFlaggedTable = null;
//	private ITable questionFollowers = null;

	public static QuestionIndexer getInstance() {
		if (instance == null) {
			instance = new QuestionIndexer();
		}
		return instance;
	}

	public static void main(String[] args) throws SolrServerException,
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

		QuestionIndexer obj = getInstance();
		obj.setRange(min, max);
		System.out.println("Indexing "
				+ ConfigLoader.getInstance().getCoreSolr());
		obj.indexRange();
		System.exit(0);
	}

	public String getIdField() {
		return "question_id";
	}

	public boolean index() {
		try {
			this.questionTable = QuestionTbl.getInstance();
			this.catchWordTable = CatchWordTbl.getInstance();
			this.answerTable = AnswerTbl.getInstance();
			this.questionFlaggedTable = QuestionFlaggedTbl.getInstance();
//			this.questionFollowers = QuestionFollowersTbl.getInstance();
			
			this.questionTable.clearParams();
			this.questionTable.addParam(Integer.valueOf(this.rangeStart));
			this.questionTable.addParam(Integer.valueOf(this.rangeStop));
			boolean ok = this.questionTable.run();
			if (!ok) {
				return false;
			}
			ResultSet data = this.questionTable.getDataSet();
			Doc doc = null;
			ArrayList<Doc> docs = new ArrayList<Doc>();
			int count = 0;
			while (data.next()) {
				int id = data.getInt("id");
				doc = new Doc(id + "");
				doc.add(new DocPartial("user_id", data.getInt("userId") + "",
						0));
				doc.add(new DocPartial("user_avatar_url", data
						.getString("avatar"), 0));
				doc.add(new DocPartial("user_name", data.getString("name"), 0));
//				doc.add(new DocPartial("user_score", data.getString("score"), 0));
				doc.add(new DocPartial("target_id", data.getInt("targetId")
						+ "", 0));
				Date date = data.getDate("since");
				Time time = data.getTime("since");
				String strTime = buildSolrDate(date, time);
				doc.add(new DocPartial("date", strTime, 0));
				doc.add(new DocPartial("vote", data.getInt("vote") + "", 0));
				doc.add(new DocPartial("explanation", data.getString("content"), 0));
				
				this.catchWordTable.clearParams();
				this.catchWordTable.addParam(Integer.valueOf(id));
				if (this.catchWordTable.run()) {
					ResultSet catchWord = this.catchWordTable.getDataSet();
					while (catchWord.next()) {
						String str = catchWord.getString("catchWord");
						doc.add(new DocPartial("catch_words", str, 0));
						str = catchWord.getInt("catchWordId") + "";
						doc.add(new DocPartial("catch_words_id", str, 0));
					}
				}
				
				// All people having the same catchword/interest as the ones in the question
//				this.questionFollowers.clearParams();
//				this.questionFollowers.addParam(id);
//				if(this.questionFollowers.run()){
//					ResultSet questionFollowerDS = this.questionFollowers.getDataSet();
//					while(questionFollowerDS.next()){
//						long followerID = questionFollowerDS.getLong("userId");
//						doc.add(new DocPartial("followers", followerID + ""));
//					}
//				}
				
				// TODO:check if content is flagged
				this.questionFlaggedTable.clearParams();
				this.questionFlaggedTable.addParam(id);
				long checkHidden = 0;
				if(this.questionFlaggedTable.run()){
					ResultSet questionFlaggedDS = this.questionFlaggedTable.getDataSet();
					boolean isQuesionFlaggedProcessed = false;
					while(questionFlaggedDS.next()){
						if(!isQuesionFlaggedProcessed){
//							doc.add(new DocPartial("flaggedContent", data.getString("title"), 0));
//							doc.add(new DocPartial("isFlagged", "true"));
						}
//						doc.add(new DocPartial("flaggedDescription", questionFlaggedDS.getLong("type") + ""));
//						doc.add(new DocPartial("flaggedDescription_" + questionFlaggedDS.getLong("type"), questionFlaggedDS.getLong("number") + ""));
//						checkHidden += questionFlaggedDS.getLong("point");
						isQuesionFlaggedProcessed = true;
					}
					if(checkHidden >= 65){
						doc.add(new DocPartial("isHidden", "true"));
						docs.add(doc);
						continue;
					}
				}
				
				doc.add(new DocPartial("content", data.getString("title"), 0));
				doc.add(new DocPartial("anonymous", data.getInt("anonymous")
						+ "", 0));

				this.answerTable.clearParams();
				this.answerTable.addParam(Integer.valueOf(id));
				if (this.answerTable.run()) {
					ResultSet answer = this.answerTable.getDataSet();
					long totalVote = 0L;
					String str = null;
					long maxVote = Long.MIN_VALUE;
					String maxVoteAnswer = null;
					String maxVoteAnswerUserName = null;
					String maxVoteAnswerUserAvatar = null;
					String maxVoteAnswerTime = null;
					long maxVoteAnswerID = 0;
					long maxVoteUserID = 0;

					Date latestDate = null;
					String answerLatestContent = null;
					String answerLatestUserID = null;
					String answerLatestUserName = null;
					String answerLatestUserAvatar = null;
					String answerLatestVote = null;
					String answerLatestTime = null;

					int answerCount = 0;
					strTime = null;
					while (answer.next()) {
						answerCount++;
						str = answer.getString("content");
						doc.add(new DocPartial("answers", str, 0));
						str = answer.getLong("id") + "";
						doc.add(new DocPartial("answers_id", str, 0));
						str = answer.getLong("userId") + "";
						doc.add(new DocPartial("answers_user_id", str, 0));
						str = answer.getString("name");
						doc.add(new DocPartial("answers_user_name", str, 0));
						str = answer.getString("avatar");
						doc.add(new DocPartial("answers_user_avatar", str, 0));
						date = answer.getDate("since");
						time = answer.getTime("since");
						strTime = buildSolrDate(date, time);
						doc.add(new DocPartial("answers_date", strTime, 0));
						long vote = answer.getLong("vote");
						str = vote + "";
						doc.add(new DocPartial("answers_vote", str, 0));
						if (maxVote < vote) {
							maxVote = vote;
							maxVoteAnswer = answer.getString("content");
							maxVoteAnswerID = answer.getLong("id");
							maxVoteUserID = answer.getLong("userId");
							maxVoteAnswerUserName = answer.getString("name");
							maxVoteAnswerUserAvatar = answer
									.getString("avatar");
							maxVoteAnswerTime = buildSolrDate(
									answer.getDate("since"),
									answer.getTime("since"));
						}
						totalVote += vote;
						if (latestDate == null
								|| latestDate.compareTo(date) < 0) {
							latestDate = date;
							answerLatestContent = answer.getString("content");
							answerLatestUserID = answer.getLong("userId") + "";
							answerLatestUserName = answer.getString("name")
									+ "";
							answerLatestUserAvatar = answer.getString("avatar")
									+ "";
							answerLatestVote = answer.getLong("vote") + "";
							answerLatestTime = strTime;
						}
					}
					str = totalVote + "";
					doc.add(new DocPartial("answers_total_vote", str, 0));
					if (answerCount > 0) {
						doc.add(new DocPartial("answers_max_vote_answer",
								maxVoteAnswer, 0));
						doc.add(new DocPartial("answers_max_vote_id",
								maxVoteAnswerID + "", 0));
						doc.add(new DocPartial("answers_max_vote_user_id",
								maxVoteUserID + "", 0));
						doc.add(new DocPartial("answers_max_vote_vote", maxVote
								+ "", 0));
						doc.add(new DocPartial("answers_max_vote_user_name",
								maxVoteAnswerUserName, 0));
						doc.add(new DocPartial("answers_max_vote_user_avatar",
								maxVoteAnswerUserAvatar, 0));
						doc.add(new DocPartial("answers_max_vote_time",
								maxVoteAnswerTime, 0));

						doc.add(new DocPartial("answers_date_final", strTime, 0));
						doc.add(new DocPartial("answers_latest_content",
								answerLatestContent, 0));
						doc.add(new DocPartial("answers_latest_user_id",
								answerLatestUserID, 0));
						doc.add(new DocPartial("answers_latest_user_name",
								answerLatestUserName, 0));
						doc.add(new DocPartial("answers_latest_user_avatar",
								answerLatestUserAvatar, 0));
						doc.add(new DocPartial("answers_latest_vote",
								answerLatestVote, 0));
						doc.add(new DocPartial("answers_latest_time",
								answerLatestTime, 0));
					}
					doc.add(new DocPartial("answers_count", answerCount + "", 0));
				}

				docs.add(doc);
				if (count++ > MAX_DOC_UPDATE) {
					updateDocuments(docs);
					optimiseUpdate();
					count = 0;
				}
			}
			if (count > 0) {
				updateDocuments(docs);
				optimiseUpdate();
			}
			data = null;
			docs.clear();
			docs = null;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			this.questionTable.dispose();
			this.catchWordTable.dispose();
			this.questionTable = null;
		}
		return true;
	}

	private String buildSolrDate(Date date, Time time) {
		Calendar cal = new GregorianCalendar();
		cal.setTimeZone(TimeZone.getTimeZone("GMT+7:00"));
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
}