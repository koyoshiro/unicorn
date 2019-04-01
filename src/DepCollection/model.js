import Observable from './observable';
export default class Model {
    _NAME_SPACE = '';
    OBSERVABLE_OBJECT = null;
    constructor(nameSpace, modelParameterObject) {
        if (!modelParameterObject) {
            console.error('modelParameterObject is undefined');
            return;
        }
        this._NAME_SPACE = nameSpace ? nameSpace : '';

        if (!modelParameterObject.data) {
            console.error('modelParameterObject.data is undefined');
            return;
        }
        this.OBSERVABLE_OBJECT = this._CreateObservable(modelParameterObject.data);
    };

    _CreateObservable = (dataSource) => {
        if (Array.isArray(dataSource)) {
            dataSource.forEach(obj => {
                _CreateObservable(obj);
            });
        } else if (isTypeOf(dataSource, "object")) {
            return new Observable(dataSource);
        } else {
            console.error('不存在数据是一个值');
        }
    }
}