import React from 'react';
import Unicorn from '../Unicorn';

const UC = new Unicorn();
const ucA = UC.builder({
    namespace: 'ucA',
    data: {},
    state: {
        arrayVal: {
            map: obm => {
                debugger;
                return obm.array[0];
            },
            handler: map => {
                debugger;
                return map.val;
            },
            onComputedUpdate: () => {}
        },
        treeVal: {
            map: obm => {
                debugger;
                return obm.root.fatherNode.childNode;
            },
            handler: map => {
                debugger;
                return map.node;
            },
            onComputedUpdate: handleRst => {
                console.log(handleRst ? 'yes' : 'no');
            }
        }
    },
    actions: {
        // payload 需要传递的信息
        add(payload) {
            this.observedModel.array[0].val += payload;
        },
        // payload 需要传递的信息
        minus(payload) {
            this.observedModel.array[0].val--;
        },
        asyncAdd() {
            setTimeout(() => {
                this.observedModel.root.fatherNode.childNode.node += 8;
            }, 500);
        },
        asyncRequire() {}
    },
    effects: {
        fetchServer() {
            const inputData = {
                num: 1,
                str: 'example',
                root: {
                    fatherNode: {
                        childNode: {
                            node: 5
                        }
                    }
                },
                array: [
                    {
                        key: 'A',
                        val: 3
                    },
                    {
                        key: 'B',
                        val: 4
                    }
                ]
            };
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('new Promise');
                    resolve(inputData);
                }, 2000);
            });
        }
    },
    subscriptions: {
        subName: {
            builderName: '',
            actionName: '',
            payload: ''
        }
    }
});

class ContextComponent extends React.Component {
    constructor(props) {
        const { dispatch } = props.viewModel;
        this.dispatch = dispatch;
    }

    compare() {
        if (this.props.viewModel.store.arrayVal < this.props.viewModel.store.treeVal) {
            return <span>{this.props.viewModel.store.str}</span>;
        }
        return <span>{this.props.viewModel.store.num}</span>;
    }

    render() {
        return (
            <div>
                <span>{this.props.viewModel.store.arrayVal}</span>
                <div>
                    <button onClick={() => this.dispatch('add', 2)}>add</button>
                    <button onClick={() => this.dispatch('minus')}>minus</button>
                    <button onClick={() => this.dispatch('asyncAdd')}>async</button>
                    <button onClick={() => this.dispatch(this.actions.asyncRequire)}>async</button>
                    <button onClick={() => this.subscribe('AAA', () => {})}>subscribe</button>
                    <button onClick={() => this.unSubscribe('AAA')}>unSubscribe</button>
                    <button onClick={() => this.sendEvent('AAA')}>sendEvent</button>
                    <button onClick={() => this.crossCall('ucB', 'add')}>crossCall</button>
                </div>
                <span>{this.props.viewModel.store.treeVal}</span>
                {this.compare()}
            </div>
        );
    }
}

ucA.render(ContextComponent);
export default ucA.wrappedComponent;
