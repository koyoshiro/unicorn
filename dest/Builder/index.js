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
            this.doSetup(this.__Configs__.subscriptions.setup);
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
    doSetup(setup) {
        return setup()
            .then((res) => {
            this.__Configs__.model = new Model_1.default(res).observedModel;
            this.UCViewModel.init(this.__Configs__.model);
            const allowRender = this.doRender();
            allowRender.next();
        })
            .catch((err) => {
            console.log(err);
        });
    }
    *doRender() {
        yield View_1.inject(this.UCViewModel)(this.renderComponent);
    }
    render(renderComponent) {
        this.renderComponent = renderComponent;
        if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
            console.log('wait autoRender');
        }
        else {
            const allowRender = this.doRender();
            allowRender.next();
        }
    }
    replaceModel(modelData) {
        this.__Configs__.model = new Model_1.default(modelData).observedModel;
        this.UCViewModel.init(this.__Configs__.model);
    }
}
exports.default = Builder;
