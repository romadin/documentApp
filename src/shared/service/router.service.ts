import { Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { MenuAction } from '../../construction-information-management-app/header/header.component';
import { UserService } from '../packages/user-package/user.service';


@Injectable()
export class RouterService {
    public headerActions$: ReplaySubject<MenuAction[]> = new ReplaySubject<MenuAction[]>();
    private _backRoute: Subject<string> = new Subject();

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                private readonly userService: UserService,
                ) {
    }

    public setHeaderAction(actions: MenuAction[]): void {
        this.userService.getCurrentUser().pipe(filter(user => !!user), take(1))
            .subscribe((currentUser) => {
                this.headerActions$.next(actions.filter(a => a.needsAdmin && currentUser.isAdmin() || !a.needsAdmin));
            });
    }

    public get backRoute(): Subject<string> {
        return this._backRoute;
    }

    public setBackRoute(route: string) {
        this._backRoute.next(route);
    }

    public setBackRouteParentFromActivatedRoute(parent: ActivatedRoute): void {
        parent.url.subscribe((urlSegments: UrlSegment[]) => {
            let urlToRemove = '';
            urlSegments.forEach((segment, index) => {
                index + 1 !== urlSegments.length ? urlToRemove += segment.path +  '/' : urlToRemove += segment.path;
            });
            const parentPath = parent.parent.snapshot.url[0].path;
            urlToRemove = parentPath + '/' + urlToRemove;
            const url = location.pathname.replace(urlToRemove, parentPath + '');
            this.setBackRoute(url);
        });
    }
}
