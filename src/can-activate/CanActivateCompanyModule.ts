import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Organisation } from '../shared/packages/organisation-package/organisation.model';
import { OrganisationService } from '../shared/packages/organisation-package/organisation.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CanActivateCompanyModule implements CanActivate {

    constructor(private router: Router, private organisationService: OrganisationService) {}

    public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.organisationService.getOrganisation().pipe(map((organisation: Organisation) => {
            if (organisation && organisation.modules.find(m => m.id === 2 && m.on)) {
                return true;
            }
            return this.router.parseUrl('/login');
        }));

    }
}
