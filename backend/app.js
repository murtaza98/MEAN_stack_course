const express = require('express');

const app = express();

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

app.use('/api/posts', (req, res, next) => {
  posts = [
    {id: 1, title: "1 title", content: "1 content"},
    {id: 1, title: "2 title", content: "2 content"},
    {id: 1, title: "3 title", content: "3 content"}
  ];
  res.status(200).json({
    message: 'Success',
    posts: posts
  });
});

// export this app
module.exports = app;



