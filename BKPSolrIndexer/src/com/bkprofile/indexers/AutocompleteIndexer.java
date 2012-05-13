package com.bkprofile.indexers;

import com.bkprofile.dataaccesslayer.AutocompleteQuestionTbl;
import com.bkprofile.dataaccesslayer.CatchTbl;
import com.bkprofile.dataaccesslayer.ITable;
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

public class AutocompleteIndexer extends AbstractIndexer {
	private static final int MAX_DOC_UPDATE = configLoader.getMaxDocCommit();
	private static final String ID_FIELD = "id";
	private int index = 1;

	private static AutocompleteIndexer instance = null;

	public static AutocompleteIndexer getInstance() {
		if (instance == null) {
			instance = new AutocompleteIndexer();
		}
		return instance;
	}

	public static void main(String[] args) throws SolrServerException,
			IOException {
		ConfigLoader.getInstance();
		int min = -1;
		int max = 2147483647;
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

		AutocompleteIndexer obj = getInstance();
		obj.setRange(min, max);
		System.out.println("Indexing "
				+ ConfigLoader.getInstance().getCoreSolr());
		obj.indexRange();
		System.exit(0);
	}

	public String getIdField() {
		return "id";
	}

	public boolean index() {
		return (indexQuestion()) && (indexCatchWord());
	}

	public boolean indexQuestion() {
		ITable autocompleteTable = null;
		try {
			autocompleteTable = AutocompleteQuestionTbl.getInstance();

			autocompleteTable.clearParams();
			autocompleteTable.addParam(Integer.valueOf(this.rangeStart));
			autocompleteTable.addParam(Integer.valueOf(this.rangeStop));
			boolean ok = autocompleteTable.run();
			if (!ok) {
				return false;
			}
			ResultSet data = autocompleteTable.getDataSet();
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
					doc.add(new DocPartial("question", data
							.getString("question"), 0));
					doc.add(new DocPartial("questionId", id + "", 0));
					doc.add(new DocPartial("questionVote", data.getInt("vote")
							+ "", 0));
					doc.add(new DocPartial("answerVote", data
							.getInt("answerVote") + "", 0));

					String strTime = null;
					Date date = data.getDate("date");
					Time time = data.getTime("date");
					System.out.println(id);
//					System.out.println(data.getString("date"));
					if ((date != null) && (time != null)) {
						strTime = buildSolrDate(date, time);
						doc.add(new DocPartial("questionDate", strTime, 0));
					}

					date = data.getDate("answerDate");
					time = data.getTime("answerDate");
//					System.out.println("answer date is " + data.getString("answerDate"));
					if ((date != null) && (time != null)) {
						strTime = buildSolrDate(date, time);
						doc.add(new DocPartial("answerDate", strTime, 0));
					}

					doc.add(new DocPartial("numberAnswer", data
							.getInt("numberAnswer") + "", 0));
				}
				doc.add(new DocPartial("catchWords", data
						.getString("catchWord"), 0));
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
			autocompleteTable.dispose();
			autocompleteTable = null;
		}
		return true;
	}

	public boolean indexCatchWord() {
		ITable catchTable = null;
		try {
			catchTable = CatchTbl.getInstance();

			catchTable.clearParams();
			boolean ok = catchTable.run();
			if (!ok) {
				return false;
			}
			ResultSet data = catchTable.getDataSet();
			Doc doc = null;
			ArrayList<Doc> docs = new ArrayList<Doc>();
			int count = 0;
			while (data.next()) {
				if (count++ > MAX_DOC_UPDATE) {
					updateDocuments(docs);
					optimiseUpdate();
					docs.clear();
					count = 1;
				}
				doc = new Doc(getIndex() + "");
				doc.add(new DocPartial("catch", data.getString("catchWord"), 0));
				doc.add(new DocPartial("catch_id", data.getString("catchwordId"), 0));
				doc.add(new DocPartial("catch_follow", data.getString("follow"), 0));
				docs.add(doc);
			}
			if (count > 0) {
				System.out.println("update");
				updateDocuments(docs);
				optimiseUpdate();
			}
			data = null;
			docs.clear();
			docs = null;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			catchTable.dispose();
			catchTable = null;
		}
		return true;
	}

	private String buildSolrDate(Date date, Time time) {
		Calendar cal = new GregorianCalendar();
		cal.setTimeZone(TimeZone.getTimeZone("GMT+7:00"));
//		System.out.println("time is " + time.toString());
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

	private int getIndex() {
		return this.index++;
	}
}
