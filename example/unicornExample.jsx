import { Store, inject } from '../src';
import React from 'react';
import ReactDOM from 'react-dom';
import { call } from '../src/Generate/call';

// Page
const UC = new Unicorn();

// 外部输入参数
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

// ComponentA
const ucA = new UC.Builder({
    namespace: 'ucA',
    model: {},
    state: {
        count: {
            handle: () => {
                return model.array[0].val;
            },
            onComputedUpdate: () => {}
        },
        result: {
            handle: () => {
                return model.root.fatherNode.childNode.node > this.count ? true : false;
            },
            onComputedUpdate: handleRst => {
                console.log(handleRst ? 'yes' : 'no');
            }
        }
    },
    actions: {
        // payload 需要传递的信息
        add(payload) {
            model.array[0].val++;
        },
        // payload 需要传递的信息
        minus(payload) {
            ucA.observedModel.array[0].val--;
        },
        asyncAdd() {
            setTimeout(() => {
                this.actions.add;
            }, 500);
        },
        asyncRequire() {
            effects.fetchServer();
        }
    },
    effects: {
        fetchServer(requireParams) {
            const data = ajax.require(requireParams);
            return data;
            // const user = yield call(fetchUser, id);
            // yield put({ type: 'saveUser', payload: user });
        }
    },
    subscriptions: {
        setup() {
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
            setTimeout(() => {
                debugger;
                return inputData;
            }, 2000);
        },
        keyEvent({ dispatch }) {
            key('⌘+up, ctrl+up', () => {
                dispatch({
                    type: 'add'
                });
            });
        }
    }
});

function fetchData(){
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
    setTimeout(() => {
        debugger;
        return inputData;
    }, 2000);
}

class App extends React.Component {
    constructor(props) {
        const { dispatch } = props.viewModel,
            { count, result } = props.viewModel.store;
        this.dispatch = dispatch;
        this.count = count;
        this.result = result;
    }
    render() {
        <Wrapper>
            <span>{this.count}</span>
            <span>{this.result}</span>
            <div>
                <button onClick={() => this.dispatch('add', 2)}>add</button>
                <button onClick={() => this.dispatch(this.actions.minus)}>minus</button>
                <button onClick={() => this.dispatch(this.actions.asyncAdd)}>async</button>
                <button onClick={() => this.dispatch(this.actions.asyncRequire)}>async</button>
                <button onClick={() => this.subscribe('AAA', () => {})}>subscribe</button>
                <button onClick={() => this.unSubscribe('AAA')}>unSubscribe</button>
                <button onClick={() => this.sendEvent('AAA')}>sendEvent</button>
                <button onClick={() => this.crossCall('ucB', 'add')}>crossCall</button>
            </div>
        </Wrapper>;
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
