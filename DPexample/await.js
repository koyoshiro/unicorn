// import Observable from './observable';
// import Watcher from './watcher';
// import autoRun from './autoRun';

const hero = {
    name: '赵云',
    hp: 100,
    sp: 100,
    equipment: ['马', '长枪']
  }
  
  const autoRun = function (handler) {
    handler();
  };
  
  class Dep {
    constructor() {
      this.deps = new Set();
    }
  
    depend() {
      this.deps.add(Dep.target);
    }
  
    async notify(notifyIndex) {
      await console.log('wait');
      if (Dep.index === notifyIndex) {
        Dep.index = 0;
        this.deps.forEach((dep) => {
          dep();
        });
      }
    }
  }
  
  Dep.target = null;
  Dep.index = 0;
  
  class Observable {
    constructor(obj) {
      return this._createProxy(obj);
    }
  
    _createProxy(obj) {
      const dep = new Dep();
      const handler = {
        get(target, key, receiver) {
          // console.log(`我的${key}属性被读取了！`);
          // 加入观察者队列 
          dep.depend();
          return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
          console.log(`我的${key}属性被修改为${value}了！`);
          //内部调用对应的 Reflect 方法
          const result = Reflect.set(target, key, value, receiver);
          //执行观察者队列
          dep.notify(Dep.index);
          return result;
        }
      }
      return new Proxy(obj, handler);
    };
  }
  
  class Watcher {
    constructor(obj, key, callback, onComputedUpdate) {
      this.obj = obj;
      this.key = key;
      this.callback = callback;
      this.onComputedUpdate = onComputedUpdate;
      return this._defineComputed();
    }
  
    _defineComputed() {
      const self = this
      const onDepUpdated = () => {
        const val = self.callback();
        this.onComputedUpdate(val);
      }
  
      const handler = {
        get(target, key, receiver) {
          console.log(`我的${key}属性被读取了！`);
          Dep.target = onDepUpdated;
          Dep.index++;
          const val = self.callback()
          Dep.target = null;
          return val
        },
        set() {
          console.error('计算属性无法被赋值！')
        }
      }
  
      return new Proxy(this.obj, handler);
    }
  }
  
  
  // const heroObs = new Observable(hero);
  
  // const heroW = new Watcher(heroObs, 'type', () => {
  //   return heroObs.hp > 4000 ? '坦克' : '脆皮'
  // }, (val) => {
  //   console.log(`我的属性是：${val}`);
  // });
  
  // const heroW2 = new Watcher(heroObs, 'mgType', () => {
  //   return heroObs.hp > 4500 ? '谋士' : '武将'
  // }, (val) => {
  //   console.log(`我的官职是：${val}`);
  // });
  
  // autoRun(() => {
  //   console.log(`英雄初始属性：${heroW.type}`);
  //   console.log(`英雄初始官职：${heroW2.mgType}`);
  // });
  
  // heroObs.hp = 4000;
  // heroObs.hp = 5000;
  // heroObs.hp = 4000;
  // heroObs.hp = 4600;
  
  
  
  // **********************
  
  const heroObs2 = new Observable(hero.equipment);
  
  const heroEQ = new Watcher(heroObs2, 'EQ', () => {
    return [...heroObs2];
  }, (val) => {
    console.log(`我的EQ是：${val}`)
  })
  
  autoRun(() => {
    console.log(`英雄初始装备：${heroEQ.EQ}`);
  });
  
  heroObs2.push('剑');
  heroObs2.push('锤');