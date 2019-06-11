export enum ELogType {
    error = -1,
    lifeCycle = 1
}

export interface ILog {
    logType: ELogType;
    logTime: number;
    logInfo: string;
}
