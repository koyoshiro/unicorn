import {
    inject as injectFn
} from '../View/index';
import {
    Model
} from './model';
import {
    ViewModel
} from './viewModel';
export default class Phoenix {
    _NAME_SPACE = '';

    ViewModelDataSource = null;
    _ModelInstance = null;
    _ViewModelInstance= null;

    constructor() {
        super();
    };

    init(nameSpace) {
        _NAME_SPACE = nameSpace;
    }

    Model = (modelParameterObject) => {
        _ModelInstance = new Model(_NAME_SPACE, modelParameterObject);
    }

    ViewModel = (viewModelParameterObject) => {
        _ViewModelInstance = new ViewModel(_NAME_SPACE,viewModelParameterObject,_ModelInstance.OBSERVABLE_OBJECT);
    }

    inject = () => injectFn(_ViewModelInstance.state);
}