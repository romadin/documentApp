import { WorkFunction } from '../work-function.model';

export function isWorkFunction(arg: any): arg is WorkFunction {
    return arg.id !== undefined &&
        arg.name !== undefined &&
        arg.template !== undefined &&
        arg.order !== undefined &&
        arg.isMainFunction !== undefined;
}
