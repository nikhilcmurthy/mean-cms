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
            });
    }
}

export default UserConfig.configState;
