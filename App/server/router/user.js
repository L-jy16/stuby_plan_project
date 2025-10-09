/** @format */

const express = require("express");
const router = express.Router();

const { User } = require("../model/User.js");
const { Counter } = require("../model/Counter.js");

// 이미지 업로드

// 회원 가입
const bcrypt = require("bcrypt");

router.post("/join", async (req, res) => {
  try {
    const { userId, userNickName, userPass, uid, photoURL } = req.body;

    // 1. 중복 ID 확인
    const existing = await User.findOne({ userId });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "이미 사용중인 ID" });

    // 2. Counter 조회
    const counter = await Counter.findOne({ name: "counter" });
    if (!counter)
      return res.status(400).json({ success: false, message: "카운터 없음" });

    // 3. 비밀번호 암호화
    const hashedPass = await bcrypt.hash(userPass, 10);

    // 4. 유저 생성
    const newUser = new User({
      userNum: counter.userNum,
      userId,
      userNickName,
      userPass: hashedPass,
      uid,
      photoURL,
    });
    await newUser.save();

    // 5. Counter 증가
    await Counter.updateOne({ name: "counter" }, { $inc: { userNum: 1 } });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
});

// 닉네임 중복 검사
router.post("/id", async (req, res) => {
  try {
    const existingUser = await User.findOne({ userId: req.body.userId });
    const check = existingUser ? false : true; // 사용 가능하면 true
    res.status(200).json({ success: true, check });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
  //   User.findOne({ userId: req.body.userId })
  //     .exec()
  //     .then((result) => {
  //       let check = true;
  //       if (result) {
  //         check = false;
  //       }
  //       res.status(200).json({ success: true, check });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(400).json({ success: false });
  //     });
});

// 프로필 사진(몽고디비 photoURL이 변경된 사진의 url로 변경)  => 네이버 클라우드와 몽고디비 photoURL이 같음
router.post("/profile/update", (req, res) => {
  let temp = {
    photoURL: req.body.photoURL,
  };

  User.updateOne({ uid: req.body.uid }, { $set: temp })
    .exec()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).json({ success: false });
    });
});

module.exports = router;
