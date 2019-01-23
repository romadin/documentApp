import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ApiService } from '../shared/service/api.service';

@Injectable()
export class CanActivateLoggedIn implements CanActivate {
    private apiService: ApiService;
    private router: Router;

    constructor(apiService: ApiService, router: Router) {
        this.apiService = apiService;
        this.router = router;
    }

    public canActivate(): Observable<boolean | UrlTree> {
        if (this.apiService.tokenExist()) {
            return of(true);
        }
        return of(this.router.parseUrl('/login'));
    }
}
