const express = require('express');
const dbConnection = require("./config/dbConnection")
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routers/authRouter');
const { profileRouter } = require('./routers/profileRouter');
const { connectionRequestRouter } = require('./routers/connectionRequestRouter');
const userRouter = require('./routers/user');
const app = express();

app.use(express.json());
app.use(cookieParser())


app.use("/", authRouter, profileRouter, connectionRequestRouter, userRouter);



dbConnection()
  .then(() => {
    console.log("DB connection establised successfully..");
    app.listen(7777, () => {
      console.log("Server started running successfully");
    })
  }).catch((err) => {
    console.error(err.message)
  });
