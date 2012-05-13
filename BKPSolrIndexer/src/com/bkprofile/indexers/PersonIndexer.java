package com.bkprofile.indexers;

import com.bkprofile.dataaccesslayer.AnswerCountTbl;
import com.bkprofile.dataaccesslayer.ExpertRankMaxTopicTbl;
import com.bkprofile.dataaccesslayer.ExpertRankPosTopicTbl;
import com.bkprofile.dataaccesslayer.ExpertRankTbl;
import com.bkprofile.dataaccesslayer.ITable;
import com.bkprofile.dataaccesslayer.ObjTbl;
import com.bkprofile.dataaccesslayer.PersonSameInterestExpertiseTbl;
import com.bkprofile.dataaccesslayer.QuestionCountTbl;
import com.bkprofile.dataaccesslayer.UserAnswerCatchCountTbl;
import com.bkprofile.dataaccesslayer.UserQuestionCatchCountTbl;
import com.bkprofile.dataaccesslayer.VoteInterestTbl;
import com.bkprofile.dataaccesslayer.VoteTbl;
import com.bkprofile.entities.Doc;
import com.bkprofile.entities.DocPartial;
import com.bkprofile.utils.ConfigLoader;

import java.awt.List;
import java.io.IOException;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.TimeZone;

import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.SolrInputDocument;

public class PersonIndexer extends AbstractIndexer {
	private static final int MAX_DOC_UPDATE = configLoader.getMaxDocCommit();
	private static final String ID_FIELD = "profile_id";
	private static PersonIndexer instance = null;

	public static PersonIndexer getInstance() {
		if (instance == null) {
			instance = new PersonIndexer();
		}
		return instance;
	}

	private PersonIndexer() {
		ConfigLoader.getInstance().setCore("person");
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

		PersonIndexer obj = getInstance();
		obj.setRange(min, max);
		System.out.println("Indexing "
				+ ConfigLoader.getInstance().getCoreSolr());
		obj.indexRange();
	}

