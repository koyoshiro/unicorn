// public call<U, V>(
//     apiDesc: BaseApiDesc<U, V>
// ): V {
//     const apiFunction = this.apiCollection.get(apiDesc.constructor) as (IApi<U, V> | undefined);
//     if (!apiFunction) {
//         throw new Error('不存在对应的api函数');
//     }
//     Logger.logTrace(logKey.callApi, {
//         funcName: apiDesc.constructor && apiDesc.constructor.name
//     });
//     return apiFunction(apiDesc.getParam());
// }

const call =function(){
    
}