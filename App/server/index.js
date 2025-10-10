/** @format */

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./config/key.js");
const userRouter = require("./router/user.js");
const aiRouter = require("./router/server.js");
const studyRouter = require("./router/study.js");

const app = express();
const port = 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/ai", aiRouter);
app.use("/api/study", studyRouter);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(port, () => {
  mongoose
    .connect(config.mongoURI)
    .then(() => {
      console.log("listening  --> " + port);
      console.log("mongoose --> connecting");
    })
    .catch((err) => {
      console.log(err);
    });
});
