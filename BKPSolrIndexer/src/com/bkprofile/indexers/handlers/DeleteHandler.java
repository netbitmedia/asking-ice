package com.bkprofile.indexers.handlers;

import com.bkprofile.indexers.AbstractSolr;
import com.bkprofile.utils.ConfigLoader;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.solr.client.solrj.SolrServerException;

public class DeleteHandler extends AbstractSolr {
	protected String query = "*:*";

	protected void deleteByQuery() {
		try {
			this.server.deleteByQuery(this.query);
			this.server.commit();
			this.server.optimize();
		} catch (SolrServerException ex) {
			Logger.getLogger(DeleteHandler.class.getName()).log(Level.SEVERE,
					null, ex);
		} catch (IOException ex) {
			Logger.getLogger(DeleteHandler.class.getName()).log(Level.SEVERE,
					null, ex);
		}
	}

	public static void main(String[] args) {
		ConfigLoader.getInstance();
		String query = "";
		String core = "";
		for (int i = 0; i < args.length; i++) {
			if (args[i].equalsIgnoreCase("-q"))
				query = args[(i + 1)];
			else if (args[i].equalsIgnoreCase("-c")) {
				core = args[(i + 1)];
			}
		}
		if (!core.equalsIgnoreCase("")) {
			ConfigLoader.getInstance().setCore(core);
		}
		DeleteHandler deleteHandler = new DeleteHandler(query);
		deleteHandler.indexAll();
	}

	public DeleteHandler() {
	}

	public DeleteHandler(String query) {
		if ((query != null) && (!query.equalsIgnoreCase("")))
			this.query = query;
	}

	public void indexAll() {
		deleteByQuery();
	}
}