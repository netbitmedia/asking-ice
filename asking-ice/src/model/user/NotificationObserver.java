package model.user;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;

import model.Base;
import model.question.Answer;
import model.question.AnswerFlag;
import model.question.AnswerVote;
import model.question.Comment;
import model.question.EmailRecommend;
import model.question.Question;
import model.question.QuestionVote;
import model.question.Recommend;

import org.ice.Config;
import org.ice.db.Table;
import org.ice.view.ScriptProcessor;
import org.ice.view.ScriptView;

import com.gargoylesoftware.htmlunit.ScriptPreProcessor;

import inc.LCS;
import inc.SendMail;
import inc.message.Observer;

public class NotificationObserver extends Table implements Observer {
	
	public long id;
	public long userId;
	public long sourceId;
	public String title;
	public String type;
	public String link;
	public int checked;
	public Timestamp since;
	
	public long totalUnchecked;
	public String name;

	public NotificationObserver()	{
		super();
		this.table = "notifications";
		this.key = "id";
	}
	
	public long countUnchecked() throws Exception	{
		ArrayList<NotificationObserver> list = this.select("userId = ?userId AND checked = 0", "COUNT(id) AS totalUnchecked", "since DESC", null);
		return list.get(0).totalUnchecked;
	}
	
	@Override
	public void onMessage(String message, Object data) {
		try {
			Base table = (Base) data;
			if (table instanceof Answer) {
				this.onAnswerAdded((Answer)table);
			} else if (table instanceof QuestionVote)	{
				this.onQuestionVoted((QuestionVote)table);
			} else if (table instanceof Question)	{
				this.onQuestionAdded((Question)table);
			} else if (table instanceof AnswerVote)	{
				this.onAnswerVoted((AnswerVote)table);
			} else if (table instanceof Comment)	{
				this.onAnswerCommented((Comment)table);
			} else if (table instanceof AnswerFlag)	{
				this.onAnswerReported((AnswerFlag)table);
			} else if (table instanceof Recommend)	{
				this.onQuestionInvited((Recommend)table);
			} else if (table instanceof EmailRecommend)	{
				this.onQuestionInvitedEmail((EmailRecommend)table);
			}
		} catch (Exception ex) {}
	}

	protected void onAnswerReported(AnswerFlag table) throws Exception {
		Answer a = new Answer();
		a.id = table.answerId;
		
		if (a.load())	{
			link = "{type: 'Question',qid: '" + a.questionId + "',hl: '"+a.id+"'}";
			type = "AnswerReported";
			sourceId = table.userId;
			userId = a.userId;
			
			User source = new User();
			source.id = sourceId;
			source.load();
			
			Question q = new Question();
			q.id = a.questionId;
			q.load();
			
			User u = new User();
			u.id = userId;
			u.load();
			
			HashMap<String, Object> view = new HashMap<String, Object>();
			view.put("name", source.name);
			view.put("qid", q.id);
			view.put("qtitle", q.title);
			view.put("answer", a.content);
			view.put("aid", a.id);
			
			String improvement;
			switch(table.type)	{
			case 1:
				improvement = "Câu trả lời này cần phải đúng trọng tâm câu hỏi hơn";
				break;
			case 2:
				improvement = "Câu trả lời này cần đưa ra ý kiến mới so với những câu trả lời trước đó";
				break;
			case 3:
				improvement = "Câu trả lời này cần thêm giải thích";
				break;
			case 4:
				improvement = "Câu trả lời này nên đưa vào phần bàn luận cho câu trả lời khác";
				break;
			case 5:
				improvement = "Chứa nội dung từ nguồn khác nhưng không có chú thích";
				break;
			default:
				improvement = "";
			}
			view.put("improvement", improvement);
			
			this.sendMail(u.email, source.name+" đã góp ý cho câu trả lời của bạn trong câu hỏi \""+q.title+"\"", view, Config.get("resourceUrl")+"/mail/answerreported.htm", source);
			this.add(source);
		}
	}

	protected void onAnswerVoted(AnswerVote table) throws Exception {
		Answer a = new Answer();
		a.id = table.answerId;
		
		if (a.load())	{
			link = "{type: 'Question',qid: '" + a.questionId + "',hl: '"+a.id+"'}";
			type = "AnswerVoted";
			sourceId = table.userId;
			userId = a.userId;
			this.add(null);
		}
	}
	
	protected void onQuestionAdded(Question table) throws Exception {
		title = table.title;
		link = "{type: 'Question',qid: '" + table.id + "'}";
		type = "Asked";
		sourceId = table.userId;
		if (table.targetId != 0)	{
			userId = table.targetId;
			this.add(null);
		}
		if (table.targetNextId != 0)	{
			userId = table.targetNextId;
			this.add(null);
		}
		
		NotificationRegister nr = new NotificationRegister();
		nr.userId = sourceId;
		nr.objId = table.id;
		nr.registerQuestion();
	}
	
