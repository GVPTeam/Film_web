package com.xiaoyu.entity;

import java.sql.Date;

//实体化，对应单表查询，保存Film信息
public class Film {

	private String name;
	private Date  year;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Date getYear() {
		return year;
	}
	public void setYear(Date year) {
		this.year = year;
	}
	
}
