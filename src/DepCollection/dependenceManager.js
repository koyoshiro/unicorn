export default class DependenceManager {
    constructor (obj, key, handler, onComputedUpdate) {
      this.obj = obj;
      this.key = key;
      this.handler = handler;
      this.onComputedUpdate = onComputedUpdate?onComputedUpdate:null;
      return this.defineComputed();
    }
  
    defineComputed () {
      const self = this;
      const onDepUpdated = () => {
        const val = self.handler();
        this.onComputedUpdate(val);
      }
  
      Object.defineProperty(self.obj, self.key, {
        get () {
          DefineReactive.target = onDepUpdated;
          const val = self.handler();
          DefineReactive.target = null;
          return val;
        },
        set () {
          console.error('计算属性无法被赋值！');
        }
      })
    }
  }