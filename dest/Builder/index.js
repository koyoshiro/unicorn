"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Model_1 = require("../Model");
const ViewModel_1 = require("../ViewModel");
const View_1 = require("../View");
class Builder {
    constructor(builderParams, tunnel, builderSignal) {
        this.__NAME_SPACE__ = '';
        this.observedModel = null;
        this.wrappedComponent = null;
        this.iteratorRender = this.doRender();
        if (!builderParams) {
            return;
        }
        this.__CONFIG__ = builderParams;
        this.__NAME_SPACE__ = this.__CONFIG__.namespace;
        this.tunnel = tunnel;
        this.signal = builderSignal;
        if (this.__CONFIG__.subscriptions && this.__CONFIG__.subscriptions.setup) {
            this.doSetup(this.__CONFIG__.subscriptions.setup);
        }
        else {
            this.__CONFIG__.model = new Model_1.default(this.__CONFIG__.model);
        }
        const viewModelParams = {
            state: this.__CONFIG__.state,
            actions: this.__CONFIG__.actions
        };
        this.UC_VIEW_MODEL = new ViewModel_1.default(viewModelParams, this.call);
    }
    doSetup(setup) {
        return setup()
            .then((res) => {
            this.__CONFIG__.model = new Model_1.default(res).observedModel;
            this.UC_VIEW_MODEL.init(this.__CONFIG__.model);
            this.iteratorRender.next();
        })
            .catch((err) => {
            console.log(err);
        });
    }
    *doRender() {
        yield this.UC_VIEW_MODEL.reactiveView.setState({ vm: this.UC_VIEW_MODEL });
    }
    render(renderComponent) {
        this.renderComponent = renderComponent;
        const StoreWrapper = View_1.connect(this.UC_VIEW_MODEL, this.renderComponent);
        this.wrappedComponent = react_1.default.createElement(StoreWrapper, null);
        if (this.__CONFIG__.subscriptions && this.__CONFIG__.subscriptions.setup) {
            console.log('wait autoRender');
        }
        else {
            this.iteratorRender.next();
        }
    }
    replaceModel(modelData) {
        this.__CONFIG__.model = new Model_1.default(modelData).observedModel;
        this.UC_VIEW_MODEL.init(this.__CONFIG__.model);
    }
    call(dispatchTarget, payload) {
        const builderName = dispatchTarget.split('/')[0];
        const actionName = dispatchTarget.split('/')[1];
        if (builderName === this.__NAME_SPACE__) {
            this.UC_VIEW_MODEL.dispatch(payload);
        }
        else {
            this.tunnel(builderName, actionName, payload);
        }
    }
}
exports.default = Builder;
