import React, { Component } from 'react';
import { IBuilderParam } from '../Interface/I_UC_Builder';
import { IViewModel, IViewModelParams } from '../Interface/I_UC_ViewModel';
import { IBroadcastSubject, ISignal } from '../Interface/I_Broadcast';
import { ELogType } from '../Interface/I_UC_Log';

import { emitLog } from '../Util/log';
import UCModel from '../Model';
import UCViewModel from '../ViewModel';
import { connect } from '../View';

export default class Builder {
    protected readonly __NAME_SPACE__: string = '';
    protected UC_VIEW_MODEL: IViewModel;
    protected observedModel: any = null;

    private readonly __CONFIG__: IBuilderParam;
    private renderComponent: Component;
    private wrappedComponent: Component = null;
    private iteratorRender: any = this.doRender();
    private tunnel: (builderName: string, actionName: string, payload?: any) => void;
    private signal: ISignal;

    public constructor(
        builderParams: IBuilderParam,
        tunnel: (builderName: string, actionName: string, payload?: any) => void,
        builderSignal: ISignal
    ) {
        if (!builderParams) {
            return;
        }
        this.__CONFIG__ = builderParams;
        this.__NAME_SPACE__ = this.__CONFIG__.namespace;
        this.tunnel = tunnel;
        this.signal = builderSignal;
        if (this.__CONFIG__.effects && this.__CONFIG__.effects.fetchServer) {
            this.doSetup(this.__CONFIG__.effects.fetchServer);
        } else {
            this.__CONFIG__.model = new UCModel(this.__CONFIG__.model);
        }
        const viewModelParams: IViewModelParams = {
            state: this.__CONFIG__.state,
            actions: this.__CONFIG__.actions
        };
        this.UC_VIEW_MODEL = new UCViewModel(viewModelParams, this.call,this.signal);
        this.doSubscribe();
        emitLog(ELogType.lifeCycle, 'builder init finish');
    }
    private doSetup(setup: () => Promise<any>) {
        return setup()
            .then((res: any) => {
                this.__CONFIG__.model = new UCModel(res).observedModel;
                this.UC_VIEW_MODEL.init(this.__CONFIG__.model);
                this.iteratorRender.next();
                emitLog(ELogType.lifeCycle, 'doSetup');
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
    private *doRender() {
        yield this.UC_VIEW_MODEL.reactiveView.setState({ vm: this.UC_VIEW_MODEL });
        emitLog(ELogType.lifeCycle, 'doRender');
    }
    private doSubscribe() {
        if (this.__CONFIG__.subscriptions) {
            const subscriptions = this.__CONFIG__.subscriptions;
            Object.keys(subscriptions).forEach((behaviorName: string) => {
                const behavior: IBroadcastSubject = subscriptions[behaviorName];
                this.signal.subscribe(behaviorName, behavior);
            });
        }
    }

    protected render(renderComponent: Component): Component {
        this.renderComponent = renderComponent;
        const StoreWrapper: Component = connect(
            this.UC_VIEW_MODEL,
            this.renderComponent
        );
        this.wrappedComponent = <StoreWrapper />;
        if (this.__CONFIG__.subscriptions && this.__CONFIG__.subscriptions.setup) {
            console.log('wait autoRender');
        } else {
            this.iteratorRender.next();
        }
        emitLog(ELogType.lifeCycle, 'render');
    }

    protected replaceModel(modelData: any) {
        this.__CONFIG__.model = new UCModel(modelData).observedModel;
        this.UC_VIEW_MODEL.init(this.__CONFIG__.model);
    }

    protected call(dispatchTarget: string, payload?: any): void {
        const builderName: string = dispatchTarget.split('/')[0];
        const actionName: string = dispatchTarget.split('/')[1];

        if (builderName === this.__NAME_SPACE__) {
            this.UC_VIEW_MODEL.dispatch(payload);
        } else {
            this.tunnel(builderName, actionName, payload);
        }
    }

    protected runSubscribe(behaviorName: string): void {
        if (behaviorName) {
            return this.signal.doSubscribe(behaviorName);
        }
        return undefined;
    }

    protected unSubscribe(behaviorName: string) {
        this.signal.unSubscribe(behaviorName);
    }
}
