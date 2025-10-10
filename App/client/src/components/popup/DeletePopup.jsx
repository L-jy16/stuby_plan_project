/** @format */

import React, { useState } from "react";
import { BASE_URL } from "../../api";
import AlertPopup from "./AlertPopup";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

const DeletePopup = ({ id, popup, setPopup }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertPopup, setAlertPopup] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deletefetch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/delete`, {
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

      console.log(data);

      return data.success;
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  const deleteBtn = async () => {
    setIsLoading(true);

    try {
      const success = await deletefetch();

      if (success) {
        navigate("/");
        dispatch(logout());
      } else {
        setAlertPopup(true);
        setAlertMessage("회원 탈퇴에 실패하였습니다.");
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

  const ClosePopup = () => {
    setPopup(false);
  };
  return (
    <>
      <div className={`pop_layer ${popup ? "popup" : ""}`}>
        <div className={`modal ${popup ? "delPopup" : ""}`}>
          <h3>회원 탈퇴</h3>

          <p className="question">회원 탈퇴 하시겠습니까?</p>

          <div className="btn_wrap">
            <button
              className="btn btn_red"
              onClick={isLoading ? undefined : deleteBtn}
            >
              확인
            </button>

            <button
              className="btn btn_gray"
              onClick={isLoading ? undefined : ClosePopup}
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

export default DeletePopup;
