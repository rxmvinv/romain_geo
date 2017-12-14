(function () {
  angular.module('romainGeo', ['ngResource','ngRoute', 'ui.router'])
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', config]);

  function config ($locationProvider, $stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('main', {
          url: '/',
          controller: 'mainCtrl',
          templateUrl: 'views/main.view.html',
          controllerAs: 'vm'
        })
        .state('main.country', {
          url: '{country}',
          controller: 'mainCtrl',
          templateUrl: 'views/main.view.html',
          controllerAs: 'vm'
        })
        .state('main.state', {
          url: '{country}/{state}',
          controller: 'mainCtrl',
          templateUrl: 'views/main.view.html',
          controllerAs: 'vm'
        });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
})();
