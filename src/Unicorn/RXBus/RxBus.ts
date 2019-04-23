import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { skip } from 'rxjs/operators/skip';
import AbsRxBusEvent from './AbsRxBusEvent';
import { Subscription } from 'rxjs/Subscription';
import { logKey, errorKey } from './LogKey';
import * as Logger from '../../Logger';

export type IEventClassType = new (...args: any[]) => AbsRxBusEvent;

export default class RxBus {
    private readonly subSet: Map<IEventClassType, BehaviorSubject<any>> = new Map<IEventClassType, any>();

    /**
     * 订阅
     * @param {IEventClassType} eventClass 消息类型
     * @param {(event: T) => void} subscriber 响应方法
     */
    public subscribe<T>(
        eventClass: IEventClassType,
        subscriber: (event: T) => void,
        useLastValue: boolean = false
    ): Subscription | undefined {
        if (eventClass && subscriber) {
            Logger.logTrace(logKey.registerEvent, {
                name: eventClass.name
            });
            // 1. 获取BehaviorSubject。
            const eventSub = this.getSubject<T>(eventClass);
            // 2. 将subscriber挂载到Subject。
            return this.doSubscribe(eventSub, useLastValue, subscriber);
        }
        return;
    }

    private getSubject<T>(eventClass: IEventClassType): BehaviorSubject<T> {
        const subject = this.subSet.get(eventClass);
        if (subject) {
            return subject;
        }

        // @ts-ignore 这里使用undefined初始化BehaviorSubject，这样后续使用时才能分辨出是否有currentValue。
        const newEventSub = new BehaviorSubject<T>();
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
    private doSubscribe<T>(
        subject: BehaviorSubject<T>,
        useLastValue: boolean,
        subscriber: (event: T) => void
    ) {
        const currentValue: T | undefined = subject.value;
        if (currentValue === undefined || !useLastValue) {
            /**
             * Subject.asObservable方法可以将subject转换为Observable（同时这样做不会丢失subject的多播特性！），然后就可以接operator了。
             * 通过Skip operator来跳过currentValue，确保subscriber只收到subject的下一个next值。
             */
            return subject.asObservable().pipe(skip(1)).subscribe(subscriber);
        }
        return subject.asObservable().subscribe(subscriber);
    }

    /**
     * 取消订阅
     * @param {IEventClassType} eventClass
     */
    public unsubscribe(subscription: Subscription | undefined) {
        if (subscription) {
            subscription.unsubscribe();
        }
    }

    /**
     * 发送
     * @param {T} event
     */
    public sendEvent<T extends AbsRxBusEvent>(event: T) {
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
            eventSub = this.subSet.get(event.constructor) as BehaviorSubject<T>;
        }

        Logger.logTrace(logKey.callEvent, {
            name: event.constructor.name
        });
        eventSub.next(event);
    }
}
