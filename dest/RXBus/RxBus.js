"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const skip_1 = require("rxjs/operators/skip");
const LogKey_1 = require("./LogKey");
const Logger = require("../../Logger");
class RxBus {
    constructor() {
        this.subSet = new Map();
    }
    /**
     * 订阅
     * @param {IEventClassType} eventClass 消息类型
     * @param {(event: T) => void} subscriber 响应方法
     */
    subscribe(eventClass, subscriber, useLastValue = false) {
        if (eventClass && subscriber) {
            Logger.logTrace(LogKey_1.logKey.registerEvent, {
                name: eventClass.name
            });
            // 1. 获取BehaviorSubject。
            const eventSub = this.getSubject(eventClass);
            // 2. 将subscriber挂载到Subject。
            return this.doSubscribe(eventSub, useLastValue, subscriber);
        }
        return;
    }
    getSubject(eventClass) {
        const subject = this.subSet.get(eventClass);
        if (subject) {
            return subject;
        }
        // @ts-ignore 这里使用undefined初始化BehaviorSubject，这样后续使用时才能分辨出是否有currentValue。
        const newEventSub = new BehaviorSubject_1.BehaviorSubject();
        this.subSet.set(eventClass, newEventSub);
        return newEventSub;
    }
    /**
     * 根据Subject是否有currentValue和useLastValue决定是否要给subscriber subject的currentValue。
     *
     * 有四种情况：
     * 1. currentValue为空，useLastValue为false。此时不给currentValue，直接给subject的下一个next值。
     * 2. currentValue为空，useLastValue为true。此时不给currentValue，直接给subject的下一个next值。
     * 3. currentValue不为空，useLastValue为false。此时不给currentValue，直接给subject的下一个next值。
     * 4. currentValue不为空，useLastValue为true。此时给currentValue。
     *
     * @param subject BehaviorSubject
     * @param useLastValue 是否使用lastValue
     * @param subscriber subscriber
     */
    doSubscribe(subject, useLastValue, subscriber) {
        const currentValue = subject.value;
        if (currentValue === undefined || !useLastValue) {
            /**
             * Subject.asObservable方法可以将subject转换为Observable（同时这样做不会丢失subject的多播特性！），然后就可以接operator了。
             * 通过Skip operator来跳过currentValue，确保subscriber只收到subject的下一个next值。
             */
            return subject.asObservable().pipe(skip_1.skip(1)).subscribe(subscriber);
        }
        return subject.asObservable().subscribe(subscriber);
    }
    /**
     * 取消订阅
     * @param {IEventClassType} eventClass
     */
    unsubscribe(subscription) {
        if (subscription) {
            subscription.unsubscribe();
        }
    }
    /**
     * 发送
     * @param {T} event
     */
    sendEvent(event) {
        // @ts-ignore
        let eventSub = this.subSet.get(event.constructor);
        if (!eventSub) {
            /**
             * 如果该Event还没有对应的subject，就生成一个。subject生成后就能记录这次event。
             * 使后续的subscriber有机会获取这次event。
             */
            const emptyFunc = () => { return; };
            // @ts-ignore
            this.subscribe(event.constructor, emptyFunc);
            // @ts-ignore
            eventSub = this.subSet.get(event.constructor);
        }
        Logger.logTrace(LogKey_1.logKey.callEvent, {
            name: event.constructor.name
        });
        eventSub.next(event);
    }
}
exports.default = RxBus;
