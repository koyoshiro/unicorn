import { I_UC_ViewModel } from '../Interface/I_UC_ViewModel';
import Events from './event';
import { Watcher } from '../Core';
import { autoRun } from '../Core';

export default class UC_ViewModel extends Events {
    private builder: any;
    private actions: any = {};
    private observedModel: any = {};
    private reactiveView: any = null;
    public store: any = {};

    constructor(vmParam: I_UC_ViewModel, builder: any) {
        super();
        if (!vmParam) {
            console.error('vm params is undefined');
            return;
        }
        const { state, actions } = vmParam;
        this.builder = builder;

        if (!state) {
            console.error('vmParam.state is undefined');
            return;
        }

        this.store = this._createVM(state);
        this._bindActions(actions);
    }

    private _createVM(state: any) {
        let viewModelState = {};
        const keys = Object.keys(state);
        keys.forEach(key => {
            viewModelState = {
                ...{
                    key: new Watcher(this.builder.UCModel.observedModel, key, state[key].handler, (val: any) => {
                        state[key].onComputedUpdate();
                        this.reactiveView.setState({ key: val });
                    })
                }
            };
        });
        keys.forEach(key => {
            autoRun(() => {
                state[key].handler(); // 直接执行关系函数，确保在使用时没有问题
            });
        });
        return viewModelState;
    }

    private _bindActions(actions: any) {
        Object.keys(actions).forEach(type => {
            const action = actions[type];
            const callback = (payload: any) => {
                action.call(this, payload);
            };
            this.actions[type] = callback;
        });
    }

    private _doAction(type: string, payload?: any) {
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
        if (type.split('/').length === 0) {
            this._doAction(type, payload);
        } else {
            const dispatchTarget:string[]=type.split('/'),
            targetBuilderName:string=dispatchTarget[0],
            targetBuilderAction :string = dispatchTarget[1];

            if(targetBuilderName===this.builder.__NameSpace__){
                this._doAction(targetBuilderAction, payload);
            }else{
                this.builder.call(targetBuilderName,targetBuilderAction,payload);
            }
        }
    };

    public registerView(reactiveView: any) {
        if (this.reactiveView === null) {
            this.reactiveView = reactiveView;
        }
    }
}
