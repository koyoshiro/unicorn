"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Model_1 = require("../Model");
const ViewModel_1 = require("../ViewModel");
const View_1 = require("../View");
class Builder {
    constructor(builderParams, tunnel) {
        this.__NameSpace__ = '';
        this.__Configs__ = {};
        this.UCModel = null;
        this.UCViewModel = null;
        this.observedModel = null;
        this.wrappedComponent = defaultComponent;
        this.iteratorRender = this.doRender();
        this.tunnel = () => { };
        if (!builderParams) {
            return;
        }
        this.__Configs__ = builderParams;
        this.__NameSpace__ = this.__Configs__.namespace;
        this.tunnel = tunnel;
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
        this.UCViewModel = new ViewModel_1.default(viewModelParams, this.call);
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
        yield this.wrappedComponent.setState({ vm: this.UCViewModel });
        yield this.UCViewModel.reactiveView.setState({ vm: this.UCViewModel });
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
    replaceModel(modelData) {
        this.__Configs__.model = new Model_1.default(modelData).observedModel;
        this.UCViewModel.init(this.__Configs__.model);
    }
    call(dispatchTarget, payload) {
        const builderName = dispatchTarget.split('/')[0];
        const actionName = dispatchTarget.split('/')[1];
        if (builderName === this.__NameSpace__) {
            this.UCViewModel.dispatch(payload);
        }
        else {
            this.tunnel(builderName, actionName, payload);
        }
    }
}
exports.default = Builder;
