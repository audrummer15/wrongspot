'use strict';

angular.module('wrongspotApp')
  .factory('Region', function Region($resource) {
    // Public API here
    return $resource('/api/regions/:id/:controller', {
      id: '@_id'
    },
    {
      addRegion: {
        method: 'POST'
      }
    });
  });
