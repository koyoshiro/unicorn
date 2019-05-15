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
class Dependency {
    constructor() {
        this.depArray = new Set();
        this.depArray = new Set();
    }
    depend(key) {
        if (linker_1.default.getDepTarget()) {
            this.depArray.add({
                key,
                target: linker_1.default.getDepTarget()
            });
        }
    }
    notify(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.depArray.forEach(dep => {
                if (dep.key === key && dep.target) {
                    dep.target();
                }
            });
            // await Dep.computeArray.clear();
        });
    }
}
exports.default = Dependency;
