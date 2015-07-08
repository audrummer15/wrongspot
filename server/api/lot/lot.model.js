'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LotSchema = new Schema({
  name: String,
  info: String
});

module.exports = mongoose.model('Lot', LotSchema);
