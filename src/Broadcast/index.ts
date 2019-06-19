import { IBroadcastSubject, IBroadcast } from '../Interface/I_Broadcast';

export default class Broadcast implements IBroadcast {
    private __SUBSCRIBE_MAP__: Map<string, IBroadcastSubject[]>;

    constructor() {
        this.__SUBSCRIBE_MAP__ = new Map<string, IBroadcastSubject[]>();
    }

    public subscribe(behaviorName: string, behavior: IBroadcastSubject): void {
        if (behaviorName && behavior) {
            if (!this.__SUBSCRIBE_MAP__.has(behaviorName)) {
                const behaviorArray: IBroadcastSubject[] = [];
                behaviorArray.push(behavior);
                this.__SUBSCRIBE_MAP__.set(behaviorName, behaviorArray);
            } else {
                const behaviorHeap: IBroadcastSubject[] | undefined = this.__SUBSCRIBE_MAP__.get(behaviorName);
                if (behaviorHeap) {
                    behaviorHeap.push(behavior);
                    this.__SUBSCRIBE_MAP__.set(behaviorName, behaviorHeap);
                }
            }
        }
    }

    public unSubscribe(behaviorName: string): void {
        if (behaviorName && this.__SUBSCRIBE_MAP__.has(behaviorName)) {
            this.__SUBSCRIBE_MAP__.delete(behaviorName);
        }
    }

    public getSubscribe(behaviorName: string): IBroadcastSubject[] | undefined {
        if (behaviorName && this.__SUBSCRIBE_MAP__.has(behaviorName)) {
            const behaviorHeap: IBroadcastSubject[] | undefined = this.__SUBSCRIBE_MAP__.get(behaviorName);
            return behaviorHeap;
        }
        return undefined;
    }
}