	protected void onQuestionInvited(Recommend table) throws Exception {
		Question q = new Question();
		q.id = table.questionId;
		
		if (q.load())	{
			title = q.title;
			link = "{type: 'Question',qid: '" + q.id + "'}";
			type = "QuestionInvited";
			sourceId = table.userId;
			userId = table.targetId;

			User source = new User();
			source.id = sourceId;
			source.load();
			
			User u = new User();
			u.id = userId;
			u.load();
			
			HashMap<String, Object> view = new HashMap<String, Object>();
			view.put("name", source.name);
			view.put("qid", q.id);
			view.put("qtitle", q.title);
			view.put("qcontent", q.content);
			
			this.sendMail(u.email, source.name+" đã mời bạn trả lời câu hỏi \""+q.title+"\"", view, Config.get("resourceUrl")+"/mail/questioninvited.htm", source);
			this.add(source);
		}
	}
	
	protected void onQuestionInvitedEmail(EmailRecommend table) throws Exception {
		Question q = new Question();
		q.id = table.questionId;
		
		if (q.load())	{
			User source = new User();
			source.id = table.userId;
			source.load();
			
			HashMap<String, Object> view = new HashMap<String, Object>();
			view.put("name", source.name);
			view.put("qid", q.id);
			view.put("qtitle", q.title);
			view.put("qcontent", q.content);
			view.put("msg", table.msg);
			
			if (table.msg == null || table.msg.trim().isEmpty())
				this.sendMail(table.email, source.name+" đã mời bạn trả lời câu hỏi \""+q.title+"\"", view, Config.get("resourceUrl")+"/mail/questioninvited.htm", source);
			else
				this.sendMail(table.email, source.name+" đã mời bạn trả lời câu hỏi \""+q.title+"\"", view, Config.get("resourceUrl")+"/mail/questioninvitedemail.htm", source);
		}
	}

	protected void onQuestionVoted(QuestionVote table) throws Exception {
		Question q = new Question();
		q.id = table.questionId;
		
		if (q.load())	{
			title = q.title;
			link = "{type: 'Question',qid: '" + q.id + "'}";
			type = "QuestionVoted";
			sourceId = table.userId;
			userId = q.userId;
			this.add(null);
		}
	}

	protected void onAnswerCommented(Comment table) throws Exception {
		Answer a = new Answer();
		a.id = table.answerId;
		
		if (a.load())	{
			link = "{type: 'Question',qid: '" + a.questionId + "',hl: '"+a.id+"'}";
			type = "AnswerCommented";
			sourceId = table.userId;
			userId = a.userId;
			this.add(null);
		}
	}

	protected void onAnswerAdded(Answer table) throws Exception {
		Question q = new Question();
		q.id = table.questionId;
		
		if (q.load())	{
			title = q.title;
			link = "{type: 'Question',qid: '" + q.id + "',hl: '"+table.id+"'}";
			if (table.lastEdited != null)	{
				type = "AnswerEdited";
			} else {
				type = "QuestionAnswered";
			}
			sourceId = table.userId;
			
			NotificationRegister nr = new NotificationRegister();
			nr.objId = q.id;
			ArrayList<NotificationRegister> list = nr.listQuestionFollowersEmail();
			
			User u = new User();
			u.id = sourceId;
			u.load();

			HashMap<String, Object> view = new HashMap<String, Object>();
			view.put("name", u.name);
			view.put("qid", q.id);
			view.put("aid", table.id);
			
			String emails = "";
			for(NotificationRegister register: list)	{
				this.userId = register.userId;
				emails += ","+register.email;
				this.add(u);
			}
			if (!emails.isEmpty())	{
				if (table.lastEdited != null)	{
					view.put("acontent", LCS.diff(table.oldContent, table.content));
					this.sendMail(emails.substring(1), u.name+" đã cập nhật trả lời cho câu hỏi \""+q.title+"\"", view, Config.get("resourceUrl")+"/mail/answeredited.htm", u);
				} else {
					view.put("acontent", table.content);
					this.sendMail(emails.substring(1), "Câu hỏi \""+q.title+"\" đã được trả lời", view, Config.get("resourceUrl")+"/mail/questionanswered.htm", u);
				}
			}
		}
	}
	
	private void sendMail(String to, String subject, HashMap<String, Object> view, String template, User source) {
		//FIXME: Currently there's no way to retrieve the base URL
		ScriptProcessor processor = new ScriptProcessor();
		view.put("baseUrl", "http://asking.vn");
		view.put("resourceUrl", "http://asking.vn/resource");
		SendMail.send(null, "Asking.vn <bkprofile@bkprofile.com>", to, subject, subject, processor.process(template, view), source.email);
	}

	protected String normalizeContent(String s)	{
		if (s != null && s.length() > 100)	{
			return s.substring(0, 100)+"...";
		}
		return s;
	}
	
	protected void add(User u) throws Exception	{
		if (sourceId == userId)
			return;
		if (title == null)
			title = "";
		if (u == null)	{
			u = new User();
			u.id = sourceId;
			u.load();
		}
		name = u.name;
		checked = 0;
		this.insert("userId, name, type, sourceId, link, checked, title");
	}

	public Object fetchFullNotification(int pageIndex, int pageSize) throws Exception {
		ArrayList<NotificationObserver> list = this.select("userId = ?userId", null, "since DESC", null, pageIndex, pageSize);
		this.checked = 1;
		this.update("checked", "userId = ?userId");
		return list;
	}
}
