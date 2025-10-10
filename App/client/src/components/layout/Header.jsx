/** @format */

import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { BASE_URL } from "../../api";

const Header = () => {
  const navgaite = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const moveBtn = () => {
    navgaite("/mypage");
  };

  return (
    <header className="header flex center">
      <div className="logo">
        <Link to="/">
          <h2>학습 비서</h2>
        </Link>
      </div>

      <nav className="nav_wrap flex center">
        <ul className="flex center">
          <li>
            <Link
              to={`${user.nickName ? "/goal" : "/login"}`}
              className={`${location.pathname === `/goal` ? "active" : ""}`}
            >
              학습 목표
            </Link>
          </li>
          <li>
            <Link
              to={`${user.nickName ? "/calendar" : "/login"}`}
              className={`${location.pathname === `/calendar` ? "active" : ""}`}
            >
              캘린더
            </Link>
          </li>
          <li>
            <Link
              to={`${user.nickName ? "/check" : "/login"}`}
              className={`${location.pathname === `/check` ? "active" : ""}`}
            >
              진행 상황
            </Link>
          </li>
        </ul>
      </nav>

      <div className="login">
        {user.nickName ? (
          <div className="userName flex center" onClick={moveBtn}>
            <Avatar
              className="avatar"
              size="30"
              round={true}
              src={`${BASE_URL}${user.photoURL}`}
            />
            <strong>{user.nickName}</strong> 님
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
