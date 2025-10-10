/** @format */

const express = require("express");
const router = express.Router();
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

const path = require("path");

const { User } = require("../model/User.js");
const { Counter } = require("../model/Counter.js");

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
        // userNum: user.userNum,
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

// 회원수정
router.post("/update", async (req, res) => {
  try {
    const { userId, userNickName, userPass } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "사용자 없음" });
    }

    if (userNickName) user.userNickName = userNickName;
    if (userPass) {
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      user.userPass = await bcrypt.hash(userPass, salt); // 비밀번호 암호화
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "회원 정보 업데이트 성공",
      userData: {
        userId: user.userId,
        userNickName: user.userNickName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
});

// 회원탈퇴
router.post("/delete", async (req, res) => {
  try {
    const { userId } = req.body;

    const deletedUser = await User.findOneAndDelete({ userId });

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    return res.status(200).json({ success: true, message: "회원 탈퇴 완료" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
});

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}${ext}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

// 프로필 사진(몽고디비 photoURL이 변경된 사진의 url로 변경)  => 네이버 클라우드와 몽고디비 photoURL이 같음
router.post("/updateImg", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "사용자 없음" });
    }

    // 파일 업로드 후 URL 저장 (예: 서버에 저장한 경로)
    if (file) {
      user.uid = `/uploads/${file.filename}`;
      user.photoURL = `/uploads/${file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "프로필 사진 업데이트 성공",
      userData: {
        uid: user.uid,
        photoURL: user.photoURL,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
});

module.exports = router;
