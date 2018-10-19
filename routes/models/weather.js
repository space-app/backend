var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;

var WeathersSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  region: {
    type: String,
    default: ""
  },
  temperature: {
    type: String,
    default: "°C"
  }
});

var WeatherModel = mongoose.model('Weather', WeathersSchema );
module.exports = WeatherModel
