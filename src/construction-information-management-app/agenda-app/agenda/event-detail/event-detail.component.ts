import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Event } from '../../../../shared/packages/agenda-package/event.model';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { User } from '../../../../shared/packages/user-package/user.model';


@Component({
    selector: 'cim-event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
    @Input() event: Event;
    @Input() user: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() {

    }

    onCloseView() {
        this.closeView.emit(true);
    }
}
