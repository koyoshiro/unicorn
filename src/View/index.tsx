import React, { Component } from 'react';

interface IProp {
    _change: () => void;
}

const inject = (viewModel: any): Component => {
    return function withStore(wrappedComponent: Component) {
        class StoreWrapper extends Component {
            constructor(props: IProp) {
                super(props);
            }

            private render() {
                return <wrappedComponent viewModel={viewModel} />;
            }

            private componentDidMount() {
                viewModel.registerView(this);
            }

            private shouldComponentUpdate() {
                //return false; // 模块只能被初始化一次，不允许更新
            }
        }
        return StoreWrapper;
    };
};

const connect = (viewModel: any, component: Component) => {
    
};

export { inject };
