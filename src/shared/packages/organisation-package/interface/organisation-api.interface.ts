import { ModuleApiResponseInterface } from '../../module-package/module-api-response.interface';
import { Organisation } from '../organisation.model';

export interface OrganisationApi {
    id: number;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    maxUsers: number;
    hasLogo: boolean;
    modules: ModuleApiResponseInterface[];
}

export function isOrganisationApi(obj: any): obj is OrganisationApi {
    return obj.id !== undefined &&
        obj.name !== undefined &&
        obj.primaryColor !== undefined &&
        obj.secondaryColor !== undefined &&
        obj.maxUsers !== undefined;
}

export function isOrganisation(obj: any): obj is Organisation {
    return obj.id !== undefined &&
        obj.name !== undefined &&
        obj.primaryColor !== undefined &&
        obj.secondaryColor !== undefined &&
        obj.maxUsers !== undefined;
}
