"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Broadcast {
    constructor() {
        this.__SubscribeMap__ = new Map();
    }
    subscribe(eventName, behavior) {
        if (!this.__SubscribeMap__.has(eventName)) {
            this.__SubscribeMap__.set(eventName, behavior);
        }
    }
    unSubscribe(eventName) {
        if (this.__SubscribeMap__.has(eventName)) {
            this.__SubscribeMap__.delete(eventName);
        }
    }
    sendEvent(eventName) {
        let broadcastSub = null;
        if (this.__SubscribeMap__.has(eventName)) {
            broadcastSub = this.__SubscribeMap__.get(eventName);
        }
        return broadcastSub;
    }
}
exports.default = Broadcast;
