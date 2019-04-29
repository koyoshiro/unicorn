import { I_UC_Model } from '../Interface/I_UC_Model';
import { Observable } from '../Core/index';
export default class UC_Model implements I_UC_Model {
    public readonly observedModel: any = null;
    public readonly Effect: any;

    public constructor(modelParam: any) {
        
        if (modelParam.dataSource) {
            this.observedModel =this._createObservable(modelParam.dataSource);
        }

        if (modelParam.effects) {
            this.Effect = modelParam.effects;
        } else if (modelParam.effects.fetch) {
            modelParam.dataSource = this._fetchServer(modelParam.effects.fetch);
            this.observedModel = this._createObservable(modelParam.dataSource);
        } else {
            console.error('modelParam is error');
            return;
        }
    }

    private async _fetchServer(effectFetch: () => any) {
        const fetchData = await effectFetch();
        return fetchData;
    }

    private _createObservable = (dataSource: any) => {
        if (typeof dataSource === 'object') {
            return new Observable(dataSource);
        } else {
            console.error('参数数据需为对象');
            return null;
        }
    };
}
