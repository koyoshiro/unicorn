import { ELogType, ILog } from '../Interface/I_UC_Log';

const emitLog = (emitLogType: ELogType, emitLogInfo: string, emitLogDesc?: any): void => {
    const log: ILog = {
        logType: emitLogType,
        logTime: Date.now(),
        logInfo: emitLogInfo,
        logDesc: emitLogDesc
    };
    /*
     * todo 环境判断
     * 暂时只做console.log
     */
    console.log(log);
};

export { emitLog };
