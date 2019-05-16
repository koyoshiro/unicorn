"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
class DefaultComponent extends react_1.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return react_1.default.createElement("h1", null, "hello");
    }
    componentDidMount() {
    }
    shouldComponentUpdate() {
        //return false; // 模块只能被初始化一次，不允许更新
    }
}
exports.default = DefaultComponent;
