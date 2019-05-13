"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("../Model");
const ViewModel_1 = require("../ViewModel");
const View_1 = require("../View");
class Builder {
    constructor(builderParams) {
        this.__NameSpace__ = '';
        this.__Configs__ = {};
        this.UCModel = null;
        this.UCViewModel = null;
        this.observedModel = null;
        if (!builderParams) {
            return;
        }
        this.__Configs__ = builderParams;
        this.__NameSpace__ = this.__Configs__.namespace;
        if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
            const res = this.__Configs__.subscriptions.setup();
            const initIt = this.init();
            initIt.next(res);
            initIt.next();
        }
        else {
            this.__Configs__.model = new Model_1.default(this.__Configs__.model);
        }
        const viewModelParams = {
            state: this.__Configs__.state,
            actions: this.__Configs__.actions
        };
        this.UCViewModel = new ViewModel_1.default(viewModelParams);
    }
    *init(modelData) {
        this.__Configs__.model = yield new Model_1.default(modelData);
        yield this.UCViewModel.init(this.__Configs__.model);
    }
    render(renderComponent) {
        setTimeout(() => {
            View_1.inject(this.UCViewModel)(renderComponent);
        }, 1000);
    }
    replaceModel(modelData) {
        this.__Configs__.model = new Model_1.default(modelData);
        this.UCViewModel.init(this.__Configs__.model);
    }
}
exports.default = Builder;
