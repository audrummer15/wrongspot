'use strict';

angular.module('wrongspotApp')
  .controller('AdminCtrl', function ($scope, $http, $location, Auth, User) {

    $scope.isAdmin = Auth.isAdmin();
    if (!$scope.isAdmin) {
      return $location.path('/');
    }

    // Use the User $resource to fetch all users
    $scope.users = User.query();

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

      console.log(user, currentUser);
      if (user.email === currentUser.email) {
        return $scope.status = "You can't delete yourself!";
      }
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
          $scope.status = "User successfully removed.";
        }
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
          $scope.users = User.query();
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
  });
