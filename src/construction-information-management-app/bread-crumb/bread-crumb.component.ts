import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

interface Breadcrumb {
    name: string;
    url: string;
}

@Component({
  selector: 'cim-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {
    breadcrumbs: Observable<Breadcrumb[]>;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        this.breadcrumbs = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .pipe(distinctUntilChanged())
            .pipe(map(event => this.buildBreadCrumb(this.activatedRoute.root)));
    }

    ngOnInit() {
    }


    buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<Breadcrumb> = []): Array<Breadcrumb> {
        // If no routeConfig is avalailable we are on the root path
        let name = route.routeConfig && route.routeConfig.data ? route.routeConfig.data[ 'breadcrumb' ] : '';
        let path = route.routeConfig ? route.routeConfig.path : '';

        if (typeof name === 'function') {
            name = name(route);
        }
        if (path === ':id') {
            path = route.snapshot.params.id;
        }
        // In the routeConfig the complete path is not available,
        // so we rebuild it each time
        const nextUrl = `${url}${path}/`;
        const breadcrumb: Breadcrumb = {
            name: name,
            url: nextUrl
        };
        const newBreadcrumbs = name !== '' ? [ ...breadcrumbs, breadcrumb ] : breadcrumbs;
        if (route.firstChild) {
            // If we are not on our current path yet,
            // there will be more children to look after, to build our breadcumb
            return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
        }
        return newBreadcrumbs;
    }

}
