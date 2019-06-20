"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const I_UC_Log_1 = require("../Interface/I_UC_Log");
const log_1 = require("../Util/log");
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
        if (this.__CONFIG__.effects && this.__CONFIG__.effects.fetchServer) {
            this.doSetup(this.__CONFIG__.effects.fetchServer);
        }
        else {
            this.__CONFIG__.model = new Model_1.default(this.__CONFIG__.model);
        }
        const viewModelParams = {
            state: this.__CONFIG__.state,
            actions: this.__CONFIG__.actions
        };
        this.UC_VIEW_MODEL = new ViewModel_1.default(viewModelParams, this.call, this.signal);
        this.doSubscribe();
        log_1.emitLog(I_UC_Log_1.ELogType.lifeCycle, 'builder init finish');
    }
    doSetup(setup) {
        return setup()
            .then((res) => {
            this.__CONFIG__.model = new Model_1.default(res).observedModel;
            this.UC_VIEW_MODEL.init(this.__CONFIG__.model);
            this.iteratorRender.next();
            log_1.emitLog(I_UC_Log_1.ELogType.lifeCycle, 'doSetup');
        })
            .catch((err) => {
            console.log(err);
        });
    }
    *doRender() {
        yield this.UC_VIEW_MODEL.reactiveView.setState({ vm: this.UC_VIEW_MODEL });
        log_1.emitLog(I_UC_Log_1.ELogType.lifeCycle, 'doRender');
    }
    doSubscribe() {
        if (this.__CONFIG__.subscriptions) {
            const subscriptions = this.__CONFIG__.subscriptions;
            Object.keys(subscriptions).forEach((behaviorName) => {
                const behavior = subscriptions[behaviorName];
                this.signal.subscribe(behaviorName, behavior);
            });
        }
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
        log_1.emitLog(I_UC_Log_1.ELogType.lifeCycle, 'render');
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
    runSubscribe(behaviorName) {
        if (behaviorName) {
            return this.signal.doSubscribe(behaviorName);
        }
        return undefined;
    }
    unSubscribe(behaviorName) {
        this.signal.unSubscribe(behaviorName);
    }
}
exports.default = Builder;
