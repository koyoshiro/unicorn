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
    data: inputData,
    effects: {
        *fetchServer(requireParams) {
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
    },
    listener: {
        // todo 监听模块之间通信使用
    }
});

// 实例化ViewModel后,生成的VM对象用于组件内的渲染与事件
ucA.viewModel({
    store: {
        count: {
            handle: () => {
                return ucModelA.observedModel.array[0].val;
            },
            onComputedUpdate: () => {}
        },
        result: {
            handle: () => {
                return ucModelA.observedModel.root.fatherNode.childNode.node > this.count ? true : false;
            },
            onComputedUpdate: handleRst => {
                console.log(handleRst ? 'yes' : 'no');
            }
        }
    },
    actions: {
        // payload 需要传递的信息
        add(payload) {
            ucModelA.observedModel.array[0].val++;
        },
        // payload 需要传递的信息
        minus(payload) {
            ucModelA.observedModel.array[0].val--;
        },
        asyncAdd() {
            setTimeout(() => {
                this.add;
            }, 500);
        },
        asyncRequire() {
            ucModelA.effects.fetchServer();
        }
    }
});

ucA.view(function(props) {
    const { actions, dispatch } = props;
    const { count, result } = props.state;

    return (
        <div>
            <span>{count}</span>
            <span>{result}</span>
            <div>
                <button onClick={() => dispatch(actions.add)}>add</button>
                <button onClick={() => dispatch(actions.minus)}>minus</button>
                <button onClick={() => dispatch(actions.asyncAdd)}>async</button>
                <button onClick={() => dispatch(actions.asyncRequire)}>async</button>
            </div>
        </div>
    );
});

ucA.render(
    class App extends React.Component {
        constructor(props) {
            this.viewModel = props.viewModel;
            const { actions, dispatch } = props.viewModel;
            const { count, result } = props.viewModel.store;
            this.actions = actions;
            this.dispatch = dispatch;
            this.count = count;
            this.result = result;
        }
        render() {
            return (
                <Wrapper>
                    <span>{this.count}</span>
                    <span>{this.result}</span>
                    <div>
                        <button onClick={() => dispatch(this.actions.add)}>add</button>
                        <button onClick={() => dispatch(this.actions.minus)}>minus</button>
                        <button onClick={() => dispatch(this.actions.asyncAdd)}>async</button>
                        <button onClick={() => dispatch(this.actions.asyncRequire)}>async</button>
                    </div>
                </Wrapper>
            );
        }
    }
);

ReactDOM.render(<App />, document.getElementById('root'));
