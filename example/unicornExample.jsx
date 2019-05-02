import {
    Store,
    inject
} from '../src';
import React from 'react';
import ReactDOM from 'react-dom';

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
    array: [{
        key: 'A',
        val: 3
    }, {
        key: 'B',
        val: 4
    }]
};

// ComponentA
const ucA = new UC.Builder({
    namespace: 'ucA',
    model: {},
    state: {
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
        add(state, payload) {
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
    },
    effects: {
        fetchServer(requireParams) {
            const data = ajax.require(requireParams);
            this.reloadModel(data);
            // const user = yield call(fetchUser, id);
            // yield put({ type: 'saveUser', payload: user });
        }
    },
    subscriptions: {
        setup({
            dispatch,
            history
        }) {
            return history.listen(({
                pathname,
                query
            }) => {
                if (pathname === '/users') {
                    dispatch({
                        type: 'fetch',
                        payload: query
                    });
                }
            })
        },
        keyEvent({
            dispatch
        }) {
            key('⌘+up, ctrl+up', () => {
                dispatch({
                    type: 'add'
                });
            });
        }
    }
});


class App extends React.Component {
    constructor(props) {
        this.viewModel = props.viewModel;
        const {
            actions,
            dispatch
        } = props.viewModel;
        const {
            count,
            result
        } = props.viewModel.store;
        this.actions = actions;
        this.dispatch = dispatch;
        this.count = count;
        this.result = result;
    }
    render() {

    }
}


ReactDOM.render( < App / > , document.getElementById('root'));