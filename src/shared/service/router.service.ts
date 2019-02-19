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
            let url = '';
            urlSegments.forEach((segment) => {
                url += segment.path + '/';
            });
            this.setBackRoute(url);
        });
    }
}
