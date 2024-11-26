const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Password = require("./models/Password");
const Status = require("./models/status");
const Log = require("./models/Log");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://rishabhkumarsingh13:iot123@cluster0.34z8u.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Unlock API

// Add axios for HTTP requests
app.get("/checkStatus", async (req, res) => {

  try {
    const storedStatus = await Status.findOne();
    if (storedStatus && storedStatus.status) {
      return res.send("success"); // Send success if password matches
    }
    res.status(401).send("fail"); // Send fail if password is incorrect
  } catch (error) {
    console.error("Error in unlock API:", error);
    res.status(500).send("error"); // Send error on exception
  }
});

app.get("/api/unlock", async (req, res) => {
  const { password } = req.query; // Use query for simpler requests

  try {
    const storedPassword = await Password.findOne();
    if (storedPassword && storedPassword.password === password) {
      await Status.findOneAndUpdate({}, {status:true}, {upsert: true})
      setTimeout(async ()=>{
        await Status.findOneAndUpdate({}, {status:false}, {upsert: true})
      }, 10000)
      return res.send("success"); // Send success if password matches
    }
    res.status(401).send("fail"); // Send fail if password is incorrect
  } catch (error) {
    console.error("Error in unlock API:", error);
    res.status(500).send("error"); // Send error on exception
  }
});

// Change Password API
app.post("/api/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const storedPassword = await Password.findOne();
    if (storedPassword && storedPassword.password === currentPassword) {
      await Password.setPassword(newPassword);
      return res.json({
        success: true,
        message: "Password changed successfully",
      });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid current password" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Server error");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
