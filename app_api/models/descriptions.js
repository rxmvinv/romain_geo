var mongoose = require('mongoose');

var stateSchema = new mongoose.Schema({
  name: String,
  info: String
});

var countrySchema = new mongoose.Schema({
  c_id: String,
  name: String,
  info: String,
  states: [stateSchema]
});

mongoose.model('Description', countrySchema);