	public String getIdField() {
		return "profile_id";
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

			ok = index(this.rangeStart, this.rangeStop);
			if (!ok)
				System.exit(0);
		}
	}

	public boolean index(int start, int stop) {
		ITable objTbl = null;
		ITable voteTbl = null;
		ITable voteInterestTbl = null;
		ITable questionCountTbl = null;
		ITable answerCountTbl = null;
		ITable expertRankTbl = null;
		// For avg of information
		ITable answerNumCountTbl = null;
		ITable questionNumCountTbl = null;
		
		// For getting best person easier
		ITable sameInterestExpertise = null;
		
		try {
			objTbl = ObjTbl.getInstance();
			voteTbl = VoteTbl.getInstance();
			voteInterestTbl = VoteInterestTbl.getInstance();
			questionCountTbl = QuestionCountTbl.getInstance();
			answerCountTbl = AnswerCountTbl.getInstance();
			answerNumCountTbl = UserAnswerCatchCountTbl.getInstance();
			questionNumCountTbl = UserQuestionCatchCountTbl.getInstance();
			expertRankTbl = ExpertRankTbl.getInstance();
			sameInterestExpertise = PersonSameInterestExpertiseTbl.getInstance();

			objTbl.clearParams();
			objTbl.addParam(Integer.valueOf(start));
			objTbl.addParam(Integer.valueOf(stop));
			boolean ok = objTbl.run();
			if (!ok) {
				objTbl.dispose();
				voteTbl.dispose();
				questionCountTbl.dispose();
				answerCountTbl.dispose();
				return false;
			}
			
			// Reasonable?
			ResultSet sameInterestExpertiseDS = null;
			Hashtable<Long,ArrayList<Long>> sameIEAL = new Hashtable<Long,ArrayList<Long>>();
			if(sameInterestExpertise.run()){
				sameInterestExpertiseDS = sameInterestExpertise.getDataSet();
				long oldSource = -1;
				ArrayList<Long> sameIEALPartial = new ArrayList<Long>();;
				long source = -1;
				long destination = -1;
				while(sameInterestExpertiseDS.next()){
					source = sameInterestExpertiseDS.getLong("source");
					destination = sameInterestExpertiseDS.getLong("destination");
					if(oldSource == -1){
						oldSource = source;
					}
					
					if(oldSource != source){
						sameIEAL.put(oldSource, sameIEALPartial);
						oldSource = source;
						sameIEALPartial = new ArrayList<Long>();
					} else {
						sameIEALPartial.add(destination);
					}
				}
				if(oldSource != -1){
					sameIEALPartial.add(destination);
					sameIEAL.put(oldSource, sameIEALPartial);
				}
			}
			
			ResultSet data = objTbl.getDataSet();
			Doc doc = null;
			ArrayList<Doc> docs = new ArrayList<Doc>();
			int count = 0;
			while (data.next()) {
				int userId = data.getInt("userID");
				String avatar = data.getString("avatar");
				String fullName = data.getString("name");

				doc = new Doc(userId + "");
				doc.add(new DocPartial("avatar", avatar));
				doc.add(new DocPartial("full_name", fullName));
				
				// Same interests/expertises
//				ArrayList<Long> shareExpertises = sameIEAL.get(Long.parseLong(userId + ""));
//				if(shareExpertises != null){
//					for (int i = 0; i < shareExpertises.size(); i++) {
//						long curPerson = shareExpertises.get(i);
//						doc.add(new DocPartial("same_expertise_interest", curPerson + ""));
//					}
//				}

				addVotingInfo(voteTbl, doc, userId, "expertise");
				addVotingInfo(voteInterestTbl, doc, userId, "interest");

				int totalQuesVote = 0;
				int totalAnsVote = 0;
				questionCountTbl.clearParams();
				questionCountTbl.addParam(Integer.valueOf(userId));
				if (questionCountTbl.run()) {
					ResultSet questionCount = questionCountTbl.getDataSet();
					while (questionCount.next()) {
						totalQuesVote = questionCount.getInt("vote");
						doc.add(new DocPartial("expertise_total_ques_vote",
								totalQuesVote + ""));
						int totalCount = questionCount.getInt("count");
						doc.add(new DocPartial(
								"expertise_total_ques_count", totalCount
										+ ""));
					}
				}

				answerCountTbl.clearParams();
				answerCountTbl.addParam(Integer.valueOf(userId));
				if (answerCountTbl.run()) {
					ResultSet answerCount = answerCountTbl.getDataSet();
					while (answerCount.next()) {
						totalAnsVote = answerCount.getInt("vote");
						doc.add(new DocPartial("expertise_total_ans_vote", totalAnsVote + ""));
						int totalCount = answerCount.getInt("count");
						doc.add(new DocPartial("expertise_total_ans_count",
								totalCount + ""));
					}
				}

				// Average of answer knowledge
				answerNumCountTbl.clearParams();
				answerNumCountTbl.addParam(Integer.valueOf(userId));
				if (answerNumCountTbl.run()) {
					ResultSet answerCatchCount = answerNumCountTbl
							.getDataSet();
					while (answerCatchCount.next()) {
						String catchwordID = answerCatchCount
								.getString("catchwordID");
						String numbers = answerCatchCount
								.getString("numbers");
						doc.add(new DocPartial("num_answer_expertise_"
								+ catchwordID, numbers + ""));
					}
				}

				// Average of questions knowledge
				questionNumCountTbl.clearParams();
				questionNumCountTbl.addParam(Integer.valueOf(userId));
				if (questionNumCountTbl.run()) {
					ResultSet questionCatchCount = questionNumCountTbl
							.getDataSet();
					while (questionCatchCount.next()) {
						String catchwordID = questionCatchCount
								.getString("catchwordID");
						String numbers = questionCatchCount
								.getString("numbers");
						doc.add(new DocPartial("num_question_expertise_"
								+ catchwordID, numbers + ""));
					}
				}
				
				// Expert Rank of an user
				expertRankTbl.clearParams();
				expertRankTbl.addParam(Integer.valueOf(userId));
				if(expertRankTbl.run()){
					ResultSet expertRankDS = expertRankTbl.getDataSet();
					while(expertRankDS.next()){
						long expertiseID = expertRankDS.getLong("expertiseID");
						String expertiseName = expertRankDS.getString("catchWord");
						double expertRank = expertRankDS.getDouble("expertRank");
						double percentage = (double)Math.round((double)expertRankDS.getDouble("normalizedExpertRank") * 10000) / 100;
						long rank = expertRankDS.getLong("rank");
						
						doc.add(new DocPartial("expert_rank", expertiseID + ""));
						doc.add(new DocPartial("expert_rank_name_" + expertiseID, expertiseName));
						doc.add(new DocPartial("expert_rank_value_" + expertiseID, expertRank + ""));
						doc.add(new DocPartial("expert_rank_percentage_" + expertiseID, percentage + ""));
						doc.add(new DocPartial("expert_rank_position_" + expertiseID, rank + ""));
					}
				}

				doc.add(new DocPartial("expertise_total_vote",
						(totalQuesVote + totalAnsVote) + ""));
				
				docs.add(doc);
				if (count++ > MAX_DOC_UPDATE) {
					updateDocuments(docs);
					optimiseUpdate();
					count = 0;
				}
			}
			
			if ((doc != null) && (count != 0)) {
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
			objTbl.dispose();
			voteTbl.dispose();
			questionCountTbl.dispose();
			answerCountTbl.dispose();

			objTbl = null;
			voteTbl = null;
			questionCountTbl = null;
			answerCountTbl = null;
		}
		return true;
	}

	private void addVotingInfo(ITable voteTbl, Doc doc, int userId, String field)
			throws SQLException {
		voteTbl.clearParams();
		voteTbl.addParam(Integer.valueOf(userId));
		if (voteTbl.run()) {
			ResultSet voteQues = voteTbl.getDataSet();
			while (voteQues.next()) {
				long catchID = voteQues.getLong("id");
				String catchStr = voteQues.getString("catchWord");
				String explanation = voteQues.getString("explanation");
				String description = voteQues.getString("detail");
				doc.add(new DocPartial(field + "_id", catchID + ""));
				doc.add(new DocPartial(field, catchStr));
				doc.add(new DocPartial(field + "_explanation_" + catchID,
						explanation));
				doc.add(new DocPartial(field + "_description_" + catchID,
						description));
				doc.add(new DocPartial(field + "_name_" + catchID,
						catchStr));

				if (voteQues.getInt("ques_user_id") == userId) {
					doc.add(new DocPartial("vote_question_" + field + "_"
							+ catchID, voteQues.getInt("ques_vote") + ""));
				}
				if (voteQues.getInt("ans_user_id") == userId)
					doc.add(new DocPartial("vote_answer_" + field + "_"
							+ catchID, voteQues.getInt("ans_vote") + ""));
			}
		}
	}

	protected void indexAll() throws SolrServerException, IOException {
		Iterator<SolrInputDocument> iter = new Iterator<SolrInputDocument>() {
			public boolean hasNext() {
				boolean result = false;

				return result;
			}

			public SolrInputDocument next() {
				SolrInputDocument result = null;

				return result;
			}

			public void remove() {
			}
		};
		this.server.add(iter);
	}

	public static String buildSolrDate(String dateStr) throws ParseException {
		Calendar cal = new GregorianCalendar();
		cal.setTimeZone(TimeZone.getTimeZone("GMT+7:00"));
		String strTime = "";
		try {
			@SuppressWarnings("deprecation")
			Date date = new Date(Date.parse(dateStr));
			cal.setTime(date);
			strTime = strTime + cal.get(Calendar.YEAR);
			strTime = strTime + "-";
			strTime = strTime + (cal.get(Calendar.MONTH) + 1);
			strTime = strTime + "-";
			strTime = strTime + cal.get(Calendar.DAY_OF_MONTH);
			strTime = strTime + "T";
			strTime = strTime + "00:00:00Z";
		} catch (Exception e) {
			strTime = dateStr;
		}

		return strTime;
	}
}