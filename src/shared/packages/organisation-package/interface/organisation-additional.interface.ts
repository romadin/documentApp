import { Organisation } from '../organisation.model';

export interface GetParams {
    name: string;
}

export interface AppTokenParams extends GetParams {
    appToken: string;
}

export interface OrganisationCache {
    [id: number]: Organisation;
}
