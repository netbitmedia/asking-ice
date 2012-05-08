package model.user;

import java.util.ArrayList;

import model.Base;

public class OpenIdLogin extends Base {

	public long id;
	public long userId;
	public String openIdUrl;

	public OpenIdLogin() {
		this.table = "openidlogins";
		this.key = "id";
	}

	public User validate() throws Exception {
		ArrayList<OpenIdLogin> openid = this.select("openIdUrl=?openIdUrl", null, null, null);
		if (openid.isEmpty())
			return null;
		User user = new User();
		user.id = openid.get(0).userId;
		if (user.load())
			return user;
		return null;
	}

	public User authenticate(User user, String email) throws Exception {
		ArrayList<OpenIdLogin> openid = this.select("openIdUrl = ?openIdUrl", null, null, null);
		
		if (openid.isEmpty()) {
			OpenIdLogin openIdLogin = new OpenIdLogin();
			openIdLogin.openIdUrl = openIdUrl;
			openIdLogin.userId = user.id;
			if (!openIdLogin.insert("openIdUrl,userId")) {
				throw new Exception("Không thể tạo tài khoản");
			}
		}
		
		return user;
	}
}
