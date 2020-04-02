const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post('/login', (req, res, next) => {
  // ----- info -----
  // auth in Single Page Apps is different from auth in other full stack websites
  // over here instead of creating session, a server will generate a JWT (json web token) and send this to client
  // the client will then send this jwt with all its future HTTP requests
  // ----- end info ------

  let fetchedUser;
  // check if email is present in db
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log(user);
      if (!user) {
        // email not found in DB
        return res.status(401).json({
          message: 'Email not found'
        });
      }
      // email found, now check if password is same
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        // password doesn't match
        return res.status(401).json({
          message: 'Password is Incorrect'
        });
      }
      // email and password verified
      // create a jwt
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
        'some_server_secret',
        {expiresIn: '1h'}
      );
      // send jwt token to client
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'Authentication Failed'
      })
    });


});


module.exports = router;
