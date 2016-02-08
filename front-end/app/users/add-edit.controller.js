'use strict';

import _ from 'lodash';

class UserEditController {

    constructor($scope, $state, $stateParams, $log, DataService, ToastService, FileService) {
        'ngInject';

        DataService.DataType = 'users';

        this.injectables = {$scope, $state, $stateParams, $log, DataService, ToastService, FileService};
        this.title = 'Add User';
        this.user = {};
        this.filesToDelete = [];

        this.initUserStateForEdit();
        this.initFileStateForEdit();
    }

    initUserStateForEdit() {
        const { $stateParams, $scope, $log, DataService, ToastService } = this.injectables;

        if ($stateParams._id) {
            this.title = 'Edit User';
            DataService.GetById($stateParams._id)
                .then((user) => {
                    // deep clone user into this.user to prevent unsaved changes staying in the cache
                    Object.assign(this.user, user);
                })
                .catch(function (reason) {
                    $log.error(reason);
                    ToastService.Error('Unable to fetch details for requested user');
                });

            // alert if user is updated/deleted by another user
            $scope.$on('users', (event, { data }) => {
                const _id = data.item && data.item._id || data._id;
                if (_id === this.user._id && _id !== this.updatedId) {
                    ToastService.Error('This user was just ' + data.action + ' by another user');
                }
            });
        }
    }

    initFileStateForEdit() {
        const { $scope, FileService } = this.injectables;

        $scope.$watch('files', () => {
            this.uploadFiles($scope.files);
        });

        $scope.$on('$destroy', () => {
            // delete any unsaved / orphaned files
            if (!this.saved && this.user.files) {
                var unsavedFiles = _.filter(this.user.files, function (file) {
                    return !file.saved
                });
                _.each(unsavedFiles, function (file) {
                    FileService.Delete(file);
                });
            }
        })
    }

    saveUser(user) {
        const { $scope } = this.injectables;

        if ($scope.userForm.$invalid) {
            return;
        }

        if (!user._id) {
            this.createUser(user)
        } else {
            this.updateUser(user);
        }
    }

    updateUser(user) {
        const { $state, $log, DataService, ToastService, FileService } = this.injectables;

        this.updatedId = user._id;
        DataService.Update(user)
            .then(() => {
                this.saved = true;

                // delete any files flagged to be deleted
                if (this.filesToDelete) {
                    _.each(this.filesToDelete, function (file) {
                        FileService.Delete(file);
                    });
                }

                // redirect to users view
                $state.go('users');
                ToastService.Success('User updated');
            })
            .catch(function (error) {
                $log.error(error);
                ToastService.Error(error);
            });
    }

    createUser(user) {
        const { $state, $log, DataService, ToastService } = this.injectables;
        DataService.Create(user)
            .then(() => {
                this.saved = true;
                $state.go('users');
                ToastService.Success('User created');
            })
            .catch(function (error) {
                $log.error(error);
                ToastService.Error(error);
            });
    }

    uploadFiles(files) {
        const { FileService } = this.injectables;

        if (files && files.length) {
            this.user.files = this.user.files || [];
            this.failedUploads = this.failedUploads || [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                file.progress = 0;

                // remove file if it's already in the list to prevent orphaned files on the server
                var existingFile = _.findWhere(this.user.files, {name: file.name});
                if (existingFile) removeFile(existingFile);

                // add file to the list
                this.user.files.push(_.clone(file));

                // upload file to server
                FileService.Upload({
                        url: $scope.apiUrl + '/uploads',
                        file: file
                    })
                    .progress(function (evt) {
                        var file = _.findWhere(this.user.files, {name: evt.config.file.name});
                        if (!file.path) { // path is set on success
                            file.progress = parseInt(100.0 * evt.loaded / evt.total);
                        }
                    })
                    .success(function (data, status, headers, config) {
                        var file = _.findWhere(this.user.files, {name: config.file.name});
                        delete file.progress;
                        file.path = '/uploads/' + data;
                    })
                    .error(function (data, status, headers, config) {
                        var file = _.findWhere(this.user.files, {name: config.file.name});
                        this.user.files = _.without(this.user.files, _.findWhere(this.user.files, file));
                        file.error = status + " " + data;
                        this.failedUploads.push(file);
                    })
            }
        }
    }

    removeFile(file) {
        const { FileService } = this.injectables;

        this.user.files = _.without(this.user.files, _.findWhere(this.user.files, {name: file.name}));

        if (!file.saved) {
            // file not linked to user so delete now
            FileService.Delete(file);
        } else {
            // file linked to user so flag to be deleted on save
            this.filesToDelete.push(file);
        }
    }

}

export default UserEditController;
