'use strict';

angular.module('wrongspotApp')
  .controller('AdminCtrl', function ($scope, $http, $location,
                                      Auth, User, Region, Lot, socket) {

    $scope.isAdmin = Auth.isAdmin();
    if (!$scope.isAdmin) {
      return $location.path('/');
    }

    $scope.isReady = false;
    $scope.lotRegion = {};

    socket.socket.emit('request:userRoles');

    socket.socket.on('message:userRoles', function (data) {
      $scope.userRoles = data.userRoles;
      $scope.userForm.role = $scope.userRoles[0];
      $scope.isReady = true;
    });

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    socket.syncUpdates('user', $scope.users);

    // Use the Region $resource to fetch all regions
    $scope.regions = Region.query();
    socket.syncUpdates('region', $scope.regions);

    // Use the Lot $resource to fetch all lots
    $scope.lots = Lot.query(function(data) {
        angular.forEach($scope.lots, function(lot) {
          if (lot.region) {
            Region.get({id:lot.region}, function(region) {
              $scope.lotRegion[lot._id] = region;
            });
          } else {
            $scope.lotRegion[lot._id] = {name:"None"};
          }
        });
    });
    socket.syncUpdates('lot', $scope.lots, function(data, data2) {
      $scope.lotRegion = {};
      angular.forEach($scope.lots, function(lot) {
        if (lot.region) {
          Region.get({id:lot.region}, function(region) {
            $scope.lotRegion[lot._id] = region;
          });
        } else {
          $scope.lotRegion[lot._id] = {name:"None"};
        }
      });
    });

    $scope.userForm = {
      name: '',
      email: '',
      password: '',
      role: ''
    };

    $scope.regionForm = {
      name: '',
      info: ''
    };

    $scope.lotForm = {
      name: '',
      info: '',
      region: null
    };

    $scope.status = "Ready";
    var originalUser = angular.copy($scope.userForm);
    var originalRegion = angular.copy($scope.regionForm);
    var originalLot = angular.copy($scope.lotForm);

    // User tab related functions
    function resetUserForm(form) {
      $scope.userFormSubmitted = false;
      $scope.userForm = angular.copy(originalUser);
      form.$setPristine();
    }

    $scope.deleteUser = function(user) {
      var currentUser = Auth.getCurrentUser();

      if (user.email === currentUser.email) {
        return $scope.status = "You can't delete yourself!";
      }
      $http.delete('/api/users/' + user._id)
        .then(function() {
          $scope.status = "User successfully removed.";
        }).catch(function(err) {
          $scope.status = err;
        });
    };

    $scope.addUser = function(form) {
      $scope.userFormSubmitted = true;
      $scope.status = "Ready";

      if(form.$valid) {
        Auth.addUser({
          name: $scope.userForm.name,
          email: $scope.userForm.email,
          password: $scope.userForm.password,
          role: $scope.userForm.role
        })
        .then( function() {
          $scope.status = "User successfully created.";
        })
        .then( function() {
          resetUserForm(form);
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    // Region tab related functions
    function resetRegionForm(form) {
      $scope.regionFormSubmitted = false;
      $scope.regionForm = angular.copy(originalRegion);
      form.$setPristine();
    }

    $scope.deleteRegion = function(region) {
      $http.delete('/api/regions/' + region._id)
        .then(function() {
          $scope.status = "Region successfully removed.";
        }).catch(function(err) {
          $scope.status = err;
        });
    };

    $scope.addRegion = function(form) {
      $scope.regionFormSubmitted = true;
      $scope.status = "Ready";

      if(form.$valid) {
        Auth.addRegion({
          name: $scope.regionForm.name,
          info: $scope.regionForm.info
        })
        .then( function() {
          $scope.status = "Region successfully created.";
        })
        .then( function() {
          resetRegionForm(form);
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    // Lot tab related functions
    function resetLotForm(form) {
      $scope.lotFormSubmitted = false;
      $scope.lotForm = angular.copy(originalLot);
      form.$setPristine();
    }

    $scope.deleteLot = function(lot) {
      $http.delete('/api/lots/' + lot._id)
        .then(function() {
          $scope.status = "Lot successfully removed.";
        }).catch(function(err) {
          $scope.status = err;
        });
    };

    $scope.addLot = function(form) {
      $scope.lotFormSubmitted = true;
      $scope.status = "Ready";

      if(form.$valid) {
        Auth.addLot({
          name: $scope.lotForm.name,
          info: $scope.lotForm.info,
          region: $scope.lotForm.region
        })
        .then( function() {
          $scope.status = "Lot successfully created.";
        })
        .then( function() {
          resetLotForm(form);
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('user');
      socket.unsyncUpdates('lot');
    });
  })
  .filter('capitalize', function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    }
  });
