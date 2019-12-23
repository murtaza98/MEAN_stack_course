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
    'GET, POST, OPTIONS, DELETE, PATCH, PUT'
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
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Success! Post Added",
      addedPostId: createdPost._id
    });
  });
  // console.log(post);
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      // console.log(result);
      console.log('Post Updated');
      res.status(200).json({
        message: "Success! Post updated"
      });
    });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      // console.log(documents);
      res.status(200).json({
        message: 'Success',
        posts: documents
      });
    })
    .catch(error=>{
      console.log('Error Occured while fetching data');
    });
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if(post){
        res.status(200).json(post);
      }else{
        res.status(404).json({
          message: 'Error!! Post not found'
        });
      }
    })
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      console.log('Post Deleted');
    })
    .catch(error => {
      console.log('Error occured while deleting post\n' + error);
    });
  res.status(200).json({
    message: 'Post deleted'
  });
});

// export this app
module.exports = app;



