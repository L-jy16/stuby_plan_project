/** @format */

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ico_id from "../assets/images/ico_id.png";
import ico_pw from "../assets/images/ico_pass.png";
import AlertPopup from "../components/popup/AlertPopup";

const Login = () => {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [alertPopup, setAlertPopup] = useState(false); // alert 창
  const [alertMessage, setAlertMessage] = useState("");
  const dispatch = useDispatch();

  const navgaite = useNavigate();

  const ChangeHandle = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "user_id":
        setId(value);
        break;
      case "user_pw":
        setPass(value);
        break;
      default:
        break;
    }
  };

  const loginBtn = async () => {};

  return (
    <>
      <div className="login_container">
        <div className="login_wrap">
          <h2>학습 비서</h2>
          <div className="login_input">
            <div className="user user_id">
              <label htmlFor="user_id">
                <img src={ico_id} alt="아이디" />
                아이디
              </label>
              <input
                type="text"
                id="user_id"
                name="user_id"
                placeholder="Enter your ID"
                value={id}
                onChange={ChangeHandle}
              />
            </div>
            <div className="user user_pw">
              <label htmlFor="user_pw">
                <img src={ico_pw} alt="비밀번호" />
                비밀번호
              </label>
              <input
                type="password"
                id="user_pw"
                name="user_pw"
                placeholder="Enter your password"
                value={pass}
                onChange={ChangeHandle}
              />
            </div>
          </div>

          <div className="signUp">
            <span>Don't have an account?</span>
            <Link to="/signup" className="userRegistration">
              Sign up here
            </Link>
          </div>

          <div className="btn_signal login_btn">
            <button className="btn btn_green" onClick={loginBtn}>
              로그인
            </button>
          </div>
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

export default Login;
