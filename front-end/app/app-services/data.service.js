/*
    Generic data service for accessing api and caching results
*/
'use strict';

import _ from 'lodash';

const _dataType = new WeakMap();

class DataService {

    constructor($rootScope, $http, CacheService, SocketService) {
        'ngInject';

        this.injectables = {
            $rootScope,
            $http,
            CacheService,
            SocketService
        };

        _dataType.set(this, '');
    }

    set DataType(value) {
        _dataType.set(this, value);
        this.RegisterSockets();
    }

    GetAll() {
        return new Promise(function (resolve, reject) {
            const { $rootScope, $http, CacheService } = this.injectables;
            let cachedData = CacheService.Get(_dataType.get(this));
            if (cachedData) {
                resolve(cachedData);
            } else {
                $http.get(`${$rootScope.apiUrl}/${_dataType.get(this)}`)
                    .then(function (res) {
                        resolve(res.data);
                    })
                    .catch(function (reason) {
                        reject(reason);
                    });
            }
        });
    }

    RegisterSockets() {
        const { SocketService, CacheService, $rootScope } = this.injectables;
        const dataType = _dataType.get(this);

        // subscribe to any changes to this type
        SocketService.On(dataType, function (data) {
            this.GetAll()
                .then(function (items) {
                switch (data.action) {
                    case 'created':
                        // add item to cache
                        items.push(data.item);
                        CacheService.Set(dataType, items);
                        break;
                    case 'updated':
                        // update item in cache
                        var index = _.findIndex(items, { _id: data.item._id })
                        items[index] = data.item;
                        CacheService.Set(dataType, items);
                        break;
                    case 'deleted':
                        // remove item from cache
                        items = _.without(items, _.findWhere(items, { _id: data._id }));
                        CacheService.Set(dataType, items);
                        break
                }

                // broadcast event to controllers to update views
                $rootScope.$broadcast(dataType, data);
            });
        });
    }

    GetById(id) {
        this.GetAll()
            .then(function (items) {
                return _.findWhere(items, {_id: id});
            });
    }

    Create(item) {
        const { $http, $rootScope } = this.injectables;
        const dataType = _dataType.get(this);

        console.log('posting', $rootScope.apiUrl + '/' + type);
        console.log('item', item);

        return new Promise(function (resolve, reject) {
            $http.post(`${$rootScope.apiUrl}/${dataType}`, item)
                .then(function (res) {
                    resolve(res);
                })
                .catch(function (res) {
                    reject(res.data);
                });
        });
    }

    Update(item) {
        const { $http, $rootScope } = this.injectables;
        const dataType = _dataType.get(this);

        return new Promise(function (resolve, reject) {
            $http.put(`${$rootScope.apiUrl}/${dataType}/${item._id}`, item)
                .then(function (res) {
                    resolve(res);
                })
                .catch(function (res) {
                    reject(res.data);
                });
        });
    }

    Delete(id) {
        const { $http, $rootScope } = this.injectables;
        const dataType = _dataType.get(this);

        return new Promise(function (resolve, reject) {
            $http.delete(`${$rootScope.apiUrl}/${dataType}/${id}`)
                .then(function (res) {
                    resolve(res);
                })
                .catch(function (res) {
                    reject(res.data);
                });
        });
    }

}

export default DataService;
