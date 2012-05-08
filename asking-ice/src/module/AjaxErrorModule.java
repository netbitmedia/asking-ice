package module;

import java.sql.SQLException;

import org.ice.db.Result;
import org.ice.exception.AccessDeniedException;
import org.ice.logger.Logger;
import org.ice.module.IErrorHandler;

public class AjaxErrorModule extends BaseAjaxModule implements IErrorHandler {

	private Exception exception;
	
	public void preDispatch() {
	}

	public void errorTask()	{
		if (exception instanceof AccessDeniedException)	{
		
		} else if (exception instanceof SQLException)	{
			Logger.getLogger().log(exception.toString(), Logger.LEVEL_WARNING);
			exception = new Exception("Error in db");
		}
		result = new Result(false, exception.getMessage(), exception.getClass().getCanonicalName());
	}

	@Override
	public Exception getException() {
		return exception;
	}

	@Override
	public void setException(Exception ex) {
		this.exception = ex;
	}
}
