/** @format */

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 5050;
// const port = process.env.PORT || 5050;
const cors = require("cors");
const config = require("./config/key.js");

app.use(cors());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

// express router
app.use("/api/user", require("./router/user.js"));
app.use("/api/ai", require("./router/server.js"));
app.use("/uploads", express.static("uploads"));
// app.use("/api/post", require("./router/study.js"));

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
