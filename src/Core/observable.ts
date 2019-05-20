import Dependency from './dependency';
export default class Observable {
    constructor(object: any) {
        return this.createProxy(object);
    }
    private createProxy(object: any) {
        const dep = new Dependency();
        const handler = {
            get(target: any, key: string, receiver: any) {
                // console.log(`我的${key}属性被读取了！`);
                // 加入观察者队列
                dep.depend(key);
                return Reflect.get(target, key, receiver);
            },
            set(target: any, key: string, value: any, receiver: any) {
                console.log(`我的${key}属性被修改为${value}了！`);
                // 内部调用对应的 Reflect 方法
                const result = Reflect.set(target, key, value, receiver);
                // 执行观察者队列
                dep.notify(key);
                return result;
            }
        };
        return new Proxy(object, handler);
    }
}
