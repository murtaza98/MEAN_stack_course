const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

// connect to remote server
mongoose.connect('mongodb+srv://max:BTtYwkIZe6n4dKvQ@mean-course-7efsh.mongodb.net/node-angular?retryWrites=true&w=majority')
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
    'GET, POST, OPTIONS, DELETE, PATCH'
  );
  next();
});

// to parser post request data
app.use(bodyParser.json());

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  console.log(post);
  res.status(201).json({
    message: "Success! Post Added"
  });
});

app.use('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message: 'Success',
        posts: documents
      });
    })
    .catch(error=>{
      console.log('Error Occured while fetching data');
    });
});

// export this app
module.exports = app;



