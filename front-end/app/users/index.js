'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import services from './../app-services';
import UserConfig from './main.config';
import UserMainController from './main.controller';
import UserEditController from './add-edit.controller';

const userModule = angular.module('app.users', [uirouter, services]);

userModule
    .config(UserConfig)
    .controller('UserMainController', UserMainController)
    .controller('UserEditController', UserEditController);

export default userModule.name;
