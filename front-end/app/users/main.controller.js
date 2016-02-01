'use strict';

class UserMainController {

    constructor($scope, $log, DataService) {
        'ngInject';

        DataService.DataType = 'users';

        this.injectables = { $scope, $log, DataService };
        this.users = [];
        this.loadUsers();

        $scope.$on('users', this.loadUsers);
    }

    loadUsers() {
        const { DataService, $log } = this.injectables;
        DataService.GetAll()
            .then((users) => {
                this.users = users;
            })
            .catch((reason) => {
                $log.error(reason);
            });
    }

    deleteUser(id) {
        const { DataService } = this.injectables;
        DataService.Delete(id);
    }
}

export default UserMainController;
