/** @format */

const express = require("express");
const config = require("../config/key.js");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

// const apiKey = "AIzaSyDpT6TvaozccjjJ5LdhBlGaG18LW8ys1pQ";

const ai = new GoogleGenAI({ apiKey: config.geminiAPI });

// /plan POST 라우터
router.post("/plan", async (req, res) => {
  const { goal, startDate, endDate, num } = req.body;

  // 실제 생성할 프롬프트
  const prompt = `
목표: ${goal}
시작 날짜: ${startDate}
끝 날짜: ${endDate}

최대 ${num}개의 일정으로 나누어 [날짜, 일정] 배열로 만들어주세요.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ type: "text", text: prompt }],
      config: { temperature: 0.7 },
    });

    // 실제 텍스트 추출
    const candidate = response.candidates?.[0];
    let result = "";

    if (candidate && candidate.content && candidate.content.parts) {
      result = candidate.content.parts.map((p) => p.text).join("\n");
    }

    if (!result) result = "응답 없음";

    res.json({ plan: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "일정 생성 실패", details: err.message });
  }
});

module.exports = router;
