'use strict';

import _ from 'lodash';

class SocketService {

    constructor($rootScope) {
        'ngInject';

        this.socket = io.connect($rootScope.apiUrl);
        this.$rootScope = $rootScope;
        this.$rootScope.socketListeners = [];
    }

    On(eventName, callback) {
        if (!this.$rootScope.socketListeners.find(function(name) {
                return name === eventName;
            })) {
            this.$rootScope.socketListeners.push(eventName);
            this.socket.on(eventName, (...args) => {
                this.$rootScope.$apply(() => {
                    callback.apply(null, args);
                });
            });
        }
    }

    Emit(eventName, data, callback) {
        this.socket.emit(eventName, data, (...args) => {
            this.$rootScope.$apply(() => {
                if (callback) {
                    callback.apply(this.socket, args);
                }
            });
        });
    }

}

export default SocketService;
