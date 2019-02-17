import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../shared/packages/user-package/user.service';
import { User } from '../shared/packages/user-package/user.model';

@Injectable()
export class CanActivateAdminUser implements CanActivate {

    constructor(
        private router: Router,
        private userService: UserService) {}

    public canActivate(): Observable<boolean | UrlTree> | boolean {
        return this.userService.getCurrentUser().pipe(map((user: User) => {
            if ( user && user.role.getName() === 'admin') {
                return true;
            }
            return this.router.parseUrl('/overview');
        }));
    }
}
