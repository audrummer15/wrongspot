'use strict';

var _ = require('lodash');
var Lot = require('./lot.model');

// Get list of lots
exports.index = function(req, res) {
  Lot.find(function (err, lots) {
    if(err) { return handleError(res, err); }
    return res.json(200, lots);
  });
};

// Get a single lot
exports.show = function(req, res) {
  Lot.findById(req.params.id, function (err, lot) {
    if(err) { return handleError(res, err); }
    if(!lot) { return res.send(404); }
    return res.json(lot);
  });
};

// Creates a new lot in the DB.
exports.create = function(req, res) {
  Lot.create(req.body, function(err, lot) {
    if(err) { return handleError(res, err); }
    return res.json(201, lot);
  });
};

// Updates an existing lot in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Lot.findById(req.params.id, function (err, lot) {
    if (err) { return handleError(res, err); }
    if(!lot) { return res.send(404); }
    var updated = _.merge(lot, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, lot);
    });
  });
};

// Deletes a lot from the DB.
exports.destroy = function(req, res) {
  Lot.findById(req.params.id, function (err, lot) {
    if(err) { return handleError(res, err); }
    if(!lot) { return res.send(404); }
    lot.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}