function call(asyncFunc: any, payload: any) {
    setInterval(asyncFunc(), 100);
}

export { call };
