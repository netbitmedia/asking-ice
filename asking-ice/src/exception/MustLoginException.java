package exception;

import org.ice.exception.AccessDeniedException;

public class MustLoginException extends AccessDeniedException {

	private static final long serialVersionUID = 8150840817044032079L;
	
	public MustLoginException(String msg)	{
		super(msg);
	}
}
