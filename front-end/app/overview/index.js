'use strict';

// even though angular will be available at this
// point as a global variable, it is a good practice
// to clearly state module dependencies
//
// webpack will bundle the module only once
import angular from 'angular';

// dependent modules
import uirouter from 'angular-ui-router';

import OverviewController from './main.controller';
import OverviewConfig from './main.config';

const overviewModule = angular.module('app.overview', [uirouter]);

overviewModule
    .config(OverviewConfig)
    .controller('OverviewController', OverviewController);

// only export module name
export default overviewModule.name;
