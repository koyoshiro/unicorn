基于RxJS实现的消息总线，使用方式如下：
````
// 自定义EventClass
class MyEventMsg extends AbsRxBusEvent { // 必须继承自AbsRxBusEvent
    public msg: string;  // 根据需要自定义要传递的属性,属性修饰符为Public
    constructor(msg: string) {
        super();
        this.msg = msg;
    }
}

// 订阅消息
const subscription = RxBus.subscribe(MyEventMsg, (event: MyEventMsg) => {
// do something
});
// 取消订阅
RxBus.unsubscribe(subscription);


// 发送消息
RxBus.sendEvent(new MyEventMsg('hello'));
````
