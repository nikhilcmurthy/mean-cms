(function () {
    'use strict';

    angular
        .module('app')
        .factory('FileService', Service);

    function Service($rootScope, $http, Upload) {
        var service = {};

        service.Upload = Upload.upload;
        service.Delete = deleteFile;

        return service;

        function deleteFile(file) {
            $http.delete($rootScope.apiUrl + file.path);
        }
    }

})();
