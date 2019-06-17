export enum ELogType {
    error = -1,
    lifeCycle = 1,
    functionCall = 2
}

export interface ILog {
    logType: ELogType;
    logTime: number;
    logInfo: string;
    logDesc?: any;
}
