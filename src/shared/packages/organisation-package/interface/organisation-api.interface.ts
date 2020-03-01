import { ModuleApiResponseInterface } from '../../module-package/module-api-response.interface';

export interface OrganisationApi {
    id: number;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    maxUsers: number;
    hasLogo: boolean;
    modules: ModuleApiResponseInterface[];
    demoPeriod: {date: string, timezone_type: number, timezone: string};
}

export function isOrganisationApi(obj: any): obj is OrganisationApi {
    return obj.id !== undefined &&
        obj.name !== undefined &&
        obj.primaryColor !== undefined &&
        obj.secondaryColor !== undefined &&
        obj.maxUsers !== undefined;
}
