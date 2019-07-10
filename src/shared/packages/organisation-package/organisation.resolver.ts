import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Organisation } from './organisation.model';
import { OrganisationService } from './organisation.service';

@Injectable()
export class OrganisationResolver implements Resolve<Observable<Organisation> | Observable<never>> {

    constructor(private organisationService: OrganisationService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Organisation | never> {

        return this.organisationService.getCurrentOrganisation().pipe(
            mergeMap( organisation => {
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
