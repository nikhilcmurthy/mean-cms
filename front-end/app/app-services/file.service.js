'use strict';

class FileService {

    constructor($rootScope, $http, Upload) {
        'ngInject';

        this.injectables = { $rootScope, $http };
        this.Upload = Upload.upload;
    }

    DeleteFile(file) {
        const { $http, $rootScope } = this.injectables;
        $http.delete(`${$rootScope.apiUrl}${file.path}`);
    }
}

export default FileService;
