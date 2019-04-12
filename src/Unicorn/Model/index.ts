import { UC_Model_interface } from './Interface/UC_Model_Interface';
import { Observable } from '../Core/index';
import { isObject } from 'src/Util';
export default class UC_Model implements UC_Model_interface {
    __NameSpace__: string = '';
    OBSERVABLE_OBJECT:any;
    Effect: []; //todo
    Subscribe: []; //todo
    Listener: []; //todo

    protected constructor(nameSpace:string, modelParam:any) {
        if (!modelParam) {
            console.error('modelParam is undefined');
            return;
        }
        this.__NameSpace__ = nameSpace ? nameSpace : '';

        if (!modelParam.data) {
            console.error('modelParam.data is undefined');
            return;
        }
        this.OBSERVABLE_OBJECT = this._CreateObservable(modelParam.data);
    }

    private _CreateObservable = (dataSource: any) => {
        if (isObject(dataSource)) {
            return new Observable(dataSource);
        } else {
            console.error('参数数据需为对象');
            return null;
        }
    };
}
