import React, { Component } from 'react';

interface IProp {
    _change: () => void;
}

const inject = (viewModel: any): Component => {
    return function withStore(WrappedComponent: Component) {
        class StoreWrapper extends Component {
            constructor(props: IProp) {
                super(props);
            }

            render() {
                return <WrappedComponent viewModel={viewModel} />;
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

export { inject };
