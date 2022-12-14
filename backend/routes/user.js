const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  bcrypt.hash(password, 10)
    .then(hash => {

      const user = new User({
        email: email,
        password: hash
      });
      user.save().then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      }).catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
    });
});


router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }

    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password).then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, 'ti_ho_mai_detto_la_definizione_di_follia_ma_lo_ho_fatto', {
        expiresIn: '1h',
      });

      return res.status(200).json({
        token: token,
        message: "Auth successful"
      });



    }).catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });

  }).catch(err => {
    return res.status(401).json({
      message: "Invalid authentication credentials!"
    });
  });
});


module.exports = router;
