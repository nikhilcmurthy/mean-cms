﻿(function () {
    'use strict';

    angular
        .module('app', ['ngMaterial', 'md.data.table', 'ngAnimate', 'ngMessages', 'ui.router', 'ngFileUpload', 'wj'])
        .config(config)
        .run(run);

    function config($locationProvider, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $mdThemingProvider) {
        $locationProvider.html5Mode(true);

        // default route
        $urlRouterProvider.otherwise("/");

        // make trailing slash in urls optional
        $urlMatcherFactoryProvider.strictMode(false);

        $stateProvider
            .state('overview', {
                url: '/',
                templateUrl: 'overview/main.html',
                controller: 'Overview.MainController',
                controllerAs: 'vm',
                data: { selectedTab: 0 }
            })
            .state('users', {
                url: '/users',
                templateUrl: 'users/main.html',
                controller: 'Users.MainController',
                controllerAs: 'vm',
                data: { selectedTab: 1 }
            })
                .state('users.add', {
                    url: '/add',
                    templateUrl: 'users/add-edit.html',
                    controller: 'Users.AddEditController',
                    controllerAs: 'vm'
                })
                .state('users.edit', {
                    url: '/edit/:_id',
                    templateUrl: 'users/add-edit.html',
                    controller: 'Users.AddEditController',
                    controllerAs: 'vm'
                })
        .state('generic', {
            url: '/:dataType',
            templateUrl: function ($stateParams) {
                return $stateParams.dataType + '/main.html';
            },
            controller: 'Generic.MainController',
            controllerAs: 'vm'
        })
            .state('generic.add', {
                url: '/add',
                templateUrl: function ($stateParams) {
                    return $stateParams.dataType + '/add-edit.html';
                },
                controller: 'Generic.AddEditController',
                controllerAs: 'vm'
            })
            .state('generic.edit', {
                url: '/edit/:_id',
                templateUrl: function ($stateParams) {
                    return $stateParams.dataType + '/add-edit.html';
                },
                controller: 'Generic.AddEditController',
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