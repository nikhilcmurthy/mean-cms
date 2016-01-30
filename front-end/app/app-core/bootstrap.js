'use strict';

import 'angular-material/angular-material.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'angular-material-data-table/dist/md-data-table.css';
import './../app-content/app.less';

import overviewModule from './../overview';
import tabsModule from './../layout';
import servicesModule from './../app-services';
import cmsModuleConfigurator from './config';

const app = angular.module('app', [
    'ngMaterial',
    'ngAnimate',
    'ngMessages',
    'ui.router',
    'ngFileUpload',
    'md.data.table',
    overviewModule,
    tabsModule,
    servicesModule
]);

cmsModuleConfigurator(app);
