'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LotSchema = new Schema({
  name: String,
  info: String,
  region: {type: mongoose.Schema.Types.ObjectId, ref: 'Region'}
});

module.exports = mongoose.model('Lot', LotSchema);
