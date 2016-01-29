'use strict';

export default function(cmsModule) {

    cmsModule
        .config(cmsAppConfigurator)
        .run(cmsAppRunConfigurator);

    function cmsAppConfigurator($locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        'ngInject';

        $locationProvider.html5Mode(true);

        // default route
        $urlRouterProvider.otherwise("/");

        // make trailing slash in urls optional
        $urlMatcherFactoryProvider.strictMode(false);
    }

    function cmsAppRunConfigurator($rootScope, $http) {
        'ngInject';

        $rootScope.apiUrl = 'http://localhost:3001';

        $http.get('/token').then(function (res) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data;
        });
    }

}
