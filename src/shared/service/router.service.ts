import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, UrlSegment } from '@angular/router';

@Injectable()
export class RouterService {
    private _backRoute: Subject<string> = new Subject();

    get backRoute(): Subject<string> {
        return this._backRoute;
    }

    setBackRoute(route: string) {
        this._backRoute.next(route);
    }

    setBackRouteParentFromActivatedRoute(parent: ActivatedRoute): void {

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
