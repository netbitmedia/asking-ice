package inc;

import java.util.Date;
import java.util.Enumeration;
import java.util.Hashtable;

public class CometContainer {

	private static CometContainer instance;
	private Hashtable<Long, Object> map = new Hashtable<Long, Object>();
	private long lastUpdated;
	private boolean isUpdated = false;

	public static CometContainer getInstance()	{
		if (instance == null)
			instance = new CometContainer();
		return instance;
	}

	private CometContainer()	{
		
	}

	public synchronized void addObject(Object obj)	{
		if (!map.containsValue(obj)) {
			lastUpdated = new Date().getTime();
			isUpdated = true;
			map.put(lastUpdated, obj);
		}
	}

	public boolean isUpdatedSince(long since)	{
		return (lastUpdated > since && isUpdated);
	}

	public Hashtable<Long, Object> getNewestUsersSince(long since) {
		if (since == -1)
			return map;
		Hashtable<Long, Object> _map = new Hashtable<Long, Object>();
		Enumeration<Long> timestamps = map.keys();
		while (timestamps.hasMoreElements())	{
			Long t = timestamps.nextElement();
			if (t < since) continue;
			_map.put(t, map.get(t));
		}
		return _map;
	}

	public long generateId() {
		return map.size();
	}
}
