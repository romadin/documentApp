import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Event } from '../../../../shared/packages/agenda-package/event.model';
import { User } from '../../../../shared/packages/user-package/user.model';


@Component({
    selector: 'cim-event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent  {
    @Input() event: Event;
    @Input() user: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() saveEvent: EventEmitter<Event> = new EventEmitter<Event>();

    constructor() { }
}
