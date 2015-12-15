(function () {
    'use strict';

    angular
        .module('app')
        .controller('TabsController', Controller);

    function Controller($rootScope) {
        var vm = this;

        vm.selectedTab = 0;
        vm.tabs = [
            { name: 'Overview', path: '/' },
            { name: 'Users', path: '/users' }
        ];

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            vm.selectedTab = toState.data.selectedTab;
        });
    }

})();