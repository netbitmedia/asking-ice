package module;

import java.util.Date;

import org.ice.db.Result;

import inc.CometContainer;

public class CometModule extends BaseAjaxModule {
	
	public void getOnlineUsersTask() throws InterruptedException	{
		Long timestamp = new Date().getTime();
		while(true)	{
			if (CometContainer.getInstance().isUpdatedSince(timestamp))	{
				result = new Result(true, null, CometContainer.getInstance().getNewestUsersSince(timestamp));
				return;
			}
			Thread.sleep(1000);
		}
	}
	
	public void getAllUsersTask() throws Exception {
		result = new Result(true, null, CometContainer.getInstance().getNewestUsersSince(-1));
	}
	
	public void addNewUserTask() {
		CometContainer.getInstance().addObject("Cat #"+CometContainer.getInstance().generateId());
		result = new Result(true, null, null);
	}
}
