"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emitLog = (emitLogType, emitLogInfo) => {
    const log = {
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
exports.emitLog = emitLog;
