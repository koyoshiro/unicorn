"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const linker_1 = require("./linker");
class Watcher {
    constructor(obj, field, cb, computedUpdate) {
        this.object = obj;
        this.key = field;
        this.callback = cb;
        this.onComputedUpdate = computedUpdate;
        return this.defineComputed();
    }
    defineComputed() {
        const self = this;
        const onDepUpdated = (key) => __awaiter(this, void 0, void 0, function* () {
            yield console.log('wait');
            if (!linker_1.default.computedArrayContains(key)) {
                linker_1.default.pushComputedArray(key);
                const val = self.callback(self.object);
                this.onComputedUpdate(val);
            }
        });
        const handler = {
            get(target, key, receiver) {
                console.log(`我的${key}属性被读取了！`);
                linker_1.default.setDepTarget(() => {
                    onDepUpdated(key);
                });
                const val = self.callback();
                linker_1.default.resetDepTarget();
                return val;
            },
            set(target, key, value, receiver) {
                console.error('计算属性无法被赋值！');
                return false;
            }
        };
        return new Proxy(this.object, handler);
    }
}
exports.default = Watcher;
