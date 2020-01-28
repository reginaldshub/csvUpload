var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
// var SchemaValidator = require('./../middleware/schemaValidator');
var User = require('../models/user');
var async = require('async');
var verifyToken = require('./../middleware/verifyToken');
let getDistanceBetweenPoints = require('./getDistanceBetweenPoints');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'csv Upload' });
});


router.post('/register', function (req, res, next) {
  User.findOne({ email: req.body.email }, (err, userExists) => {
    if (userExists) return res.status(409).json({ message: 'User Already Registered.' })
    else if (err) throw err;
    else {
      var user = new User({
        email: req.body.email,
        username: req.body.username,
        password: User.hashPassword(req.body.password),
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        incognito: false,
        creation_dt: Date.now()
      });
      user.save().then(doc => {
        return res.status(201).json({ message: "registered sucessfully" });
      }).catch(err => {
        return res.status(501).json({ message: 'Error registering user.' })
      })
    }
  })

})

router.post('/login', (req, res, next) => {
  User.findOne({ username: req.body.username }).exec().then((user) => {
    let nearByUsers = [];
    if (user) {
      console.log(user);
      
      console.log(user);
      if (user.isValid(req.body.password)) {
        // generate token
        let token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '20m' });
        User.find().then((allRecords) => {
         
          var promise = new Promise(function(resolve, reject) { 
            allRecords.forEach((rec) => {
              distance = getDistanceBetweenPoints(user.latitude, user.longitude, rec.latitude, rec.longitude);
             console.log("SIST",distance);
             
              if(distance <= 10 || distance >= 10) nearByUsers.push({"username": rec.username, "distance": distance})
            })         
            return resolve(res.status(200).send({ success: true, message: "Succesfully fetched user details", token, nearByUsers }));
          }); 
        })
      } else {
        return res.status(401).json({ message: ' Invalid Credentials' });
      }
    } else {
      return res.status(404).json({ message: 'User email is not registered.' })
    }
  }).catch(err => {
    console.log(err);
    
    return res.status(501).json({ message: 'Some internal error' });
  })
})

module.exports = router;
