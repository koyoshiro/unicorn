import React from 'react';
import Unicorn from '../Unicorn';

const UC = new Unicorn();
const ucA = UC.builder({
    namespace: 'ucA',
    model: {},
    state: {
        count: {
            map: (obm) => {
                return obm.array[0];
            },
            handler: ()=> {
                return map.val;
            },
            onComputedUpdate: () => {}
        },
        result: {
            handler: obm => {
                return obm.root.fatherNode.childNode.node > this.count ? true : false;
            },
            onComputedUpdate: handleRst => {
                console.log(handleRst ? 'yes' : 'no');
            }
        }
    },
    actions: {
        // payload 需要传递的信息
        add(payload) {
            this.observedModel.array[0].val = this.observedModel.array[0].val + payload;
        },
        // payload 需要传递的信息
        minus(payload) {
            this.observedModel.array[0].val--;
        },
        asyncAdd() {},
        asyncRequire() {}
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
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('new Promise');
                    resolve(inputData);
                }, 2000);
            });
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

class ContextComponent extends React.Component {
    constructor(props) {
        const { dispatch } = props.viewModel;
        this.dispatch = dispatch;
    }
    render() {
        return (
            <div>
                <span>{this.props.viewModel.store.count}</span>
                <span>{this.props.viewModel.store.result}</span>
                <span>{this.props.viewModel.store.count2}</span>
                <div>
                    <button onClick={() => this.dispatch('ucA/add', 2)}>add</button>
                    <button onClick={() => this.dispatch(this.actions.minus)}>minus</button>
                    <button onClick={() => this.dispatch(this.actions.asyncAdd)}>async</button>
                    <button onClick={() => this.dispatch(this.actions.asyncRequire)}>async</button>
                    <button onClick={() => this.subscribe('AAA', () => {})}>subscribe</button>
                    <button onClick={() => this.unSubscribe('AAA')}>unSubscribe</button>
                    <button onClick={() => this.sendEvent('AAA')}>sendEvent</button>
                    <button onClick={() => this.crossCall('ucB', 'add')}>crossCall</button>
                </div>
            </div>
        );
    }
}

ucA.render(ContextComponent);
export default ucA.wrappedComponent;

//******************************** 解决object和array同时存在的数据关系 */

// const ob1 = obs(model1);

// const ob2 = obs(model2);

// const ob3 = obs(array1);

// const obs = {ob1,ob2,ob3};

// const ucB = UC.builder(obs,{
//     namespace: 'ucB',
//     model: {
//         datasource."object1",
//         datasource.array1
//         datasource
//     },
//     state: {
//       count: {
//         handler: (obs) => {
//           return obs.ob1.val;
//           },
//         onComputedUpdate: () => { }
//       },
//       result: {
//         handler: (obs) => {
//           return obs.ob3[0].val
//         },
//         onComputedUpdate: handleRst => {
//           console.log(handleRst ? 'yes' : 'no');
//         }
//       }
//     },
//     actions: {
//       // payload 需要传递的信息
//       add(payload) {
//           this.observedModel.array[0].val= this.observedModel.array[0].val+payload;
//       },
//       // payload 需要传递的信息
//       minus(payload) {
//           this.observedModel.array[0].val--;
//       },
//       asyncAdd() {

//       },
//       asyncRequire() {

//       }
//     }
// }
