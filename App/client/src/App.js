/** @format */

import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./components/layout/Main";
import Home from "./page/Home";
import Login from "./page/Login";
import SignUp from "./page/SignUp";
import Goal from "./page/Goal";
import Check from "./page/Check";
import Mypage from "./page/Mypage";
import CalendarPage from "./page/CalendarPage";

const App = () => {
  return (
    <>
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/goal" element={<Goal />} />
          <Route path="/check" element={<Check />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </Main>
    </>
  );
};

export default App;
