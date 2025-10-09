/** @format */

import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertPopup from "../components/popup/AlertPopup";
import { BASE_URL } from "../api";

const SignUp = () => {
  const [id, setId] = useState(""); // 아이디
  const [id2, setId2] = useState(""); // 아이디
  const [nickName, setNickName] = useState(""); //별칭
  const [pass, setPass] = useState("");
  const [passC, setPassC] = useState("");
  const [idCheck, setIdCheck] = useState(false);
  const today = new Date(); //오늘 날짜
  const contractDate = moment(today).format().slice(0, 10); // 계약일

  const [alertPopup, setAlertPopup] = useState(false); // alert 창
  const [alertMessage, setAlertMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");

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

  const idCheckfetch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/idcheck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
        }),
      });

      if (!response.ok) {
        // throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return { success: data.success, check: data.check };
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  const joinfetch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          userNickName: nickName,
          userPass: pass,
          userRegisterDate: contractDate,
          uid: "",
          photoURL: "",
        }),
      });

      if (!response.ok) {
        // throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data.success;
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 아이디 중복
  const userCheck = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!id) {
        setAlertPopup(true);
        setAlertMessage("아이디를 입력해 주세요.");
        setIsLoading(false);
        return;
      }

      const { success, check } = await idCheckfetch();
      if (success) {
        if (check) {
          setAlertPopup(true);
          setAlertMessage("사용 가능한 아이디입니다.");
          setId2(id);
          setIdCheck(true);
          setIsLoading(false);
          return;
        } else {
          setAlertPopup(true);
          setAlertMessage("사용할 수 없는 아이디입니다.");
          setIdCheck(false);
          setIsLoading(false);
          return;
        }
      } else {
        setAlertPopup(true);
        setAlertMessage("중복 확인 중 오류가 발생하였습니다.");
        setIdCheck(false);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("에러 발생:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 회원 가입
  const userSignUp = async (e) => {
    setIsLoading(true);
    try {
      const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

      if (!idCheck) {
        setAlertPopup(true);
        setAlertMessage("아이디 중복 검사를 해주세요.");
        setIsLoading(false);
        return;
      }

      if (id2 !== id) {
        setAlertPopup(true);
        setAlertMessage("아이디 중복 검사를 다시 해주세요.");
        setIdCheck(false);
        setIsLoading(false);
        return;
      }

      if (!regex.test(pass) && !regex.test(passC)) {
        setAlertMessage("비밀번호를 영문과 숫자를 조합하여 입력해주세요.");
        setAlertPopup(true);
        setIsLoading(false);
        setPass("");
        setPassC("");
        return;
      }

      if (!pass || !passC) {
        setAlertPopup(true);
        setAlertMessage("비밀 번호를 입력해 주세요.");
        setIsLoading(false);

        return;
      } else if (pass !== passC) {
        setAlertPopup(true);
        setAlertMessage("비밀 번호를 확인 주세요.");
        setPass("");
        setPassC("");
        setIsLoading(false);

        return;
      }

      if (!nickName) {
        setAlertPopup(true);
        setAlertMessage("별칭을 입력해 주세요.");
        setIsLoading(false);

        return;
      }

      const success = await joinfetch();

      if (success) {
        setAlertPopup(true);
        setAlertMessage("가입이 완료되었습니다.");
        setTitle("회원가입");
        setIsLoading(false);

        return;
      } else {
        setAlertPopup(true);
        setAlertMessage("회원 가입에 실패하였습니다.");
        setIsLoading(false);

        setId("");
        setNickName("");
        setPass("");
        setPassC("");
        return;
      }
    } catch (error) {
      console.error("에러 발생:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

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
                <button
                  className={`checkbutton userCheck`}
                  onClick={isLoading ? null : userCheck}
                >
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
          title={title}
          alertPopup={alertPopup}
          setAlertPopup={setAlertPopup}
          alertMessage={alertMessage}
        />
      )}
    </>
  );
};

export default SignUp;
