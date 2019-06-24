import { ModuleApiResponseInterface } from '../../module-package/module-api-response.interface';

export interface OrganisationApi {
    id: number;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    maxUsers: number;
    logo: string | null;
    modules: ModuleApiResponseInterface[];
}

export function isOrganisationApi(obj: any): obj is OrganisationApi {
    return obj.id !== undefined &&
        obj.name !== undefined &&
        obj.primaryColor !== undefined &&
        obj.secondaryColor !== undefined &&
        obj.maxUsers !== undefined;
}
