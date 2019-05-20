"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("./event");
const Core_1 = require("../Core");
const Core_2 = require("../Core");
class UC_ViewModel extends event_1.default {
    constructor(vmParam) {
        super();
        this.actions = {};
        this.reactiveView = null;
        this.store = {};
        this.viewModelParams = { state: {} };
        this.observedModel = {};
        this.dispatch = (type, payload) => {
            if (!type || type === '') {
                return;
            }
            /*
             * 判断dispatch对象是否为本viewmodel的action？
             * 若是则直接处理；
             * 若不是则调用builder中的crossCall方法处理（隐式处理所有跨模块通信）
             */
            if (type.split('/').length === 1) {
                this._doAction(type, payload);
            }
            else {
                const dispatchTarget = type.split('/'), targetBuilderName = dispatchTarget[0], targetBuilderAction = dispatchTarget[1];
                if (targetBuilderName === this.builder.__NameSpace__) {
                    this._doAction(targetBuilderAction, payload);
                }
                else {
                    this.builder.call(targetBuilderName, targetBuilderAction, payload);
                }
            }
        };
        if (!vmParam) {
            console.error('vm params is undefined');
            return;
        }
        this.viewModelParams = vmParam;
    }
    init(observedModel) {
        this.observedModel = observedModel;
        const { state, actions } = this.viewModelParams;
        this.store = this._createVM(state, observedModel);
        this._bindActions(actions);
    }
    _createVM(state, observedModel) {
        let viewModelState = {};
        const keys = Object.keys(state);
        keys.forEach(key => {
            viewModelState = Object.assign({
                key: new Core_1.Watcher(observedModel, key, state[key].handler, (val) => {
                    state[key].onComputedUpdate();
                    this.reactiveView.setState({ key: val });
                })
            });
        });
        keys.forEach(key => {
            Core_2.autoRun(() => {
                state[key].handler(observedModel); // 直接执行关系函数，确保在使用时没有问题
            });
        });
        return viewModelState;
    }
    _bindActions(actions) {
        Object.keys(actions).forEach(type => {
            const action = actions[type];
            const callback = (payload) => {
                action.call(this, payload);
            };
            this.actions[type] = callback;
        });
    }
    _doAction(type, payload) {
        const action = this.actions[type];
        if (!action || typeof action !== 'function') {
            throw new Error(`Can not find action of ${type}`);
        }
        action(payload);
    }
    registerView(reactiveView) {
        if (this.reactiveView === null) {
            this.reactiveView = reactiveView;
        }
    }
}
exports.default = UC_ViewModel;
