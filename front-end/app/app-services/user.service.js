(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service(DataService) {
        var type = 'users';
        var service = {};

        service.GetAll = DataService.GetAll(type);
        service.GetById = DataService.GetById(type);
        service.Create = DataService.Create(type);
        service.Update = DataService.Update(type);
        service.Delete = DataService.Delete(type);

        return service;
    }

})();
