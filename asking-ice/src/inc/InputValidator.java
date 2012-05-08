package inc;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import exception.InputException;

public class InputValidator {

	public static void validateEmail(String email) throws Exception {
		if (email == null || email.isEmpty())	{
			throw new InputException("Email không được để trống");
		}
		Pattern pattern = Pattern.compile("\\b[a-zA-Z0-9._%+-]+\\@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}\\b");
        Matcher matcher = pattern.matcher(email);
        if (!matcher.find())    {
        	throw new InputException("Email không hợp lệ");
        }
	}

}
