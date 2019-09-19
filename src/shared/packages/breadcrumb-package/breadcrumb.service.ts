import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

export interface Breadcrumb {
    name: string;
    url: string;
}

@Injectable()
export class BreadcrumbService {
    breadcrumbs: Observable<Breadcrumb[]>;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        this.breadcrumbs
    }


}
