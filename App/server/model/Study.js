/** @format */

const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  date: String, // "2025-10-10" 형식
  text: String, // 목표 내용
  type: String, // "ai" 등
  checked: Boolean, // check
});

const studySchema = new mongoose.Schema(
  {
    studyNum: Number,
    userId: String,
    title: String,
    content: [goalSchema], // content를 배열로 변경
    start: String,
    end: String,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "study" }
);

const Study = mongoose.model("Study", studySchema);

module.exports = { Study };
