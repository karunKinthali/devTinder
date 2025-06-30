const express = require('express');

const app = express();

// app.use("/", (req, res) => res.send("Hello! Karun Kinthali"));

app.use("/hello", (req, res) => res.send("Karun...."));
app.use("/karun", (req, res) => res.send("Karun. Kumar. Kinthali.."));
app.use("/", (req, res) => res.send("Hello...."));


app.listen(7777, () => {
    console.log("Server started running successfully");
})
