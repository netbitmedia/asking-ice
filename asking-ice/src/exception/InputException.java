package exception;

import org.ice.exception.IceException;

public class InputException extends IceException {
	
	private static final long serialVersionUID = 7707939425205106841L;

	public InputException(String msg) {
		super(msg, 200);
	}
}
