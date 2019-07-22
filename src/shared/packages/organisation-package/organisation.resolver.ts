import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { Organisation } from './organisation.model';
import { OrganisationService } from './organisation.service';

@Injectable()
export class OrganisationResolver implements Resolve<Observable<Organisation> | Observable<never>> {

    constructor(private organisationService: OrganisationService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.organisationService.getOrganisation().pipe(first(v => v !== undefined)).pipe(
            map( organisation => {
                if (organisation) {
                    return organisation;
                } else { // no organisation
                    this.router.navigate(['not-found/organisation']);
                    return EMPTY;
                }
            })
        );
    }
}
