import { UC_Model_interface } from "./Interface/UC_Model_Interface";

export default class UC_Model implements UC_Model_interface {
        __NameSpace__: string = "";
        OBSERVABLE_OBJECT = null;
        Effect: []; //todo
        Subscribe: []; //todo
        Listener: []; //todo

        protected constructor(nameSpace, modelParameterObject) {
                if (!modelParameterObject) {
                        console.error("modelParameterObject is undefined");
                        return;
                }
                this.__NameSpace__ = nameSpace ? nameSpace : "";

                if (!modelParameterObject.data) {
                        console.error("modelParameterObject.data is undefined");
                        return;
                }
                this.OBSERVABLE_OBJECT = this._CreateObservable(
                        modelParameterObject.data
                );
        }

        private _CreateObservable = (dataSource:any) => {
                if (Array.isArray(dataSource)) {
                    for(let obj of dataSource){
                        this._CreateObservable(obj);
                    }
                } else if (isTypeOf(dataSource, "object")) {
                        return new Observable(dataSource);
                } else {
                        console.error("不存在数据是一个值");
                }
        };
}
