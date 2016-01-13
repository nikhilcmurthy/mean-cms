(function () {
    'use strict';

    angular
        .module('app')
        .controller('Users.AddEditController', Controller);

    function Controller($scope, $state, $stateParams, $timeout, UserService, ToastService, FileService) {
        var vm = this;

        vm.title = 'Add User';
        vm.user = {};
        vm.saveUser = saveUser;
        vm.removeFile = removeFile;

        initController();

        function initController() {
            if ($stateParams._id) {
                vm.title = 'Edit User';
                UserService.GetById($stateParams._id)
                    .then(function (user) {
                        // deep clone user into vm.user to prevent unsaved changes staying in the cache
                        $.extend(true, vm.user, user);
                    });

                // alert if user is updated/deleted by another user
                $scope.$on('users', function (event, data) {
                    var _id = data.item && data.item._id || data._id;
                    if (_id === vm.user._id && _id !== vm.updatedId) {
                        ToastService.Error('This user was just ' + data.action + ' by another user');
                    }
                });
            }

            $scope.$watch('files', function () {
                uploadFiles($scope.files);
            });

            $scope.$on('$destroy', function () {
                // delete any unsaved / orphaned files
                if (!vm.saved && vm.user.files) {
                    var unsavedFiles = _.filter(vm.user.files, function (file) { return !file.saved });
                    _.each(unsavedFiles, function (file) {
                        FileService.Delete(file);
                    });
                }
            })
        }

        function saveUser(user) {
            if ($scope.userForm.$invalid) {
                return;
            }

            if (!user._id) {
                createUser()
            } else {
                updateUser();
            }

            function createUser() {
                UserService.Create(user)
                    .then(function () {
                        vm.saved = true;
                        $state.go('users');
                        ToastService.Success('User created');
                    })
                    .catch(function (error) {
                        ToastService.Error(error);
                    });
            }

            function updateUser() {
                vm.updatedId = user._id;
                UserService.Update(user)
                    .then(function () {
                        vm.saved = true;

                        // delete any files flagged to be deleted
                        if (vm.filesToDelete) {
                            _.each(vm.filesToDelete, function (file) {
                                FileService.Delete(file);
                            });
                        }

                        // redirect to users view
                        $state.go('users');
                        ToastService.Success('User updated');
                    })
                    .catch(function (error) {
                        ToastService.Error(error);
                    });
            }
        }

        function uploadFiles(files) {
            if (files && files.length) {
                vm.user.files = vm.user.files || [];
                vm.failedUploads = vm.failedUploads || [];
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    file.progress = 0;

                    // remove file if it's already in the list to prevent orphaned files on the server
                    var existingFile = _.findWhere(vm.user.files, { name: file.name });
                    if (existingFile) removeFile(existingFile);

                    // add file to the list
                    vm.user.files.push(_.clone(file));

                    // upload file to server
                    FileService.Upload({
                            url: $scope.apiUrl + '/uploads',
                            file: file
                        })
                        .progress(function (evt) {
                            var file = _.findWhere(vm.user.files, { name: evt.config.file.name });
                            if (!file.path) { // path is set on success
                                file.progress = parseInt(100.0 * evt.loaded / evt.total);
                            }
                        })
                        .success(function (data, status, headers, config) {
                            var file = _.findWhere(vm.user.files, { name: config.file.name });
                            delete file.progress;
                            file.path = '/uploads/' + data;
                        })
                        .error(function (data, status, headers, config) {
                            var file = _.findWhere(vm.user.files, { name: config.file.name });
                            vm.user.files = _.without(vm.user.files, _.findWhere(vm.user.files, file));
                            file.error = status + " " + data;
                            vm.failedUploads.push(file);
                        })
                }
            }
        }

        function removeFile(file) {
            vm.user.files = _.without(vm.user.files, _.findWhere(vm.user.files, { name: file.name }));

            if (!file.saved) {
                // file not linked to user so delete now
                FileService.Delete(file);
            } else {
                // file linked to user so flag to be deleted on save
                vm.filesToDelete = vm.filesToDelete || [];
                vm.filesToDelete.push(file);
            }
        }
    }

})();