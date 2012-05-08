package model.user;

public interface IProfile {

	public Object fetchInfo() throws Exception;

	public void setUserId(long userId);
	
	public String getTemplate(String template);

	public void edit(String param) throws Exception;
}
