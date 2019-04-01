
import Events from './event';
import {isObject} from '../Util';

export default class Observable extends Events {
  private _from:any={};
  private _model:any = {};

  constructor(state:any,from:any) {
    super();
    this._from=from;
    this._observe(state, this);
  }

  public get (path:string) {
    if (!path) {
      return;
    }

    const field = path.split('.');
    let value = this[field[0]];

    for (let i = 1, len = field.length; i < len; i++) {
      value = value[field[i]];
      if (value == null) {
        break;
      }
    }
    return value;
  }

  public set (path:string, value:any) {
    let currentValue = this.get(path);
    if (currentValue === value) {
      return;
    } 
    console.log(`${path}的值监听成功： ${currentValue} --> ${value}`);
    this[path] = value;
    this.emit('change', {
      key: path
    });
  }

  private _observe(state:any, target:any) {
    if (!state || !isObject(state)) {
      return;
    }
    // 使用递归劫持对象属性
    Object.keys(state).forEach(key => {
      target[key] = this._defineReactive(state[key], key)
    })
  }

  private _defineReactive (item:any, key:any) {
    if (isObject(item)) {
      item = new Observable(item,key);
    }
    return item;
  }
}