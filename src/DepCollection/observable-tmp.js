import dependenceManager from "./s-dependence-manager";

var objIDCounter = 1;
class Observable {
        /**
         * 全局唯一 id
         * @type {number}
         */
        objID = 0;
        /**
         * 真实值
         * @type {null}
         */
        objVal = null;
        constructor(value) {
                this.objID = "ob-" + ++objIDCounter;
                if (Array.isArray(value)) {
                        this._wrapArrayProxy(value);
                } else {
                        this.objVal = value;
                }
        }

        get() {
                dependenceManager.collect(this.objID);
                return this.objVal;
        }

        set(value) {
                if (Array.isArray(value)) {
                        this._wrapArrayProxy(value);
                } else {
                        this.objVal = value;
                }
                dependenceManager.trigger(this.objID);
        }

        /**
         * 手动触发依赖
         */
        trigger() {
                dependenceManager.trigger(this.objID);
        }
        /**
         * 对数组包装Proxy拦截数组操作的动作
         */
        _wrapArrayProxy(value) {
                this.objVal = new Proxy(value, {
                        set: (obj, key, val) => {
                                obj[key] = val;
                                if (key != "length") {
                                        this.trigger();
                                }
                                return true;
                        }
                });
        }
}

export default Observable;
