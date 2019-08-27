import { Company } from '../company.model';

export function isCompany(arg: any): arg is Company {
    return arg.id !== undefined &&
        arg.name !== undefined &&
        arg.documents !== undefined &&
        arg.parent !== undefined;
}
