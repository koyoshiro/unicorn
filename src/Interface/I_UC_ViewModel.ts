export interface IViewModelParams {
    state: any;
    actions?: any;
}

export interface IViewModel {
    init: (observedModel: any) => void;
    dispatch: (type: string, payload?: any) => void;
    registerView: (reactiveView: any) => void;
    reactiveView: any;
    store: any;
    observedModel: any;
}
