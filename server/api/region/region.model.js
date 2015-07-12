'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RegionSchema = new Schema({
  name: String,
  info: String
});

module.exports = mongoose.model('Region', RegionSchema);
