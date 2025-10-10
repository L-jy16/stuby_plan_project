/** @format */

import { createSlice } from "@reduxjs/toolkit";

// 초기 상태 설정
const initialState = {
  // userNum: "",
  id: "",
  nickName: "",
  uid: "",
  photoURL: "",
  isLoading: false,
};

// sessionStorage에서 유저 정보를 불러오기
const savedUser = sessionStorage.getItem("user");
if (savedUser) {
  const parsedUser = JSON.parse(savedUser);
  // initialState.userNum = parsedUser.userNum;
  initialState.id = parsedUser.id;
  initialState.nickName = parsedUser.nickName;
  initialState.uid = parsedUser.uid;
  initialState.photoURL = parsedUser.photoURL;
  initialState.isLoading = true;
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      // state.userNum = action.payload.userNum;
      state.id = action.payload.id;
      state.nickName = action.payload.nickName;
      state.uid = action.payload.uid;
      state.photoURL = action.payload.photoURL;
      state.isLoading = true;

      // sessionStorage에 저장
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout: (state) => {
      // state.userNum = "";
      state.id = "";
      state.nickName = "";
      state.uid = "";
      state.photoURL = "";
      state.isLoading = false;

      // sessionStorage에서 제거
      sessionStorage.removeItem("user");
    },

    updateUser: (state, action) => {
      // 사용자 일부 정보만 업데이트할 수도 있음
      Object.assign(state, action.payload);
      sessionStorage.setItem("user", JSON.stringify(state));
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
