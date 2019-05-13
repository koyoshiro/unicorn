export default class Events {
    __events__ : any;
    on (type: string , callback: any) {
      if (!type || !callback) {
        return this;
      }

      if (!this.__events__) {
        this.__events__ = {};
      }
  
      (this.__events__[type] || (this.__events__[type] = [])).push(callback);
      return this;
    }
  
    off (type: string , callback: any) {
      let event = this.__events__;
  
      if (!type || !event) {
        event = {};
        return this;
      }
  
      if (!callback) {
        event[type] = [];
      }
  
      event[type] = event[type].filter((item:any) => item !== callback);
      return this;
    }
  
    emit (type: string , param: any) {
      const event = this.__events__;
  
      if (event && event[type]) {
        event[type].forEach((item:any) => item && item(param));
      }
  
      return this;
    }
  }