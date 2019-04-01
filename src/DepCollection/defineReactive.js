export default class DefineReactive{
    constructor () {
        this.deps = []
    }
    
    depend () {
    if (DefineReactive.target && this.deps.indexOf(DefineReactive.target) === -1) {
        this.deps.push(DefineReactive.target);
    }
    }

    notify () {
    this.deps.forEach((dep) => {
        dep();
    })
    }
}
    
DefineReactive.target = null;