import { Injectable } from '@angular/core';
import { OrganisationService } from '../shared/packages/organisation-package/organisation.service';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable()
export class CanActivateNoOrganisation implements CanActivate {

    constructor(private organisationService: OrganisationService, private router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this.organisationService.getOrganisation().pipe(first(v => v !== undefined)).pipe(
            map( organisation => {
                if (organisation) {
                    return this.router.parseUrl('/projecten');
                }
                return true;
            })
        );
    }
}
