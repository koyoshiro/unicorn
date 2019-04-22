import { I_UC_Model } from '../Interface/I_UC_Model';
import { Observable } from '../Core/index';
export default class UC_Model implements I_UC_Model {
    public observedModel: any;
    Effect: []; //todo
    Subscribe: []; //todo
    Listener: []; //todo

    public constructor(modelParam: any) {
        if (!modelParam) {
            console.error('modelParam is undefined');
            return;
        }

        if (!modelParam.data) {
            console.error('modelParam.data is undefined');
            return;
        }
        this.observedModel = this._CreateObservable(modelParam.data);
    }

    private _CreateObservable = (dataSource: any) => {
        if (typeof dataSource === 'object') {
            return new Observable(dataSource);
        } else {
            console.error('参数数据需为对象');
            return null;
        }
    };
}
