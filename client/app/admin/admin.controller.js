'use strict';

angular.module('wrongspotApp')
  .controller('AdminCtrl', function ($scope, $http, $location,
                                      Auth, User, Lot, socket) {

    $scope.isAdmin = Auth.isAdmin();
    if (!$scope.isAdmin) {
      return $location.path('/');
    }

    $scope.isReady = false;

    socket.socket.emit('request:userRoles');

    socket.socket.on('message:userRoles', function (data) {
      $scope.userRoles = data.userRoles;
      $scope.isReady = true;
    });

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    socket.syncUpdates('user', $scope.users);

    // Use the Lot $resource to fetch all lots
    $scope.lots = Lot.query();
    socket.syncUpdates('lot', $scope.lots);

    $scope.userForm = {
      name: '',
      email: '',
      password: '',
      role: 'user'
    };

    $scope.lotForm = {
      name: '',
      info: ''
    };

    $scope.status = "Ready";
    var originalUser = angular.copy($scope.userForm);
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

    // Lot tab related functions
    function resetLotForm() {
      $scope.lotFormSubmitted = false;
      $scope.lotForm = angular.copy(originalLot);
      $scope.htmlLotForm.$setPristine();
    }

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
