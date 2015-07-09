'use strict';

angular.module('wrongspotApp')
  .factory('Lot', function Lot($resource) {
    // Public API here
    return $resource('/api/lots/:id/:controller', {
      id: '@_id'
    },
    {
      addLot: {
        method: 'POST'
      }
    });
  });
