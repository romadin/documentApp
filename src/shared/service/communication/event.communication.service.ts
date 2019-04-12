import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Event } from '../../packages/agenda-package/event.model';

@Injectable()
export class EventCommunicationService {
    private _triggerAddEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _eventAdded: Subject<Event> = new Subject<Event>();

    get triggerAddEvent(): BehaviorSubject<boolean> {
        return this._triggerAddEvent;
    }

    get eventAdded(): Subject<Event> {
        return this._eventAdded;
    }
}
