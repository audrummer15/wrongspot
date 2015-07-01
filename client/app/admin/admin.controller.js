'use strict';

angular.module('wrongspotApp')
  .controller('AdminCtrl', function ($scope, $http, $location, Auth, User, socket) {

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

    $scope.user = {
      name: '',
      email: '',
      password: '',
      role: 'user'
    };

    $scope.status = "Ready";
    var originalUser = angular.copy($scope.user);

    function resetForm() {
      $scope.submitted = false;
      $scope.user = angular.copy(originalUser);
      $scope.form.$setPristine();
    }

    $scope.delete = function(user) {
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
      $scope.submitted = true;
      $scope.status = "Ready";

      if(form.$valid) {
        Auth.addUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          role: $scope.user.role
        })
        .then( function() {
          $scope.status = "User successfully created.";
        })
        .then( function() {
          resetForm();
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
      socket.unsyncUpdates('thing');
    });
  })
  .filter('capitalize', function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    }
  });
