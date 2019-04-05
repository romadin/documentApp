import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../shared/packages/agenda-package/event.service';
import { Event } from '../../../shared/packages/agenda-package/event.model';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { EventCommunicationService } from '../../../shared/packages/communication/event.communication.service';

@Component({
  selector: 'cim-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
    events: Event[];
    rightSideActive = false;
    eventToEdit: Event;
    currentUser: User;

    constructor(
        private eventService: EventService,
        private route: ActivatedRoute,
        private userService: UserService,
        private eventCommunication: EventCommunicationService,
    ) { }

    ngOnInit() {
        this.events  = <Event[]>this.route.snapshot.data.events;
        this.userService.getCurrentUser().subscribe((user) => {
            this.currentUser = user;
        });
        this.eventCommunication.triggerAddEvent.subscribe(trigger => {
            this.eventToEdit = undefined;
            this.rightSideActive = trigger;
        });
        this.eventCommunication.eventAdded.subscribe(newEvent => {
            this.eventToEdit = newEvent;
            this.events.push(newEvent);
        });
    }

    eventOnClick(clickedEvent: Event): void  {
        this.eventToEdit = clickedEvent;
        this.rightSideActive = true;
    }
    eventOnDelete(eventToDelete: Event): void {
        this.events.splice(this.events.findIndex(event => event === eventToDelete), 1);
        if (eventToDelete === this.eventToEdit ) {
            this.onCloseRightSide(true);
        }
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
