package exception;

import org.ice.exception.IceException;

public class UserBlockedException extends IceException {
	
	private static final long serialVersionUID = 7707939425205106841L;

	public UserBlockedException(String msg) {
		super(msg, 200);
	}
}
