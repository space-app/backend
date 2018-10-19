var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiagnosisSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  info: {
    type: String,
    default: ""
  }
});

var DiagnosisModel = mongoose.model('Diagnosis', DiagnosisSchema );
module.exports = DiagnosisModel
