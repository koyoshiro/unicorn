import { Component } from 'react';
import { I_UC_Builder } from '../Interface/I_UC_Builder';
import { I_UC_ViewModel } from '../Interface/I_UC_ViewModel';
import { I_UC_Model } from '../Interface/I_UC_Model';

import UC_Model from '../Model';
import UC_ViewModel from '../ViewModel';
import { inject } from '../View';

export default class Builder {
    public readonly _NameSpace_: string = '';
    public readonly _Configs_: I_UC_Builder | any = {};
    protected UCModel: any = null;
    protected UCViewModel: any = null;

    protected observedModel: any = null;

    public constructor(builderParams: I_UC_Builder) {
        if (!builderParams) {
            return;
        }
        this._Configs_ = builderParams;
        this._NameSpace_ = this._Configs_.namespace;
        if (this._Configs_.subscriptions && this._Configs_.subscriptions.setup) {
            this._doSetup(this._Configs_.subscriptions.setup);
        } else {
            this._Configs_.model = new UC_Model(this._Configs_.model);
        }
        const viewModelParams: I_UC_ViewModel = {
            state: this._Configs_.state,
            actions: this._Configs_.actions
        };
        this.UCViewModel = new UC_ViewModel(viewModelParams);
    }

    private async _doSetup(setup: () => void) {
        const modelData = await setup();
        this._Configs_.model = new UC_Model(modelData);
        this.UCViewModel.init(this._Configs_.model);
    }

    protected render(renderComponent: Component) :Component{
        inject(this.UCViewModel)(renderComponent);
    }

    protected replaceModel(modelData : any){
        this._Configs_.model = new UC_Model(modelData);
        this.UCViewModel.init(this._Configs_.model);
    }

    // protected async model(modelParam: I_UC_Model) {
    //     if (!modelParam) {
    //         console.error('modelParam is undefined');
    //         return;
    //     }
    //     this.UCModel = await new UC_Model(modelParam);
    //     this.UCViewModel.init(this.UCModel.observedModel);
    // }

    // protected viewModel(vmParam: I_UC_ViewModel): void {
    //     this.UCViewModel = new UC_ViewModel(vmParam);
    // }


    // public call(builderName: string, actionName: string, payload: any) {
    //     this.Channel(builderName, actionName, payload);
    // }

    // public sendEvent(eventName: string) {
    //     this.Broadcast.sendEvent(eventName); //todo
    // }

    // public subscribe(eventName: string, eventCallback: (p: any) => void) {
    //     this.Broadcast.subscribe(eventName, eventCallback);
    // }

    // public unSubscribe(eventName: string) {
    //     this.Broadcast.unSubscribe(eventName);
    // }
}
