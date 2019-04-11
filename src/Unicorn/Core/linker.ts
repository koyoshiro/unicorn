export default class Linker {
    private static depTarget: any = null;
    private static computedArray: Set<any> = new Set();

    public static setDepTarget(newDepTarget: any) {
        if (newDepTarget) {
            this.depTarget = newDepTarget;
        }
    }

    public static pushComputedArray(computedKey: string) {
        if (computedKey) {
            this.computedArray.add(computedKey);
        }
    }
}
