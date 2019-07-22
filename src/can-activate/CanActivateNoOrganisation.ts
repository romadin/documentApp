import { Injectable } from '@angular/core';
import { OrganisationService } from '../shared/packages/organisation-package/organisation.service';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organisation } from '../shared/packages/organisation-package/organisation.model';

@Injectable()
export class CanActivateNoOrganisation implements CanActivate {

    constructor(private organisationService: OrganisationService, private router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this.organisationService.getCurrentOrganisation().pipe(map((organisation: Organisation) => {
            console.log('no organisation page', organisation);
            if ( organisation ) {
                // @todo get the last route so that we can redirect to that route.
                return this.router.parseUrl('/projecten');
            }
            return true;
        }));
    }
}
