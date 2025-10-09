/** @format */

import React from "react";

const AlertPopup = ({ alertPopup, setAlertPopup, alertMessage }) => {
  const CloseAlertPopup = () => {
    setAlertPopup(false);
  };

  return (
    <>
      {/* <div className={`pop_layer popup`}>
        <div className={`modal alertpopup`}> */}
      <div className={`pop_layer ${alertPopup ? "popup" : ""}`}>
        <div className={`modal ${alertPopup ? "alertpopup" : ""}`}>
          <h3>알림</h3>
          <p className="question">{alertMessage}</p>
          {/* <p className="question">저장할 위치를 다시 선택해 주세요.</p> */}
          <div className="btn_wrap">
            <button className="btn btn_gray" onClick={CloseAlertPopup}>
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertPopup;
