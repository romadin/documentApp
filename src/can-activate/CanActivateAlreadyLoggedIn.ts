import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ApiService } from '../shared/service/api.service';

@Injectable()
export class CanActivateAlreadyLoggedIn implements CanActivate {
    private apiService: ApiService;
    private router: Router;

    constructor(apiService: ApiService, router: Router) {
        this.apiService = apiService;
        this.router = router;
    }

    public canActivate(): Observable<boolean | UrlTree> {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && localStorage.getItem('token')) {
            return of(this.router.parseUrl('/overview'));
        }
        return of(true);
    }
}
