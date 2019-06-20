"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emitLog = (emitLogType, emitLogInfo, emitLogDesc) => {
    const log = {
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
exports.emitLog = emitLog;
