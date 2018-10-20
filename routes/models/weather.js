var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;

var WeathersSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: "Region"
  },
  temperature: {
    type: String,
    default: "0 °C"
  }
});

var WeatherModel = mongoose.model('Weather', WeathersSchema );
module.exports = WeatherModel
