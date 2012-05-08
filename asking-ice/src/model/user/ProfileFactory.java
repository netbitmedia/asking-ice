package model.user;

public class ProfileFactory {

	public static IProfile getProfile(String type) {
		IProfile p = null;
		if (type.equals("person")) {
			p = new UserProfile();
		} else if (type.equals("partner")) {
			
		}
		return p;
	}
}
