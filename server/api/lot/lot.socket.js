/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Lot = require('./lot.model');

exports.register = function(socket) {
  Lot.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Lot.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('lot:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('lot:remove', doc);
}