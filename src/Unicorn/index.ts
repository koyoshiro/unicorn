import Builder from './Builder';
export default class Unicorn {
    private __BUILD_RECORD__: string[]; //Set<string>[] = new Set;
    private __BUILD_STACK__: any[];

    constructor(props: any) {
        // todo init Radio
        // todo init Channel
        // todo init Log
        this.__BUILD_RECORD__ = [];
        this.__BUILD_STACK__ = [];
    }

    public builder(nameSpace: string) {
        if (nameSpace && this.__BUILD_RECORD__.indexOf(nameSpace) === -1) {
            this.__BUILD_RECORD__.push(nameSpace);
            this.__BUILD_STACK__.push({
                key: nameSpace,
                instance: new Builder(nameSpace)
            });
        }
    }
}
