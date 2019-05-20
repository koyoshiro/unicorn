import Linker from './linker';
export default class Dependency {
    private depArray: Set<any>;
    constructor() {
        this.depArray = new Set();
    }

    public depend(key: string) {
        if (Linker.getDepTarget() && !this.depArray.has(key)) {
            this.depArray.add({
                key,
                target: Linker.getDepTarget()
            });
        }
    }

    public async notify(key: string) {
        this.depArray.forEach((dep: any) => {
            if (dep.key === key && dep.target) {
                dep.target();
            }
        });
        // await Dep.computeArray.clear();
    }
}
