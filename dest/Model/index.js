"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../Core/index");
class UC_Model {
    constructor(modelData) {
        this.observedModel = null;
        this._createObservable = (dataSource) => {
            if (typeof dataSource === 'object') {
                return new index_1.Observable(dataSource);
            }
            else {
                console.error('参数数据需为对象');
                return null;
            }
        };
        if (!modelData) {
            console.error('modelParam is error');
            return;
        }
        this.observedModel = this._createObservable(modelData);
    }
    replaceModel() {
    }
}
exports.default = UC_Model;
