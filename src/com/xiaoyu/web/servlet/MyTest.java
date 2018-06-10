package com.xiaoyu.web.servlet;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.xiaoyu.dao.TT;

import net.sf.json.JSONArray;

@SuppressWarnings("serial")
@WebServlet("/MyTest")
public class MyTest extends HttpServlet {
	private TT tt = new TT(); 
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//String type = request.getParameter("type"); //��ȡǰ������
		
		List<Map<String, Object>> list = tt.add_film();	//�߼�����
		
		String string = JSONArray.fromObject(list).toString(); //��ΪJSON����
		System.out.println(string);
		//response.getWriter().print(string);
		response.getWriter().write(string); //�������ݸ�ǰ��
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
