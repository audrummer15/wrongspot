'use strict';

angular.module('wrongspotApp')
  .factory('Auth', function Auth($location, $rootScope, $http,
    User, Region, Lot, $cookieStore, $q) {
    var currentUser = {};
    if($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Add a new user from Admin panel
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      addUser: function(user, callback) {
        if (!currentUser.role === 'admin') {
          return new Error("You're not allowed to do that!");
        }

        var cb = callback || angular.noop;

        user.provider = 'local';

        return User.addUser(user,
          function(data) {
            return cb(user);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },


      /**
       * Add a new region from Admin panel
       *
       * @param  {Object}   lot     - lot info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      addRegion: function(region, callback) {
        if (!currentUser.role === 'admin') {
          return new Error("You're not allowed to do that!");
        }

        var cb = callback || angular.noop;

        return Region.addRegion(region,
          function(data) {
            return cb(region);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Add a new lot from Admin panel
       *
       * @param  {Object}   lot     - lot info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      addLot: function(lot, callback) {
        if (!currentUser.role === 'admin') {
          return new Error("You're not allowed to do that!");
        }

        var cb = callback || angular.noop;

        return Lot.addLot(lot,
          function(data) {
            return cb(lot);
          },
          function(err) {
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
