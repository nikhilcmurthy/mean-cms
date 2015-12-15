/*
    Generic data service for accessing api and caching results
*/
(function () {
    'use strict';

    angular
        .module('app')
        .factory('DataService', Service);

    function Service($rootScope, $http, $q, Cache, Socket) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll(type) {
            return function () {
                var deferred = $q.defer();

                if (!Cache.get(type)) {
                    // get data from api
                    $http.get($rootScope.apiUrl + '/' + type)
                        .then(function (res) {
                            // cache data then return
                            Cache.put(type, res.data);
                            deferred.resolve(res.data);
                        })
                        .catch(function (res) {
                            deferred.reject(res.data);
                        });
                } else {
                    // return data from cache
                    deferred.resolve(Cache.get(type));
                }

                // subscribe to any changes to this type
                Socket.On(type, function (data) {
                    GetAll(type)().then(function (items) {
                        switch (data.action) {
                            case 'created':
                                // add item to cache
                                items.push(data.item);
                                Cache.put(type, items);
                                break;
                            case 'updated':
                                // update item in cache
                                var index = _.findIndex(items, { _id: data.item._id })
                                items[index] = data.item;
                                Cache.put(type, items);
                                break;
                            case 'deleted':
                                // remove item from cache
                                items = _.without(items, _.findWhere(items, { _id: data._id }));
                                Cache.put(type, items);
                                break
                        }

                        // broadcast event to controllers to update views
                        $rootScope.$broadcast(type, data);
                    });
                });

                return deferred.promise;
            }
        }

        function GetById(type) { 
            return function (_id) {
                return GetAll(type)().then(function (items) {
                    return _.findWhere(items, { _id: _id });
                });
            }
        }

        function Create(type) {
            return function (item) {
                var deferred = $q.defer();

                $http.post($rootScope.apiUrl + '/' + type, item)
                    .then(function (res) { deferred.resolve(); })
                    .catch(function (res) { deferred.reject(res.data); });

                return deferred.promise;
            }
        }

        function Update(type) {
            return function (item) {
                var deferred = $q.defer();

                $http.put($rootScope.apiUrl + '/' + type + '/' + item._id, item)
                    .then(function (res) { deferred.resolve(); })
                    .catch(function (res) { deferred.reject(res.data); });

                return deferred.promise;
            }
        }

        function Delete(type) {
            return function (_id) {
                var deferred = $q.defer();

                $http.delete($rootScope.apiUrl + '/' + type + '/' + _id)
                    .then(function (res) { deferred.resolve(); })
                    .catch(function (res) { deferred.reject(res.data); });

                return deferred.promise;
            }
        }
    }

})();
