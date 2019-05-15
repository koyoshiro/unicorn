"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("./Builder");
// import Broadcast from './Broadcast';
class Unicorn {
    // private Broadcast : any;
    constructor() {
        this.__BUILD_RECORD__ = []; //Set<string>[] = new Set;
        this.__BUILD_STACK__ = [];
        // todo init Log
        // this.__BUILD_RECORD__ = [];
        // this.__BUILD_STACK__ = [];
        // this.Broadcast = new Broadcast();
    }
    builder(builderParams) {
        if (builderParams && builderParams.namespace && this.__BUILD_RECORD__.indexOf(builderParams.namespace) === -1) {
            this.__BUILD_RECORD__.push(builderParams.namespace);
            const builderInstance = new Builder_1.default(builderParams);
            this.__BUILD_STACK__.push({
                key: builderParams.namespace,
                instance: builderInstance
            });
            return builderInstance;
        }
    }
}
exports.default = Unicorn;