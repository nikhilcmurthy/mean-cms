'use strict';

import _ from 'lodash';

class TabsController {
    constructor($rootScope) {
        'ngInject';

        this.selectedTab = 0;
        this.tabs = [
            { name: 'Overview', path: '/' },
            { name: 'Users', path: '/users' },
            { name: 'Services', path: '/services' },
            { name: 'Staff', path: '/staff' },
            { name: 'News', path: '/news' },
            { name: 'Events', path: '/events' }
        ];

        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams) => {
            ({ data : { selectedTab : this.selectedTab = this.getTabFromParams(toParams) } } = toState);
        });
    }

    getTabFromParams(toParams) {
        if (toParams.dataType) {
            _.find(this.tabs, function (tab, index) {
                if (toParams.dataType === tab.name.toLowerCase()) {
                    this.selectedTab = index;
                }
            });
        }
    }
}

export default TabsController;
