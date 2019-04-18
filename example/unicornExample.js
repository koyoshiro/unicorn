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

ucA.model({
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
                return phxA.MODEL.array[0].val;
            },
            onComputedUpdate: () => {}
        },
        result: {
            handle: () => {
                return phxA.MODEL.root.fatherNode.childNode.node > this.count ? true : false;
            },
            onComputedUpdate: handleRst => {
                console.log(handleRst ? 'yes' : 'no');
            }
        }
    },
    actions: {
        // payload 需要传递的信息
        add(payload) {
            phxA.MODEL.array[0].val++;
        },
        // payload 需要传递的信息
        minus(payload) {
            phxA.MODEL.array[0].val--;
        },
        asyncAdd() {
            setTimeout(() => {
                this.add;
            }, 500);
        },
        asyncRequire() {
            phxA.model.effects.fetchServer();
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

@phxA.inject()
class App extends React.Component {
    render() {
        const { actions, dispatch } = phxA.VIEW_MODEL;
        const { count, result } = phxA.VIEW_MODEL.state;

        return (
            <Wrapper>
                <span>{count}</span>
                <span>{result}</span>
                <div>
                    <button onClick={() => dispatch(actions.add)}>add</button>
                    <button onClick={() => dispatch(actions.minus)}>minus</button>
                    <button onClick={() => dispatch(actions.asyncAdd)}>async</button>
                    <button onClick={() => dispatch(actions.asyncRequire)}>async</button>
                </div>
            </Wrapper>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
