angular.module('app').config([
  '$stateProvider',
  '$locationProvider',

  function($stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/home.html'
      });

    $stateProvider
      .state('upload', {
        url: '/upload',
        templateUrl: '/upload.html'
      })

    $stateProvider
      .state('show', {
        url: '/show',
        templateUrl: '/show.html'
      })



}]);