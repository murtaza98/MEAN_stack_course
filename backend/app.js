const express = require('express');
const bodyParser = require('body-parser');

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

// to parser post request data
app.use(bodyParser.json());

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Success! Post Added"
  });
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



