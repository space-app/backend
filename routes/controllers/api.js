var express = require('express');
var router = express.Router();
var moment = require('moment')
var Diagnosis = require('../models/diagnosis')
var Users = require('../models/user')
var Region = require('../models/region')
var Weather = require('../models/weather')

// NOTE: here we want to provide user specific information what can hapens
// NOTE: based on weather for today and three days later
router.post('/prediction', function(req, res, next) {
  // TODO:
  // NOTE: body =>
  // {
  //   location: enum("Northeast, south, west")
  // }
  console.log(moment.utc("21. 10. 2018","DD. MM. YYYY").format());
  let regionName = req.body.name
  // let date = moment.utc().format()
  let date = moment.utc("21. 10. 2018","DD. MM. YYYY").format()
  console.log(regionName);
  // Region.find({name: regionName},(err, region) => {
  //   console.log(err);
  //   console.log(region);
  // })
  Weather.aggregate([
    {
      // NOTE: Here we populate current patientId field with patients info
      $lookup: {
        from: "regions",
        localField: "region",
        foreignField: "_id",
        as: "region"
      }
    },
    {
      $unwind: '$region'
    },
    {
      $match: {
        'region.name': regionName,
        // date: new Date("2018-10-21T00:00:00.000Z")
      }
    },

  ]).exec((err, weathers) => {
    // NOTE: feeling enum ('super', 'good', 'bad', 'very bad', 'critic')
    if (err) throw err;
    console.log(weathers);
    var currentTemp = weathers[0].temperature
    var isGood = true
    weathers[0].feeling = "good"
    for (var i = 1; i < weathers.length; i++) {
      if(
        currentTemp - weathers[i].temperature > 5 &&
        weathers[i].temperature < 10 &&
        currentTemp > 10
      ) {
        isGood = false
        weathers[i].feeling = "critic"
        weathers[0].solutions = [
          "Cleans your hands for 15 seconds",
          "Eat more fish and eggs or yogurt"
        ]
      }
    }
    var final = {
      me: JSON.parse(JSON.stringify(weathers)),
      fluffy: JSON.parse(JSON.stringify(weathers)),
      plants: JSON.parse(JSON.stringify(weathers))
    }
    final.fluffy[0].solutions = [
      "Take 15 min walks with your flufy :)"
    ]

    final.plants[0].solutions = [
      "Tomorrow will be big dropdown in temperature. Please get your plants inside ;)"
    ]

    res.send(final)
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
  let items = [{
    name: 'Cold',
    info: 'The common cold is a viral infection of your nose and throat (upper respiratory tract).'
  }, {
    name: 'Flu',
    info: 'Flu is an extremely contagious respiratory illness caused by influenza.'
  }]

  for (var i = 0; i < items.length; i++) {
    let diag = new Diagnosis({
      name: items[i],
    });
    diag.save(function (err) {
      if (err) return handleError(err);
      console.log("i", i);
    });
  }
  res.send({status: "probably Success"})
});

router.get('/region/create', function(req, res, next) {
  // var diag = new Diagnosis({
  //   name: 'Flu',
  //   info: 'Flu is an extremely contagious respiratory illness caused by influenza.'
  // });
  let items = ["Northeast", "South", "West"]

  for (var i = 0; i < items.length; i++) {
    let region = new Region({
      name: items[i],
    });
    region.save(function (err) {
      if (err) return handleError(err);
      console.log("i", i);
    });
  }


});


router.get('/weather/create', function(req, res, next) {
  // var diag = new Diagnosis({
  //   name: 'Flu',
  //   info: 'Flu is an extremely contagious respiratory illness caused by influenza.'
  // });
  let items = ["Northeast", "South", "West"]
  Region.find({},(err, regions) => {
    if (err) return handleError(err);
    console.log(regions);
    var temp = [
      // [8.14, 4.56, 10.26, 7.94, 4.77, 2.69, 15.32, 16.78, 8.34, 9.35,],
      [16.78, 8.34, 9.35],
      // [17.67,	13.65,	12.11,	11.57,	11.09,	12.72,	11.84,	14.35,	7.35,	7.98],
      [14.35,	7.35,	7.98],
      // [11.62,	11.52,	9.58,	8.54,	8.34,	7.23,	10.83,	12.22,	6.12,	5.25]
      [12.22,	6.12,	5.25]
    ]

    var dates = [
      moment.utc("21. 10. 2018","DD. MM. YYYY").format(),
      moment.utc("22. 10. 2018","DD. MM. YYYY").format(),
      moment.utc("23. 10. 2018","DD. MM. YYYY").format()
    ]

    for (var i = 0; i < regions.length; i++) {
      for (var j = 0; j < temp[i].length; j++) {
        let json = {
          date: dates[j],
          region: regions[i]._id,
          temperature: temp[i][j]
        }
        let weather = new Weather(json);
        weather.save(function (err) {
          if (err) return handleError(err);
          console.log("i", i);
        });
      }

    }
    res.send({note: "Created weathers"})

  })


});

module.exports = router;
