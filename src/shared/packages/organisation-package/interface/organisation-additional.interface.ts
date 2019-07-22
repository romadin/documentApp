import { BehaviorSubject } from 'rxjs';
import { Organisation } from '../organisation.model';

export interface AppTokenParams {
    appToken: string;
    name?: string;
}

export interface OrganisationCache {
    [id: number]: Organisation;
}

export interface OrganisationCacheObservable {
    [name: string]: BehaviorSubject<Organisation>;
}
