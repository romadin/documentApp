import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../shared/packages/agenda-package/event.service';
import { Event } from '../../../shared/packages/agenda-package/event.model';

@Component({
  selector: 'cim-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
    events: Event[];
    private projectId: number;
    constructor(private eventService: EventService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.events  = <Event[]>this.route.snapshot.data.events;

    }

}
