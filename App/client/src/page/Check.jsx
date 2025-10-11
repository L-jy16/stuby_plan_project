/** @format */

import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { useSelector } from "react-redux";
import { BASE_URL } from "../api";
import moment from "moment";
import AlertPopup from "../components/popup/AlertPopup";

const Check = () => {
  const user = useSelector((state) => state.user);
  // const [check, setCheck] = useState(false);
  const [checkId, setCheckId] = useState("");
  const [goals, setGoals] = useState([]);
  const [goalsNum, setGoalsNum] = useState("");
  const [goalsList, setGoalsList] = useState([]);

  const [goalsUpdate, setGoalsUpdate] = useState(false);
  const [goalsEnd, setGoalsEnd] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [alertPopup, setAlertPopup] = useState(false); // alert 창
  const [alertMessage, setAlertMessage] = useState("");

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
  }, [goalsUpdate]);

  const infoList = (goal, checkSave) => {
    setGoalsNum(goal.studyNum);
    setGoalsList(goal.content);
    setGoalsEnd(checkSave);
  };

  const saveListInfofetch = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/study/study_checked/${goalsNum}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: goalsList,
          }),
        }
      );

      if (!response.ok) {
        // throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data.success;
    } catch (error) {
      console.error(error);
    }
  };

  const saveListInfoBtn = async () => {
    setIsLoading(true);
    try {
      const success = await saveListInfofetch();

      if (success) {
        setAlertMessage("일정이 등록 되었습니다!");
        setAlertPopup(true);
        setIsLoading(false);
        setGoalsUpdate(!goalsUpdate);
        return;
      } else {
        setAlertMessage("일정 등록에 실패하였습니다.");
        setAlertPopup(true);
        setIsLoading(false);
        setGoalsNum("");
        setGoalsList([]);
        setGoalsEnd("");
        setGoalsUpdate(!goalsUpdate);
        return;
      }
    } catch (err) {
      console.error(err);
      setAlertMessage("서버 에러 발생");
      setAlertPopup(true);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
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

                const percent = Math.round(
                  (checkedItems.length / contentNum) * 100
                );

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

                      <progress
                        value={percent}
                        max="100"
                        className="progress"
                      />
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
                {goalsEnd.length < 0
                  ? goalsList.map((list) => (
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
                    ))
                  : !goalsEnd
                  ? goalsList.map((list) => (
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
                    ))
                  : goalsList.map((list) => (
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
                <button
                  className="btn btn_green"
                  onClick={isLoading ? undefined : saveListInfoBtn}
                >
                  저장
                </button>
              </div>
            )}
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

export default Check;
