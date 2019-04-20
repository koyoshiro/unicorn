import { I_UC_ViewModel } from '../Interface/I_UC_ViewModel';
import { I_UC_Model } from '../Interface/I_UC_Model';

import UC_Model from '../Model';
import UC_ViewModel from '../ViewModel';
import {inject} from '../View';

export default class Builder {
    protected __NameSpace__: string = '';
    protected UCModel: any = null;
    protected UCViewModel: any = null;

    constructor(nameSpace: string) {
        this.__NameSpace__ = nameSpace ? nameSpace : '';
    }

    public model(modelParam: I_UC_Model) {
        this.UCModel = new UC_Model(modelParam);
    }

    public viewModel(vmParam: I_UC_ViewModel): any {
        this.UCViewModel = new UC_ViewModel(vmParam, this.UCModel);
    }

    public render(renderComponent: any) {
        inject(renderComponent(this.UCViewModel));  // TODO 修改写法
    }
}
