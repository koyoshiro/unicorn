import Linker from './linker';
export default class Dependency {
    private depArray: Set<any> = new Set();
    constructor() {
        this.depArray = new Set();
    }

    depend(key: string) {
        if (Linker.setDepTarget(()=>void)) {
            this.depArray.add({
                key,
                target: Dep.target
            });
        }
    }

    async notify(key:string) {
        this.depArray.forEach(dep => {
            if (dep.key === key && dep.target) {
                dep.target();
            }
        });
        // await Dep.computeArray.clear();
    }
}