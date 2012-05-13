package com.bkprofile.indexers;

import com.bkprofile.entities.Doc;
import com.bkprofile.entities.DocPartial;
import com.bkprofile.utils.SolrSchema;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.parsers.ParserConfigurationException;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.SolrInputDocument;
import org.xml.sax.SAXException;

public abstract class AbstractIndexer extends AbstractSolr {
	protected int rangeStart = -1;
	protected int rangeStop = -1;

	public abstract String getIdField();

	public void addDocument(SolrInputDocument doc) {
		try {
			this.server.add(doc);
		} catch (SolrServerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void addDocuments(Collection<SolrInputDocument> docs) {
		try {
			this.server.add(docs);
		} catch (SolrServerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void updateDocument(Doc doc) {
		try {
			this.updateServer.add(constructDoc(doc));
			commitUpdate();
		} catch (SolrServerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void updateDocuments(Collection<Doc> docs) {
		try {
			this.updateServer.add(constructDocs(docs));
			commitUpdate();
		} catch (SolrServerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void updateAllDocuments(Iterator<SolrInputDocument> iter)
			throws SolrServerException, IOException {
		getSolrServer().add(iter);
	}

	public void duplicateUpdateDocument(Doc doc, SolrQuery solrQuery)
			throws SolrServerException, Throwable {
		QueryResponse rsp = this.server.query(solrQuery);
		SolrDocumentList docs = rsp.getResults();
		ArrayList<SolrInputDocument> resultDocs = new ArrayList<SolrInputDocument>();
		for (Iterator<SolrDocument> iter = docs.iterator(); iter.hasNext();) {
			SolrDocument solrDoc = (SolrDocument) iter.next();
			SolrInputDocument y = ClientUtils.toSolrInputDocument(constructDoc(
					solrDoc, doc));
			resultDocs.add(y);
		}
		this.updateServer.add(resultDocs);
	}

	public void duplicateUpdateDocument(Doc doc) throws SolrServerException,
			Throwable {
		SolrInputDocument x = constructDoc(doc);
		SolrQuery solrQuery = new SolrQuery().setQuery(getIdField() + ":"
				+ x.getFieldValue(getIdField()));
		duplicateUpdateDocument(doc, solrQuery);
	}

	public void commitUpdate() {
		try {
			this.updateServer.commit();
		} catch (SolrServerException ex) {
			Logger.getLogger(AbstractIndexer.class.getName()).log(Level.SEVERE,
					null, ex);
		} catch (IOException ex) {
			Logger.getLogger(AbstractIndexer.class.getName()).log(Level.SEVERE,
					null, ex);
		}
	}

	public void commit() {
		try {
			this.server.commit();
		} catch (SolrServerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	protected void optimise() {
		try {
			this.server.optimize();
		} catch (SolrServerException ex) {
			Logger.getLogger(AbstractIndexer.class.getName()).log(Level.SEVERE,
					null, ex);
		} catch (IOException ex) {
			Logger.getLogger(AbstractIndexer.class.getName()).log(Level.SEVERE,
					null, ex);
		}
	}

	public void optimiseUpdate() {
		try {
			this.updateServer.optimize();
		} catch (SolrServerException ex) {
			Logger.getLogger(AbstractIndexer.class.getName()).log(Level.SEVERE,
					null, ex);
		} catch (IOException ex) {
			Logger.getLogger(AbstractIndexer.class.getName()).log(Level.SEVERE,
					null, ex);
		}
	}

	public Collection<SolrInputDocument> constructDocs(Collection<Doc> docs) {
		Collection<SolrInputDocument> res = new ArrayList<SolrInputDocument>();
		for (Doc doc : docs) {
			res.add(constructDoc(doc));
		}
		return res;
	}

	public void setRange(int min, int max) {
		this.rangeStart = min;
		this.rangeStop = max;
	}

	public SolrInputDocument constructDoc(Doc doc) {
		SolrInputDocument solrDoc = new SolrInputDocument();
		ArrayList<DocPartial> params = doc.getParams();
		solrDoc.addField(getIdField(), doc.getId());
		for (DocPartial p : params) {
			if (p.isBoostSpecific())
				solrDoc.addField(p.getField(), p.getValue(), p.getBoost());
			else {
				solrDoc.addField(p.getField(), p.getValue());
			}
		}
		return solrDoc;
	}

	public SolrDocument constructDoc(SolrDocument solrDoc, Doc doc)
			throws IOException, ParserConfigurationException, SAXException {
		ArrayList<DocPartial> params = doc.getParams();
		System.out.println("===========IN==========");
		for (DocPartial p : params) {
			String field = p.getField();
			String value = p.getValue();
			if ((solrDoc.containsKey(field))
					&& (!SolrSchema.getInstance().getField(field)
							.isMultiValued())) {
				solrDoc.removeFields(field);
			}
			solrDoc.addField(field, value);
		}
		return solrDoc;
	}
}
