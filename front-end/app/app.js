(function () {
    'use strict';

    angular
        .module('app', ['ngMaterial', 'ngAnimate', 'ngMessages', 'ui.router', 'ngFileUpload', 'wj'])
        .config(config)
        .run(run);

    function config($locationProvider, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $mdThemingProvider) {
        $locationProvider.html5Mode(true);

        // default route
        $urlRouterProvider.otherwise("/");

        // make trailing slash in urls optional
        $urlMatcherFactoryProvider.strictMode(false)

        $stateProvider
            .state('overview', {
                url: '/',
                templateUrl: 'overview/index.html',
                controller: 'Overview.IndexController',
                controllerAs: 'vm',
                data: { selectedTab: 0 }
            })
            .state('content', {
                url: '/content',
                templateUrl: 'content/main.html',
                controller: 'Content.IndexController',
                data: { selectedTab: 1 }
            })
            .state('users', {
                url: '/users',
                templateUrl: 'users/index.html',
                controller: 'Users.IndexController',
                controllerAs: 'vm',
                data: { selectedTab: 1 }
            })
                .state('users.add', {
                    url: '/users/add',
                    templateUrl: 'users/add-edit.html',
                    controller: 'Users.AddEditController',
                    controllerAs: 'vm'
                })
                .state('users.edit', {
                    url: '/users/edit/:_id',
                    templateUrl: 'users/add-edit.html',
                    controller: 'Users.AddEditController',
                    controllerAs: 'vm'
                });
    }

    function run($rootScope, $http) {
        $rootScope.apiUrl = 'http://localhost:3001';

        $http.get('/token').then(function (res) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data;
        });
    }

})();