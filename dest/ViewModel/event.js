"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Events {
    on(type, callback) {
        if (!type || !callback) {
            return this;
        }
        if (!this.__events__) {
            this.__events__ = {};
        }
        (this.__events__[type] || (this.__events__[type] = [])).push(callback);
        return this;
    }
    off(type, callback) {
        let event = this.__events__;
        if (!type || !event) {
            event = {};
            return this;
        }
        if (!callback) {
            event[type] = [];
        }
        event[type] = event[type].filter((item) => item !== callback);
        return this;
    }
    emit(type, param) {
        const event = this.__events__;
        if (event && event[type]) {
            event[type].forEach((item) => item && item(param));
        }
        return this;
    }
}
exports.default = Events;
