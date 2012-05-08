package model.user;

import inc.Encode;
import inc.InputValidator;
import inc.Time;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;

import org.ice.db.Viewer;

import model.Base;
import model.question.Answer;
import model.question.Question;

import exception.InputException;
import exception.UserBlockedException;

public class User extends Base {
	
	public long id;
	public String username;
	public String email;
	public String password;
	public String avatar;
	public String role;
	public String expertField;
	public String name;
	public String type;
	public String blockReason;
	public String about;
	public int score;
	public int block;
	public int isExpert;
	public String lastActiveIP;
	public String cookie;
	public long cookieSince;
	public String recoverToken;
	public long recoverSince;
	public Timestamp registerDate;
	public long lastActive;
	
	public long questionCount;
	public long answerCount;
	public Object interests;
	public Object catches;
	
	public String oldRecoverToken;
	
	public User()	{
		super();
		this.table = "users";
		this.key = "id";
	}
	
	public void setUsername(String username) throws Exception {
		if (username == null || username.isEmpty())	{
			throw new InputException("Tên đăng nhập không được để trống");
		}
		if (username.length() > 25 || username.length() < 6)	{
			throw new InputException("Tên đăng nhập phải dài từ 6-25 kí tự");
		}
		this.username = username;
		if (isExist("username"))	{
        	throw new InputException("Tên đăng nhập đã tồn tại");
        }
	}
	
	public void setPassword(String password) throws Exception {
		if (password == null || password.isEmpty())	{
			throw new InputException("Mật khẩu không được để trống");
		}
		if (password.length() > 32 || password.length() < 6)	{
			throw new InputException("Mật khẩu phải dài từ 6-32 kí tự");
		}
		
		if (this.password != null && !this.password.isEmpty())	{
			if (this.password.equals(Encode.sha1(password)))	{
				throw new InputException("Mật khẩu phải khác mật khẩu cũ");
			}
		}
		
		this.password = Encode.sha1(password);
	}
	
	public void setEmail(String email) throws Exception {
		InputValidator.validateEmail(email);
		if (this.email != null && !this.email.isEmpty())	{
			if (this.email.equals(email))
				throw new InputException("Email phải khác email cũ");
		}
		
        this.email = email;
        if (emailExist())
        	throw new InputException("Email đã tồn tại");
	}
	
	public Object fetchInfo() {
		return this.view("id,username,name,type,role,avatar");
	}

	public Object fetchExperts() throws Exception {
		ArrayList<User> user = this.select("`score` > 600", "id, name, expertField, score, avatar", "expertField DESC, score DESC", null, 0, 12);
		return this.view(user, "id, name, expertField, score, avatar");
	}

	public Object fetchTopScore() throws Exception {
		ArrayList<User> user = this.select(null, "id, name, score, avatar", "score DESC", null, 0, 12);
		return this.view(user, "id, name, score, avatar");
	}
	
	public Object fetchLatest() throws Exception {
		ArrayList<User> user = this.select(null, "id, name, registerDate, avatar", "registerDate DESC", null, 0, 12);
		return this.view(user, "id, name, registerDate, avatar");
	}
	
	public void editCredentials() throws Exception	{
		this.update("email, password");
	}
	
	public static User login(String credentials, String password) throws Exception {
		User user = new User();
		user.username = user.email = credentials;
		ArrayList<User> list = null;
		if (credentials.indexOf("@") != -1)	{
			list = user.select("email = ?email");
		} else {
			list = user.select("username = ?username");
		}
		
		if (list.isEmpty()) return null;
		user = list.get(0);
		if (!Encode.sha1(password).equals(user.password)) {
			return null;
		}
		if (user.block == 1) {
			throw new UserBlockedException(user.blockReason);
		}
		return user;
	}

	public Object briefInfo() throws Exception {
		Answer answer = new Answer();
		answer.userId = id;
		answerCount = answer.countByUser();
		
		Question question = new Question();
		question.userId = id;
		questionCount = question.countByUser();
		
		UserInterest interest = new UserInterest();
		interest.userId = id;
		interests = interest.fetchBriefByUser();
		
		UserCatch cat = new UserCatch();
		cat.userId = id;
		catches = cat.fetchBriefByUser();
		return this.view("avatar,name,score,isExpert,expertField,questionCount,answerCount,interests,catches");
	}
	
	public boolean add() throws Exception {
		this.role = "user";
		this.block = 0;
		this.score = 10;
		this.isExpert = 0;
		this.avatar = this.expertField = "";
		this.type = "person";
		this.about = "";
		this.cookieSince = 0;
		
		return this.insert("username, password, name, email, role, block, score, isExpert, avatar, expertField, type, about, cookieSince");
	}

