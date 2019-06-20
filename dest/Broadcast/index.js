"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Broadcast {
    constructor() {
        this.__SUBSCRIBE_MAP__ = new Map();
    }
    subscribe(behaviorName, behavior) {
        if (behaviorName && behavior) {
            if (!this.__SUBSCRIBE_MAP__.has(behaviorName)) {
                const behaviorArray = [];
                behaviorArray.push(behavior);
                this.__SUBSCRIBE_MAP__.set(behaviorName, behaviorArray);
            }
            else {
                const behaviorHeap = this.__SUBSCRIBE_MAP__.get(behaviorName);
                if (behaviorHeap) {
                    behaviorHeap.push(behavior);
                    this.__SUBSCRIBE_MAP__.set(behaviorName, behaviorHeap);
                }
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
            const behaviorHeap = this.__SUBSCRIBE_MAP__.get(behaviorName);
            return behaviorHeap;
        }
        return undefined;
    }
}
exports.default = Broadcast;
