import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, isObservable, Observable, of } from 'rxjs';
import { first, mergeMap, skip, take } from 'rxjs/operators';
import { isOrganisation, isOrganisationApi } from './interface/organisation-api.interface';

import { Organisation } from './organisation.model';
import { OrganisationService } from './organisation.service';

@Injectable()
export class OrganisationResolver implements Resolve<Observable<Organisation> | Observable<never>> {

    constructor(private organisationService: OrganisationService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.organisationService.getOrganisation().pipe(first(v => v !== undefined));
    }

    // resolve(route: ActivatedRouteSnapshot): Observable<Organisation | never> {
    //
    //     return this.organisationService.getCurrentOrganisation().pipe(
    //         mergeMap( organisation => {
    //             if (organisation) {
    //                 return of(organisation);
    //             } else { // no organisation
    //                 this.router.navigate(['not-found/organisation']);
    //                 return EMPTY;
    //             }
    //         })
    //     );
    // }
}
