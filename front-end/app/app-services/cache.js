(function () {
    'use strict';

    angular
        .module('app')
        .factory('Cache', Service);

    function Service($cacheFactory) {
        return $cacheFactory('cache');
    }

})();
