var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var payloadChecker = require("payload-validator");
var Userdetails = require("../models/userdetails");
var User = require('../models/user');
let getDistanceBetweenPoints = require('./getDistanceBetweenPoints');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

csv = require("csvtojson");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * 5
  }
});

const expectedPayload = {
  username: "",
  password: "",
  place: "",
  latitude: "",
  longitude: ""
};

router.post("/upload", upload.single("csvfile"), (req, res, next) => {
  console.log(req.file.originalname);
  csv()
    .fromFile(`uploads/${req.file.originalname}`)
    .then((jsonObj) => {
      var result = payloadChecker.validator(
        jsonObj[0],
        expectedPayload, [
        "username",
        "password",
        "place",
        "latitude",
        "longitude"
      ],
        false
      );
      if (result.success) {
        jsonObj.forEach((row) => {
          User.find({ username: row.username }, (err, record) => {
            if (err)
              console.log("err", err)
            else if (record.length > 0) {
              var myquery = { username: row.username };
              var newvalues = { $set: { password: User.hashPassword(row.password), place: row.place, longitude: row.longitude, latitude: row.latitude, incognito: false } };
              User.updateOne(myquery, newvalues, function (err, updatedRes) {
                if (err) console.log("New Error", err);
                else {
                  console.log("updated", updatedRes)
                  // return res.status(201).json({ message: "updated sucessfully" });
                }
              })
            } else {
              var user = new User({
                username: row.username,
                password: User.hashPassword(row.password),
                longitude: row.longitude,
                latitude: row.latitude,
                incognito: false,
                creation_dt: Date.now()
              });
              user.save().then(response => {
                // return res.status(201).json({ message: "added sucessfully" });
              }).catch(err => {
                return res.status(501).json({ message: 'Error in adding row.' })
              })
            }
          })
        })
        return res.status(201).json({ message: "added sucessfully" });
      } else return res.status(501).json({ message: 'Bad CSV format.' })

    })
});

// router.post("/find", (req, res, next) => {
//   let latitude = req.body.latitude;
//   let longitude = req.body.longitude;
//   console.log(latitude, longitude)
//   User.find().then((allRecords) => {
//     let nearByUsers = [];
//     var promise = new Promise(function (resolve, reject) {
//       allRecords.forEach((rec) => {
//         distance = getDistanceBetweenPoints(latitude, longitude, rec.latitude, rec.longitude);
//         if (distance <= 10 ) nearByUsers.push({ "username": rec.username, "distance": distance })
//         console.log(nearByUsers, distance);

//       })
//       return resolve(res.status(200).send({ success: true, message: "Succesfully fetched user details", nearByUsers }));
//     });
//   }).catch(err => console.log(err))
// })

router.post("/find", (req, res, next) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  User.find({$and: [{latitude: latitude}, {longitude: longitude}]}).then((allRecords) => {
    console.log(allRecords);
    
      return res.status(200).send({ success: true, message: "Succesfully fetched user details", allRecords} );
  }).catch(err => console.log(err))
})

router.post("/setIncognito", (req, res, next) => {
  console.log(req.body.username);

  User.find({ username: req.body.username }, (err, updatedRes) => {
    if (err) throw err;
    else {
      User.updateOne({ username: req.body.username }, { $set: { incognito: true } }, (err, updatedRes) => {
        if (err) console.log("err", err);
        else {
          return res.status(200).json({ message: updatedRes })
        }
      })
    }
  }).catch(err => console.log("err", err))
})

router.get("/getAllUsers", (req, res, next) => {
  User.find().then((allRecords) => {    
      return res.status(200).send({ success: true, message: "Succesfully fetched user details", allRecords} );
  }).catch(err => console.log(err))
})

module.exports = router;
