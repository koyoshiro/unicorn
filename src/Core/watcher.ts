import Linker from './linker';
export default class Watcher {
    private object: any;
    private key: string;
    private callback: (obm: any) => void;
    private onComputedUpdate: (val: any) => void;
    constructor(obj: any, field: string, cb: () => void, computedUpdate: (val: any) => void) {
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

            if (!Linker.computedArrayContains(key)) {
                Linker.pushComputedArray(key);
                const val = self.callback(self.object);
                this.onComputedUpdate(val);
            }
        };

        const handler = {
            get(target: any, key: string, receiver: any) {
                console.log(`我的${key}属性被读取了！`);
                Linker.setDepTarget(() => {
                    onDepUpdated(key);
                });
                const val = self.callback();
                Linker.resetDepTarget();
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
