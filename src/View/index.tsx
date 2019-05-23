import { React } from 'react';

interface IProp {
    _change: (payload: any) => void;
}

const connect = (viewModel: any, RenderComponent: React.Component): React.Component => {
    class StoreWrapper extends React.Component {
        private state: any;

        constructor(props: IProp) {
            super(props);
            this.state = {
                vm: viewModel
            };
        }

        private render() {
            return <RenderComponent viewModel={this.state.vm} />;
        }

        private componentDidMount() {
            viewModel.registerView(this);
        }

        // public doSomething(viewModel: any) {
        //     this.setState({ vm: viewModel.store });
        // }

        // private shouldComponentUpdate() {
        //     //return false; // 模块只能被初始化一次，不允许更新
        // }
    }
    return StoreWrapper;
};

export { connect };
