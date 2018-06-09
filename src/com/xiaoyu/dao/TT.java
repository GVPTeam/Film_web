package com.xiaoyu.dao;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.MapListHandler;

import com.xiaoyu.entity.Film;
import com.xiaoyu.utils.DBCPUtil;

public class TT {
	
	QueryRunner queryRunner = new QueryRunner(DBCPUtil.getDataSource());
	
	//多表返回多行记录
	public List<Map<String, Object>> add() {
		List<Map<String, Object>> list = null;
		try {
			list = queryRunner.query("", new MapListHandler());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	//单表返回多行记录
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
