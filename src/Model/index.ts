import { IModel } from '../Interface/I_UC_Model';
import { Observable } from '@vanir/unicorn-core';
export default class UCModel implements IModel {
    public observedModel: any = null;

    public constructor(modelData: any) {
        if (!modelData) {
            console.error('modelParam is error');
            return;
        }
        this.createObservable(modelData);
    }

    private createObservable(dataSource: any) {
        this.observedModel = this.recursiveDataSource(dataSource);
    }

    private recursiveDataSource(dataSource: any) {
        // 对数据结构中统一处理为Proxy类型
        const obsField: any = new Observable(dataSource);

        // 遍历Proxy内容中的每个字段
        Object.keys(obsField).forEach((key: string) => {
            // 若为object或array则递归
            if (typeof obsField[key] === 'object' || Array.isArray(obsField[key])) {
                obsField[key] = this.recursiveDataSource(obsField[key]); // 覆盖原字段的值为Proxy类型
            }
        });
        return obsField;
    }
}
