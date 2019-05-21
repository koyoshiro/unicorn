"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const connect = (viewModel, RenderComponent) => {
    class StoreWrapper extends react_1.React.Component {
        constructor(props) {
            super(props);
            this.state = {
                vm: viewModel.store
            };
            props._change = this.doSomething;
            // this.doSomething = this.doSomething.bind(this);
        }
        render() {
            return react_1.React.createElement(RenderComponent, { viewModel: this.state.vm });
        }
        componentDidMount() {
            viewModel.registerView(this);
        }
        doSomething(viewModel) {
            this.setState({ vm: viewModel.store });
        }
        shouldComponentUpdate() {
            //return false; // 模块只能被初始化一次，不允许更新
        }
    }
    return StoreWrapper;
};
exports.connect = connect;
