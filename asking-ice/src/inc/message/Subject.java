package inc.message;

import java.util.ArrayList;
import java.util.Hashtable;

public class Subject {
	
	private static Subject instance;

	private Hashtable<String, ArrayList<Observer>> map = new Hashtable<String, ArrayList<Observer>>();
	
	private Subject() {
		
	}
	
	public static Subject getInstance() {
		if (instance == null)
			instance = new Subject();
		return instance;
	}
	
	public void register(String message, Observer observer)	{
		if (!map.containsKey(message))	{
			map.put(message, new ArrayList<Observer>());
		}
		map.get(message).add(observer);
	}
	
	public synchronized void notifyMessage(String message, Object data) {
		if (map.containsKey(message))	{
			ArrayList<Observer> list = map.get(message);
			for(Observer observer: list)	{
				observer.onMessage(message, data);
			}
		}
	}
}
