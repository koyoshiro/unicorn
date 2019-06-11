import React, { Component } from 'react';
import { I_UC_Builder } from '../Interface/I_UC_Builder';
import { I_UC_ViewModel } from '../Interface/I_UC_ViewModel';
import { I_UC_Model } from '../Interface/I_UC_Model';
import { IBroadcastSubject, ISignal } from '../Interface/I_Broadcast';

import UC_Model from '../Model';
import UC_ViewModel from '../ViewModel';
import { connect } from '../View';

export default class Builder {
    public readonly __NameSpace__: string = '';
    private readonly __Configs__: I_UC_Builder | any = {};
    protected UCModel: any = null;
    protected UCViewModel: any = null;

    protected observedModel: any = null;
    private renderComponent: Component;
    private wrappedComponent: Component = null;
    private iteratorRender: any = this.doRender();
    private tunnel: (builderName: string, actionName: string, payload?: any) => void;
    private signal: ISignal;

    public constructor(
        builderParams: I_UC_Builder,
        tunnel: (builderName: string, actionName: string, payload?: any) => void,
        builderSignal: ISignal
    ) {
        if (!builderParams) {
            return;
        }
        this.__Configs__ = builderParams;
        this.__NameSpace__ = this.__Configs__.namespace;
        this.tunnel = tunnel;
        this.signal = builderSignal;
        if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
            this.doSetup(this.__Configs__.subscriptions.setup);
        } else {
            this.__Configs__.model = new UC_Model(this.__Configs__.model);
        }
        const viewModelParams: I_UC_ViewModel = {
            state: this.__Configs__.state,
            actions: this.__Configs__.actions
        };
        this.UCViewModel = new UC_ViewModel(viewModelParams, this.call);
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
        yield this.wrappedComponent.setState({ vm: this.UCViewModel });
        yield this.UCViewModel.reactiveView.setState({ vm: this.UCViewModel });
    }

    protected render(renderComponent: Component): Component {
        this.renderComponent = renderComponent;
        const StoreWrapper: Component = connect(
            this.UCViewModel,
            this.renderComponent
        );
        this.wrappedComponent = <StoreWrapper />;
        if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
            console.log('wait autoRender');
        } else {
            this.iteratorRender.next();
        }
    }

    protected replaceModel(modelData: any) {
        this.__Configs__.model = new UC_Model(modelData).observedModel;
        this.UCViewModel.init(this.__Configs__.model);
    }

    protected call(dispatchTarget: string, payload?: any): void {
        const builderName: string = dispatchTarget.split('/')[0];
        const actionName: string = dispatchTarget.split('/')[1];

        if (builderName === this.__NameSpace__) {
            this.UCViewModel.dispatch(payload);
        } else {
            this.tunnel(builderName, actionName, payload);
        }
    }

    protected doSubscribe(behaviorName: string): IBroadcastSubject | undefined {
        if (behaviorName) {
            return this.signal.doSubscribe(behaviorName);
        }
        return undefined;
    }

    protected subscribe(behaviorName: string, behavior: (p: IBroadcastSubject) => void): void {
        this.signal.subscribe(behaviorName, behavior);
    }

    protected unSubscribe(behaviorName: string) {
        this.signal.unSubscribe(behaviorName);
    }
}
