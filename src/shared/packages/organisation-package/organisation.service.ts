import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Company } from '../company-package/company.model';

import { AppTokenParams, OrganisationCacheObservable } from './interface/organisation-additional.interface';
import { isOrganisationApi, OrganisationApi } from './interface/organisation-api.interface';
import { Organisation } from './organisation.model';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment';
import { ModuleService } from '../module-package/module.service';

@Injectable()
export class OrganisationService {
    private APP_TOKEN = environment.APP_TOKEN;
    private organisationByNameCache: OrganisationCacheObservable = {};
    private path = '/organisations';
    private params: AppTokenParams = {appToken: this.APP_TOKEN};

    constructor(private apiService: ApiService, private moduleService: ModuleService) {  }

    getOrganisation(): BehaviorSubject<Organisation> {
        const organisationName: string = location.host.split('.')[0];

        if (this.organisationByNameCache[organisationName]) {
            return this.organisationByNameCache[organisationName];
        }

        this.params.name = organisationName;
        const newSubject: BehaviorSubject<Organisation> = new BehaviorSubject<Organisation>(undefined);

        this.apiService.noTokenGet(this.path, this.params).pipe(take(1)).subscribe(response => {
            const organisation = isOrganisationApi(response) ? this.makeOrganisation(response) : null;
            newSubject.next(organisation);
        });

        this.organisationByNameCache[organisationName] = newSubject;
        return this.organisationByNameCache[organisationName];
    }

    updateOrganisation(body: FormData, organisation: Organisation): Observable<Organisation> {
        return this.apiService.post(this.path + '/' +  organisation.id, body).pipe(map(result => {
            this.updateCache(organisation);
            return organisation;
        }));
    }

    private makeOrganisation(data: OrganisationApi): Organisation {
        const organisation = new Organisation();

        organisation.id = data.id;
        organisation.name = data.name;
        organisation.primaryColor = data.primaryColor;
        organisation.secondaryColor = data.secondaryColor;
        organisation.maxUser = data.maxUsers;

        const modules = [];
        data.modules.forEach(module => {
            modules.push(this.moduleService.makeModule(module));
        });
        organisation.modules = modules;

        if (data.hasLogo) {
            organisation.logo = this.getOrganisationLogo(organisation);
        }

        return organisation;
    }

    private getOrganisationLogo(organisation: Organisation): Subject<Blob> {
        const subject: BehaviorSubject<Blob> = new BehaviorSubject(null);

        this.apiService.getBlobNoToken(this.path + '/' + organisation.id + '/image', this.params).subscribe((value: Blob) => {
            subject.next(value);
        });

        return subject;
    }

    private updateCache(organisation: Organisation): void {
        if (this.organisationByNameCache[organisation.name]) {
            this.organisationByNameCache[organisation.name].next(organisation);
        }
    }
}
