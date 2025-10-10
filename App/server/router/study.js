/** @format */

const express = require("express");
const router = express.Router();

// 스키마 만들기
const { Study } = require("../model/Study.js");
const { Counter } = require("../model/Counter.js");
const { User } = require("../model/User.js");

router.post("/save_study", async (req, res) => {
  const { userId, goals, goal, start, end } = req.body;

  try {
    // 1. 유저 존재 확인
    const user = await User.findOne({ userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    let counter = await Counter.findOne({ name: "counter" });

    // 2. goals 배열 DB에 저장
    // Post 컬렉션에 userId 포함해서 저장
    const post = new Study({
      studyNum: counter.studyNum,
      userId: user.userId,
      title: goal,
      content: goals, // goals 배열 자체를 content에 저장
      start: start,
      end: end,
      createdAt: new Date(),
    });

    await post.save();

    await Counter.updateOne({ name: "counter" }, { $inc: { studyNum: 1 } });

    res
      .status(200)
      .json({ success: true, message: "AI 목표가 저장되었습니다.", post });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
});

// ----- 진행 상황 -------
// 특정 유저의 학습 정보 가져오기
router.get("/study_info/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 유저 확인
    const user = await User.findOne({ userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    // 유저 학습 정보 가져오기
    const studies = await Study.find({ userId });
    res.json({ success: true, studies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 에러" });
  }
});

// checked 값 업데이트
router.patch("/study_info/:studyId", async (req, res) => {
  const { studyId } = req.params;
  const { checked } = req.body; // true 또는 false

  try {
    const updatedStudy = await Study.findByIdAndUpdate(
      studyId,
      { checked },
      { new: true } // 업데이트 후 새 document 반환
    );

    if (!updatedStudy) {
      return res
        .status(404)
        .json({ success: false, message: "학습 정보를 찾을 수 없습니다." });
    }

    res.json({ success: true, study: updatedStudy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 에러" });
  }
});

module.exports = router;
