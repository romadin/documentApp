import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../../../shared/packages/agenda-package/event.model';

@Component({
  selector: 'cim-event-row',
  templateUrl: './event-row.component.html',
  styleUrls: ['./event-row.component.css']
})
export class EventRowComponent implements OnInit {
    @Input() event: Event;

    constructor() { }

    ngOnInit() {
    }

}
