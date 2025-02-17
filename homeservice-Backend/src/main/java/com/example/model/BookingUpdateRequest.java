package com.example.model;


public class BookingUpdateRequest {
    private String date; 
    private String time; 
	public BookingUpdateRequest() {
		super();
	}
	public BookingUpdateRequest(String date, String time) {
		super();
		this.date = date;
		this.time = time;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
    
    
}

