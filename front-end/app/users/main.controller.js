(function () {
    'use strict';

    angular
        .module('app')
        .controller('Users.MainController', Controller);

    function Controller($scope, DataService) {
        var vm = this;
        var UserService = DataService('users');

        vm.users = [];
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            loadUsers();

            // reload users on 'users' event
            $scope.$on('users', loadUsers);
        }

        function loadUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.users = users;
                });
        }

        function deleteUser(_id) {
            UserService.Delete(_id);
        }
    }

})();