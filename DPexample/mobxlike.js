let __mobservableViewStack = [];

class ObservableObject {
  constructor(target) {
    this._target = target;
    this._values = {};
    Object.defineProperty(target, "$mobservable", {
			enumerable: false,
			configurable: false,
			value: this
		});
  }

  set(propName, value) {
    this._values[propName] = new ObservableValue(value);

    Object.defineProperty(this._target, propName, {
      configurable: true,
      enumerable: true,
      get: function () {
        return this.$mobservable._values[propName].get();
      },
      set: function (newValue) {
        this.$mobservable._values[propName].set(newValue);
      }
    });
  }
}

class ObservableValue {
  constructor(value) {
    this._value = value;
    this.callbacks = [];
  }

  get() {
    this.listen();
    return this._value;
  }

  set(newValue) {
    this._value = newValue;
    this.notifyObserved();
  }

  notifyObserved() {
    for (let i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i]();
    }
  }

  listen() {
    __mobservableViewStack.forEach((func) => {
      this.callbacks.push(func);
    });
  }
}

function observable(target) {
  let observable = new ObservableObject(target);
  for (let key in target) {
    observable.set(key, target[key])
  }
  return target;
}

function autorun(func) {
  __mobservableViewStack.push(func);
  func();
  __mobservableViewStack = [];
}

const mobx = {
  observable,
  autorun
};