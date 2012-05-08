package model.crawler;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import model.question.Question;

public class Sitemap {

	public String generateSitemap(String baseUrl) throws Exception {
		Question question = new Question();
		ArrayList<Question> list = (ArrayList<Question>) question.fetchAll();

		StringBuilder sitemap = new StringBuilder();
		sitemap.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		sitemap.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		
		sitemap.append("<url>");
		sitemap.append("<loc>" + baseUrl + "/#!</loc>");
		sitemap.append("<lastmod>" + sdf.format(now) + "</lastmod>");
		sitemap.append("<changefreq>daily</changefreq>");
		sitemap.append("</url>");

		for (Question q : list) {
			Date date = new Date(q.since.getTime());

			sitemap.append("<url>");
			sitemap.append("<loc>" + baseUrl + "/#!page/Question/qid/" + q.id
					+ "</loc>");
			sitemap.append("<lastmod>" + sdf.format(date) + "</lastmod>");
			sitemap.append("<changefreq>monthly</changefreq>");
			sitemap.append("</url>");
		}
		
		

		sitemap.append("</urlset>");

		return sitemap.toString();
	}
}
