import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { Organisation } from './organisation.model';
import { OrganisationService } from './organisation.service';

@Injectable()
export class OrganisationResolver implements Resolve<Organisation | Observable<never>> {

    constructor(private organisationService: OrganisationService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.organisationService.getOrganisation().pipe(first(v => v !== undefined)).pipe(
            map( organisation => {
                if (organisation && organisation.demoPeriod) {
                    const startDate = organisation.demoPeriod;
                    const endDate = new Date(startDate);
                    // add 30 days. That is how long the period of demo is.
                    endDate.setDate(endDate.getDate() + 30);

                    if (endDate.getTime() >= new Date().getTime()) {
                        return organisation;
                    } else {
                        this.router.navigate(['demo-expired']);
                        return EMPTY;
                    }

                }  else if (organisation && !organisation.demoPeriod) {
                    return organisation;
                } else { // no organisation
                    this.router.navigate(['not-found/organisation']);
                    return EMPTY;
                }
            })
        );
    }
}
