import { Injectable } from '@angular/core';
import { OrganisationService } from '../shared/packages/organisation-package/organisation.service';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable()
export class CanActivateDemoPeriodExpired implements CanActivate {

    constructor(private organisationService: OrganisationService, private router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this.organisationService.getOrganisation().pipe(first(v => v !== undefined)).pipe(
            map( organisation => {
                if (organisation && organisation.demoPeriod) {
                    const startDate = organisation.demoPeriod;
                    const endDate = new Date(startDate);
                    // add 30 days. That is how long the period of demo is.
                    endDate.setDate(endDate.getDate() + 30);

                    // The organisation is still in the demo period.
                    if (endDate.getTime() >= new Date().getTime()) {
                        return this.router.parseUrl('/projecten');
                    } else {
                        return true;
                    }

                }
                // has no demo period so redirect to projects page.
                return this.router.parseUrl('/projecten');
            })
        );
    }
}
