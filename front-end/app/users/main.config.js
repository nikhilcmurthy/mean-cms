'use strict';

class UserConfig {

    static configState($stateProvider) {
        'ngInject';

        $stateProvider
            .state('users', {
                url: '/users',
                template: require('./main.html'),
                controller: 'UserMainController',
                controllerAs: 'vm',
                data: {
                    selectedTab: 1,
                    selectedTabName: 'users'
                }
            })
                .state('users.add', {
                    url: '/add',
                    template: require('./add-edit.html'),
                    controller: 'UserEditController',
                    controllerAs: 'vm'
                })
                .state('users.edit', {
                    url: '/edit/:_id',
                    template: require('./add-edit.html'),
                    controller: 'UserEditController',
                    controllerAs: 'vm'
                });

    }
}

export default UserConfig.configState;
