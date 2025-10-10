/** @format */

const express = require("express");
const fetch = require("node-fetch"); // v20 이상 Node.js는 내장 fetch 가능
const cors = require("cors");

const router = express.Router();

const API_KEY = "AIzaSyDpT6TvaozccjjJ5LdhBlGaG18LW8ys1pQ";

router.use(cors());
router.use(express.json());

router.post("/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api.generativeai.googleapis.com/v1beta2/models/text-bison-001:generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          temperature: 0.7,
          maxOutputTokens: 256,
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API 호출 실패" });
  }
});

module.exports = router;
