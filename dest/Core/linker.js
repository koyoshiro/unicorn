"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Linker {
    static getDepTarget() {
        return this.depTarget;
    }
    static setDepTarget(newDepTarget) {
        if (newDepTarget) {
            this.depTarget = newDepTarget;
        }
    }
    static resetDepTarget() {
        this.depTarget = null;
    }
    static pushComputedArray(computedKey) {
        if (computedKey) {
            this.computedArray.add(computedKey);
        }
    }
    static computedArrayContains(computedKey) {
        if (computedKey) {
            return this.computedArray.has(computedKey);
        }
        return false;
    }
}
Linker.depTarget = null;
Linker.computedArray = new Set();
exports.default = Linker;
