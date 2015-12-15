(function () {
    'use strict';

    angular
        .module('app')
        .controller('Users.IndexController', Controller);

    function Controller($scope, UserService, $timeout, $mdDialog) {
        var vm = this;

        vm.users = [];
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            // wait for flexgrid to initialise before loading users
            var watch = $scope.$watch('vm.flexgrid', function () {
                if (vm.flexgrid) {
                    loadUsers();

                    // reload users on 'users' event
                    $scope.$on('users', function () { loadUsers(); });

                    // unbind watch
                    watch();
                }
            });
        }

        function loadUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.users = users;
                    vm.flexgrid.collectionView.refresh();
                });
        }

        function deleteUser(_id) {
            UserService.Delete(_id)
                .then(function () {
                    loadUsers();
                });
        }
    }

})();