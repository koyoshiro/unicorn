const autoRun = (handler: () => void) => {
    try {
        handler(); // 直接执行关系函数，确保在使用时没有问题
    } catch (ex) {
        throw ex;
    }
};

export { autoRun };
