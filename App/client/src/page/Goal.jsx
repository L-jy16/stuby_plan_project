/** @format */

import React, { useState } from "react";
import Header from "../components/layout/Header";
import moment from "moment";

const Goal = () => {
  const today = new Date();
  const todayDate = moment(today).format().slice(0, 10);
  const [goal, setGoal] = useState("");
  const [start, setStart] = useState(todayDate);
  const [end, setEnd] = useState(todayDate);

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
  const [goals, setGoals] = useState([
    { type: "ai", text: "AI 추천 목표 예시 1" },
    { type: "ai", text: "AI 추천 목표 예시 2" },
    { type: "user", text: "" },
    { type: "user", text: "" },
    { type: "user", text: "" },
    { type: "ai", text: "AI 추천 목표 예시 1" },
    { type: "ai", text: "AI 추천 목표 예시 2" },
    { type: "user", text: "" },
    { type: "user", text: "" },
  ]);

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

                <button className="btn btn_green">AI 추천</button>
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
                      + 사용자 목표 추가 +
                    </button>
                  </div>
                ) : (
                  <div className="btn_signal">
                    <button
                      className="btn btn_green"
                      onClick={handleAddUserGoal}
                    >
                      저장
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Goal;
