import { I_UC_ViewModel } from '../Interface/I_UC_ViewModel';
import Events from './event';
import { Watcher } from '../Core';
import { autoRun } from '../Core';

export default class UC_ViewModel extends Events {
    private builder: any;
    private actions: any = {};
    public reactiveView: any = null;
    public store: any = {};
    private viewModelParams: I_UC_ViewModel = { state: {} };
    public observedModel: any = {};

    constructor(vmParam: I_UC_ViewModel) {
        super();
        if (!vmParam) {
            console.error('vm params is undefined');
            return;
        }
        this.viewModelParams = vmParam;
    }

    public init(observedModel: any) {
        this.observedModel = observedModel;
        const { state, actions } = this.viewModelParams;
        this.store = this.createVM(state, observedModel);
        this.bindActions(actions);
    }

    private createVM(state: any, observedModel: any) {
        let viewModelState: any = {};
        const keys = Object.keys(state);
        keys.forEach(key => {
            // todo 根据state[key].map去递归生成watcher实例
            // todo 递归时需要实现所有非object和array 的 直接可以使用的值
            const watcherIns: any = new Watcher(observedModel, key, state[key].handler, (val: any) => {
                state[key].onComputedUpdate(val);
                this.store[key] = val;
                this.reactiveView.setState({ vm: this });
            });
            viewModelState[key] = watcherIns[key];
        });
        // keys.forEach(key => {
        //     autoRun(() => {
        //         viewModelState[key].handler(observedModel); // 直接执行关系函数，确保在使用时没有问题
        //     });
        // });
        return viewModelState;
    }

    // private recursiveObservableModel(observableModel: any) {
    //     // 对数据结构中统一处理为Proxy类型
    //     const obsField: any = new Watcher(observedModel, key, state[key].handler, (val: any) => {
    //         state[key].onComputedUpdate(val);
    //         this.store[key] = val;
    //         this.reactiveView.setState({ vm: this });
    //     });

    //     // 遍历Proxy内容中的每个字段
    //     Object.keys(obsField).forEach((key: any) => {
    //         // 若为object或array则递归
    //         if (typeof obsField[key] === 'object' || Array.isArray(obsField[key])) {
    //             obsField[key] = this.recursiveDataSource(obsField[key]); // 覆盖原字段的值为Proxy类型
    //         }
    //     });
    //     return obsField;
    // }

    private bindActions(actions: any) {
        Object.keys(actions).forEach(type => {
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

    public dispatch = (type: string, payload?: any) => {
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
        } else {
            const dispatchTarget: string[] = type.split('/'),
                targetBuilderName: string = dispatchTarget[0],
                targetBuilderAction: string = dispatchTarget[1];

            if (targetBuilderName === this.builder.__NameSpace__) {
                this.doAction(targetBuilderAction, payload);
            } else {
                this.builder.call(targetBuilderName, targetBuilderAction, payload);
            }
        }
    };

    public registerView(reactiveView: any) {
        if (this.reactiveView === null) {
            this.reactiveView = reactiveView;
        }
    }
}
