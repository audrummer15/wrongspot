'use strict';

angular.module('wrongspotApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      addUser: {
        method: 'POST',
        params: {
          id:'new'
        }
      }
	  });
  });
