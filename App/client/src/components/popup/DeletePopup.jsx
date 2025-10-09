/** @format */

import React from "react";

const DeletePopup = ({ popup, setPopup }) => {
  const ClosePopup = () => {
    setPopup(false);
  };
  return (
    <div className={`pop_layer ${popup ? "popup" : ""}`}>
      <div className={`modal ${popup ? "delPopup" : ""}`}>
        <h3>회원 탈퇴</h3>

        <p className="question">회원 탈퇴 하시겠습니까?</p>

        <div className="btn_wrap">
          <button className="btn btn_red" onClick={ClosePopup}>
            확인
          </button>

          <button className="btn btn_gray" onClick={ClosePopup}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
