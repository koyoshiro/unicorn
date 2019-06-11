import { ELogType, ILog } from '../Interface/I_UC_Log';

const emitLog = (emitLogType: ELogType, emitLogInfo: string): void => {
    const log: ILog = {
        logType: emitLogType,
        logTime: Date.now(),
        logInfo: emitLogInfo
    };
    /*
     * todo 环境判断
     * 暂时只做console.log
     */
    console.log(log);
};

export { emitLog };
