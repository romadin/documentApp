import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';

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

    getOrganisation(): Observable<Organisation> {
        const organisationName: string = location.host.split('.')[0];

        if (!this.organisationByNameCache[organisationName]) {
            this.params.name = organisationName;

            this.organisationByNameCache[organisationName] = this.apiService.noTokenGet(this.path, this.params).pipe(
                map(response => isOrganisationApi(response) ? this.makeOrganisation(response) : null),
                take(1),
                shareReplay(1),
            );
        }

        return this.organisationByNameCache[organisationName];
    }

    updateOrganisation(body: FormData, organisation: Organisation): Observable<Organisation> {
        return this.apiService.post(this.path + '/' +  organisation.id, body).pipe(map(result => organisation));
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

        organisation.logo = this.getOrganisationLogo(organisation);

        return organisation;
    }

    private getOrganisationLogo(organisation: Organisation): Subject<Blob> {
        const subject: BehaviorSubject<Blob> = new BehaviorSubject(null);

        this.apiService.getBlobNoToken(this.path + '/' + organisation.id + '/image', this.params).subscribe((value: Blob) => {
            subject.next(value);
        });

        return subject;
    }
}