	public void setName(String param) throws InputException {
		if (param == null || param.isEmpty())
			throw new InputException("Tên không được để trống");
		if (param.length() > 25)
			throw new InputException("Tên không được dài quá 25 kí tự");
		this.name = param;
	}

	public void editName() throws Exception {
		this.update("name");
	}

	public void updateSession() throws Exception {
		this.update("lastActiveIP,lastActive");
	}

	public User loginViaCookie() throws Exception {
		ArrayList<User> user = this.select("id = ?id", null, null, null);
    	if(user.isEmpty()){
    		return null;
    	}
    	if(user.get(0).cookie != null && user.get(0).cookie.equals(Encode.sha1(this.cookie)) && user.get(0).cookieSince >= (new Date().getTime() - Time.MONTH)){
    		return user.get(0);
    	}
    	return null;
	}
	
	public static User instanceByEmail(String email) throws Exception {
		User user = new User();
		user.email = email;
		ArrayList<User> list = user.select("email = ?email", "id, name, email, avatar, role, type, username, score", null, null, 0, 1);
		if (list.isEmpty()) return null;
		return list.get(0);
	}

	public void updateCookie() throws Exception {
		if (cookie != null)	{
			cookieSince = new Date().getTime();
			cookie = Encode.sha1(cookie);
			this.update("cookie, cookieSince");
		}
	}

	public boolean createDefaultUser(String email) throws Exception {
		this.setEmail(email);
		String username = email.substring(0, email.indexOf('@'));
		int len = username.length();
		for(int i=len;i<=6;i++)	{
			username += "1";
		}
		String seed = "";
		while (true)	{
			try {
				this.setUsername(username+seed);
				break;
			} catch (Exception ex) {
				if (seed.isEmpty())	{
					seed = "0";
				} else {
					seed = (Integer.parseInt(seed)+1)+"";
				}
			}
		}
		this.setName(username);
        this.password = Encode.sha1(this.password);
        return this.add();
	}

	public double calcReputationPoint() throws Exception {
		return calcRolePoint()*0.7+calcScorePoint()*0.3;
	}
	
	public double calcScorePoint() throws Exception {
		return 50*score/calcMaxScore();
	}

	public double calcRolePoint() {
		if (role.equals("user"))	{
			return 9;
		} else if (role.equals("manager") || role.equals("question-verifier"))	{
			return 18;
		} else if (role.equals("admin"))	{
			return 36;
		}
		return 5;
	}
	
	public double calcMaxScore() throws Exception {
		ArrayList<User> list = this.select("", "MAX(score) AS score", null, null);
		return list.get(0).score;
	}

	public boolean emailExist() throws Exception {
		return this.isExist("email");
	}

	public void updateToken() throws Exception {
		if (recoverToken != null)	{
			recoverSince = new Date().getTime();
			recoverToken = Encode.sha1(recoverToken);
			this.update("recoverToken, recoverSince");
		}
	}

	public void checkToken() throws Exception {
		recoverToken = Encode.sha1(recoverToken);
		ArrayList<User> list = this.select("recoverToken = ?recoverToken", "id, recoverToken, recoverSince", null, null, 0, 1);
		if (list.isEmpty())
			throw new InputException("Mã khôi phục của bạn không hợp lệ");
		long now = new Date().getTime();
		if (now - list.get(0).recoverSince > 24 * 3600 * 1000)	{
			throw new InputException("Mã khôi phục của bạn đã quá hạn");
		}
	}

	public void resetPassword() throws Exception {
		this.checkToken();
		this.oldRecoverToken = this.recoverToken;
		this.recoverToken = "";
		this.update("recoverToken, password", "recoverToken = ?oldRecoverToken");
	}

	public Object checkFinishProfile() throws Exception {
		Viewer viewer = new Viewer();
		viewer.put("avatar", (this.avatar != null && !this.avatar.isEmpty()));
		
		UserCatch userCatch = new UserCatch();
		userCatch.userId = id;
		viewer.put("catches", userCatch.hasFillCatch());
		
		UserInterest userInterest = new UserInterest();
		userInterest.userId = id;
		viewer.put("interest", userInterest.hasFillCatch());
		
		Question question = new Question();
		question.userId = id;
		viewer.put("question", question.countByUser() > 0);
		return viewer.getMap();
	}

	public void editAvatar() throws Exception {
		this.update("avatar");
	}

	public Object getActiveSince() throws Exception {
		return this.view(this.select("lastActive > ?lastActive", "id,name,avatar", null, null, 0, 50), "id,name,avatar");
	}
}
