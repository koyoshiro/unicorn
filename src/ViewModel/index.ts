import { IViewModel } from '../Interface';
import Events from './event';
import Observable from './observable';

export default class Store extends Events {
  
  private actions:any={};
  private observedModel: any = {};
  private state: any = {};

  private _bindActions (actions:any) {
    Object.keys(actions).forEach(type => {
      const action = actions[type];
      const callback = (payload:any) => {
        action.call(this, this.observedModel, payload);
      }
      this.actions[type] = callback;
    })
  }
  
  constructor(params:IViewModel) {
    super();
    const { state, actions } = params;
    
    this.observedModel = new Observable(state, this);
    this.observedModel.on('change', (args:any) => {
      const { key } = args,
            value = this.observedModel.get(key);
      this.emit('change', {
        key,
        value
      })
    })
    this.state = this.observedModel;    // 传递给WrapComponent包裹的Components使用
    this._bindActions(actions);
  }

  public dispatch = (type:string, payload:any) => {
    const action = this.actions[type];

    if (!action || typeof action !== 'function') {
      throw new Error(`Can not find action of ${type}`);
    }
    action(payload);
  }
}