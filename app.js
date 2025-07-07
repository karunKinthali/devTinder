const express = require('express');
const dbConnection = require("./config/dbConnection")
const User = require('./model/user');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(express.json());


app.post("/signup", async (req, res) => {
  console.log(req.body)
  const user = new User(req.body);
  try {
    await user.save();
    res.send(`User ${user.firstName.toUpperCase()} saved successfully`);
  } catch (err) {
    res.status(400).send("error while saving the data:" + err.message)
  }
})

app.get("/user", async (req, res) => {
  try {
    emailId = req.body.emailId;
    const user = await User.findOne({ emailId });
    if (user) {
      res.send(user);
    }
    else {
      res.status(404).send("user not found")
    }
  }
  catch (err) {
    res.send("Unexpcted error" + err);
  }
})

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.send(400, "something went wrong")
  }
})

app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId
  const user = await User.findByIdAndDelete(userId);
  res.send(`User "${userId}" deleted successfully`);
})

app.patch("/updateUser", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "before" });
  console.log(user)
  res.send({
    "message": "üser updated successfully",
    "before update": user
  }
  )
})

dbConnection()
  .then(() => {
    console.log("DB connection establised successfully..");
    app.listen(7777, () => {
      console.log("Server started running successfully");
    })
  }).catch((err) => {
    console.error(err.message)
  })
