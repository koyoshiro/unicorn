"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const connect = (viewModel, RenderComponent) => {
    class StoreWrapper extends react_1.React.Component {
        constructor(props) {
            super(props);
            this.state = {
                vm: viewModel
            };
        }
        render() {
            return react_1.React.createElement(RenderComponent, { viewModel: this.state.vm });
        }
        componentDidMount() {
            viewModel.registerView(this);
        }
    }
    return StoreWrapper;
};
exports.connect = connect;
