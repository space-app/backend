var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;

var RegionsSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

var RegionModel = mongoose.model('Region', RegionsSchema );
module.exports = RegionModel
