/** @format */

import React, { useState } from "react";
import Header from "../components/layout/Header";
import moment from "moment";
import { BASE_URL } from "../api";
import AlertPopup from "../components/popup/AlertPopup";
import { useSelector } from "react-redux";

const Goal = () => {
  const today = new Date();
  const todayDate = moment(today).format().slice(0, 10);
  const user = useSelector((state) => state.user);
  const [goal, setGoal] = useState("");
  const [start, setStart] = useState(todayDate);
  const [end, setEnd] = useState(todayDate);
  const [isLoading, setIsLoading] = useState(false);

  const [alertPopup, setAlertPopup] = useState(false); // alert 창
  const [alertMessage, setAlertMessage] = useState("");

  const ChangeHandle = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "goal":
        setGoal(value);
        break;

      default:
        break;
    }
  };

  // 목표 리스트 (type으로 구분)
  //   { type: "user", text: "AI 추천 목표 예시 1", date: "2025-01-10" },
  const [goals, setGoals] = useState([]);

  const maxGoals = 10;

  const handleChange = (index, value) => {
    const newGoals = [...goals];
    newGoals[index].text = value;
    setGoals(newGoals);
  };

  const handleAddUserGoal = () => {
    if (goals.length < maxGoals) {
      setGoals([...goals, { type: "user", text: "" }]);
    }
  };

  const handleRemoveGoal = (index) => {
    const newGoals = goals.filter((_, i) => i !== index);
    setGoals(newGoals);
  };

  const startDateChange = (e) => setStart(e.target.value);
  const endDateChange = (e) => setEnd(e.target.value);

  const aifetch = async (number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/ai/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goal,
          startDate: start,
          endDate: end,
          num: number,
        }),
      });

      if (!response.ok) {
        // throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleAiRecommend = async () => {
    setIsLoading(true);
    try {
      const number = maxGoals - goals.length;
      const data = await aifetch(number);

      if (data?.plan) {
        // 1. 서버에서 받은 JSON 문자열을 파싱
        let planArray = [];
        try {
          planArray = JSON.parse(data.plan.match(/```json\n([\s\S]*?)```/)[1]);
        } catch (e) {
          console.error("JSON 파싱 실패:", e);
        }

        // 2. goals 형태로 변환
        const newGoals = planArray.map(([date, text]) => ({
          type: "ai",
          text,
          date,
          checked: false,
        }));

        // 3. 기존 goals 배열에 추가
        setGoals((prevGoals) => [...prevGoals, ...newGoals]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 저장
  const saveGoalfetch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/study/save_study`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          goals: goals,
          goal: goal,
          start: start,
          end: end,
        }),
      });

      if (!response.ok) {
        // throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data.success;
    } catch (error) {
      console.error(error);
    }
  };

  const saveGoalBtn = async () => {
    setIsLoading(true);
    try {
      if (!goal) {
        setAlertMessage("목표를 입력해주세요.");
        setAlertPopup(true);
        setIsLoading(false);
        return;
      }

      if (start < todayDate) {
        setAlertPopup(true);
        setAlertMessage("오늘보다 이전 날짜는 선택할 수 없습니다.");
        return;
      }

      if (start > end) {
        setAlertPopup(true);
        setAlertMessage("시작일보다 이전 날짜는 선택할 수 없습니다.");
        return;
      }

      const success = await saveGoalfetch();

      if (success) {
        setGoal("");
        setGoals([]);
        setStart(todayDate);
        setEnd(todayDate);
        setAlertMessage("일정이 등록 되었습니다!");
        setAlertPopup(true);
        setIsLoading(false);
        return;
      } else {
        setAlertMessage("일정 등록에 실패하였습니다.");
        setAlertPopup(true);
        setGoal("");
        setGoals([]);
        setStart(todayDate);
        setEnd(todayDate);
        setIsLoading(false);
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
        <div className="wrap goal_wrap">
          <div className="input_wrap flex center">
            <div className="inpu_wrap_top flex center">
              <div className="goal_input_wrap flex center">
                <span>목표 입력</span>
                <input
                  type="text"
                  className="goal_input"
                  id="goal"
                  name="goal"
                  placeholder="목표를 입력해주세요."
                  value={goal}
                  onChange={ChangeHandle}
                  autoComplete="off"
                  autoFocus
                />
              </div>

              <div className="date_input_wrap flex center">
                <span>일정 등록</span>
                <div className={`date_input flex center`}>
                  <input
                    type="date"
                    className="date"
                    value={start}
                    onChange={startDateChange}
                  />
                  <span>~</span>
                  <input
                    type="date"
                    className="date"
                    value={end}
                    onChange={endDateChange}
                  />
                </div>
              </div>
            </div>

            <div className="inpu_wrap_bottom">
              <div className="goal_list_top">
                <h3>일정 목록(최대 10개 입력 가능)</h3>

                <button
                  className={`btn btn_green`}
                  onClick={isLoading ? null : handleAiRecommend}
                >
                  AI 추천
                </button>
              </div>

              <div className="goal_list_bottom">
                <div className="goal_list_info">
                  {goals.map((goal, index) => (
                    <div
                      key={index}
                      className={`goal_list ${goal.type}_goal flex center`}
                    >
                      <span>{index + 1}. </span>

                      <div className="goal_input_wrap">
                        <input
                          type="date"
                          className="goal_date_input"
                          value={goal.date || ""}
                          onChange={(e) => {
                            const newGoals = [...goals];
                            newGoals[index].date = e.target.value;
                            setGoals(newGoals);
                          }}
                        />
                        <input
                          type="text"
                          className="goal_list_input"
                          placeholder={
                            goal.type === "user" ? `목표 ${index + 1}` : ""
                          }
                          value={goal.text}
                          readOnly={goal.type === "ai"}
                          onChange={(e) => handleChange(index, e.target.value)}
                        />

                        <button
                          className="trash_btn"
                          onClick={() => handleRemoveGoal(index)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {goals.length < maxGoals ? (
                  <div className="btn_signal">
                    <button className="add_list" onClick={handleAddUserGoal}>
                      + 사용자 일정 추가 +
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="btn_signal">
                <button
                  className="btn btn_green"
                  onClick={isLoading ? null : saveGoalBtn}
                >
                  저장
                </button>
              </div>
            </div>
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

export default Goal;
