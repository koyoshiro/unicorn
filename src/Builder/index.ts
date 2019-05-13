import { Component } from 'react';
import { I_UC_Builder } from '../Interface/I_UC_Builder';
import { I_UC_ViewModel } from '../Interface/I_UC_ViewModel';
import { I_UC_Model } from '../Interface/I_UC_Model';

import UC_Model from '../Model';
import UC_ViewModel from '../ViewModel';
import { inject } from '../View';

export default class Builder {
    public readonly __NameSpace__: string = '';
    private readonly __Configs__: I_UC_Builder | any = {};
    protected UCModel: any = null;
    protected UCViewModel: any = null;

    protected observedModel: any = null;

    public constructor(builderParams: I_UC_Builder) {
        if (!builderParams) {
            return;
        }
        this.__Configs__ = builderParams;
        this.__NameSpace__ = this.__Configs__.namespace;
        if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
            const res = this.__Configs__.subscriptions.setup();
            const initIt = this.init();
            initIt.next(res);
            initIt.next();
        } else {
            this.__Configs__.model = new UC_Model(this.__Configs__.model);
        }
        const viewModelParams: I_UC_ViewModel = {
            state: this.__Configs__.state,
            actions: this.__Configs__.actions
        };
        this.UCViewModel = new UC_ViewModel(viewModelParams);
    }

    private *init(modelData?: any) {
        this.__Configs__.model = yield new UC_Model(modelData);
        yield this.UCViewModel.init(this.__Configs__.model);
    }

    protected render(renderComponent: Component): Component {
        setTimeout(() => {
            inject(this.UCViewModel)(renderComponent);
        }, 1000);
    }

    protected replaceModel(modelData: any) {
        this.__Configs__.model = new UC_Model(modelData);
        this.UCViewModel.init(this.__Configs__.model);
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
