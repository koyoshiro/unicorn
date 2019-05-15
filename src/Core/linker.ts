export default class Linker {
    private static depTarget: any = null;
    private static computedArray: Set<any> = new Set();

    public static getDepTarget(): any {
        return this.depTarget;
    }

    public static setDepTarget(newDepTarget: any) {
        if (newDepTarget) {
            this.depTarget = newDepTarget;
        }
    }

    public static resetDepTarget() {
        this.depTarget = null;
    }

    public static pushComputedArray(computedKey: string) {
        if (computedKey) {
            this.computedArray.add(computedKey);
        }
    }

    public static computedArrayContains(computedKey: string): boolean {
        if (computedKey) {
            return this.computedArray.has(computedKey);
        }
        return false;
    }
}
