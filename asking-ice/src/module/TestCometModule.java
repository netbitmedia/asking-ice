package module;

import org.ice.module.HttpModule;

public class TestCometModule extends HttpModule {
	
	public void indexTask() {
		setTemplate("/testcomet.html");
	}
}
