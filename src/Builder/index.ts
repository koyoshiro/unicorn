import { Component } from 'react';
import { I_UC_Builder } from '../Interface/I_UC_Builder';
import { I_UC_ViewModel } from '../Interface/I_UC_ViewModel';
import { I_UC_Model } from '../Interface/I_UC_Model';

import UC_Model from '../Model';
import UC_ViewModel from '../ViewModel';
import { connect } from '../View';
import defaultComponent from './default';

export default class Builder {
    public readonly __NameSpace__: string = '';
    private readonly __Configs__: I_UC_Builder | any = {};
    protected UCModel: any = null;
    protected UCViewModel: any = null;

    protected observedModel: any = null;
    private renderComponent: Component;
    private wrappedComponent: Component = defaultComponent;
    private iteratorRender: any = this.doRender();
    // private iteratorStart: any = this.doStart();

    public constructor(builderParams: I_UC_Builder) {
        if (!builderParams) {
            return;
        }
        this.__Configs__ = builderParams;
        this.__NameSpace__ = this.__Configs__.namespace;
        if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
            this.doSetup(this.__Configs__.subscriptions.setup);
        } else {
            this.__Configs__.model = new UC_Model(this.__Configs__.model);
        }
        const viewModelParams: I_UC_ViewModel = {
            state: this.__Configs__.state,
            actions: this.__Configs__.actions
        };
        this.UCViewModel = new UC_ViewModel(viewModelParams);
    }
    private doSetup(setup: any) {
        return setup()
            .then((res: any) => {
                this.__Configs__.model = new UC_Model(res).observedModel;
                this.UCViewModel.init(this.__Configs__.model);
                this.iteratorRender.next();
                // this.iteratorStart.next();
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
    private *doRender() {
        yield this.wrappedComponent.doSomething(this.UCViewModel);
    }

    protected render(renderComponent: Component): Component {
        this.renderComponent = renderComponent;
        this.wrappedComponent = connect(
            this.UCViewModel,
            this.renderComponent
        );
        if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
            console.log('wait autoRender');
        } else {
            this.iteratorRender.next();
        }
    }

    // private *doStart(wrappedComponent?: Component) {
    //     yield (this.wrappedComponent = wrappedComponent);
    //     return yield this.wrappedComponent;
    // }

    // protected start() {
    //     // this.iteratorStart = this.doStart();
    //     if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
    //         console.log('wait autoRender');
    //     } else {
    //         this.iteratorStart.next();
    //         return this.iteratorStart.next();
    //     }
    // }

    protected replaceModel(modelData: any) {
        this.__Configs__.model = new UC_Model(modelData).observedModel;
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
