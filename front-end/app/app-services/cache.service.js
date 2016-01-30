'use strict';

const _localCache = new WeakMap();

class CacheService {

    constructor($cacheFactory) {
        'ngInject';

        _localCache.set(this, $cacheFactory('cms-cache'));
    }

    Set(key, value = {}) {
        _localCache.get(this).put(key, value);
    }

    Get(key = '') {
        return _localCache.get(this).get(key);
    }
}

export default CacheService;
