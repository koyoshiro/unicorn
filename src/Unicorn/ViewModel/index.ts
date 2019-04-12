import UC_ViewModel_Interface from './Interface/UC_ViewModel_Interface';
import Events from './event';
import { Watcher } from '../Core';

export default class UC_ViewModel extends Events {
    private actions: any = {};
    private observedModel: any = {};
    public state: any = {};

    constructor(vmParam: UC_ViewModel_Interface, obsObject: any) {
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

        this.state = this._createVM(state);
        this._bindActions(actions);
    }

    private _createVM(state: any) {
        let viewModelState = {};
        const keys = Object.keys(state);
        keys.forEach(key => {
            viewModelState = {
                ...{
                    key: new Watcher(this.observedModel, key, state[key].handler, state[key].onComputedUpdate)
                }
            };
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
}
