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
            { name: 'Users', path: '/users' },
            { name: 'Services', path: '/services' },
            { name: 'Staff', path: '/staff' },
            { name: 'News', path: '/news' },
            { name: 'Events', path: '/events' },
        ];

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.data && toState.data.selectedTab) {
                vm.selectedTab = toState.data.selectedTab;
            } else if (toParams.dataType) {
                _.find(vm.tabs, function (tab, index) {
                    if (toParams.dataType === tab.name.toLowerCase()) {
                        vm.selectedTab = index;
                    }
                });
            }
        });
    }

})();