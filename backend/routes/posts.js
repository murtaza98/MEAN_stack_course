const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      console.log("image valid");
      error = null;
    }else{
      console.log("image invalid");
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, fileName + '-' + Date.now() + '.' + ext);
  }
});

// "image" is the name of property in form at frontend
router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
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

router.get('', (req, res, next) => {
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

router.get('/:id', (req, res, next) => {
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

router.delete('/:id', (req, res, next) => {
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


module.exports = router;

