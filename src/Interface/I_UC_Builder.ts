import { IBroadcastSubject } from './I_Broadcast';
import React, { Component } from 'react';
export interface IState {
    handler: () => void;
    onComputedUpdate: () => void;
}

export interface IEffect {
    fetchServer?: () => Promise<any>;
}

export interface IBuilderParam {
    namespace: string;
    model?: {};
    state: any;
    actions: any;
    effects?: IEffect;
    subscriptions?: {
        [_: string]: IBroadcastSubject
    };
}

export interface IBuilder {
    render: (renderComponent: Component) => Component;
    call: (dispatchTarget: string, payload?: any) => void;
    doSubscribe: (behaviorName: string) => IBroadcastSubject | undefined;
    subscribe: (behaviorName: string, behavior: (p: IBroadcastSubject) => void) => void;
    unSubscribe: (behaviorName: string) => void;
}
