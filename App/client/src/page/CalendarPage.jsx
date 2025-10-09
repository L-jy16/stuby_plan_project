/** @format */

import React, { useState } from "react";
import Header from "../components/layout/Header";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarPage = () => {
  const [value, setValue] = useState(new Date());

  const onChange = (date) => {
    setValue(date);
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Header />

      <div className="contents_wrap flex center">
        <div className="wrap calendar_wrap flex center">
          <div className="calendar">
            <Calendar
              onChange={onChange}
              calendarType="iso8601"
              value={value}
              tileClassName={({ date }) => {
                const day = date.getDay();
                if (day === 5) return "sunday";
                if (day === 6) return "saturday";
                if (date.toDateString() === new Date().toDateString())
                  return "today-highlight";
                return null;
              }}
            />
          </div>

          <div className="schedule">
            <h3>Schedule</h3>
            <div className="date">
              <span className="activeDate">{formatDate(value)}</span>
            </div>

            <div className="check_List">
              <ul>
                <li className={`check_list_wrap flex checked`}>
                  <input
                    type="checkbox"
                    className="check_list_checked"
                    name="check_list_checked"
                    checked={true}
                  />
                  <span className="check_list_info">
                    아이엘츠 모의고사 1회 풀기
                  </span>
                </li>
                <li className={`check_list_wrap flex`}>
                  <input
                    type="checkbox"
                    className="check_list_checked"
                    name="check_list_checked"
                    checked={true}
                  />
                  <span className="check_list_info">
                    아이엘츠 모의고사 1회 풀기
                  </span>
                </li>
                <li className={`check_list_wrap flex`}>
                  <input
                    type="checkbox"
                    className="check_list_checked"
                    name="check_list_checked"
                    checked={true}
                  />
                  <span className="check_list_info">
                    아이엘츠 모의고사 1회 풀기
                  </span>
                </li>
                <li className={`check_list_wrap flex`}>
                  <input
                    type="checkbox"
                    className="check_list_checked"
                    name="check_list_checked"
                    checked={true}
                  />
                  <span className="check_list_info">
                    아이엘츠 모의고사 1회 풀기
                  </span>
                </li>
              </ul>
            </div>

            <div className="btn_signal">
              <button className="btn btn_green">저장</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
