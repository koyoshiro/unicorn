export default class DefineReactive{
    private depsArray:any[]= [];
    constructor () {
        this.depsArray = [];
    }
    
    depend () {
    if (DefineReactive.target && this.depsArray.indexOf(DefineReactive.target) === -1) {
        this.depsArray.push(DefineReactive.target);
    }
    }

    notify () {
    this.depsArray.forEach((dep) => {
        dep();
    })
    }
}
    
DefineReactive.target:any = null;