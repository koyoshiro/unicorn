import { I_UC_Model } from '../Interface/I_UC_Model';
import { Observable } from '../Core/index';
export default class UC_Model implements I_UC_Model {
    public readonly observedModel: any = null;
    public readonly Effect: any;

    public constructor(modelData: any) {
        if (!modelData) {
            console.error('modelParam is error');
            return;
        }
        this.observedModel = this.createObservable(modelData);
    }

    private createObservable = (dataSource: any) => {
        if (typeof dataSource === 'object') {
            return new Observable(dataSource);
        } else {
            console.error('参数数据需为对象');
            return null;
        }
    };

    private ergodicDataSource(dataSource: any){
        const keys = Object.keys(dataSource);
        keys.forEach(key => {
           if(typeof dataSource[key] === 'object'){
               
           }
        });
    }

    public replaceModel(){
        
    }
}
