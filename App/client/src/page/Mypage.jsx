/** @format */
import React, { useRef, useState } from "react";
import Header from "../components/layout/Header";
import Avatar from "react-avatar";
import AlertPopup from "../components/popup/AlertPopup";
import DeletePopup from "../components/popup/DeletePopup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateUser } from "../redux/authSlice";
import { BASE_URL } from "../api";

const Mypage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [nickName, setNickName] = useState(user.nickName || "");
  const [pass, setPass] = useState("");
  const [passC, setPassC] = useState("");
  const [file, setFile] = useState(null);
  const [change, setChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [alertPopup, setAlertPopup] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [popup, setPopup] = useState(false);

  // 입력값 변경
  const ChangeHandle = (event) => {
    const { name, value } = event.target;
    if (name === "user_nickname_check") setNickName(value);
    if (name === "user_pw") setPass(value);
    if (name === "user_pw_check") setPassC(value);
  };

  const modfiyBtn = () => setChange(true);

  const logoutBtn = () => {
    dispatch(logout());
    navigate(`/`);
  };

  // const handleFileChange = (e) => setFile(e.target.files[0]);

  const upDatefetch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          userNickName: nickName,
          userPass: pass,
        }),
      });

      if (!response.ok) {
        // throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return { success: data.success, data: data };
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 닉네임 + 비밀번호 수정
  const upDateBtn = async () => {
    setIsLoading(true);
    try {
      const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

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

      if (pass !== passC) {
        setAlertMessage("비밀번호와 확인이 일치하지 않습니다.");
        setAlertPopup(true);
        return;
      }

      const { success, data } = await upDatefetch();

      if (success) {
        dispatch(
          updateUser({
            nickName: data.userData.userNickName,
          })
        );
        setChange(false);
        setPass("");
        setPassC("");
        // setFile(null);
        setAlertMessage("회원 정보가 수정되었습니다!");
        setAlertPopup(true);
        setIsLoading(false);
        return;
      } else {
        setAlertMessage("회원 정보 수정에 실패하였습니다.");
        setAlertPopup(true);
        setPass("");
        setPassC("");
        setNickName(user.nickName);
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

  const changeCancle = () => {
    try {
      setChange(false);
      setPass("");
      setPassC("");
      setNickName(user.nickName);
    } catch (error) {
      console.error(error);
    }
  };

  // 프로필 이미지 변경
  const changeImgfetch = async (formData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/updateImg`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("에러 발생:", error);
      return { success: false };
    }
  };

  const changeImg = async (selectedFile) => {
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("file", selectedFile);

      const { success, userData } = await changeImgfetch(formData);

      if (success) {
        dispatch(
          updateUser({
            uid: `${userData.uid}`,
            photoURL: `${userData.photoURL}`,
          })
        );
        setAlertMessage("프로필 이미지가 변경되었습니다!");
      } else {
        setAlertMessage("프로필 이미지 변경에 실패하였습니다.");
      }

      setAlertPopup(true);

      // 버튼 클릭 효과
      setClicked(true);
      setTimeout(() => setClicked(false), 200);
    } catch (err) {
      console.error(err);
      setAlertMessage("서버 에러 발생");
      setAlertPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 선택 시 이미지 변경 실행
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) changeImg(selectedFile);
  };

  // 버튼 클릭 시 input 열기
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 회원탈퇴

  const deleteBtn = () => setPopup(true);

  return (
    <>
      <Header />
      <div className="contents_wrap flex center">
        <div className="wrap mypage_wrap flex center">
          <div className="mypage flex center">
            {/* 좌측: 프로필 이미지 */}
            <div className="mypage_info mypage_left flex center">
              <div className="changeImg_wrap flex center">
                <button className="btn btn_gray" onClick={handleButtonClick}>
                  이미지 변경
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="change_input"
                />
              </div>

              <Avatar
                className="avatar"
                size="250"
                round
                src={`${BASE_URL}${user.photoURL}`}
              />

              <h3 className="user_name">
                <strong>{user.nickName}</strong>님
              </h3>
              <div className="btn_signal">
                <button className="logout_btn" onClick={logoutBtn}>
                  로그아웃
                </button>
              </div>
            </div>

            {/* 우측: 회원 정보 수정 */}
            <div className="mypage_info mypage_right flex center">
              <div className="user_info">
                <div className="modal_select flex id">
                  <span>아이디</span>
                  <input type="text" value={user.id} readOnly />
                </div>

                {change ? (
                  <>
                    <div className="modal_select flex name">
                      <span>이름</span>
                      <input
                        type="text"
                        name="user_nickname_check"
                        value={nickName}
                        onChange={ChangeHandle}
                      />
                    </div>
                    <div className="modal_select flex pass">
                      <span>비밀번호</span>
                      <input
                        type="password"
                        name="user_pw"
                        value={pass}
                        onChange={ChangeHandle}
                      />
                    </div>
                    <div className="modal_select flex passC">
                      <span>비밀번호 확인</span>
                      <input
                        type="password"
                        name="user_pw_check"
                        value={passC}
                        onChange={ChangeHandle}
                      />
                    </div>
                  </>
                ) : (
                  <div className="modal_select flex name">
                    <span>이름</span>
                    <input type="text" value={nickName} readOnly />
                  </div>
                )}
              </div>

              {change ? (
                <div className="btn_wrap flex cent">
                  <button
                    className="btn btn_green"
                    onClick={isLoading ? undefined : upDateBtn}
                  >
                    저장
                  </button>

                  <button className="btn btn_red" onClick={changeCancle}>
                    취소
                  </button>
                </div>
              ) : (
                <div className="btn_signal">
                  <button className="btn btn_gray" onClick={modfiyBtn}>
                    회원 수정
                  </button>
                </div>
              )}
            </div>

            <div className="btn_signal">
              <button className="btn btn_red" onClick={deleteBtn}>
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
      {popup && <DeletePopup id={user.id} popup={popup} setPopup={setPopup} />}
    </>
  );
};

export default Mypage;
