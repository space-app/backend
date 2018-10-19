var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  diagnosis: [{
    type: Schema.Types.ObjectId,
    ref: 'Diagnosis'
  }]
});

var UserModel = mongoose.model('User', UsersSchema );
module.exports = UserModel
