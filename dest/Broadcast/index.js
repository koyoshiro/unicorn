"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Broadcast {
    constructor() {
        this.__SUBSCRIBE_MAP__ = new Map();
    }
    subscribe(behaviorName, behavior) {
        if (behaviorName && behavior) {
            if (!this.__SUBSCRIBE_MAP__.has(behaviorName)) {
                this.__SUBSCRIBE_MAP__.set(behaviorName, behavior);
            }
        }
    }
    unSubscribe(behaviorName) {
        if (behaviorName && this.__SUBSCRIBE_MAP__.has(behaviorName)) {
            this.__SUBSCRIBE_MAP__.delete(behaviorName);
        }
    }
    getSubscribe(behaviorName) {
        if (behaviorName && this.__SUBSCRIBE_MAP__.has(behaviorName)) {
            const broadcastSubscribe = this.__SUBSCRIBE_MAP__.get(behaviorName);
            return broadcastSubscribe;
        }
        return undefined;
    }
}
exports.default = Broadcast;
