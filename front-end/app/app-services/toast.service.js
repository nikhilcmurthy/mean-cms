(function () {
    'use strict';

    angular
        .module('app')
        .factory('ToastService', Service);

    function Service($mdToast) {
        var service = {};

        service.Success = Flash('success');
        service.Error = Flash('error');

        return service;

        function Flash(type) {
            return function (message) {
                $mdToast.show({
                    controller: Controller,
                    controllerAs: 'vm',
                    templateUrl: 'toast-' + type + '-template.html',
                    hideDelay: 6000,
                });

                function Controller() {
                    var vm = this;

                    vm.message = message;
                    vm.close = $mdToast.hide;
                }
            }
        }
    }

})();