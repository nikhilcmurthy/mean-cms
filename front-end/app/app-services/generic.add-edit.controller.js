(function () {
    'use strict';

    angular
        .module('app')
        .controller('Generic.AddEditController', Controller);

    function Controller($scope, $state, $stateParams, DataService, ToastService) {
        var vm = this;
        var dataType = $stateParams.dataType;
        var service = DataService(dataType);

        vm.item = {};
        vm.saveItem = saveItem;

        initController();

        function initController() {
            if ($stateParams._id) {
                service.GetById($stateParams._id)
                    .then(function (item) {
                        // deep clone item into vm.item to prevent unsaved changes staying in the cache
                        $.extend(true, vm.item, item);
                    });

                // alert if item is updated/deleted by another user
                $scope.$on(dataType, function (event, data) {
                    var _id = data.item && data.item._id || data._id;
                    if (_id === vm.item._id && _id !== vm.updatedId) {
                        ToastService.Error('This item was just ' + data.action + ' by another user');
                    }
                });
            }
        }

        function saveItem(item) {
            if ($scope.form.$invalid) {
                return;
            }

            if (!item._id) {
                createItem()
            } else {
                updateItem();
            }

            function createItem() {
                service.Create(item)
                    .then(function () {
                        vm.saved = true;
                        $state.go('generic', { dataType: dataType });
                        ToastService.Success('Item created');
                    })
                    .catch(function (error) {
                        ToastService.Error(error);
                    });
            }

            function updateItem() {
                vm.updatedId = item._id;
                service.Update(item)
                    .then(function () {
                        vm.saved = true;

                        // redirect to item list view
                        $state.go('generic', { dataType: dataType });
                        ToastService.Success('Item updated');
                    })
                    .catch(function (error) {
                        ToastService.Error(error);
                    });
            }
        }
    }

})();