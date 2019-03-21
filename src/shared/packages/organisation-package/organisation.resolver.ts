import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';

import { Organisation } from './organisation.model';
import { OrganisationService } from './organisation.service';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class OrganisationResolver implements Resolve<Observable<Organisation> | Observable<never>> {

    constructor(private organisationService: OrganisationService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Organisation | never> {

        return this.organisationService.getCurrentOrganisation().pipe(
            mergeMap( organisation => {
                console.log('here');
                if (organisation) {
                    return of(organisation);
                } else { // no organisation
                    this.router.navigate(['not-found/organisation']);
                    return EMPTY;
                }
            })
        );
    }
}
