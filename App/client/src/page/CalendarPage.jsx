/** @format */

import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AlertPopup from "../components/popup/AlertPopup";
import { BASE_URL } from "../api";
import { useSelector } from "react-redux";

const CalendarPage = () => {
  const user = useSelector((state) => state.user);
  const [value, setValue] = useState(new Date());
  const [goals, setGoals] = useState([]);
  const [goalsList, setGoalsList] = useState([]);
  const [dateList, setDateList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [alertPopup, setAlertPopup] = useState(false); // alert 창
  const [alertMessage, setAlertMessage] = useState("");

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

  const study_list = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/study/study_info/${user.id}`
      );

      if (!response.ok) {
        // throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setGoals(data.studies);

      return data.studies;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const goal = async () => {
      const data = await study_list();

      if (data) {
        const contentList = data.flatMap((goal) => goal.content);
        setGoalsList(contentList);
      }
    };

    goal();
  }, []);

  const changeDate = () => {
    if (goalsList) {
      const date = formatDate(value);

      const filterDate = goalsList.filter((info) => info.date === date);

      setDateList(filterDate);
    }
  };

  useEffect(() => {
    changeDate();
  }, [value, goalsList]);

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
                {dateList.map((list) => (
                  <li
                    key={list._id}
                    className={`check_list_wrap flex ${
                      list.checked ? "checked" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="check_list_checked"
                      name="check_list_checked"
                      checked={list.checked}
                    />

                    <div className="check_info flex center">
                      <span className="check_date">{list.date}</span>
                      <span className="check_list_info">{list.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* <div className="btn_signal">
              <button className="btn btn_green">저장</button>
            </div> */}
          </div>
        </div>
      </div>

      <div className={`loading ${isLoading ? "overlay" : ""}`}>
        <div className="cv-spinner">
          <span className="spinner"></span>
        </div>
      </div>

      {alertPopup && (
        <AlertPopup
          alertPopup={alertPopup}
          setAlertPopup={setAlertPopup}
          alertMessage={alertMessage}
        />
      )}
    </>
  );
};

export default CalendarPage;
