import { Store, inject } from '../src';
import React from 'react';
import ReactDOM from 'react-dom';

// Page
const UC = new Unicorn();

// ComponentA
const ucA = new UC.Builder('ucA');

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
    array: [{ key: 'A', val: 3 }, { key: 'B', val: 4 }]
};

const ucModelA = ucA.model({
    dataSource: inputData,
    effects: {
        fetchServer(requireParams) {
            const data = ajax.require(requireParams);
            this.reloadModel(data);
            // const user = yield call(fetchUser, id);
            // yield put({ type: 'saveUser', payload: user });
        }
    },
    subscriptions: {
        keyEvent({ dispatch }) {
            key('⌘+up, ctrl+up', () => {
                dispatch({ type: 'add' });
            });
        }
    }
});

// 实例化ViewModel后,生成的VM对象用于组件内的渲染与事件
ucA.viewModel({
    store: {
        count: {
            handle: () => {
                return ucA.observedModel.array[0].val;
            },
            onComputedUpdate: () => {}
        },
        result: {
            handle: () => {
                return ucA.observedModel.root.fatherNode.childNode.node > this.count ? true : false;
            },
            onComputedUpdate: handleRst => {
                console.log(handleRst ? 'yes' : 'no');
            }
        }
    },
    actions: {
        // payload 需要传递的信息
        add(payload) {
            ucA.observedModel.array[0].val++;
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
            ucA.effects.fetchServer();
        }
    }
});

ucA.render(
    class App extends React.Component {
        constructor(props) {
            this.viewModel = props.viewModel;
            const { actions, dispatch } = props.viewModel;
            const { count, result } = props.viewModel.store;
            const { subscribe, unSubscribe,sendEvent,crossCall } = props.builder;
            this.actions = actions;
            this.dispatch = dispatch;
            this.count = count;
            this.result = result;
            this.subscribe = subscribe;
            this.unSubscribe = unSubscribe;
            this.sendEvent = sendEvent;
            this.crossCall = crossCall;
        }
        render() {
            return (
                <Wrapper>
                    <span>{this.count}</span>
                    <span>{this.result}</span>
                    <div>
                        <button onClick={() => this.dispatch(this.actions.add)}>add</button>
                        <button onClick={() => this.dispatch(this.actions.minus)}>minus</button>
                        <button onClick={() => this.dispatch(this.actions.asyncAdd)}>async</button>
                        <button onClick={() => this.dispatch(this.actions.asyncRequire)}>async</button>
                        <button onClick={() => this.subscribe('AAA',()=>{})}>subscribe</button>
                        <button onClick={() => this.unSubscribe('AAA')}>unSubscribe</button>
                        <button onClick={() => this.sendEvent('AAA')}>sendEvent</button>
                        <button onClick={() => this.crossCall('ucB','add')}>crossCall</button>
                    </div>
                </Wrapper>
            );
        }
    }
);

ReactDOM.render(<App />, document.getElementById('root'));
