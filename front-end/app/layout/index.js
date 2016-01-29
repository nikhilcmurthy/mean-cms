'use strict';

import angular from 'angular';
import TabsController from './tabs.controller';

const tabsModule = angular.module('app.tabs', []);

tabsModule.controller('TabsController', TabsController);

export default tabsModule.name;
