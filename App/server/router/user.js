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
    const { userId, userNickName, userPass, userRegisterDate, uid, photoURL } =
      req.body;

    // 1. 중복 ID 확인
    const existing = await User.findOne({ userId });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "이미 사용중인 ID" });

    // 2. Counter 조회
    let counter = await Counter.findOne({ name: "counter" });
    if (!counter) {
      counter = new Counter({ name: "counter", userNum: 1 });
      await counter.save();
      console.log("Counter 생성 완료!");
    }

    // 3. 비밀번호 암호화
    const hashedPass = await bcrypt.hash(userPass, 10);

    // 4. 유저 생성
    const newUser = new User({
      userNum: counter.userNum,
      userId,
      userNickName,
      userPass: hashedPass,
      userRegisterDate,
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
router.post("/idcheck", async (req, res) => {
  try {
    const existingUser = await User.findOne({ userId: req.body.userId });
    const check = existingUser ? false : true; // 사용 가능하면 true
    res.status(200).json({ success: true, check });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { userId, userPass } = req.body;

    // 1. 아이디 확인
    const user = await User.findOne({ userId });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "존재하지 않는 ID입니다." });
    }

    // 2. 비밀번호 확인
    const isMatch = await bcrypt.compare(userPass, user.userPass);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "비밀번호 틀립니다." });
    }

    // 3. 성공 시
    res.status(200).json({
      success: true,
      message: "로그인 성공",
      userData: {
        userId: user.userId,
        userNickName: user.userNickName,
        uid: user.uid,
        photoURL: user.photoURL,
      },
    });

    res.status(200).json({ success: true, check });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
});

// 로그아웃
// router.post("/logout", (req, res) => {
//   try {
//     // 세션 사용 시
//     req.session.destroy((err) => {
//       if (err) {
//         console.error(err);
//         return res
//           .status(500)
//           .json({ success: false, message: "로그아웃 실패" });
//       }
//       res.clearCookie("connect.sid"); // 세션 쿠키 삭제
//       res.status(200).json({ success: true, message: "로그아웃 성공" });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ success: false, message: "로그아웃 실패" });
//   }
// });

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
