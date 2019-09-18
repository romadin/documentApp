import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

interface BreadCrumb {
    name: string;
    url: string;
}

@Component({
  selector: 'cim-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {
    breadcrumbs: Observable<BreadCrumb[]>;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.breadcrumbs = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .pipe(distinctUntilChanged())
            .pipe(map(event => this.buildBreadCrumb(this.activatedRoute.root)));
        this.breadcrumbs.subscribe(v => {
            console.log(v);
        });
    }


    buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {
        // If no routeConfig is avalailable we are on the root path
        console.log(route.routeConfig.data);
        const name = route.routeConfig ? route.routeConfig.data[ 'breadcrumb' ] : 'Home';
        const path = route.routeConfig ? route.routeConfig.path : '';
        // In the routeConfig the complete path is not available,
        // so we rebuild it each time
        const nextUrl = `${url}${path}/`;
        const breadcrumb: BreadCrumb = {
            name: name,
            url: nextUrl
        };
        const newBreadcrumbs = [ ...breadcrumbs, breadcrumb ];
        if (route.firstChild) {
            // If we are not on our current path yet,
            // there will be more children to look after, to build our breadcumb
            return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
        }
        return newBreadcrumbs;
    }

}
