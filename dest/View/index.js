"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const connect = (viewModel, renderComponent) => {
    class StoreWrapper extends react_1.Component {
        constructor(props) {
            super(props);
            this.state = {
                vm: viewModel
            };
        }
        render() {
            return react_1.createElement("renderComponent", { viewModel: this.state.vm });
        }
        componentDidMount() {
            viewModel.registerView(this);
        }
        doSomething(viewModel) {
            this.setState({ vm: viewModel });
        }
        shouldComponentUpdate() {
            //return false; // 模块只能被初始化一次，不允许更新
        }
    }
    return StoreWrapper;
};
exports.connect = connect;
