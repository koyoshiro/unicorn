export interface IBroadcastSubject {
    builderName: string;
    actionName: string;
    payload?: any;
}

export interface IBroadcast {
    subscribe: (behaviorName: string, behavior: IBroadcastSubject) => void;
    unSubscribe: (behaviorName: string) => void;
    getSubscribe: (behaviorName: string) => IBroadcastSubject[] | undefined;
}

export interface ISignal {
    subscribe: (behaviorName: string, behavior: IBroadcastSubject) => void;
    unSubscribe: (behaviorName: string) => void;
    doSubscribe: (behaviorName: string) => void;
}
