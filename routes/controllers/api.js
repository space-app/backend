var express = require('express');
var router = express.Router();

var Diagnosis = require('../models/diagnosis')
var Users = require('../models/user')

// NOTE: here we want to provide user specific information what can hapens
// NOTE: based on weather for today and three days later
router.post('...', function(req, res, next) {
  // TODO:
  Diagnosis.find((err, diagnosis) => {
    if (err) return console.error(err);
    console.log(diagnosis);
    res.send(diagnosis);
  })
});

// NOTE: we provide possible diagnosis/diseases
router.get('/diagnosis', function(req, res, next) {
  Diagnosis.find((err, diagnosis) => {
    if (err) return console.error(err);
    console.log(diagnosis);
    res.send(diagnosis);
  })
});

// NOTE: here user provide data about his health status
router.post('/diagnosis/create', function(req, res, next) {
  console.log(req.body);
  let json = {
    date: moment.utc().format(),
    diagnosis: req.body
  }
  var user = new Users(json);
  user.save(function (err) {
    if (err) return handleError(err);
    res.send('Success');
  });
});

router.get('/diagnosis/create', function(req, res, next) {
  // var diag = new Diagnosis({
  //   name: 'Flu',
  //   info: 'Flu is an extremely contagious respiratory illness caused by influenza.'
  // });
  var diag = new Diagnosis({
    name: 'Cold',
    info: 'The common cold is a viral infection of your nose and throat (upper respiratory tract).'
  });
  diag.save(function (err) {
    if (err) return handleError(err);
    res.send('Success');
  });

});

module.exports = router;
