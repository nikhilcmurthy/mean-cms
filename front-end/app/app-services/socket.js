(function () {
    'use strict';

    angular
        .module('app')
        .factory('Socket', Service);

    function Service($rootScope) {
        var socket = io.connect($rootScope.apiUrl);
        var service = {};
        
        service.On = On;
        service.Emit = Emit;

        $rootScope.socketListeners = [];

        return service;

        function On(eventName, callback) {
            if (!_.contains($rootScope.socketListeners, eventName)) {
                $rootScope.socketListeners.push(eventName);
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            }
        }

        function Emit(eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    }

})();
