"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I_UC_Log_1 = require("./Interface/I_UC_Log");
const log_1 = require("./Util/log");
const Builder_1 = require("./Builder");
const Broadcast_1 = require("./Broadcast");
class Unicorn {
    constructor() {
        this.__BUILD_STACK__ = [];
        log_1.emitLog(I_UC_Log_1.ELogType.lifeCycle, 'unicorn constructor');
        this.__BUILD_RECORD__ = new Set();
        this.__BROAD_CAST__ = new Broadcast_1.default();
    }
    builder(builderParams) {
        if (!builderParams || !builderParams.namespace || this.__BUILD_RECORD__.has(builderParams.namespace)) {
            log_1.emitLog(I_UC_Log_1.ELogType.error, 'builder error');
            return null;
        }
        this.__BUILD_RECORD__.add(builderParams.namespace);
        const builderInstance = new Builder_1.default(builderParams, this.tunnel, this.signal());
        this.__BUILD_STACK__.push({
            key: builderParams.namespace,
            instance: builderInstance
        });
        log_1.emitLog(I_UC_Log_1.ELogType.lifeCycle, 'builder successful', {
            namespace: builderParams.namespace
        });
        return builderInstance;
    }
    tunnel(builderName, actionName, payload) {
        if (!builderName || !actionName || !this.__BUILD_RECORD__.has(builderName)) {
            log_1.emitLog(I_UC_Log_1.ELogType.error, 'tunnel error');
            return;
        }
        const builderChannel = this.__BUILD_STACK__.find((builder) => builder.key === builderName).instance;
        builderChannel.UCViewModel.dispatch(actionName, payload);
        log_1.emitLog(I_UC_Log_1.ELogType.functionCall, 'tunnel', {
            builderName,
            actionName,
            payload
        });
    }
    signal() {
        const runSubscribe = (behaviorName) => {
            const behaviorHeap = this.__BROAD_CAST__.getSubscribe(behaviorName);
            if (behaviorHeap) {
                behaviorHeap.forEach((behavior) => {
                    const builderChannel = this.__BUILD_STACK__.find((builder) => builder.key === behavior.builderName).instance;
                    builderChannel.UCViewModel.dispatch(behavior.actionName, behavior.payload);
                });
            }
        };
        return {
            subscribe: this.__BROAD_CAST__.subscribe,
            unSubscribe: this.__BROAD_CAST__.unSubscribe,
            doSubscribe: runSubscribe
        };
    }
}
exports.default = Unicorn;
