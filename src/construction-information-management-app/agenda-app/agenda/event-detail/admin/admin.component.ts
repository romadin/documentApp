import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../../../../shared/packages/agenda-package/event.model';
import { User } from '../../../../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-event-detail-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    @Input() event: Event;
    @Input() user: User;
    constructor() { }

    ngOnInit() {

    }

}
