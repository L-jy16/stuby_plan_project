/** @format */

import React, { useState } from "react";
import Header from "../components/layout/Header";
import user from "../assets/images/ico_user.png";
import Avatar from "react-avatar";
import AlertPopup from "../components/popup/AlertPopup";
import DeletePopup from "../components/popup/DeletePopup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

const Mypage = () => {
  const id = ""; // 아이디
  const [nickName, setNickName] = useState(""); //별칭
  const [popup, setPopup] = useState(""); //별칭
  const [pass, setPass] = useState("");
  const [passC, setPassC] = useState("");
  const [change, setChange] = useState(false);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alertPopup, setAlertPopup] = useState(false); // alert 창
  const [alertMessage, setAlertMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const modfiyBtn = () => {
    setChange(true);
  };

  const deleteBtn = () => {
    setPopup(true);
  };

  const ChangeHandle = (event) => {
    const { name, value } = event.target;

    switch (name) {
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

  const logoutBtn = async () => {
    try {
      dispatch(logout());
      navigate(`/`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className="contents_wrap flex center">
        <div className="wrap mypage_wrap  flex center">
          <div className="mypage flex center">
            <div className="mypage_info mypage_left flex center">
              <Avatar
                className="avatar"
                size="250"
                round={true}
                src={user.photoURL}
              />
              <h3 className="user_name">
                <strong>이이호</strong>님
              </h3>

              <div className="btn_signal">
                <button className="logout_btn" onClick={logoutBtn}>
                  로그아웃
                </button>
              </div>
            </div>

            <div className="mypage_info mypage_right flex center">
              <div className="user_info">
                <div className="modal_select flex id">
                  <span>아이디</span>
                  <input
                    type="text"
                    id="user_id"
                    name="user_id"
                    placeholder="아이디 입력"
                    value={id}
                    autoComplete="off"
                  />
                </div>

                {change ? (
                  <>
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
                  </>
                ) : (
                  <div className="modal_select flex name">
                    <span>이름</span>
                    <input
                      type="text"
                      id="user_nickname"
                      name="user_nickname"
                      placeholder="별칭 입력"
                      value={nickName}
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>

              <div className="btn_signal">
                {change ? (
                  <button className={`btn btn_green`}>저장</button>
                ) : (
                  <button className={`btn btn_gray`} onClick={modfiyBtn}>
                    회원 수정
                  </button>
                )}
              </div>
            </div>

            <div className="btn_signal">
              <button className={`btn btn_red`} onClick={deleteBtn}>
                회원 탈퇴
              </button>
            </div>
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

      {popup && <DeletePopup popup={popup} setPopup={setPopup} />}
    </>
  );
};

export default Mypage;
