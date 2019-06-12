import { IViewModel, IViewModelParams } from '../Interface/I_UC_ViewModel';
import { Watcher } from '../Core';
// import { autoRun } from '../Core';

export default class UCViewModel implements IViewModel {
    private call: (dispatchTarget: string, payload?: any) => void;
    private actions: any = {};
    public reactiveView: any = null;
    public store: any = {};
    private viewModelParams: IViewModelParams = { state: {} };
    public observedModel: any = {};

    constructor(vmParam: IViewModelParams, call: (dispatchTarget: string, payload?: any) => void) {
        if (!vmParam) {
            console.error('vm params is undefined');
            return;
        }
        this.viewModelParams = vmParam;
        this.call = call;
    }

    public init(observedModel: any): void {
        this.observedModel = observedModel;
        const { state, actions } = this.viewModelParams;
        this.store = this.createVM(state);
        this.bindActions(actions);
    }

    private createVM(state: any) {
        const viewModelState: any = {};
        const keys = Object.keys(state);
        keys.forEach((key: string) => {
            /*
            map: obm => {
                return obm.array[0];
            }
            */
            // 根据state[key].map去递归生成watcher实例
            const watcherInstance: any = new Watcher(
                state[key].map(this.observedModel),
                key,
                state[key].handler,
                (val: any) => {
                    state[key].onComputedUpdate(val);
                    this.store[key] = val;
                    this.reactiveView.setState({ vm: this });
                }
            );
            viewModelState[key] = watcherInstance[key];
        });
        // 递归时需要实现所有非object和array 的 直接可以使用的值
        Object.keys(this.observedModel).forEach((key: string) => {
            const baseWatcherInstance: any = new Watcher(
                this.observedModel,
                key,
                () => {
                    return this.observedModel[key];
                },
                (val: any) => {
                    this.store[key] = val;
                    this.reactiveView.setState({ vm: this });
                }
            );
            viewModelState[key] = baseWatcherInstance[key];
        });
        // keys.forEach(key => {
        //     autoRun(() => {
        //         viewModelState[key].handler(observedModel); // 直接执行关系函数，确保在使用时没有问题
        //     });
        // });
        return viewModelState;
    }

    // add(model,payload) {
    //     model.array[0].val = payload;
    // }
    private bindActions(actions: any) {
        Object.keys(actions).forEach((type: string) => {
            const action = actions[type];
            const callback = (payload: any) => {
                action.call(this, payload);
            };
            this.actions[type] = callback;
        });
    }

    private doAction(type: string, payload?: any) {
        const action = this.actions[type];
        if (!action || typeof action !== 'function') {
            throw new Error(`Can not find action of ${type}`);
        }
        action(payload);
    }

    public dispatch(type: string, payload?: any): void {
        if (!type || type === '') {
            return;
        }
        /*
         * 判断dispatch对象是否为本viewmodel的action？
         * 若是则直接处理；
         * 若不是则调用builder中的call方法处理（隐式处理所有跨模块通信）
         */
        if (type.split('/').length === 1) {
            this.doAction(type, payload);
        } else {
            this.call(type, payload);
        }
    }

    public registerView(reactiveView: any): void {
        if (this.reactiveView === null) {
            this.reactiveView = reactiveView;
        }
    }
}
