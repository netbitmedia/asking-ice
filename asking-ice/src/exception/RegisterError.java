package exception;

public class RegisterError {

	public String type;
	
	public String msg;
	
	public RegisterError(String type, String msg)	{
		this.type = type;
		this.msg = msg;
	}
}
