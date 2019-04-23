import { I_UC_ViewModel } from '../Interface/I_UC_ViewModel';
import Events from './event';
import { Watcher } from '../Core';
import { autoRun } from '../Core';

export default class UC_ViewModel extends Events {
    private actions: any = {};
    private observedModel: any = {};
    private reactiveView : any =null;
    public store: any = {};
    
    constructor(vmParam: I_UC_ViewModel, obsObject: any) {
        super();
        if (!vmParam || !obsObject) {
            console.error('vm params is undefined');
            return;
        }

        const { state, actions } = vmParam;
        this.observedModel = obsObject;

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
                    key: new Watcher(this.observedModel, key, state[key].handler, (val:any)=>{
                        state[key].onComputedUpdate();
                        this.reactiveView.setState({key:val});
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
                action.call(this, this.observedModel, payload);
            };
            this.actions[type] = callback;
        });
    }

    public dispatch = (type: string, payload: any) => {
        const action = this.actions[type];
        if (!action || typeof action !== 'function') {
            throw new Error(`Can not find action of ${type}`);
        }
        action(payload);
    };

    public registerView(reactiveView:any){
        if(this.reactiveView===null){
            this.reactiveView=reactiveView;
          }
    }
}
