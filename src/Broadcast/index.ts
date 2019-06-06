import { I_Broadcast_Subject } from '../Interface/I_Broadcast_Subject';

export default class Broadcast {
    private __SubscribeMap__: Map<string, I_Broadcast_Subject> = new Map<string, I_Broadcast_Subject>();

    public subscribe(behaviorName: string, behavior: I_Broadcast_Subject) {
        if (behaviorName && behavior) {
            if (!this.__SubscribeMap__.has(behaviorName)) {
                this.__SubscribeMap__.set(behaviorName, behavior);
            }
        }
    }

    public unSubscribe(behaviorName: string) {
        if (behaviorName && this.__SubscribeMap__.has(behaviorName)) {
            this.__SubscribeMap__.delete(behaviorName);
        }
    }

    public getSubscribe(behaviorName: string): I_Broadcast_Subject | undefined {
        if (behaviorName && this.__SubscribeMap__.has(behaviorName)) {
            const broadcastSubscribe: I_Broadcast_Subject | undefined = this.__SubscribeMap__.get(behaviorName);
            return broadcastSubscribe;
        }
        return undefined;
    }
}
