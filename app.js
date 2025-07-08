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

app.patch("/updateUserById", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const fieldsNotAllowed = ["emailId"];
    const notAllowed = Object.keys(data).some((k) => fieldsNotAllowed.includes(k));
    if (notAllowed) {
      throw new Error("Fields in the payload can't be updated");
    }
    if (data.skills.length > 10) {
      throw new Error("Maximum of 10 skills allowed");
    }
    const user = await User.findByIdAndUpdate(userId, data, { runValidators: true, returnDocument: "before" });
    console.log(user)
    res.send({
      "message": "üser updated successfully",
      "before update": user
    }
    )
  }
  catch (err) {
    res.status(400).send(err.message)
  }
})
// app.patch("/updateUserById", async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;

//   try {
//     const fieldsNotAllowed = ["emailId"];
//     const notAllowed = Object.keys(data).some((k) => fieldsNotAllowed.includes(k)); // Use some instead of every

//     if (notAllowed) {
//       console.log("if block");
//       throw new Error("Fields in the payload can't be updated");
//     }

//     const user = await User.findByIdAndUpdate(userId, data, { runValidators: true, returnDocument: "after" }); // Use returnDocument: "after" to return the updated document

//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     console.log(user);
//     res.send({
//       message: "User updated successfully",
//       "before update": user
//     });
//   } catch (err) {
//     console.log("catch block");
//     res.status(400).send({ message: err.message });
//   }
// });


app.patch("/updateUserByEmail", async (req, res) => {
  const { emailId } = req.body.emailId;
  const data = req.body;
  try {
    user = await User.findOneAndUpdate(emailId, data, { runValidators: true, returnDocument: 'before' })
    res.send({
      "message": "üser updated successfully",
      "before update": user
    });
  }
  catch (err) {
    res.status(400).send(err)
  }
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
