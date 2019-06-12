import { IBuilderParam } from './Interface/I_UC_Builder';
import { ELogType } from './Interface/I_UC_Log';
import { emitLog } from './Util/log';
import { IBroadcastSubject, IBroadcast, ISignal } from './Interface/I_Broadcast';
import Builder from './Builder';
import Broadcast from './Broadcast';
export default class Unicorn {
    protected __BUILD_RECORD__: Set<string>;
    protected __BUILD_STACK__: any[] = [];
    private __BROAD_CAST__: IBroadcast;

    constructor() {
        emitLog(ELogType.lifeCycle, 'unicorn constructor');
        this.__BUILD_RECORD__ = new Set<string>();
        this.__BROAD_CAST__ = new Broadcast();
    }

    public builder(builderParams: IBuilderParam) {
        if (!builderParams || !builderParams.namespace || this.__BUILD_RECORD__.has(builderParams.namespace)) {
            emitLog(ELogType.lifeCycle, 'builder error');
            return null;
        }
        this.__BUILD_RECORD__.add(builderParams.namespace);
        const builderInstance = new Builder(builderParams, this.tunnel, this.signal());
        this.__BUILD_STACK__.push({
            key: builderParams.namespace,
            instance: builderInstance
        });
        return builderInstance;
    }

    private tunnel(builderName: string, actionName: string, payload?: any): void {
        if (!builderName || !actionName || !this.__BUILD_RECORD__.has(builderName)) {
            return;
        }
        const builderChannel = this.__BUILD_STACK__.find((builder: any) => builder.key === builderName).instance;
        builderChannel.UCViewModel.dispatch(actionName, payload);
    }

    private signal(): ISignal {
        const runSubscribe = (behaviorName: string): void => {
            const broadcastSubscribe: IBroadcastSubject | undefined = this.__BROAD_CAST__.getSubscribe(behaviorName);
            if (broadcastSubscribe) {
                const builderChannel = this.__BUILD_STACK__.find(
                    (builder: any) => builder.key === broadcastSubscribe.builderName
                ).instance;
                builderChannel.UCViewModel.dispatch(broadcastSubscribe.actionName, broadcastSubscribe.payload);
            }
        };
        return {
            subscribe: this.__BROAD_CAST__.subscribe,
            unSubscribe: this.__BROAD_CAST__.unSubscribe,
            doSubscribe: runSubscribe
        };
    }
}
