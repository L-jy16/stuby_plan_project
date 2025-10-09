/** @format */

import React from "react";
import Header from "../components/layout/Header";
import ico_goal from "../assets/images/ico_goal.png";
import ico_calendar from "../assets/images/ico_calendar2.png";
import ico_check from "../assets/images/ico_check.png";
import ico_user from "../assets/images/ico_user.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navgaite = useNavigate();
  const user = useSelector((state) => state.user);

  const startBtn = () => {
    if (user.nickName) {
      navgaite("/goal");
    } else {
      navgaite("/login");
    }
  };

  const cardMove = (e) => {
    if (user.nickName) {
      if (e === "목표") {
        navgaite("/goal");
      } else if (e === "캘린더") {
        navgaite("/calendar");
      } else if (e === "체크") {
        navgaite("/check");
      } else if (e === "마이페이지") {
        navgaite("/mypage");
      }
    } else {
      navgaite("/login");
    }
  };

  return (
    <>
      <Header />

      <div className="home_wrap flex">
        <div className="banner flex">
          <h2 className="banner_text">
            학습 비서와 함게하는
            <br />
            나만의 학습 플래너✨
          </h2>
          <div className="btn_wrap">
            <button className="btn start_btn" onClick={startBtn}>
              시작하기
            </button>
          </div>
        </div>

        <div className="card_wrap flex center ">
          <div
            className="card flex center goal_card"
            onClick={() => cardMove("목표")}
          >
            <div className="card_img">
              <img src={ico_goal} alt="목표 이미지" />
            </div>
            <span className="card_text">학습 목표</span>
          </div>
          <div
            className="card flex center calendar_card"
            onClick={() => cardMove("캘린더")}
          >
            <div className="card_img">
              <img src={ico_calendar} alt="목표 이미지" />
            </div>
            <span className="card_text">캘린더 보기</span>
          </div>
          <div
            className="card flex center check_card"
            onClick={() => cardMove("체크")}
          >
            <div className="card_img">
              <img src={ico_check} alt="목표 이미지" />
            </div>
            <span className="card_text">진행 상황</span>
          </div>
          <div
            className="card flex center mypage_card"
            onClick={() => cardMove("마이페이지")}
          >
            <div className="card_img">
              <img src={ico_user} alt="목표 이미지" />
            </div>
            <span className="card_text">My Page</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
