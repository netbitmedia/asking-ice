package module;

import java.util.HashMap;

import inc.Encode;
import inc.OpenIDConsumer;
import inc.SendMail;
import model.user.OpenIdLogin;
import model.user.User;

import org.ice.Config;
import org.ice.module.HttpModule;
import org.ice.view.ScriptProcessor;
import org.openid4java.discovery.Identifier;

public class IndexModule extends HttpModule {

	public void init() {
		setContentType("text/html");
	}

//	private String rewriteQueryString(String baseUrl, String escapedUrl) {
//		if (escapedUrl.isEmpty())
//			return baseUrl;
//		return baseUrl + "#!" + escapedUrl;
//	}

	public void indexTask() throws Exception {
//		HttpServletRequest rq = this.getRequest().getUnderlyingRequest();
//		String queryString = rq.getQueryString();
//		if ((queryString != null)
//				&& (queryString.contains("_escaped_fragment_"))) {
//			String escapedUrl = URLDecoder.decode(
//					queryString.replaceFirst("_escaped_fragment_=", ""),
//					"utf-8");
//			String baseUrl = rq.getRequestURL().toString();
//			String hashUrl = rewriteQueryString(baseUrl, escapedUrl);
//			System.out.println(hashUrl);
//
//			// use the headless browser to obtain an HTML snapshot
//			final WebClient webClient = new WebClient();
//			HtmlPage page = webClient.getPage(hashUrl);
//
//			webClient.waitForBackgroundJavaScript(5000);
//			echo(page.asXml());
//		} else {
			getRequest().setAttribute("baseUrl", this.getBaseUrl());
			getRequest().setAttribute("resourceUrl", this.getResourceUrl());
			getRequest().setAttribute("version", this.getParam("version", "fall"));
			setTemplate("/index.html");
//		}
	}
	
	public void loginOpenidTask() throws Exception {
		OpenIDConsumer consumer = new OpenIDConsumer();
		setTemplate("/openid.html");
		String action = getParam(0);
		String error = "";
		if (action.equals("login")) {
			String provider = getProvider();
			if (provider == null)
				error = "Provider không tồn tại";
			else {
				String url = consumer.authRequest(getReturnUrl(), provider, getRequest(), getResponse().getUnderlyingResponse());
				this.redirect(url);
			}
		} else if (action.equals("verify")) {
			try {
				Identifier identifier = consumer.verifyResponse(getRequest());
				if (identifier == null)	{
					error = "Bạn cần phải cho phép Asking.vn truy cập vào tài khoản OpenID của bạn";
					return;
				}
			} catch (Exception ex)	{
				error = ex.getMessage();
				return;
			}
			String email = consumer.getEmail();
			String identity = consumer.getIdentity();
			OpenIdLogin openIdLogin = new OpenIdLogin();
			try {
				User user = User.instanceByEmail(email);

				if (user == null) {
					user = new User();
					String password = Encode.random(6);
					user.password = password;
					if (!user.createDefaultUser(email)) {
						throw new Exception("Không thể tạo tài khoản");
					}

					ScriptProcessor processor = new ScriptProcessor();
					HashMap<String, Object> view = new HashMap<String, Object>();
					String template = Config.get("resourceUrl")+"/mail/openidwelcome.htm";
					view.put("password", password);
					view.put("username", user.username);
					SendMail.send(this, email, "Chào mừng bạn đến với Asking.vn", "Chào mừng bạn đến với Asking.vn - Mạng chia sẻ tri thức Việt Nam", processor.process(template, view), null);
				}
				
				openIdLogin.openIdUrl = identity;
				openIdLogin.authenticate(user, email);
				getRequest().setSession("viewer", user);
			} catch (Exception ex)	{
				ex.printStackTrace();
				error = "Không thể tiến hành đăng nhập bằng OpenID. Bạn hãy thử lại sau ("+ex.getMessage()+")";
			}
		}
		getRequest().setAttribute("error", error);
	}
	
	private String getProvider()	{
		String provider = this.getParam(1);
		if (provider == null)	{
			return null;
		}
		if (provider.equals("gmail")) {
			return "https://www.google.com/accounts/o8/id";
		} else if (provider.equals("yahoo"))	{
			return "me.yahoo.com";
		}
		return null;
	}

	private String getReturnUrl() {
		return getBaseUrl() + "/index/login-openid/verify";
	}
}
