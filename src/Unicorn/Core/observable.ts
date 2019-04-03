

export default class Observable {
    constructor(obj:any) {
        return this._walk(obj);
    }

    _walk(obj) {
        // const keys = Object.keys(obj);
        // keys.forEach(key => {
        //     this.defineReactive(obj, key, obj[key]);
        // });
        // return obj;
        return this._createProxy(obj)
        
    }

    // defineReactive(obj, key, val) {
    //     const dep = new DefineReactive();
    //     Object.defineProperty(obj, key, {
    //         get() {
    //             console.log(`我的${key}属性被读取了！`);
    //             dep.depend();
    //             return val;
    //         },
    //         set(newVal) {
    //             console.log(`我的${key}属性被修改了！`);
    //             val = newVal;
    //             dep.notify();
    //         }
    //     });
    // }

    //初始化Proxy对象，设置拦截操作
    _createProxy = obj => {
        const handler = {
            get(target, name, receiver) {
                console.log(`我的${name}属性被读取了！`);
                //todo 加入观察者队列 
                return Reflect.get(target, name, receiver);
            },
            set(target, key, value, receiver) {
                console.log(`我的${key}属性被修改为${value}了！`);
                //内部调用对应的 Reflect 方法
                const result = Reflect.set(target, key, value, receiver);
                //todo 执行观察者队列 
                //observableArray.forEach(item => item());  
                return result;
            }
        };
        return new Proxy(obj, handler);
    };
}
