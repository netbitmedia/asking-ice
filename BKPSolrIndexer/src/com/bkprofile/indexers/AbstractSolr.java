package com.bkprofile.indexers;

import com.bkprofile.utils.ConfigLoader;
import java.net.MalformedURLException;
import org.apache.solr.client.solrj.impl.CommonsHttpSolrServer;
import org.apache.solr.client.solrj.impl.StreamingUpdateSolrServer;

public abstract class AbstractSolr {
	protected static ConfigLoader configLoader = ConfigLoader.getInstance();
	protected static final int QUEUE_SIZE = 20;
	protected static final int THREAD_COUNT = 10;
	protected CommonsHttpSolrServer server = null;
	protected StreamingUpdateSolrServer updateServer = null;
	protected String url = null;

	public AbstractSolr() {
		onBegin();
	}

	protected void onBegin() {
		this.url = configLoader.getSolrURL();
		this.server = getSolrServer();
		this.updateServer = getUpdateServer();
	}

	public CommonsHttpSolrServer getSolrServer() {
		if (this.server != null)
			return this.server;
		try {
			CommonsHttpSolrServer x = new CommonsHttpSolrServer(this.url);
			x.setSoTimeout(1000);
			x.setConnectionTimeout(200);
			x.setDefaultMaxConnectionsPerHost(500);
			x.setMaxTotalConnections(500);
			x.setFollowRedirects(false);

			x.setAllowCompression(true);
			x.setMaxRetries(1);

			this.server = x;
			return x;
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		return null;
	}

	public StreamingUpdateSolrServer getUpdateServer() {
		if (this.updateServer != null)
			return this.updateServer;
		try {
			StreamingUpdateSolrServer x = new StreamingUpdateSolrServer(
					this.url, 20, 10);
			this.updateServer = x;
			return x;
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		return null;
	}
}
