import { WorkFunction } from '../work-function.model';

export function isWorkFunction(arg: any): arg is WorkFunction {
    return arg.id !== undefined &&
        arg.name !== undefined &&
        arg.parent !== undefined &&
        arg.order !== undefined &&
        arg.fromTemplate !== undefined &&
        arg.chapters !== undefined &&
        arg.headlines !== undefined &&
        arg.isMainFunction !== undefined;
}
