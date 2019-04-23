import BaseApiDesc from './BaseApiDesc';
import { logKey } from './LogKey';
import * as Logger from '../../Logger';

type IApiDesc<U, V> = new (...args: any[]) => BaseApiDesc<U, V>;
type IApi<U, V> = (param: U) => V;

export default class ApiBus {
    private apiCollection: Map<any, any> = new Map();

    public refreshBus() {
        this.apiCollection = new Map();
    }

    public registerApi<U, V>(apiDescClas: IApiDesc<U, V>, api: IApi<U, V>) {
        if (this.apiCollection.get(apiDescClas) && __DEV__) {
            throw new Error('重复的api函数');
        }
        Logger.logTrace(logKey.registerApi, {
            funcName: apiDescClas.name
        });
        this.apiCollection.set(apiDescClas, api);
    }

    public callApi<U, V>(
        apiDesc: BaseApiDesc<U, V>
    ): V {
        const apiFunction = this.apiCollection.get(apiDesc.constructor) as (IApi<U, V> | undefined);
        if (!apiFunction) {
            throw new Error('不存在对应的api函数');
        }
        Logger.logTrace(logKey.callApi, {
            funcName: apiDesc.constructor && apiDesc.constructor.name
        });
        return apiFunction(apiDesc.getParam());
    }
}
