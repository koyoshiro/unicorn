import * as React from 'react';

interface IProp {
    _change: () => void;
}

const inject = (viewModel: any) => {
    return function withStore(WrappedComponent: React.Component) {
        class StoreWrapper extends React.Component {
            private _change: any;
            constructor(props: IProp) {
                super(props);

                this._change = (obj: any) => {
                    const state: any = {};

                    state[obj.key] = obj.value;
                    this.setState(state);
                };

                viewModel.on('change', this._change);
                WrappedComponent.prototype.viewModel = viewModel;
            }

            render() {
                return <WrappedComponent viewModel={viewModel} {...this.props} />;
            }

            shouldComponentUpdate() {
                return false; // 模块只能被初始化一次，不允许更新
            }
        }
        return StoreWrapper;
    };
};

export { inject };
