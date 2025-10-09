/** @format */

import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertPopup from "../components/popup/AlertPopup";

const SignUp = () => {
  const [id, setId] = useState(""); // 아이디
  const [nickName, setNickName] = useState(""); //별칭
  const [pass, setPass] = useState("");
  const [passC, setPassC] = useState("");
  const today = new Date(); //오늘 날짜
  const contractDate = moment(today).format().slice(0, 10); // 계약일

  const [alertPopup, setAlertPopup] = useState(false); // alert 창
  const [alertMessage, setAlertMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navgaite = useNavigate();

  const ChangeHandle = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "user_nickname":
        setNickName(value);
        break;

      case "user_id":
        setId(value);
        break;

      case "user_pw":
        setPass(value);
        break;

      case "user_pw_check":
        setPassC(value);
        break;

      default:
        break;
    }
  };

  // 아이디 중복
  const userCheck = () => {};

  // 회원 가입
  const userSignUp = () => {};

  // 회원 가입 취소
  const cancleSignup = () => {
    navgaite("/");
  };

  return (
    <>
      <div className="sign_up_wrap flex center">
        <div className="sign_up">
          <div className="popup_box flex center">
            <span></span>
          </div>

          <div className="registration_wrap flex center">
            <div className="content_box content_left flex center">
              <div className="logo_img_wrap">
                <div className="logo">
                  <h2>학습 비서</h2>
                </div>
                <h3>회원 가입</h3>
              </div>
            </div>

            <div className="content_box content_right">
              <div className="modal_select flex id">
                <span>아이디</span>
                <input
                  type="text"
                  id="user_id"
                  name="user_id"
                  placeholder="아이디 입력"
                  value={id}
                  onChange={ChangeHandle}
                  autoComplete="off"
                  autoFocus
                />
                <button className="checkbutton userCheck" onClick={userCheck}>
                  중복 확인
                </button>
              </div>

              <div className="modal_select flex name">
                <span>이름</span>
                <input
                  type="text"
                  id="user_nickname"
                  name="user_nickname"
                  placeholder="별칭 입력"
                  value={nickName}
                  onChange={ChangeHandle}
                  autoComplete="off"
                />
              </div>

              <div className="modal_select flex pass">
                <span>비밀번호</span>
                <input
                  type="password"
                  id="user_pw"
                  name="user_pw"
                  placeholder="영문과 숫자를 조합하여 6자리 이상 입력"
                  value={pass}
                  onChange={ChangeHandle}
                  autoComplete="off"
                />
              </div>

              <div className="modal_select flex passC">
                <span>비밀번호 확인</span>
                <input
                  type="password"
                  id="user_pw_check"
                  name="user_pw_check"
                  placeholder="비밀번호 확인"
                  value={passC}
                  onChange={ChangeHandle}
                  autoComplete="off"
                />
              </div>

              <div className="modal_select flex date both">
                <span>등록일</span>
                <input
                  type="date"
                  className="date_input"
                  id="user_contract"
                  name="user_contract"
                  value={contractDate}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="popup_btn_wrap flex center">
            <button
              className={`btn btn_green`}
              onClick={isLoading ? null : userSignUp}
            >
              회원 가입
            </button>
            <button
              className={`btn btn_gray`}
              onClick={isLoading ? null : cancleSignup}
            >
              취소
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

export default SignUp;
