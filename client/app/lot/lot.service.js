'use strict';

angular.module('wrongspotApp')
  .factory('Lot', function ($resource) {
    // Public API here
    return $resource('/api/lots/:id/:controller', {
      id: '@_id'
    },
    {
      addLot: {
        method: 'POST',
        params: {
          id:'new'
        }
      }
    });
  });
