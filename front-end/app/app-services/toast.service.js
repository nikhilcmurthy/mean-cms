'use strict';

class ToastService {

    constructor($mdToast) {
        'ngInject';
        this.$mdToast = $mdToast;
    }

    Success(message) {
        this.$mdToast.show(ToastService.Flash('success', message));
    }

    Error(message) {
        this.$mdToast.show(ToastService.Flash('error', message));
    }

    static Flash(type = 'success', message = '') {
        return {
            controller: ($mdToast) => {
                'ngInject';
                this.message = message;
                this.close = $mdToast.hide;
            },
            bindToController: true,
            controllerAs: 'vm',
            templateUrl: 'toast-' + type + '-template.html',
            hideDelay: 6000,
            locals: { message }
        };
    }
}

export default ToastService;
