import {I_UC_Builder} from './Interface/I_UC_Builder';
import Builder from './Builder';
// import Broadcast from './Broadcast';
export default class Unicorn {
    protected __BUILD_RECORD__: string[] = []; //Set<string>[] = new Set;
    protected __BUILD_STACK__: any[]= [];
    // private Broadcast : any;

    constructor() {

        // todo init Log
        // this.__BUILD_RECORD__ = [];
        // this.__BUILD_STACK__ = [];
        // this.Broadcast = new Broadcast();
    }

    public builder(builderParams:I_UC_Builder) {
        if (builderParams&&builderParams.namespace && this.__BUILD_RECORD__.indexOf(builderParams.namespace) === -1) {
            this.__BUILD_RECORD__.push(builderParams.namespace);
            const builderInstance=new Builder(builderParams);
            this.__BUILD_STACK__.push({
                key: builderParams.namespace,
                instance: builderInstance
            });
            return builderInstance;
        }
    }

    // private _channel(builderName:string, actionName:string,payload?:any){
    //     if(!builderName||!actionName||this.__BUILD_RECORD__.indexOf(builderName) === -1){
    //         return;
    //     }
    //     const builderChannel = this.__BUILD_STACK__.find((builder:any)=>builder.key===builderName).instance;
    //     builderChannel.UCViewModel.dispatch(actionName,payload);
    // }

    // private _broadcast(){
    //     const broadcastObj = new Broadcast();
    // } 


}
