"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function call(asyncFunc, payload) {
    setInterval(asyncFunc(), 100);
}
exports.call = call;
