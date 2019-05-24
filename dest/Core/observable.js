"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependency_1 = require("./dependency");
class Observable {
    constructor(object) {
        return this.createProxy(object);
    }
    createProxy(object) {
        const dep = new dependency_1.default();
        const handler = {
            get(target, key, receiver) {
                console.log(`我的${key}属性被读取了！`);
                // 加入观察者队列
                dep.depend(key);
                return Reflect.get(target, key, receiver);
            },
            set(target, key, value, receiver) {
                console.log(`我的${key}属性被修改为${value}了！`);
                // 内部调用对应的 Reflect 方法
                const result = Reflect.set(target, key, value, receiver);
                // 执行观察者队列
                dep.notify(key);
                return result;
            }
        };
        return new Proxy(object, handler);
    }
}
exports.default = Observable;
