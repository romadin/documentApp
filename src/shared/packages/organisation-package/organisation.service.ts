import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppTokenParams, GetParams, OrganisationCache } from './interface/organisation-additional.interface';
import { isOrganisationApi, OrganisationApi } from './interface/organisation-api.interface';
import { Organisation } from './organisation.model';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class OrganisationService {
    private APP_TOKEN = environment.APP_TOKEN;
    private organisationCache: OrganisationCache = [];

    constructor(private apiService: ApiService) {  }

    getCurrentOrganisation(): Observable<Organisation | null > {
        const currentOrganisationName: string = location.host.split('.')[0];

        if (this.checkCacheByName(currentOrganisationName)) {
            return of(this.checkCacheByName(currentOrganisationName));
        }

        const params: AppTokenParams = {
            name: currentOrganisationName,
            appToken: this.APP_TOKEN
        };

        return this.apiService.noTokenGet('/organisations', params).pipe(map((organisation: OrganisationApi ) => {
            if (isOrganisationApi(organisation)) {
                return this.makeOrganisation(organisation);
            }
            return null;
        }));
    }

    private makeOrganisation(data: OrganisationApi): Organisation {
        const organisation = new Organisation();

        organisation.id = data.id;
        organisation.name = data.name;
        organisation.primaryColor = data.primaryColor;
        organisation.secondaryColor = data.secondaryColor;
        organisation.maxUser = data.maxUsers;

        // @todo need to add the logo
        this.organisationCache[organisation.id] = organisation;

        return organisation;
    }

    private checkCacheByName(name: string): Organisation {
        for ( const key in this.organisationCache) {
            if (this.organisationCache[key].name === name) {
                return this.organisationCache[key];
            }
        }
    }
}
