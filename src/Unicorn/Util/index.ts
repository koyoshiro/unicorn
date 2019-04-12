function isTypeOf (target:any, type:string) {
    if (!type) {
      return null;
    }
  
    if (target == null) {
      return `${target}`;
    }
  
    return Object.prototype.toString.call(target).toLowerCase() === `[object ${type}]`;
  }
  
const isArray = (target:any) => {
    return isTypeOf(target, 'array');
  }
  
const isObject = (target:any)  => {
    return isTypeOf(target, 'object');
  }

  export {
    isArray,
    isObject
  }