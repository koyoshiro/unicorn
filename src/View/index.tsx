import React, { Component } from 'react';

interface IProp {
    _change: ()=>void;
}

const inject = (store:any) =>{
  return function withStore(WrappedComponent:Component) {
    class StoreWrapper extends Component {
      private _change: any;
      constructor(props: IProp) {
        super(props);
  
        this._change = (obj:any) => {
          const state:any = {};
  
          state[obj.key] = obj.value;
          this.setState(state);
        }
  
        store.on('change', this._change);
        WrappedComponent.prototype.store = store;
      }
  
      render () {
        return <WrappedComponent store={store} {...this.props} />
      }
    }
    return StoreWrapper;
  }
} 

export default inject;