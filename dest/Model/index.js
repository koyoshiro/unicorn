"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../Core/index");
class UCModel {
    constructor(modelData) {
        this.observedModel = null;
        if (!modelData) {
            console.error('modelParam is error');
            return;
        }
        this.createObservable(modelData);
    }
    createObservable(dataSource) {
        this.observedModel = this.recursiveDataSource(dataSource);
    }
    recursiveDataSource(dataSource) {
        // 对数据结构中统一处理为Proxy类型
        const obsField = new index_1.Observable(dataSource);
        // 遍历Proxy内容中的每个字段
        Object.keys(obsField).forEach((key) => {
            // 若为object或array则递归
            if (typeof obsField[key] === 'object' || Array.isArray(obsField[key])) {
                obsField[key] = this.recursiveDataSource(obsField[key]); // 覆盖原字段的值为Proxy类型
            }
        });
        return obsField;
    }
}
exports.default = UCModel;
