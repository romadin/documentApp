import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { Event } from '../../shared/packages/agenda-package/event.model';
import { EventService } from '../../shared/packages/agenda-package/event.service';
import { LoadingService } from '../../shared/loading.service';

@Injectable()
export class EventsResolver implements Resolve<Observable<Event[]> | Observable<never>> {
    constructor (
        private eventService: EventService,
        private router: Router,
        private loading: LoadingService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Event[] | never> {
        this.loading.isLoading.next(true);
        const projectId = parseInt(location.pathname.split('/')[2], 10);
        return this.eventService.getEvents(projectId).pipe(
            mergeMap( events => {
                this.loading.isLoading.next(false);
                if (events) {
                    return of(events);
                } else { // no organisation
                    this.router.navigate(['projecten/' + projectId]);
                    return EMPTY;
                }
            })
        );
    }
}
