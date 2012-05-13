package com.bkprofile.indexers;

import com.bkprofile.entities.Doc;
import com.bkprofile.entities.DocPartial;
import com.bkprofile.utils.ConfigLoader;
import java.io.IOException;
import java.net.MalformedURLException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.CommonsHttpSolrServer;
import org.apache.solr.client.solrj.impl.StreamingUpdateSolrServer;
import org.apache.solr.client.solrj.impl.XMLResponseParser;
import org.apache.solr.common.SolrInputDocument;

public abstract class Indexer {

    private static final String ID_FIELD = "profile_id";
    protected static ConfigLoader configLoader = ConfigLoader.getInstance();
    private static final int QUEUE_SIZE = 20;
    private static final int THREAD_COUNT = 4;
    SolrServer server = null;
    StreamingUpdateSolrServer updateServer = null;
    String url = null;

    /*
     * CommonsHttpSolrServer is thread-safe and if you are using the following
     * constructor, you *MUST* re-use the same instance for all requests. If
     * instances are created on the fly, it can cause a connection leak. The
     * recommended practice is to keep a static instance of
     * CommonsHttpSolrServer per solr server url and share it for all requests.
     * See https://issues.apache.org/jira/browse/SOLR-861 for more details
     */
    public Indexer() {
        onBegin();
    }

    protected void addDocument(SolrInputDocument doc) {
        try {
            server.add(doc);
        } catch (SolrServerException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    protected void addDocuments(Collection<SolrInputDocument> docs) {
        try {
            server.add(docs);
        } catch (SolrServerException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    protected void deleteAll() throws SolrServerException, IOException {
        server.deleteByQuery("*:*");
    }

    

    protected void updateDocument(Doc doc) {
        try {
            updateServer.add(constructDoc(doc));
        } catch (SolrServerException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    protected void updateDocuments(Collection<Doc> docs) {
        try {
            updateServer.add(constructDocs(docs));
            commitUpdate();
        } catch (SolrServerException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    protected void commitUpdate(){
        try {
            updateServer.commit();
        } catch (SolrServerException ex) {
            Logger.getLogger(Indexer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(Indexer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }


    protected void commit() {
        try {
            server.commit();
        } catch (SolrServerException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    protected void optimise(){
        try {
            server.optimize();
        } catch (SolrServerException ex) {
            Logger.getLogger(Indexer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(Indexer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    protected void optimiseUpdate() {
        try {
            updateServer.optimize();
        } catch (SolrServerException ex) {
            Logger.getLogger(Indexer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(Indexer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    protected SolrInputDocument constructDoc(Doc doc) {
        SolrInputDocument solrDoc = new SolrInputDocument();
        ArrayList<DocPartial> params = doc.getParams();
        solrDoc.addField(ID_FIELD, doc.getId());
        for (DocPartial p : params) {
            if (p.isBoostSpecific()) {
                if (p.getIsIndexed() == 1) {
                    solrDoc.addField(p.getField() + "_indexed", p.getValue(), p.getBoost());
                    solrDoc.addField(p.getField() + "_indexed_untokenized", p.getValue(), p.getBoost());
                } else {
                    solrDoc.addField(p.getField() + "_unindexed", p.getValue(), p.getBoost());
                }
            } else {
                if (p.getIsIndexed() == 1) {
                    solrDoc.addField(p.getField() + "_indexed", p.getValue());
                    solrDoc.addField(p.getField() + "_indexed_untokenized", p.getValue());
                } else {
                    solrDoc.addField(p.getField() + "_unindexed", p.getValue());
                }
            }
        }
        return solrDoc;
    }

    protected Collection<SolrInputDocument> constructDocs(Collection<Doc> docs) {
        Collection<SolrInputDocument> res = new ArrayList<SolrInputDocument>();
        for (Doc doc : docs) {
            res.add(constructDoc(doc));
        }
        return res;
    }

    protected void duplicateUpdate() {
        CommonsHttpSolrServer server = (CommonsHttpSolrServer) getSolrServer();
        Iterator<SolrInputDocument> iter = new Iterator<SolrInputDocument>() {

            public boolean hasNext() {
                boolean result = false;
                // set the result to true false to say if you have more
                // documensts
                return result;
            }

            public SolrInputDocument next() {
                SolrInputDocument result = null;
                // construct a new document here and set it to result
                return result;
            }

            @Override
            public void remove() {
                // TODO Auto-generated method stub
            }
        };
        try {
            server.add(iter);
        } catch (SolrServerException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public SolrServer getSolrServer() {
        CommonsHttpSolrServer x = null;
        // the instance can be reused
        try {
            x = new CommonsHttpSolrServer(this.url);
            x.setSoTimeout(1000); // socket read timeout
            x.setConnectionTimeout(100);
            x.setDefaultMaxConnectionsPerHost(100);
            x.setMaxTotalConnections(100);
            x.setFollowRedirects(false); // defaults to false
            // allowCompression defaults to false.
            // Server side must support gzip or deflate for this to have any effect.
            x.setAllowCompression(true);
            x.setMaxRetries(1); // defaults to 0. > 1 not recommended.
            x.setParser(new XMLResponseParser()); // binary parser is used by
            // default
        } catch (MalformedURLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return x;
    }

    private StreamingUpdateSolrServer getUpdateServer() {
        try {
            return new StreamingUpdateSolrServer(this.url, QUEUE_SIZE,
                    THREAD_COUNT);
        } catch (MalformedURLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    public abstract ResultSet getResultSet();

    public abstract void setTable(int min, int max);

    public abstract void index();

    protected void onBegin() {
        url = configLoader.getSolrURL();//"http://localhost:8983/solr/level1";
        server = getSolrServer();
        updateServer = getUpdateServer();
    }
}
