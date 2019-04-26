import { I_Broadcast_Subject } from '../Interface/I_Broadcast_Subject';

export default class Broadcast {
    private __SubscribeMap__: Map<string, I_Broadcast_Subject> = new Map<string, I_Broadcast_Subject>();

    public constructor() {}

    public subscribe(eventName: string, behavior: I_Broadcast_Subject) {
        if (!this.__SubscribeMap__.has(eventName)) {
            this.__SubscribeMap__.set(eventName, behavior);
        }
    }

    public unSubscribe(eventName: string) {
        if (this.__SubscribeMap__.has(eventName)) {
            this.__SubscribeMap__.delete(eventName);
        }
    }

    public sendEvent(eventName: string) {
        let broadcastSub = null;
        if (this.__SubscribeMap__.has(eventName)) {
            broadcastSub = this.__SubscribeMap__.get(eventName);
        }
        return broadcastSub;
    }
}
