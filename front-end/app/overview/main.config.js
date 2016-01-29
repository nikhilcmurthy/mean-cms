'use strict';

class OverviewConfig {

    static configState($stateProvider) {
        'ngInject';

        $stateProvider
            .state('overview', {
                url: '/',
                template: require('./main.html'),
                controller: 'OverviewController',
                controllerAs: 'vm',
                data: {
                    selectedTab: 0,
                    selectedTabName: 'overview'
                }
            });
    }
}

export default OverviewConfig.configState;
