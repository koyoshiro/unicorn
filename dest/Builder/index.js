"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Model_1 = require("../Model");
const ViewModel_1 = require("../ViewModel");
const View_1 = require("../View");
const default_1 = require("./default");
class Builder {
    // private iteratorStart: any = this.doStart();
    constructor(builderParams) {
        this.__NameSpace__ = '';
        this.__Configs__ = {};
        this.UCModel = null;
        this.UCViewModel = null;
        this.observedModel = null;
        this.wrappedComponent = default_1.default;
        this.iteratorRender = this.doRender();
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
            this.iteratorRender.next();
            // this.iteratorStart.next();
        })
            .catch((err) => {
            console.log(err);
        });
    }
    *doRender() {
        yield this.wrappedComponent.doSomething(this.UCViewModel);
    }
    render(renderComponent) {
        this.renderComponent = renderComponent;
        const StoreWrapper = View_1.connect(this.UCViewModel, this.renderComponent);
        this.wrappedComponent = react_1.default.createElement(StoreWrapper, null);
        if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
            console.log('wait autoRender');
        }
        else {
            this.iteratorRender.next();
        }
    }
    // private *doStart(wrappedComponent?: Component) {
    //     yield (this.wrappedComponent = wrappedComponent);
    //     return yield this.wrappedComponent;
    // }
    // protected start() {
    //     // this.iteratorStart = this.doStart();
    //     if (this.__Configs__.subscriptions && this.__Configs__.subscriptions.setup) {
    //         console.log('wait autoRender');
    //     } else {
    //         this.iteratorStart.next();
    //         return this.iteratorStart.next();
    //     }
    // }
    replaceModel(modelData) {
        this.__Configs__.model = new Model_1.default(modelData).observedModel;
        this.UCViewModel.init(this.__Configs__.model);
    }
}
exports.default = Builder;
