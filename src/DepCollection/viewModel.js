import {
    DependenceManager
} from './dependenceManager';

export default class ViewModel {
    _NAME_SPACE = '';
    OBSERVABLE_OBJECT = {};
    state = {};
    actions = {};

    constructor(nameSpace, viewModelParameterObject, observableObject) {
        if (!viewModelParameterObject) {
            console.error('viewModelParameterObject is undefined');
            return;
        }
        this._NAME_SPACE = nameSpace ? nameSpace : '';

        if (!viewModelParameterObject.store) {
            console.error('viewModelParameterObject.store is undefined');
            return;
        }

        if (!observableObject) {
            console.error('observableObject is undefined');
            return;
        }

        this.state = this._collectDependence(viewModelParameterObject.store);
        _bindActions(viewModelParameterObject.actions);
    }

    _collectDependence(store) {
        const viewModelState = {};
        const keys = Object.keys(store);
        keys.forEach(key => {
            this._createDependence(key, store[key].handler, store[key].onComputedUpdate);

            viewModelState = {
                ...{
                    key: this.OBSERVABLE_OBJECT[key]
                }
            };
        });
        return viewModelState;
    }

    _createDependence(key, handler, onComputedUpdate) {
        new DependenceManager(this.OBSERVABLE_OBJECT, key, handler, onComputedUpdate);
    }

    _bindActions(actions) {
        Object.keys(actions).forEach(type => {
            const action = actions[type];
            const callback = payload => {
                action.call(this, this.observedModel, payload);
            };
            this.actions[type] = callback;
        });
    }

    dispatch = (type, payload) => {
        const action = this.actions[type];

        if (!action || typeof action !== 'function') {
            throw new Error(`Can not find action of ${type}`);
        }
        action(payload);
    };
}