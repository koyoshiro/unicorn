import { I_Builder_State } from './I_UC_Builder';
export interface I_Builder_State {
    handler : ()=>void;
    onComputedUpdate: ()=>void;
}

export interface I_Builder_Subs{
    setup?:()=>void
}

export interface I_UC_Builder{
    namespace: string;
    model?: {},
    state: any;
    actions: any;
    effects?: any;
    subscriptions?:I_Builder_Subs;
}