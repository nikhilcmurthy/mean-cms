'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import services from './../app-services';
import UserConfig from './main.config';
import UserMainController from './main.controller';

const userModule = angular.module('app.users', [uirouter, services]);

userModule
    .config(UserConfig)
    .controller('UserMainController', UserMainController);

export default userModule.name;
