import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '../../../../shared/packages/agenda-package/event.model';

@Component({
  selector: 'cim-event-row',
  templateUrl: './event-row.component.html',
  styleUrls: ['./event-row.component.css']
})
export class EventRowComponent implements OnInit {
    @Input() event: Event;
    @Output() eventToShow: EventEmitter<Event> = new EventEmitter<Event>();

    constructor() { }

    ngOnInit() {
    }

    showEvent(e: MouseEvent): void {
        e.stopPropagation();
        this.eventToShow.emit(this.event);
    }
}
