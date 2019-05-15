"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const inject = (viewModel) => {
    return function withStore(wrappedComponent) {
        class StoreWrapper extends react_1.Component {
            constructor(props) {
                super(props);
            }
            render() {
                return react_1.default.createElement("wrappedComponent", { viewModel: viewModel });
            }
            componentDidMount() {
                viewModel.registerView(this);
            }
            shouldComponentUpdate() {
                //return false; // 模块只能被初始化一次，不允许更新
            }
        }
        return StoreWrapper;
    };
};
exports.inject = inject;
const connect = (viewModel, component) => {
};
