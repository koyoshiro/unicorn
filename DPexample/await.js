const autoRun = function (handler) {
    handler();
  };
  
  class Dep {
    constructor() {
      this.deps = new Set();
    }
  
    depend(key) {
      if (Dep.target) {
        this.deps.add({
          key,
          target: Dep.target
        });
      }
    }
  
    async notify(key) {
      this.deps.forEach((dep) => {
        if (dep.key === key && dep.target) {
          dep.target();
        }
      });
      await Dep.computeArray.clear();
    }
  
  
  }
  
  Dep.target = null;
  Dep.computeArray = new Set();
  
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
          dep.depend(key);
          return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
          console.log(`我的${key}属性被修改为${value}了！`);
          //内部调用对应的 Reflect 方法
          const result = Reflect.set(target, key, value, receiver);
          //执行观察者队列
          dep.notify(key);
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
      this.idx = 0;
      return this._defineComputed();
    }
  
    _defineComputed() {
      const self = this;
      const onDepUpdated = async (key) => {
        await console.log('wait');
  
        if (!Dep.computeArray.has(key)) {
          Dep.computeArray.add(key);
          const val = self.callback();
          this.onComputedUpdate(val);
        }
      }
  
      const handler = {
        get(target, key, receiver) {
          console.log(`我的${key}属性被读取了！`);
          Dep.target = () => { onDepUpdated(key) };
          const val = self.callback();
          Dep.target = null;
          return val;
        },
        set() {
          console.error('计算属性无法被赋值！')
        }
      }
  
      return new Proxy(this.obj, handler);
    }
  }
  
  const hero = {
    name: '赵云',
    hp: 100,
    sp: 100,
    equipment: ['马', '长枪']
  }
  
  const heroObs = new Observable(hero);
  
  const heroHealth = new Watcher(heroObs, 'health', () => {
    return heroObs.hp > 2000 ? '强壮' : '良好';
  }, (val) => {
    console.log(`英雄的健康状况是：${val}`);
  });
  
  const heroJob = new Watcher(heroObs, 'job', () => {
    return heroObs.sp < 3000 ? '武将' : '谋士'
  }, (val) => {
    console.log(`英雄的职业是：${val}`);
  });
  
  autoRun(() => {
    console.log(`英雄初始健康状况：${heroHealth.health}`);
    console.log(`英雄初始职业：${heroJob.job}`);
  });
  
  
  heroObs.name = '诸葛亮';
  console.log(`英雄的名字是：${heroObs.name}`);
  heroObs.hp = 5000;
  heroObs.hp = 1000;
  heroObs.sp = 4000;
  
  
  
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