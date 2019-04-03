class Dep {
  constructor() {
    this.deps = []
  }

  depend() {
    console.log(this.deps);
    if (Dep.target && this.deps.indexOf(Dep.target) === -1) {
      this.deps.push(Dep.target)
    }
  }

  notify() {
    this.deps.forEach((dep) => {
      dep()
    })
  }
}

Dep.target = null

class Observable {
  constructor(obj) {
    return this.walk(obj)
  }

  walk(obj) {
    //return this._createProxy(obj)
    const keys = Object.keys(obj)
    keys.forEach((key) => {
      this.defineReactive(obj, key, obj[key])
    })
    return obj
  }

  defineReactive(obj, key, val) {
    const dep = new Dep()
    if (Array.isArray(obj[key])) {
      Object.defineProperty(obj[key], 'push', {
        value() {
          this[this.length] = arguments[0];
          dep.notify()
        }
      })
      Object.defineProperty(obj, key, {
        get() {
          dep.depend()
          return val
        }
      })
    } else {
      Object.defineProperty(obj, key, {
        get() {
          dep.depend()
          return val
        },
        set(newVal) {
          val = newVal
          dep.notify()
        }
      })
    }

  }

  _createProxy = obj => {
    const dep = new Dep()
    const handler = {
      get(target, name, receiver) {
        console.log(`我的${name}属性被读取了！`);
        //todo 加入观察者队列 
        dep.depend()
        return Reflect.get(target, name, receiver);
      },
      set(target, key, value, receiver) {
        console.log(`我的${key}属性被修改为${value}了！`);
        //内部调用对应的 Reflect 方法
        const result = Reflect.set(target, key, value, receiver);
        //todo 执行观察者队列 
        //observableArray.forEach(item => item());  
        dep.notify()
      }
    };
    return new Proxy(obj, handler);
  };
}



class Watcher {
  constructor(obj, key, cb, onComputedUpdate) {
    this.obj = obj
    this.key = key
    this.cb = cb
    this.onComputedUpdate = onComputedUpdate
    return this.defineComputed()
  }

  defineComputed() {
    const self = this
    const onDepUpdated = () => {
      const val = self.cb()
      this.onComputedUpdate(val)
    }

    Object.defineProperty(self.obj, self.key, {
      get() {
        Dep.target = onDepUpdated
        const val = self.cb()
        Dep.target = null
        return val
      },
      set() {
        console.error('计算属性无法被赋值！')
      }
    })
  }
}

const hero = new Observable({
  health: 3000,
  IQ: 150,
  equipment: ['马', '长枪']
})

new Watcher(hero, 'type', () => {
  return hero.health > 4000 ? '坦克' : '脆皮'
}, (val) => {
  console.log(`我的类型是：${val}`)
})

new Watcher(hero, 'type2', () => {
  return hero.health === 5000 ? 'AAA' : 'BBB'
}, (val) => {
  console.log(`我的类型2是：${val}`)
})

new Watcher(hero, 'eq', () => {
  return hero.equipment;
}, (val) => {
  console.log(`我的eq是：${val}`)
})

console.log(`英雄初始类型：${hero.type}`)
console.log(`英雄初始类型2：${hero.type2}`)
console.log(`英雄初始类型3：${hero.eq}`)

hero.health = 5000;
hero.equipment.push('ccc');