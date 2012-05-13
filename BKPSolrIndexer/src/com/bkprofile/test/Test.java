package com.bkprofile.test;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class Test {
	public static void main(String[] args) {
		try {
			System.out.println(Test.buildSolrDate("22 Nov 2011"));
		} catch (Exception e) {
			System.out.println(e);
		}

	}

	public static String buildSolrDate(String dateStr) throws ParseException {
		Calendar cal = new GregorianCalendar();
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
			// strTime = strTime + time.toString();
			// strTime = strTime + "Z";
		} catch (Exception e) {
			strTime = dateStr;
		}

		return strTime;
	}
}
