export default class Watcher {
    private object: any;
    private key: string;
    private callback: () => void;
    private onComputedUpdate: (val: any) => void;
    constructor(obj: any, field: string, cb: () => void, computedUpdate: () => void) {
        this.object = obj;
        this.key = field;
        this.callback = cb;
        this.onComputedUpdate = computedUpdate;
        return this._defineComputed();
    }

    private _defineComputed() {
        const self = this;
        const onDepUpdated = async (key: string) => {
            await console.log('wait');

            if (!Dep.computedArray.has(key)) {
                Dep.computedArray.add(key);
                const val = self.callback();
                this.onComputedUpdate(val);
            }
        };

        const handler = {
            get(target: any, key: string, receiver: any) {
                console.log(`我的${key}属性被读取了！`);
                Dep.target = () => {
                    onDepUpdated(key);
                };
                const val = self.callback();
                Dep.target = null;
                return val;
            },
            set(target: any, key: string, value: any, receiver: any) {
                console.error('计算属性无法被赋值！');
                return false;
            }
        };

        return new Proxy(this.object, handler);
    }
}
