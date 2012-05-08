package exception;

import org.ice.exception.IceException;

public class PrivilegeException extends IceException {

	private static final long serialVersionUID = 7253483738734177528L;

	public PrivilegeException(String exception) {
		super(exception, 200);
	}

}
