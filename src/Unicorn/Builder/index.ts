import UC_Model from '../Model';
import UC_ViewModel from '../ViewModel';

export default class Builder {
    protected __NameSpace__: string = '';
    protected UCModel: any;

    constructor(nameSpace: string) {
        this.__NameSpace__ = nameSpace ? nameSpace : '';
    }

    public model(modelParam: any) {
        this.UCModel = new UC_Model(modelParam);
    }

    public viewModel(vmParam: UC_ViewModel_Interface): any {}

    public render(renderComponent: any) {
        renderComponent();
    }
}
