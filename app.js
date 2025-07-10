const express = require('express');
const dbConnection = require("./config/dbConnection")
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { authRouter } = require('./routers/authRouter');
const { profileRouter } = require('./routers/profileRouter');
const { connnectionRequestRouter } = require('./routers/connectionRequestRouter');
const app = express();

app.use(express.json());
app.use(cookieParser())


app.use("/", authRouter, profileRouter, connnectionRequestRouter)

dbConnection()
  .then(() => {
    console.log("DB connection establised successfully..");
    app.listen(7777, () => {
      console.log("Server started running successfully");
    })
  }).catch((err) => {
    console.error(err.message)
  });
