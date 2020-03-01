const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');

const app = express();

// connect to remote server
mongoose.connect('mongodb+srv://max:BTtYwkIZe6n4dKvQ@mean-course-7efsh.mongodb.net/node-angular?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(()=>{
    console.log('connected to DB');
  })
  .catch(()=>{
    console.log('Connection Failed');
  });

// to handle CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, DELETE, PATCH, PUT'
  );
  next();
});

// to parser post request data
app.use(bodyParser.json());

// posts routes
app.use("/api/posts", postsRoutes);

// give access images folder
app.use("/images", express.static(path.join('backend/images')));

// export this app
module.exports = app;



