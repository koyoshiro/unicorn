import { IBroadcastSubject, IBroadcast } from '../Interface/I_Broadcast';

export default class Broadcast implements IBroadcast {
    private __SUBSCRIBE_MAP__: Map<string, IBroadcastSubject>;

    constructor() {
        this.__SUBSCRIBE_MAP__ = new Map<string, IBroadcastSubject>();
    }

    public subscribe(behaviorName: string, behavior: IBroadcastSubject): void {
        if (behaviorName && behavior) {
            if (!this.__SUBSCRIBE_MAP__.has(behaviorName)) {
                this.__SUBSCRIBE_MAP__.set(behaviorName, behavior);
            }
        }
    }

    public unSubscribe(behaviorName: string): void {
        if (behaviorName && this.__SUBSCRIBE_MAP__.has(behaviorName)) {
            this.__SUBSCRIBE_MAP__.delete(behaviorName);
        }
    }

    public getSubscribe(behaviorName: string): IBroadcastSubject | undefined {
        if (behaviorName && this.__SUBSCRIBE_MAP__.has(behaviorName)) {
            const broadcastSubscribe: IBroadcastSubject | undefined = this.__SUBSCRIBE_MAP__.get(behaviorName);
            return broadcastSubscribe;
        }
        return undefined;
    }
}
