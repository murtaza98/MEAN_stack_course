const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log("First MiddleWare");
  next();   // pass request to next middleWare
});

app.use((req, res, next) => {
  res.send("Hello from express");
});


// export this app
module.exports = app;



