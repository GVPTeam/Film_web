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
		//String type = request.getParameter("type"); //获取前端数据
		
		List<Map<String, Object>> list = tt.add_film();	//逻辑处理
		
		String string = JSONArray.fromObject(list).toString(); //变为JSON数组
		System.out.println(string);
		//response.getWriter().print(string);
		response.getWriter().write(string); //返回数据给前端
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
