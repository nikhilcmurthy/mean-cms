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
        if (!_.contains(this.$rootScope.socketListeners, eventName)) {
            this.$rootScope.socketListeners.push(eventName);
            this.socket.on(eventName, (...args) => {
                this.$rootScope.$apply(() => {
                    callback.apply(this.socket, args);
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
