export default abstract class BaseApiDesc<T, V> {
    private param: T;
    // @ts-ignore
    private result?: V;

    constructor(param: T) {
        this.param = param;
    }

    public getParam(): T {
        return this.param;
    }
}
