import React, { Component } from 'react';

interface IProp {
    _change: () => void;
}

const connect = (viewModel: any, renderComponent: Component): Component => {
    class StoreWrapper extends Component {
        private state: any;

        constructor(props: IProp) {
            super(props);
            this.state = {
                vm: viewModel
            };
        }

        private render() {
            return <renderComponent viewModel={this.state.vm} />;
        }

        private componentDidMount() {
            viewModel.registerView(this);
        }

        public doSomething(viewModel: any) {
            this.setState({ vm: viewModel });
        }

        private shouldComponentUpdate() {
            //return false; // 模块只能被初始化一次，不允许更新
        }
    }
    return StoreWrapper;
};

export { connect };
