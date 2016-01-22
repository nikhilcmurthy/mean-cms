(function () {
    'use strict';

    angular
        .module('app')
        .controller('Generic.MainController', Controller);

    function Controller($scope, $state, $stateParams, DataService) {
        var vm = this;
        var dataType = $stateParams.dataType;
        var service = DataService(dataType);

        vm.dataType = dataType;
        vm[dataType] = [];
        vm.deleteItem = deleteItem;

        initController();

        function initController() {
            loadItems();

            // reload items on 'dataType' event
            $scope.$on(dataType, loadItems);
        }

        function loadItems() {
            service.GetAll()
                .then(function (items) {
                    vm[dataType] = items;
                });
        }

        function deleteItem(_id) {
            service.Delete(_id);
        }
    }

})();