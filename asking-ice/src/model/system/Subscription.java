package model.system;

import inc.Encode;
import inc.InputValidator;

import java.sql.Timestamp;
import java.util.ArrayList;

import exception.InputException;

import model.Base;

public class Subscription extends Base {

	public long id;
	public long userId;
	public String email;
	public Timestamp since;
	
	public Subscription()	{
		super();
		this.table = "subscriptions";
		this.key = "id";
	}
	
	public void add() throws Exception	{
		if (userId > 0)	{
			Subscription sub = this.instanceByUser();
			if (sub != null)	{
				sub.email = email;
				sub.update("email");
				return;
			}
		}
		this.insert("userId, email, since");
	}
	
	public void remove() throws Exception {
		this.delete("email = ?email");
	}
	
	public void removeUser() throws Exception {
		this.delete("userId = ?userId");
	}
	
	public ArrayList<Subscription> fetchSubscriptions(int pageIndex, int pageSize) throws Exception {
		return this.select("", "email,since", null, null, pageIndex, pageSize);
	}

	public String encodeEmail() throws Exception {
		return Encode.sha1(email+"sarah.bkprofile"+since);
	}
	
	public Subscription instanceByEmail() throws Exception {
		ArrayList<Subscription> list = this.select("email = ?email");
		if (list.isEmpty())
			return null;
		this.extend(list.get(0));
		return list.get(0);
	}
	
	public Subscription instanceByUser() throws Exception {
		ArrayList<Subscription> list = this.select("userId = ?userId");
		if (list.isEmpty())
			return null;
		this.extend(list.get(0));
		return list.get(0);
	}
	
	public void checkEmailCode(String code) throws Exception {
		ArrayList<Subscription> list = this.select("email = ?email");
		if (list.isEmpty())
			throw new InputException("Email không tồn tại");
		if (!list.get(0).encodeEmail().equals(code))	{
			throw new InputException("Mã hủy không hợp lệ");
		}
	}

	public void setEmail(String email) throws Exception {
		InputValidator.validateEmail(email);
		this.email = email;
	}
	
	private void extend(Subscription subs)	{
		id = subs.id;
		userId = subs.userId;
		email = subs.email;
	}
}
