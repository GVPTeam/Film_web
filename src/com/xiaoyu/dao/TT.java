package com.xiaoyu.dao;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.MapListHandler;

import com.sun.org.apache.bcel.internal.generic.NEW;
import com.xiaoyu.entity.Film;
import com.xiaoyu.utils.DBCPUtil;

public class TT {
	
	QueryRunner queryRunner = new QueryRunner(DBCPUtil.getDataSource());
	
	//����ض��м�¼
	@SuppressWarnings("deprecation")
	public List<Map<String, Object>> add(String a) {
		List<Map<String, Object>> list = null;
		try {
			//��ѯ
			list = queryRunner.query("select * from table where name=?",a, new MapListHandler());
			
			//����
			int res = queryRunner.update("insert into table value(?)",a); //����ɹ�����Ӱ�������
			
			//����
			int update = queryRunner.update(""); 
					
			//ɾ��
			int delete = queryRunner.update("");
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	public List<Map<String, Object>> add_film() {
		
		List<Map<String, Object>> list = null;
		
		try {
			
			list = queryRunner.query("select img from db_img ", new MapListHandler());
			
		} catch (SQLException e) {
			
			e.printStackTrace();
		}
		
		return list;
		
		
	}
	
	
	
	
	
	
	
	//�����ض��м�¼
	public List<Film> addss() {
		List<Film> list = null;
		try {
			list = queryRunner.query("", new BeanListHandler<Film>(Film.class));
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}

}
