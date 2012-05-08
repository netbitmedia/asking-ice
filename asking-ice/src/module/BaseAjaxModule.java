package module;

import inc.annotations.AccessControl;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

import model.system.Privilege;
import model.user.User;
import net.arnx.jsonic.JSON;

import org.ice.db.Result;
import org.ice.exception.AccessDeniedException;
import org.ice.module.HttpModule;

import exception.MustLoginException;

public abstract class BaseAjaxModule extends HttpModule {
	
	protected Result result;
	protected User viewer;
	
	public void init()	{
		viewer = (User) this.getRequest().getSession("viewer");
		if (viewer == null)	{
			viewer = new User();
			viewer.id = -1;
		}
	}
	
	protected void enforceAccessControl(String roles) throws Exception {
		if (viewer.id == -1)
			throw new MustLoginException("Bạn phải đăng nhập để sử dụng tính năng này");
		if (roles.isEmpty())
			return;
		String[] roleArr = roles.split(roles);
		for(String role: roleArr)	{
			if (viewer.role != null && role.equals(viewer.role))	{
				return;
			}
		}
		throw new AccessDeniedException("Bạn không được phép sử dụng tính năng này");
	}
	
	public void preDispatch(Method method) throws Exception	{
		if (method.isAnnotationPresent(AccessControl.class))	{
			Annotation annotation = method.getAnnotation(AccessControl.class);
			String roles = "";
			try {
				Field field = annotation.annotationType().getField("roles");
				roles = field.get(annotation).toString();
			} catch (Exception ex) {}
			this.enforceAccessControl(roles);
		}
		
		Privilege privilege = new Privilege();
		privilege.enforce(viewer, getRequest().getModuleName(), getRequest().getTaskName());
//		setContentType("text/json");
	}
	
	public void postDispatch(Method method) throws Exception	{
		if (result == null)
			result = new Result(true, null, null);
		echo(JSON.encode(result));
	}
}
