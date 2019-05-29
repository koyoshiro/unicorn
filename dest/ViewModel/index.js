"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("./event");
const Core_1 = require("../Core");
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
                this.doAction(type, payload);
            }
            else {
                const dispatchTarget = type.split('/'), targetBuilderName = dispatchTarget[0], targetBuilderAction = dispatchTarget[1];
                if (targetBuilderName === this.builder.__NameSpace__) {
                    this.doAction(targetBuilderAction, payload);
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
        this.store = this.createVM(state);
        this.bindActions(actions);
    }
    createVM(state) {
        let viewModelState = {};
        const keys = Object.keys(state);
        keys.forEach(key => {
            /*
            map: obm => {
                return obm.array[0];
            }
            */
            // 根据state[key].map去递归生成watcher实例
            const watcherInstance = new Core_1.Watcher(state[key].map.bind(this.observedModel), key, state[key].handler, (val) => {
                state[key].onComputedUpdate(val);
                this.store[key] = val;
                this.reactiveView.setState({ vm: this });
            });
            viewModelState[key] = watcherInstance[key];
        });
        // 递归时需要实现所有非object和array 的 直接可以使用的值
        Object.keys(this.observedModel).forEach((key) => {
            const baseWatcherInstance = new Core_1.Watcher(this.observedModel, key, () => {
                return this.observedModel[key];
            }, (val) => {
                this.store[key] = val;
                this.reactiveView.setState({ vm: this });
            });
            viewModelState[key] = baseWatcherInstance[key];
        });
        // keys.forEach(key => {
        //     autoRun(() => {
        //         viewModelState[key].handler(observedModel); // 直接执行关系函数，确保在使用时没有问题
        //     });
        // });
        return viewModelState;
    }
    bindActions(actions) {
        Object.keys(actions).forEach(type => {
            const action = actions[type];
            const callback = (payload) => {
                action.call(this, payload);
            };
            this.actions[type] = callback;
        });
    }
    doAction(type, payload) {
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
