package module;

import org.ice.module.HttpModule;

import model.crawler.Sitemap;

public class CrawlerModule extends HttpModule {

	public void sitemapTask() throws Exception {
		Sitemap sitemap = new Sitemap();
		setContentType("text/xml");
		echo(sitemap.generateSitemap(getBaseUrl()));
	}
}
