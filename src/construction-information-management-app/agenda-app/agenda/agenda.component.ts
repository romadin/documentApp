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
    rightSideActive = false;
    eventToEdit: Event;

    constructor(private eventService: EventService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.events  = <Event[]>this.route.snapshot.data.events;
    }

    eventOnClick(clickedEvent: Event): void  {
        this.eventToEdit = clickedEvent;
        this.rightSideActive = true;
    }

    onCloseRightSide(close: boolean): void {
        this.rightSideActive = false;
        this.reset();
    }

    private reset(): void {
        setTimeout(() => {
            this.eventToEdit = undefined;
        }, 500);
    }

}
