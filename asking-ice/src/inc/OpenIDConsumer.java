package inc;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.openid4java.OpenIDException;
import org.openid4java.consumer.ConsumerManager;
import org.openid4java.consumer.VerificationResult;
import org.openid4java.discovery.DiscoveryInformation;
import org.openid4java.discovery.Identifier;
import org.openid4java.message.AuthRequest;
import org.openid4java.message.AuthSuccess;
import org.openid4java.message.ParameterList;
import org.openid4java.message.ax.AxMessage;
import org.openid4java.message.ax.FetchRequest;
import org.openid4java.message.ax.FetchResponse;

public class OpenIDConsumer {
	
	private String identity;
	private String email;

	public static ConsumerManager consumerManager = null;
	
	public static ConsumerManager getConsumerManager()	{
		if (consumerManager == null)
			consumerManager = new ConsumerManager();
		return consumerManager;
	}

	public OpenIDConsumer() {
	}

	@SuppressWarnings("unchecked")
	public String authRequest(String returnToUrl, String userSuppliedString, HttpServletRequest request, HttpServletResponse response) {
		try {
			ConsumerManager manager = getConsumerManager();
			
			List<? extends Object> discoveries = manager.discover(userSuppliedString);
			DiscoveryInformation discovered = manager.associate(discoveries);
			request.getSession().setAttribute("openid-disc", discovered);

			AuthRequest authReq = manager.authenticate(discovered, returnToUrl);
			FetchRequest fetch = FetchRequest.createFetchRequest();
			fetch.addAttribute("email", "http://axschema.org/contact/email", true);
			authReq.addExtension(fetch);
			return authReq.getDestinationUrl(true);
		} catch (OpenIDException e) {
			e.printStackTrace();
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	public Identifier verifyResponse(HttpServletRequest request) throws Exception {
//		try {
			email = null;
			identity = null;
			ConsumerManager manager = getConsumerManager();
			ParameterList response = new ParameterList(request.getParameterMap());

			DiscoveryInformation discovered = (DiscoveryInformation) request.getSession().getAttribute("openid-disc");

			StringBuffer receivingURL = request.getRequestURL();
			String queryString = request.getQueryString();
			if (queryString != null && queryString.length() > 0)
				receivingURL.append("?").append(request.getQueryString());

			
			VerificationResult verification = manager.verify(receivingURL.toString(), response, discovered);
			Identifier verified = verification.getVerifiedId();
			if (verified != null) {
				AuthSuccess authSuccess = (AuthSuccess) verification.getAuthResponse();
				identity = authSuccess.getIdentity();
				
				if (authSuccess.hasExtension(AxMessage.OPENID_NS_AX)) {
					FetchResponse fetchResp = (FetchResponse) authSuccess.getExtension(AxMessage.OPENID_NS_AX);
					List<? extends Object> emails = fetchResp.getAttributeValues("email");
					email = (String) emails.get(0);
				}
				return verified; // success
			}
//		} catch (OpenIDException e) {
//
//		}
		return null;
	}

	public String getIdentity() {
		return identity;
	}

	public String getEmail() {
		return email;
	}
}