const express = require('express');
const dbConnection = require("./config/dbConnection")
const User = require('./model/user');
const validateSignUp = require('./utils/validateSignUp')
const bcrypt = require('bcrypt')
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const userAuth = require('./middleware/userAuth')
const app = express();

app.use(express.json());
app.use(cookieParser())


app.post("/signup", async (req, res) => {
  validateSignUp(req);
  const { firstName, lastName, emailId, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ firstName, lastName, emailId, password: hashedPassword });
    await user.save();
    res.send(`User ${user.firstName.toUpperCase()} saved successfully`);
  } catch (err) {
    res.status(400).send("Error while saving the data:" + err.message)
  }
})

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email format");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await user.getBcrypt(password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const jwtToken = await user.getJWT();
    res.cookie('token', jwtToken, { expires: new Date(Date.now() + 1 * 3600000) })
    res.status(200).send("Logged in successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    // const token = req.cookies.token;
    // if (!token) {
    //   throw new Error("Token missing. Please login again.");
    // }

    // const decoded = jwt.verify(token, 'Karun@123');
    // if (!decoded || !decoded.id) {
    //   throw new Error("Invalid token. Please login again.");
    // }

    // const user = await User.findById(decoded.id);
    // if (!user) {
    //   throw new Error("User not found.");
    // }
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(400).send(err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  console.log("Entered to sendConnectionRequest");
  res.send("sendConnectionRequest");
})

app.get("/user", async (req, res) => {
  try {
    emailId = req.body.emailId;
    const user = await User.findOne({ emailId });
    if (user) {
      res.send(user);
    }
    else {
      res.status(404).send("User not found")
    }
  }
  catch (err) {
    res.send("Unexpcted error" + err);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.send(400, "Something went wrong")
  }
});

app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId
  const user = await User.findByIdAndDelete(userId);
  res.send(`User "${userId}" deleted successfully`);
});

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
      "message": "User updated successfully",
      "Before update": user
    }
    )
  }
  catch (err) {
    res.status(400).send(err.message)
  }
});
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
      "message": "User updated successfully",
      "before update": user
    });
  }
  catch (err) {
    res.status(400).send(err)
  }
});


dbConnection()
  .then(() => {
    console.log("DB connection establised successfully..");
    app.listen(7777, () => {
      console.log("Server started running successfully");
    })
  }).catch((err) => {
    console.error(err.message)
  });
