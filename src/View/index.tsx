import React, { Component } from 'react';

interface IProp {
    _change: () => void;
}

const connect = (viewModel: any, RenderComponent: Component): Component => {
    class StoreWrapper extends React.Component {
        private state: any;

        constructor(props: IProp) {
            super(props);
            this.state = {
                vm: viewModel.store
            };
        }

        private render() {
            return <RenderComponent viewModel={this.state.vm} />;
        }

        private componentDidMount() {
            viewModel.registerView(this);
        }

        public doSomething(viewModel: any) {
            this.setState({ vm: viewModel.store });
        }

        private shouldComponentUpdate() {
            //return false; // 模块只能被初始化一次，不允许更新
        }
    }
    return StoreWrapper;
};

export { connect };
