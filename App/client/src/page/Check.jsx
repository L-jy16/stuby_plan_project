/** @format */

import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { useSelector } from "react-redux";
import { BASE_URL } from "../api";
import moment from "moment";

const Check = () => {
  const user = useSelector((state) => state.user);
  // const [check, setCheck] = useState(false);
  const [checkId, setCheckId] = useState("");
  const [goals, setGoals] = useState([]);
  const [goalsNum, setGoalsNum] = useState("");
  const [goalsList, setGoalsList] = useState([]);
  const [goalsEnd, setGoalsEnd] = useState("");
  const today = new Date();

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

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const ChangeHandle = (id) => {
    setGoalsList((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  useEffect(() => {
    study_list();
  }, []);

  const infoList = (goal, checkSave) => {
    setGoalsNum(goal.studyNum);
    setGoalsList(goal.content);
    setGoalsEnd(checkSave);
  };

  return (
    <>
      <Header />

      <div className="contents_wrap flex center">
        <div className="wrap check_wrap flex center">
          <div className="card_wraps">
            <div className="check_card_wrap">
              {goals.map((goal, index) => {
                // 문자열을 Date 객체로 변환
                const startDate = new Date(goal.start);
                const endDate = new Date(goal.end);
                const contentNum = goal.content.length;
                const checkedItems = goal.content.filter(
                  (item) => item.checked
                );

                const percent = Math.round(checkedItems.length / contentNum);

                // 일(day) 단위 차이 계산
                const diffDays = Math.ceil(
                  (endDate - startDate) / (1000 * 60 * 60 * 24)
                );

                const checkSave = endDate > today || diffDays < 0;

                return (
                  <div
                    key={index}
                    className={`card ${
                      goal.studyNum === goalsNum ? "active" : ""
                    } ${
                      endDate < today
                        ? "red_card"
                        : diffDays < 0
                        ? "red_card"
                        : ""
                    }`}
                    onClick={() => {
                      infoList(goal, checkSave);
                    }}
                  >
                    <h2 className={`card_title`}>{goal.title}</h2>

                    <div className={`card_contents`}>
                      <div className="card_contents_text flex center">
                        {endDate < today ? (
                          <span className="days red_day">
                            기한이 만료된 목표입니다.
                          </span>
                        ) : diffDays < 0 ? (
                          <span className="days red_day">
                            기한이 만료된 목표입니다.
                          </span>
                        ) : (
                          <span className="days">
                            남은기간: <strong>{diffDays}일</strong>
                          </span>
                        )}

                        <span className="percent">{percent}%</span>
                      </div>

                      <progress value="5" className="progress" />
                    </div>
                  </div>
                );
              })}

              <div className="card">
                <h2 className="card_title">아이엘츠</h2>

                <div className="card_contents">
                  <div className="card_contents_text flex center">
                    <span className="days">
                      남은기간: <strong>7일</strong>
                    </span>

                    <span className="percent">70%</span>
                  </div>

                  <progress value="5" className="progress" />
                </div>
              </div>
            </div>
          </div>

          <div className="schedule_list_wrap">
            <h2>List</h2>

            <div className="check_List">
              <ul>
                {goalsList.map((list) => (
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
                      onChange={() => ChangeHandle(list._id)}
                      checked={list.checked || false}
                    />

                    <div className="check_info flex center">
                      <span className="check_date">{list.date}</span>
                      <span className="check_list_info">{list.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {goalsEnd.length < 0 ? (
              <></>
            ) : !goalsEnd ? (
              <></>
            ) : (
              <div className="btn_signal">
                <button className="btn btn_green">저장</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Check;
