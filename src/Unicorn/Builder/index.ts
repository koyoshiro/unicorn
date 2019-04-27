import { Component } from 'react';
import { I_UC_ViewModel } from '../Interface/I_UC_ViewModel';
import { I_UC_Model } from '../Interface/I_UC_Model';

import UC_Model from '../Model';
import UC_ViewModel from '../ViewModel';
import { inject } from '../View';

export default class Builder {
    protected __NameSpace__: string = '';
    protected UCModel: any = null;
    protected UCViewModel: any = null;
    protected Channel: any;
    protected Broadcast : any;

    constructor(nameSpace: string, channel: any,broadcast:any) {
        this.__NameSpace__ = nameSpace ? nameSpace : '';
        this.Channel = channel;
        this.Broadcast = broadcast;
    }

    public model(modelParam: I_UC_Model) {
        this.UCModel = new UC_Model(modelParam);
        this.UCModel.subscribe = this.subscribe;    //todo
    }

    public viewModel(vmParam: I_UC_ViewModel): any {
        this.UCViewModel = new UC_ViewModel(vmParam, this.UCModel.observedModel);
        this.UCViewModel.channel = this.Channel; //todo 
    }

    public render(renderComponent: Component) {
        inject(this)(renderComponent);
    }

    public crossCall(builderName:string, actionName:string,payload:any) {
        this.Channel(builderName,actionName,payload);
    }

    public sendEvent(eventName:string){
        this.Broadcast.sendEvent(eventName);    //todo
    }

    public subscribe(eventName:string,eventCallback:(p:any)=>void){
        this.Broadcast.subscribe(eventName,eventCallback);
    }

    public unSubscribe(eventName:string){
        this.Broadcast.unSubscribe(eventName);
    }
}
